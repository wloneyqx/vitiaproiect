import "server-only";

import { formatMoney } from "@/lib/order-utils";
import type { OrderWithItems } from "@/lib/types";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

async function sendEmail({ to, subject, html, text }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || process.env.ORDER_EMAILS_ENABLED === "false") return { skipped: true };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Email failed: ${response.status} ${details}`);
  }
  return { skipped: false };
}

function orderLines(order: OrderWithItems) {
  return order.items
    .map((item) => `${item.quantity} x ${item.productName}${item.size ? ` (${item.size})` : ""} - ${formatMoney(item.lineTotal)}`)
    .join("\n");
}

function customerEmail(order: OrderWithItems) {
  const url = `${getSiteUrl()}/order-confirmation/${order.orderNumber}`;
  return {
    to: order.email,
    subject: `Comanda ${order.orderNumber} a fost primita`,
    text: [
      `Salut, ${order.firstName}!`,
      "",
      `Am primit comanda ${order.orderNumber}.`,
      "",
      orderLines(order),
      "",
      `Total: ${formatMoney(order.total)}`,
      `Detalii comanda: ${url}`,
      "",
      "Te vom contacta pentru confirmare si productie.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1a1a1a">
        <h1>Comanda ${order.orderNumber}</h1>
        <p>Salut, ${order.firstName}! Am primit comanda ta.</p>
        <ul>
          ${order.items.map((item) => `<li>${item.quantity} x ${item.productName}${item.size ? ` (${item.size})` : ""} - ${formatMoney(item.lineTotal)}</li>`).join("")}
        </ul>
        <p><strong>Total: ${formatMoney(order.total)}</strong></p>
        <p><a href="${url}">Vezi detaliile comenzii</a></p>
        <p>Te vom contacta pentru confirmare si productie.</p>
      </div>
    `,
  };
}

function adminEmail(order: OrderWithItems) {
  const adminTo = process.env.ORDER_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
  if (!adminTo) return null;
  const url = `${getSiteUrl()}/admin/orders/${order.id}`;
  return {
    to: adminTo,
    subject: `Comanda noua ${order.orderNumber} - ${formatMoney(order.total)}`,
    text: [
      `Comanda noua: ${order.orderNumber}`,
      `Client: ${order.firstName} ${order.lastName}`,
      `Email: ${order.email}`,
      `Telefon: ${order.phone}`,
      `Adresa: ${order.address}, ${order.city}, ${order.country}`,
      "",
      orderLines(order),
      "",
      `Total: ${formatMoney(order.total)}`,
      `Admin: ${url}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1a1a1a">
        <h1>Comanda noua ${order.orderNumber}</h1>
        <p><strong>${order.firstName} ${order.lastName}</strong><br>${order.email}<br>${order.phone}</p>
        <p>${order.address}, ${order.city}, ${order.country}</p>
        <ul>
          ${order.items.map((item) => `<li>${item.quantity} x ${item.productName}${item.size ? ` (${item.size})` : ""} - ${formatMoney(item.lineTotal)}</li>`).join("")}
        </ul>
        <p><strong>Total: ${formatMoney(order.total)}</strong></p>
        <p><a href="${url}">Deschide comanda in admin</a></p>
      </div>
    `,
  };
}

export async function sendOrderEmails(order: OrderWithItems) {
  const messages = [customerEmail(order), adminEmail(order)].filter((message): message is EmailPayload => Boolean(message));
  const results = await Promise.allSettled(messages.map((message) => sendEmail(message)));
  for (const result of results) {
    if (result.status === "rejected") console.error(result.reason);
  }
}
