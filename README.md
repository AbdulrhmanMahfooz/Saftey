# Saftey Website

A services marketplace website with a customer-facing storefront and an admin panel to manage services and customer requests.

**Bilingual**: English (LTR) and Arabic (RTL), with a language switcher in the nav.

Built with **Next.js 14** (App Router) + **Tailwind CSS**. Data is stored as JSON files under `data/` — no database required to get started.

## Features

All pages are locale-prefixed: `/en/...` for English, `/ar/...` for Arabic. The Arabic version renders right-to-left. `/` redirects to the browser's preferred language.

**Customer pages**
- `/{locale}` — Home with hero + featured services
- `/{locale}/services` — Full service catalog
- `/{locale}/services/[id]` — Service detail with an order/inquiry form (with JSON-LD Service structured data)
- `/{locale}/contact` — General contact form
- `/{locale}/privacy` and `/{locale}/terms` — Legal placeholder pages

**Admin panel** (at `/{locale}/admin`)
- `/{locale}/admin/login` — Sign in (rate-limited)
- `/{locale}/admin` — Dashboard (counts, recent requests, revenue)
- `/{locale}/admin/services` — Add, edit, delete services
- `/{locale}/admin/orders` — View all customer requests, change status, delete

**Production-ready extras**
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Rate limiting on public POST endpoints
- scrypt password hashing for the admin credential
- Input validation on every API route with clean error responses
- Atomic file writes + per-file locking (concurrent orders won't clobber each other)
- HMAC-signed session cookie
- Health check at `/api/health`
- Sitemap at `/sitemap.xml`, robots at `/robots.txt`
- OpenGraph + canonical + `hreflang` alternates on every page
- Locale-aware error, not-found, and loading states
- Skip-to-content link
- Toast feedback in the admin panel

## Getting started

```bash
npm install
cp data/services.example.json data/services.json
cp data/orders.example.json   data/orders.json
npm run dev
```

The runtime `data/*.json` files are gitignored (orders contain customer PII). The `*.example.json` files are the seeds committed to the repo — copy them on first setup, or let the app create empty ones on first write.

Open [http://localhost:3000](http://localhost:3000). It will redirect to `/en` or `/ar` based on your browser language.

The admin panel is at `/en/admin` (or `/ar/admin`).

### Default admin credentials (dev only!)

- Username: `admin`
- Password: `admin123`

Change these before deploying — see the next section.

## Configuration

Copy [.env.example](.env.example) to `.env.local` and fill in real values.

Minimum you need in production:

```
SITE_URL=https://your-domain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=scrypt$...   # generate with `npm run hash-password`
SESSION_SECRET=<long random hex>
DATA_DIR=/var/lib/saftey         # persistent directory
```

Generate a password hash:

```bash
npm run hash-password
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deploying

See [DEPLOY.md](DEPLOY.md) for step-by-step guides for Docker Compose, bare Node.js on a VPS, and notes on serverless (spoiler: JSON storage won't survive Vercel).

Fast path for a VPS with Docker:

```bash
cp .env.example .env      # then edit .env
docker compose up -d --build
```

## Data

Data lives in JSON files that Next.js reads/writes at runtime:

- `data/services.json` — list of services (seeded with 3 samples)
- `data/orders.json` — customer requests

Set `DATA_DIR` to override the location. In Docker, mount a volume at that path so data persists across container restarts.

> JSON file storage is fine for one admin on a single instance. For heavier traffic or serverless deployment, swap [lib/data.js](lib/data.js) for a real database — the API routes treat it as an async storage layer, so only that one file changes.

## Project structure

```
app/
  globals.css
  global-error.js          # Very-top error boundary
  robots.js                # /robots.txt
  sitemap.js               # /sitemap.xml
  [locale]/                # All UI pages live here; locale = "en" | "ar"
    layout.js              # Sets <html lang dir>, metadata, OpenGraph, alternates
    page.js                # Home
    loading.js             # Loading skeleton
    error.js               # Error boundary
    not-found.js           # 404
    services/              # Customer service pages (+ JSON-LD on detail)
    contact/               # Contact page
    privacy/ + terms/      # Legal placeholders
    admin/                 # Admin panel (auth-gated)
  api/                     # API routes — not localized
    auth/login|logout/
    services/[id]/
    orders/[id]/
    health/
middleware.js              # Redirects unprefixed paths to /{locale}/...
components/                # Shared UI (Nav, Footer, LanguageSwitcher, SkipLink, Toast)
lib/
  data.js                  # JSON file read/write helpers (locking + atomic)
  auth.js                  # scrypt password + HMAC session
  i18n.js                  # English + Arabic dictionaries
  rateLimit.js             # In-memory bucket rate limiter
  validate.js              # Input validators
scripts/
  hash-password.mjs        # `npm run hash-password`
data/                      # JSON data store
Dockerfile
docker-compose.yml
```

## Adding or editing translations

All UI text lives in [lib/i18n.js](lib/i18n.js) under two objects: `en` and `ar`. Keep the two shapes in sync — every key added to one must exist in the other.

Service titles, descriptions, and features come from `data/services.json` and are not translated automatically. To add per-locale copy, extend the service records with `title_ar` / `description_ar` and switch on `params.locale` in the service pages.

## Next steps you might want

- Wire up email notifications when a request comes in (Resend, SendGrid, etc.)
- Swap JSON storage for a real database (SQLite works for VPS; use Postgres/Turso for serverless)
- Add Stripe checkout to accept payments up-front
- Add image uploads for each service
- Add per-locale service copy (Arabic titles/descriptions)
- Add analytics (Plausible, Fathom, GA4)
