# HAIL MARY RENTAL SERVICES — Ultra-Luxury & Exotic Supercar Showroom

> **Live Production Website**: [https://hailmaryrentals.com](https://hailmaryrentals.com)  
> **Executive CRM Admin Portal**: [https://hailmaryrentals.com/admin/login](https://hailmaryrentals.com/admin/login)

HAIL MARY RENTAL SERVICES is a premier, cinematic car rental showcase and lead-generation platform built for high-net-worth individuals, executives, and luxury lifestyle clients in Beverly Hills and Miami.

---

## 🌟 Key Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Glassmorphism luxury dark design system (`#050505` obsidian & `#D4AF37` gold accents)
- **Animation**: Framer Motion scroll reveals & session-gated cinematic intro
- **3D Interactive Showroom**: React Three Fiber + Drei (Three.js) with 360° OrbitControls and mouse parallax
- **Database & CRM**: PostgreSQL via Supabase accessed through Prisma ORM
- **Authentication**: Single-admin HTTP-only JWT session cookies (`hm_admin_token`) protected by Next.js Middleware and PBKDF2 password hashing
- **Deployment**: Vercel Serverless Platform

---

## 📖 Day-2 Operations Manual (For Business Owner & Admin)

This guide walks through how the business owner manages daily operations without needing a developer or editing code.

### 1. Accessing the Admin Portal
1. Go to `https://hailmaryrentals.com/admin/login`.
2. Enter your master admin credentials (`admin@hailmaryrentals.com` / your updated password).
3. Upon login, you will land on the **Executive CRM Dashboard**.

### 2. Managing Public Vehicle Inventory (`/admin/fleet`)
- **Add a New Car**: Click **"Add New Vehicle"**. Fill in the model name, marque, daily/weekly/monthly rates, deposit terms, fuel type, seating capacity, and features tags (*AC, GPS, Starlight Headliner, Akrapovič Exhaust*). Add photo URLs for exterior, interior, and dashboard views.
- **Edit Pricing or Status**: Click **"Edit"** on any car card to adjust prices or set status to `AVAILABLE`, `LIMITED`, `RENTED`, or `COMING_SOON`.
- **Flagship Spotlight**: Check the "Set as Flagship Featured Vehicle" box to feature a car at the top of the showroom catalog.
- **Delete Vehicle**: Click the trash icon on any vehicle card (confirmation prompt required).

### 3. Handling Incoming Leads & Conversion (`/admin/leads`)
- Every public inquiry (Contact Form, "Request a Quote" Modal, or WhatsApp click) automatically streams into the **Lead Inbox**.
- **Real-Time Alerts**: New leads trigger both an in-app notification (bell icon top right) and an email alert to your admin inbox.
- **Update Stage Inline**: Change a lead's status directly from `NEW` → `CONTACTED` → `NEGOTIATING` → `CONVERTED` or `LOST`.
- **Quick Contact**: Click the **WhatsApp** or **Call** buttons to launch a pre-filled direct response to the client.
- **Save Internal Notes**: Click **"Details & Notes"** to record agreed rates, delivery locations, and custom requests.

### 4. Creating Manual Bookings (`/admin/bookings`)
- When a rental is finalized post-phone call, click **"Create New Booking"** or convert a lead directly from `/admin/leads`.
- Select dates, review the auto-calculated rate, adjust final agreed pricing if negotiated, and set deposit status.

### 5. Bulk Pricing Matrix (`/admin/pricing`)
- To update daily, weekly, or monthly rates across multiple vehicles rapidly, visit `/admin/pricing`. Edit values directly in the matrix and click **"Save All Rates"**.

### 6. Editing Homepage Text & Client Reviews (`/admin/cms`)
- **Homepage Copy**: Update the main hero headline, subheading text, or stats numbers (`50+ Vehicles`, `99.8% Satisfaction`).
- **Client Reviews**: Add or delete customer testimonials. Edits reflect on the live homepage instantly without redeploying code.

### 7. Updating Business Details & Master Password (`/admin/settings`)
- **WhatsApp Routing**: Change the primary WhatsApp phone number in `/admin/settings` to redirect all `wa.me` deep links to a new phone line.
- **Business Info**: Update display phone, email, address, and operating hours.
- **Master Password**: Update your admin login password securely under "Admin Password Security".

---

## 🛡️ Database Backup & Disaster Recovery Guide

### Supabase Automated Backups
- Supabase automatically takes daily backups of your PostgreSQL database.
- To restore a backup in case of emergency:
  1. Log into your [Supabase Dashboard](https://app.supabase.com).
  2. Select your project -> navigate to `Database` -> `Backups`.
  3. Select the desired restore point and click **"Restore to Point in Time"**.

### Manual Database Export
To export a local SQL backup manually via command line:
```bash
pg_dump -h db.[REF].supabase.co -U postgres -d postgres > backup.sql
```

---

## ⚡ Deployment & Build Commands

```bash
# Install Dependencies
npm install

# Start Next.js Development Server
npm run dev

# Run Production Build
npm run build

# Seed Initial Database Admin
npm run seed
```
