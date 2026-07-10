# Carzo — Scale Models & RC Cars Store

Dark, racing-themed e-commerce site built with **Next.js 16 + Tailwind CSS 4**.

## Features

**Storefront**
- Home page with hero, featured products, category banners
- Shop page with category filter (Scale Models / RC Cars), search, and price sorting
- Product detail pages with discount badges, stock warnings, related products
- Cart (saved in the browser) + full checkout with Cash on Delivery
- About and Contact pages
- All prices in INR (₹), free shipping over ₹999

**Admin panel** (`/admin`)
- Login: single admin account (email + password)
- Dashboard: revenue, new orders, product count, low-stock alerts
- Products: add / edit / delete, image via pasted URL, featured toggle
- Orders: full customer + item details, update status (new → confirmed → shipped → delivered / cancelled)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — admin at http://localhost:3000/admin

**Default admin login** (change in `.env.local`):
- Email: `admin@carzo.in`
- Password: `carzo123`

## Data storage — IMPORTANT

Products and orders are stored in JSON files in `data/` (auto-created with 18
sample products on first run). This is perfect for local use and client demos.

**Before real production use on Vercel**, swap `lib/db.ts` for a real database
(e.g. Neon Postgres free tier or Vercel Postgres) — Vercel's serverless
filesystem does not persist writes. All database logic is isolated in
`lib/db.ts`, so only that one file needs changing.

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import the repo at vercel.com → framework auto-detected
3. Add environment variables: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`
4. Connect the client's domain in Vercel → Domains

## To-do before final delivery

- [ ] Replace placeholder product images (admin → edit product → paste image URL)
- [ ] Real client contact details in `app/contact/page.tsx` and footer
- [ ] Client's logo file in `public/` (currently a text-based logo in `components/Logo.tsx`)
- [ ] Swap `lib/db.ts` to Postgres before production deploy
- [ ] Order notifications (email/WhatsApp) — hook in `app/api/orders/route.ts` (see TODO)
- [ ] Payment gateway (Razorpay/Stripe) when client is ready
