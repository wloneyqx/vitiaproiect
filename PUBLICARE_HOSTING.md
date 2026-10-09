# Publicare pe hosting

Acest proiect este o aplicatie Next.js cu API si MySQL. Nu se publica prin upload simplu de HTML; are nevoie de hosting Node.js/Next.js si baza MySQL.

## Recomandat

- Vercel, Render, Railway sau un VPS cu Node.js 20+
- Baza MySQL gestionata separat

## Comenzi build

```bash
npm install
npm run build
npm run start
```

## Variabile de mediu

Copiaza valorile din `.env.example` in panoul hostingului si completeaza datele reale:

```env
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=svidanie_art
NEXT_PUBLIC_SITE_URL=https://domeniul-tau.com
ADMIN_EMAIL=
ADMIN_SESSION_SECRET=
JWT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
ORDER_NOTIFICATION_EMAIL=
ORDER_EMAILS_ENABLED=true
```

Nu urca `.env.local` pe hosting si nu publica parolele in repository.

## Baza de date

Ruleaza schema si seed-ul o singura data pe baza MySQL de productie:

```bash
npm run db:schema
npm run db:seed
```

Dupa seed, schimba parola adminului demo.

## Observatii importante

- Folderul `public/uploads` este inclus in pachet pentru imaginile existente.
- Uploadurile noi salvate local pot disparea pe unele platforme serverless. Pentru productie serioasa, muta uploadurile in Cloudinary, S3 sau alt storage persistent.
- Backend-ul Express din `backend/` este optional. Aplicatia Next are deja API routes in `src/app/api`.
