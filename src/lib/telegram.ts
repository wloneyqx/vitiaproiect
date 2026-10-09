import "server-only";

import { formatMoney } from "@/lib/order-utils";
import { getPool, query } from "@/lib/mysql";
import { OrderStatus, type OrderWithItems } from "@/lib/types";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";
const CALLBACK_PREFIX = "order";

type TelegramResponse = {
  ok: boolean;
  description?: string;
};

type TelegramCallbackAction = "approve" | "reject";

type TelegramCallbackResult =
  | { ok: true; orderId: number; status: OrderStatus; message: string }
  | { ok: false; status: number; message: string };

type TelegramCallbackQuery = {
  id: string;
  from?: { id?: number };
  data?: string;
  message?: {
    message_id?: number;
    text?: string;
    chat?: { id?: number | string };
  };
};

type OrderStatusRow = RowDataPacket & {
  id: number;
  order_status: OrderStatus;
};

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function orderLines(order: OrderWithItems) {
  return order.items
    .map((item) => `• ${item.quantity} x ${item.productName}${item.size ? ` (${item.size})` : ""} - ${formatMoney(item.lineTotal)}`)
    .join("\n");
}

function orderMessage(order: OrderWithItems) {
  const adminUrl = `${getSiteUrl()}/admin/orders/${order.id}`;

  return [
    `Comanda noua: ${order.orderNumber}`,
    "",
    `Client: ${order.firstName} ${order.lastName}`,
    `Telefon: ${order.phone}`,
    `Email: ${order.email}`,
    `Adresa: ${order.address}, ${order.city}, ${order.country}`,
    "",
    orderLines(order),
    "",
    `Total: ${formatMoney(order.total)}`,
    `Admin: ${adminUrl}`,
  ].join("\n");
}

function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  return { token, chatId };
}

async function callTelegram(method: string, body: Record<string, unknown>) {
  const { token } = getTelegramConfig();
  if (!token) return { skipped: true };

  const response = await fetch(`${TELEGRAM_API_BASE}${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as TelegramResponse | null;
  if (!response.ok || !data?.ok) {
    throw new Error(data?.description ?? `Telegram failed with status ${response.status}`);
  }

  return { skipped: false };
}

async function sendTelegramMessage(text: string, replyMarkup?: Record<string, unknown>) {
  const { token, chatId } = getTelegramConfig();
  if (!token || !chatId) return { skipped: true };

  return callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });
}

export async function sendOrderTelegram(order: OrderWithItems) {
  try {
    await sendTelegramMessage(orderMessage(order), {
      inline_keyboard: [
        [
          { text: "✅ Approve Order", callback_data: `${CALLBACK_PREFIX}:${order.id}:approve` },
          { text: "❌ Reject Order", callback_data: `${CALLBACK_PREFIX}:${order.id}:reject` },
        ],
      ],
    });
  } catch (error) {
    console.error("Telegram order notification failed", error instanceof Error ? error.message : "Unknown error");
  }
}

function parseCallbackData(data: string | undefined) {
  const [prefix, orderIdRaw, action] = (data ?? "").split(":");
  const orderId = Number(orderIdRaw);

  if (prefix !== CALLBACK_PREFIX || !Number.isInteger(orderId) || orderId <= 0) return null;
  if (action !== "approve" && action !== "reject") return null;

  return {
    orderId,
    action: action as TelegramCallbackAction,
    targetStatus: action === "approve" ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED,
  };
}

async function findOrderStatus(orderId: number) {
  const rows = await query<OrderStatusRow[]>(`SELECT id, order_status FROM orders WHERE id = :orderId LIMIT 1`, { orderId });
  return rows[0] ?? null;
}

async function updateOrderStatusAtomically(orderId: number, targetStatus: OrderStatus) {
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute<OrderStatusRow[]>(
      `SELECT id, order_status FROM orders WHERE id = :orderId FOR UPDATE`,
      { orderId },
    );
    const order = rows[0];

    if (!order) {
      await connection.rollback();
      return { ok: false as const, status: 404, message: "Order not found." };
    }

    if (order.order_status === targetStatus) {
      await connection.commit();
      return { ok: true as const, status: targetStatus, changed: false };
    }

    if (order.order_status !== OrderStatus.NEW) {
      await connection.commit();
      return {
        ok: false as const,
        status: 409,
        message: `Order already processed as ${order.order_status}.`,
      };
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE orders SET order_status = :targetStatus WHERE id = :orderId AND order_status = 'NEW'`,
      { orderId, targetStatus },
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      const current = await findOrderStatus(orderId);
      return current?.order_status === targetStatus
        ? { ok: true as const, status: targetStatus, changed: false }
        : { ok: false as const, status: 409, message: "Order was already processed." };
    }

    return { ok: true as const, status: targetStatus, changed: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function answerCallbackQuery(callbackQueryId: string, text: string, showAlert = false) {
  try {
    await callTelegram("answerCallbackQuery", {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    });
  } catch (error) {
    console.error("Telegram callback answer failed", error instanceof Error ? error.message : "Unknown error");
  }
}

async function editOrderMessage(callback: TelegramCallbackQuery, orderId: number, status: OrderStatus) {
  const chatId = callback.message?.chat?.id;
  const messageId = callback.message?.message_id;
  if (!chatId || !messageId) return;

  const statusText = status === OrderStatus.CONFIRMED ? "APPROVED" : "REJECTED";
  const originalText = callback.message?.text?.replace(/\n\nStatus: [\s\S]+$/, "") ?? `Order ${orderId}`;

  await callTelegram("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: `${originalText}\n\nStatus: ${statusText}`,
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: [] },
  });
}

export async function handleTelegramOrderCallback(callback: TelegramCallbackQuery): Promise<TelegramCallbackResult> {
  const adminUserId = process.env.TELEGRAM_ADMIN_USER_ID;
  const callbackUserId = callback.from?.id ? String(callback.from.id) : "";

  if (!adminUserId || callbackUserId !== adminUserId) {
    if (callback.id) await answerCallbackQuery(callback.id, "Unauthorized Telegram user.", true);
    return { ok: false, status: 403, message: "Unauthorized Telegram user." };
  }

  const parsed = parseCallbackData(callback.data);
  if (!parsed) {
    if (callback.id) await answerCallbackQuery(callback.id, "Invalid order action.", true);
    return { ok: false, status: 400, message: "Invalid callback data." };
  }

  try {
    const result = await updateOrderStatusAtomically(parsed.orderId, parsed.targetStatus);
    if (!result.ok) {
      if (callback.id) await answerCallbackQuery(callback.id, result.message, true);
      return { ok: false, status: result.status, message: result.message };
    }

    try {
      await editOrderMessage(callback, parsed.orderId, result.status);
    } catch (error) {
      console.error("Telegram message edit failed", error instanceof Error ? error.message : "Unknown error");
    }

    const label = result.status === OrderStatus.CONFIRMED ? "approved" : "rejected";
    const message = result.changed ? `Order ${label}.` : `Order already ${label}.`;
    if (callback.id) await answerCallbackQuery(callback.id, message);

    return { ok: true, orderId: parsed.orderId, status: result.status, message };
  } catch (error) {
    console.error("Telegram order callback failed", error instanceof Error ? error.message : "Unknown error");
    if (callback.id) await answerCallbackQuery(callback.id, "Could not update order.", true);
    return { ok: false, status: 500, message: "Could not update order." };
  }
}
