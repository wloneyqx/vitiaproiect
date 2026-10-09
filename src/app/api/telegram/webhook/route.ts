import { apiError, json } from "@/lib/api-response";
import { handleTelegramOrderCallback } from "@/lib/telegram";

export const dynamic = "force-dynamic";

type TelegramWebhookUpdate = {
  callback_query?: {
    id: string;
    from?: { id?: number };
    data?: string;
    message?: {
      message_id?: number;
      text?: string;
      chat?: { id?: number | string };
    };
  };
};

export async function POST(request: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get("x-telegram-bot-api-secret-token");

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return apiError("Unauthorized.", 401);
  }

  const update = (await request.json().catch(() => null)) as TelegramWebhookUpdate | null;
  if (!update) return apiError("Invalid Telegram update.", 400);

  if (!update.callback_query) {
    return json({ ok: true, skipped: true });
  }

  const result = await handleTelegramOrderCallback(update.callback_query);
  return json(result, result.ok ? 200 : result.status);
}
