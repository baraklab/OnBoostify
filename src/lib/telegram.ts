const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim().replace(/^bot/i, "");
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();

/**
 * Fire-and-log: a delivery failure (or missing secrets) here should never
 * block the flow that triggered it, so this never throws. Server-only —
 * never import this from a Client Component.
 */
export async function notifyTelegram(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log(`[telegram] ${text}`);
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
    if (!res.ok) {
      console.error("notifyTelegram: Telegram API error", res.status, await res.text());
    }
  } catch (err) {
    console.error("notifyTelegram: unhandled error", err);
  }
}
