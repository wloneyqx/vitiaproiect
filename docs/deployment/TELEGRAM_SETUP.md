# Telegram Setup

1. Create a bot with BotFather.
2. Put the bot token in `TELEGRAM_BOT_TOKEN`.
3. Add the bot to your admin chat or channel.
4. Get the chat ID and set `TELEGRAM_CHAT_ID`.
5. Get your numeric Telegram user ID and set `TELEGRAM_ADMIN_USER_ID`.
6. Generate a webhook secret:

```bash
openssl rand -hex 32
```

7. Set the webhook after SSL is working:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.md/api/telegram/webhook","secret_token":"YOUR_WEBHOOK_SECRET"}'
```

Telegram failures must not block order storage. The current code saves the order first and logs Telegram notification failures.

