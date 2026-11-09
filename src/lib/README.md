# Al-Noor Islamic University — bilingual website & operations platform

A production-shaped, fully bilingual (English / اردو) website for an Islamic higher-education
institution in Pakistan, including the Qurbani 2027 booking module, donations, Darul Ifta workflow,
digital library with server-side PDF generation, and a role-based admin panel.

> **Platform note:** this sandbox runs Next.js (App Router) + PostgreSQL/Drizzle. The original brief
> asked for React + FastAPI + MongoDB; the same architecture is implemented with Next.js route
> handlers as the API layer and PostgreSQL (Drizzle ORM) in place of MongoDB. All data access is
> server-side only; the browser never talks to the database directly.

## Getting started

```bash
npm install
npx drizzle-kit push     # create tables
npm run build && npm start
```

The database seeds itself on first request (`src/db/seed.ts`, idempotent, guarded by a
`seed_version` settings row). All content is sample/placeholder data.

## Admin panel

`/admin/login` — role-based access, 8-hour httpOnly session cookie, audit log on every mutation.

| Role | Email | Password |
| --- | --- | --- |
| Super admin | admin@alnoor.edu.pk | Admin@2027 |
| Mufti / Darul Ifta | mufti@alnoor.edu.pk | Mufti@2027 |
| Qurbani in-charge | qurbani@alnoor.edu.pk | Qurbani@2027 |
| Cashier | cashier@alnoor.edu.pk | Cashier@2027 |
| Dispatch team | dispatch@alnoor.edu.pk | Dispatch@2027 |
| Viewer | viewer@alnoor.edu.pk | Viewer@2027 |

Passwords are demo placeholders — rotate them and add `ADMIN_*` secrets before deployment.

## Key routes

- `/` home (hero slider, quick tiles, rector, ticker, events, programmes, stats, gallery, seasonal,
  Darul Ifta, PDF strip, donation band, testimonials, articles, contact)
- `/about`, `/academics`, `/academics/[slug]`, `/admissions`, `/library`, `/library/[slug]`
- `/darul-ifta`, `/darul-ifta/[slug]` (sample fatwa), `/darul-ifta/ask`
- `/events`, `/events/[slug]`, `/gallery`, `/articles`, `/students`, `/contact`, `/seasonal`
- `/qurbani`, `/qurbani/book`, `/qurbani/status`, `/qurbani/faq`, `/qurbani/pay/[receiptId]`,
  `/qurbani/receipt/[receiptId]` (sample receipt `QRB-2027-000123`, phone `+92 300 1234567`)
- `/donate`, `/donate/thank-you`, `/policies/{privacy,terms,refund,accessibility}`, `404`
- Admin: `/admin`, `/admin/qurbani`, `/admin/fatawa`, `/admin/content`, `/admin/donations`, `/admin/leads`

## Payments

- **Stripe (card):** `src/app/api/qurbani/payments` simulates a test-mode confirmation when
  `STRIPE_SECRET_KEY` is absent and records `stripe-webhook-demo` as the verifier.
- **JazzCash / Easypaisa / UPaisa:** provider request references are created and the booking remains
  pending until the webhook confirms. Placeholders: `POST /api/webhooks/{stripe,jazzcash,easypaisa,upaisa}`
  with `{ receiptId, transactionId, status }`. Signature secrets are read from
  `STRIPE_WEBHOOK_SECRET`, `JAZZCASH_HASH_KEY`, `EASYPAISA_KEY`, `UPAISA_KEY`.
- **Bank transfer:** buyer submits a transaction ID/screenshot, admin verifies with one click.
- **Cash:** cashier records the payment and a manual receipt is issued.
- Full card numbers are never stored. All payments are logged with method, amount, transaction ID and status.

## PDFs & storage

- `/api/qurbani/receipt/[receiptId]/pdf` — generated with `pdf-lib` + a QR code to the private status page.
  (Standard PDF fonts are Latin-only; the bilingual Urdu copy is shown in the on-screen receipt and
  notification templates. Embed a Nastaliq TTF in `src/lib/pdf.ts` for Urdu PDFs in production.)
- `/api/pdf/library/[slug]` — reader/download PDF for any library item (download count increments).
- `/api/pdf/prospectus/[slug]`, `/api/pdf/report/[slug]` — prospectus, admission form and reports.
- `/api/upload` — validates type/size, writes to a private folder and records metadata; swap in S3/R2.

## Environment variables

```
DATABASE_URL=postgresql://…            # required
NEXT_PUBLIC_SITE_URL=https://…         # canonical URLs, QR codes, sitemap
STRIPE_SECRET_KEY= / STRIPE_WEBHOOK_SECRET=
JAZZCASH_HASH_KEY= / EASYPAISA_KEY= / UPAISA_KEY=
```

Optional analytics placeholders are stored in `settings.analytics_placeholders`; no tracking script
is loaded until consent is given.

## Placeholders

Institution name, fees, contact details, bank accounts, cow numbers, events, fatawa, staff names and
photograph approvals are clearly marked placeholders. Campus imagery is stock/AI-generated; no
identifiable faces are used on institutional pages.
