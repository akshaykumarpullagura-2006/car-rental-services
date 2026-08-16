# HAIL MARY RENTAL SERVICES — Production Launch Checklist

This checklist documents the required environment variables, database migrations, security configurations, and manual QA validation steps before deploying **Hail Mary Rental Services** to Vercel and Supabase.

---

## 1. Vercel Production Environment Variables

Ensure the following environment variables are set in your Vercel Project Settings (`Settings -> Environment Variables`):

| Variable Name | Example / Value | Description |
|---|---|---|
| `JWT_SECRET` | `hail-mary-luxury-rentals-super-secret-key-2026` | 32+ char secret string used to sign HTTP-only session JWT cookies (`hm_admin_token`). |
| `DATABASE_URL` | `postgres://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres` | Supabase Postgres database connection string with pooling. |
| `NEXT_PUBLIC_APP_URL` | `https://hailmaryrentals.com` | Primary production domain (used for canonical URLs, sitemaps, and OpenGraph headers). |
| `NODE_ENV` | `production` | Enables HTTP-only `Secure` cookie flag in production. |

---

## 2. Supabase Postgres Database Setup & Migration

Run the following commands locally or within a GitHub Actions CI pipeline to push the Prisma schema to Supabase:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push Schema to Supabase Postgres
npx prisma db push

# 3. Seed Initial Super Admin Account
npx ts-node prisma/seed.ts
```

---

## 3. Seeded Admin Credentials

- **Default Email**: `admin@hailmaryrentals.com`
- **Default Password**: `AdminPass123!`
- **Security Action**: After logging into `/admin/login` for the first time in production, navigate to `/admin/settings` and update the master admin password immediately.

---

## 4. Custom Domain & DNS Setup

In your domain registrar (e.g. GoDaddy, Namecheap, Cloudflare), set up the following DNS records pointing to Vercel:

| Type | Name | Value | Purpose |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | Points apex domain `hailmaryrentals.com` to Vercel edge servers. |
| `CNAME` | `www` | `cname.vercel-dns.com` | Redirects `www.hailmaryrentals.com` to apex domain. |

---

## 5. End-to-End Manual QA Checklist

Before pointing production traffic, complete the following manual QA test suite:

- [ ] **Public Form Submission**: Submit an enquiry on `https://hailmaryrentals.com/contact` -> verify green success banner and check that the lead record appears instantly at `/admin/leads`.
- [ ] **Quote Modal Submission**: Trigger the "Request Quote" modal on a car card -> submit dates -> verify lead appears with `source: "quote-modal"`.
- [ ] **WhatsApp Deep Link**: Click the WhatsApp button on a vehicle detail page -> verify it opens `wa.me/15552345678` with a pre-filled vehicle message.
- [ ] **Admin Authentication**: Try opening `/admin/dashboard` while logged out -> verify automatic redirect to `/admin/login`. Log in with admin credentials -> verify session cookie creation.
- [ ] **Lead Status Update**: In `/admin/leads`, change a lead status inline from `NEW` to `CONVERTED` -> verify status persists upon refresh.
- [ ] **Lead to Booking Conversion**: Click a converted lead -> click "Convert to Booking" -> verify booking is logged at `/admin/bookings`.
- [ ] **Bulk Pricing Edit**: In `/admin/pricing`, update daily rates -> click "Save All Rates" -> verify public `/fleet` page displays updated pricing.
- [ ] **Live CMS Override**: In `/admin/cms`, edit the hero headline text -> save -> visit `https://hailmaryrentals.com/` -> verify headline updates live without code redeployment.
- [ ] **First-Visit Intro Animation**: Open an incognito browser tab -> visit homepage -> verify 3D supercar drive-by and text reveal plays once per session. Refresh tab -> verify intro is skipped.
- [ ] **Mobile Touch Test**: Open site on an iOS/Android mobile device -> test responsive mobile drawer, 44px tap targets, media gallery swipe gestures, and verify zero input focus zoom.
