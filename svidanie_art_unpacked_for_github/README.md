# Svidanie Art

Site e-commerce pentru portrete personalizate premium pe canvas, metal si string art. Proiectul este pregatit pentru dezvoltare locala si pentru continuare de catre alt developer sau AI.

## Tehnologii folosite

- Next.js 16.3.0 cu App Router
- React 19.2.8
- TypeScript
- Tailwind CSS v4
- Framer Motion pentru animatii
- Zod pentru validarea formularelor
- bcryptjs si jose pentru autentificarea admin
- Stocare locala in `data/store.json`
- Prisma schema si migratii SQLite pastrate in `prisma/` pentru modelul bazei de date

Nu exista integrare activa cu servicii platite. Google Fonts sunt incarcate prin `next/font/google` la build.

## Instalare

Cerinte recomandate:

- Node.js 20+
- npm

Pasi:

```bash
npm install
copy .env.example .env.local
npm run db:migrate
npm run dev
```

Aplicatia porneste local la:

```text
http://localhost:3000
```

Pentru build de productie:

```bash
npm run build
npm run start
```

## Variabile de mediu

Fisierul real `.env.local` nu este inclus in arhiva. Creeaza-l pornind de la `.env.example`.

Variabile necesare:

- `DATABASE_URL` - cale SQLite sau valoare compatibila cu configurarea viitoare a bazei de date.
- `ADMIN_EMAIL` - emailul contului admin.
- `ADMIN_PASSWORD` - parola contului admin pentru dezvoltare locala.
- `ADMIN_SESSION_SECRET` - sir lung, privat, folosit pentru semnarea sesiunii admin.

Exemplu pentru generarea unui secret local:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Structura proiectului

```text
src/
  app/
    page.tsx
    layout.tsx
    globals.css
    cart/
    checkout/
    products/[slug]/
    order-confirmation/[orderNumber]/
    admin/
  components/
    admin/
    cart/
    checkout/
    Header.tsx
    Hero.tsx
    Shop.tsx
    ProductDetailClient.tsx
    PortraitArt.tsx
  lib/
    actions/
    cart/
    admin-auth.ts
    data.ts
    db.ts
    order-utils.ts
    products.ts
    types.ts
    upload.ts
public/
  uploads/products/
data/
  store.json
prisma/
  schema.prisma
  migrations/
scripts/
  init-local-store.mjs
design-system/
  svidanie_art/MASTER.md
```

## Functionalitati implementate

- Homepage cu hero, navigatie sticky, meniu mobil, sectiuni de prezentare si grid de produse.
- Produse citite din stocarea locala, cu imagini reale sau fallback generativ prin `PortraitArt`.
- Pagina de detalii produs la `/products/[slug]`.
- Selectie simpla de optiuni si adaugare in cos.
- Cos local, pastrat in `localStorage`, cu modificare cantitati si stergere produse.
- Checkout cu formular de livrare.
- Creare comanda pe server, cu recalcularea preturilor din sursa de date.
- Pagina de confirmare comanda.
- Zona admin cu login, dashboard, lista comenzi, detalii comanda si management produse.
- Upload de imagini pentru produse in `public/uploads/products`.

## Backend si date

Proiectul foloseste in prezent o implementare locala in `src/lib/db.ts`, care citeste si scrie in `data/store.json`. Acest lucru permite rularea fara server de baza de date separat.

Folderul `prisma/` contine schema si migratiile SQLite pentru modelul planificat sau pentru migrarea ulterioara catre Prisma real. Inainte de a trece pe Prisma in productie, verifica dependintele necesare si adapteaza `src/lib/db.ts`.

Arhiva pregatita pentru transfer include `data/store.json` sanitizat: produsele sunt pastrate, dar comenzile de test si datele personale ale clientilor sunt eliminate.

## Servicii externe / API-uri

Nu sunt conectate servicii externe active pentru:

- plati online;
- email transactional;
- AI image generation;
- analytics;
- CRM sau fulfillment.

Campurile pentru status plata si intent Stripe exista in modelul de date, dar integrarea de plata nu este implementata.

## Ce mai trebuie configurat pentru functionare completa

- Completeaza `.env.local` cu valorile locale sau de productie.
- Schimba credentialele admin inainte de orice deploy public.
- Alege strategia finala de stocare: `data/store.json` pentru prototip sau Prisma/SQLite pentru o baza persistenta mai robusta.
- Configureaza un serviciu de plata daca site-ul va procesa plati reale.
- Configureaza emailuri pentru confirmari de comanda si notificari admin.
- Stabileste unde se vor pastra imaginile uploadate in productie, deoarece `public/uploads` local nu este potrivit pentru deploy serverless fara storage separat.
- Ruleaza `npm run build` inainte de predarea catre productie.

## Note importante pentru Next.js 16

Proiectul contine `AGENTS.md` cu instructiuni specifice Next.js. Inainte de schimbari de cod, citeste ghidurile relevante din `node_modules/next/dist/docs/`, deoarece aceasta versiune are diferente fata de versiunile mai vechi.

Fisierul `src/proxy.ts` este folosit pentru protectia rutelor admin. In Next.js 16 conventia veche `middleware.ts` a fost schimbata, deci pastreaza abordarea existenta.
