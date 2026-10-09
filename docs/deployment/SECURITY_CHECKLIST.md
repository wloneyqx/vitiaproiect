# Security Checklist

- Use SSH keys and disable password SSH login.
- Keep MySQL bound to `127.0.0.1`.
- Use HTTPS only.
- Generate unique values for every secret.
- Change seeded admin credentials before launch.
- Keep `.env.production` readable only by the app user.
- Do not commit uploaded customer photos.
- Keep `CUSTOMER_UPLOAD_DIR` outside `public`.
- Verify `/admin` is not indexed.
- Confirm `/api/telegram/webhook` rejects missing or wrong `x-telegram-bot-api-secret-token`.
- Run `npm audit` before launch and after dependency updates.
- Review logs for sensitive data before going live.

