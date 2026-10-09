# Production Readiness

Status after local pass: partially ready for VPS staging, not yet verified on live hosting.

## Verified locally

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes with Next.js 16.3.0.
- Admin route protection uses signed HTTP-only cookies.
- Orders are saved before Telegram notification is attempted.
- Server calculates order prices from stored products, not browser-submitted totals.

## Implemented locally

- Standalone Next.js build output.
- Security headers in `next.config.ts`.
- Health check at `/api/health`.
- `robots.txt` and `sitemap.xml`.
- Customer upload content sniffing for JPG, PNG, and WEBP.
- Customer uploads now default to `CUSTOMER_UPLOAD_DIR` outside `public`.
- Nginx, systemd, deploy, backup, and restore templates.

## Main remaining blockers

- Production VPS, domain, DNS, SSL, and real secrets are not configured here.
- Telegram cannot be fully verified without a real bot token, webhook URL, and admin user ID.
- MySQL restore has not been verified against a staging clone in this local pass.
- Legal pages need business-owner review before publication.
- Online payment is not integrated; current flow is manual order collection.

