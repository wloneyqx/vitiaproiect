# Production Audit Report

## Completed tasks

- Inspected the active Next.js app, API routes, admin auth, order creation, Telegram webhook, upload handling, MySQL wrapper, schema, scripts, and deployment config.
- Read the bundled Next.js 16 docs for project structure, Proxy, headers, standalone output, metadata, robots, sitemap, and server action body limits.
- Added standalone build output and security headers.
- Added `/api/health`.
- Added `robots.txt` and `sitemap.xml`.
- Hardened customer image upload validation and moved new customer uploads out of `public` by default.
- Added VPS deployment, Nginx, systemd, backup, restore, Telegram, security, troubleshooting, and launch docs.

## Severity findings

Critical:

- Production secrets, domain, DNS, SSL, real MySQL credentials, and Telegram credentials are not configured in this local workspace.
- `database/schema.sql` drops tables and must not be used directly on a production database with data.

High:

- Customer images were stored under `public/uploads/customers`; new uploads now default to `CUSTOMER_UPLOAD_DIR`, but old public files should be migrated manually.
- Telegram has only approve/reject callback actions implemented; the full status workflow still needs callback buttons for in-production, ready, shipped, and completed.
- No database-backed Telegram notification outbox exists yet, so failed Telegram sends are logged but not retried automatically.

Medium:

- Legal/trust pages are not implemented as customer-facing pages.
- Automated tests currently cover catalog data only; checkout, admin, uploads, and Telegram need integration tests with a test database.
- Online payment processing is not integrated; the current site collects manual orders.

Low:

- The repository contains old exported/handoff folders and zip archives that should not be deployed.
- Product image uploads remain public, which is acceptable for catalog assets but should be separated from customer media.

## Modified files

- `.env.example`
- `next.config.ts`
- `src/app/layout.tsx`
- `src/components/ProductDetailClient.tsx`
- `src/lib/actions/create-order.ts`
- `src/lib/api-schemas.ts`
- `src/lib/upload.ts`

## Created files

- `src/app/api/customer-uploads/[filename]/route.ts`
- `src/app/api/health/route.ts`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `deploy/nginx/svidanie-art.conf`
- `deploy/systemd/svidanie-art.service`
- `deploy/scripts/deploy.sh`
- `deploy/scripts/backup-mysql.sh`
- `deploy/scripts/restore-mysql.sh`
- `docs/deployment/*.md`

## Test results

- VERIFIED: `npm run typecheck` passed.
- VERIFIED: `npm run lint` passed.
- VERIFIED: `npm test` passed.
- VERIFIED: `npm run build` passed.

## Readiness status

- Security status: improved locally, but requires live HTTPS and real secret verification.
- Database readiness: schema exists, queries are parameterized, order creation is transactional, but production migrations must be made non-destructive.
- Telegram readiness: webhook secret and admin user restriction exist; full lifecycle buttons and retry outbox remain.
- Hosting requirements: Ubuntu LTS VPS, Node.js 22, MySQL, Nginx, Certbot, domain, DNS, systemd.
- Required secrets: DB password, admin session secret, Telegram bot token, Telegram chat ID, Telegram admin user ID, Telegram webhook secret, optional email provider key.

## Exact next launch steps

1. Buy/configure the domain and point DNS A records to the VPS.
2. Provision Ubuntu LTS, install Node.js 22, MySQL, Nginx, Certbot.
3. Create the MySQL database and app user.
4. Create `/var/www/svidanie_art/shared/.env.production` from `.env.example`.
5. Replace every placeholder secret with real generated values.
6. Deploy with `bash deploy/scripts/deploy.sh`.
7. Install SSL with Certbot.
8. Configure Telegram webhook.
9. Place a staging test order and verify admin, image, database, and Telegram behavior.
10. Run and restore a database backup on staging before accepting real customers.
