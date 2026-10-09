# Environment Variables

Use `/var/www/svidanie_art/shared/.env.production` on the server. Never commit real values.

Required:

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://example.md
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=svidanie_app
DB_PASSWORD=long-random-password
DB_NAME=svidanie_art
ADMIN_SESSION_SECRET=at-least-32-random-characters
CUSTOMER_UPLOAD_DIR=/var/www/svidanie_art/shared/customer-uploads
DB_BACKUP_DIR=/var/www/svidanie_art/shared/backups
```

Telegram:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_ADMIN_USER_ID=
TELEGRAM_WEBHOOK_SECRET=long-random-secret
```

Email is optional in the current code:

```bash
RESEND_API_KEY=
EMAIL_FROM=Svidanie Art <orders@example.md>
ORDER_NOTIFICATION_EMAIL=orders@example.md
ORDER_EMAILS_ENABLED=true
```

