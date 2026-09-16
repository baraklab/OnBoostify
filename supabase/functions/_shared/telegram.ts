// Same Telegram bot/chat as the contact form and the newsletter signup notifier in the
// Next.js app (src/lib/telegram.ts) — TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are the same
// secrets, just reused here for signup notifications instead.
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")?.trim().replace(/^bot/i, "");
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")?.trim();

/** Fire-and-log: a delivery failure (or missing secrets) here should never block the auth
 * flow that triggered it, so this never throws. */
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
