# Launch Checklist

Before launch:

- Buy or configure a domain.
- Point DNS A records to the VPS.
- Create production MySQL database and app user.
- Configure `.env.production` with real secrets.
- Change admin credentials.
- Deploy and enable the systemd service.
- Install HTTPS certificate.
- Verify `/api/health`.
- Place a test order using a test product.
- Confirm order appears in admin.
- Confirm Telegram notification and callback status update.
- Confirm customer uploaded image appears for the admin.
- Run and restore a backup on staging.
- Add privacy policy, terms, delivery, payment, and refund pages after owner/legal review.

Do not accept real customer orders until every item above is verified on the live server.
