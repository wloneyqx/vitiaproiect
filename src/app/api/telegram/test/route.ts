import { apiError, json } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const TELEGRAM_SEND_MESSAGE_URL = "https://api.telegram.org/bot";
const TEST_MESSAGE = "✅ Telegram conectat cu succes la svidanie_art!";

type TelegramResponse = {
  ok: boolean;
  description?: string;
};

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return apiError("Not found.", 404);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return apiError("Telegram environment variables are missing.", 500);
  }

  try {
    const response = await fetch(`${TELEGRAM_SEND_MESSAGE_URL}${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: TEST_MESSAGE,
      }),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as TelegramResponse | null;

    if (!response.ok || !data?.ok) {
      return apiError(data?.description ?? "Telegram message could not be sent.", 502);
    }

    return json({ ok: true, message: "Telegram test message sent." });
  } catch (error) {
    console.error("Telegram test failed", error instanceof Error ? error.message : "Unknown error");
    return apiError("Telegram request failed.", 502);
  }
}
