# Deploying Saftey

This app is a Next.js 14 site with JSON file storage. It runs anywhere Node.js 20+ runs. **Data persistence matters** — pick a host that gives you a writable disk that survives restarts.

## Pre-flight checklist

Before deploying:

1. **Generate a password hash** (never ship the default `admin123`):
   ```
   npm run hash-password
   ```
   Copy the printed line into your production env as `ADMIN_PASSWORD_HASH` and remove `ADMIN_PASSWORD`.

2. **Generate a session secret**:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Set it as `SESSION_SECRET`.

3. **Set your public URL** as `SITE_URL=https://your-domain.com`. This drives canonical links, the sitemap, and OpenGraph.

4. **Point `DATA_DIR`** at a persistent path (a mounted volume, not the container's ephemeral filesystem).

See [.env.example](.env.example) for the full list.

## Option 1 — Docker Compose (recommended for a small VPS)

The simplest way to run this in production.

```bash
# 1. Prepare env
cp .env.example .env
# edit .env — set ADMIN_PASSWORD_HASH, SESSION_SECRET, SITE_URL

# 2. Build and start
docker compose up -d --build

# 3. Watch logs
docker compose logs -f web
```

The [docker-compose.yml](docker-compose.yml) mounts `./data` into the container so your `services.json` and `orders.json` survive restarts and rebuilds.

Put nginx / Caddy / Traefik in front of it for TLS. Example Caddyfile:

```
your-domain.com {
  reverse_proxy localhost:3000
}
```

## Option 2 — Bare Node.js on a VPS

```bash
npm ci
npm run build
NODE_ENV=production PORT=3000 npm start
```

Run under a process manager (systemd, pm2). Example systemd unit:

```ini
[Unit]
Description=Saftey
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/saftey
EnvironmentFile=/srv/saftey/.env
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start -p 3000
Restart=on-failure
User=saftey

[Install]
WantedBy=multi-user.target
```

## Option 3 — Vercel / other serverless

**Warning:** JSON file storage does not work on serverless. Each function invocation gets a fresh (or read-only) filesystem, so orders will silently disappear. Before deploying to Vercel, replace [lib/data.js](lib/data.js) with a real database — Vercel Postgres, Turso, Supabase, or similar all work. The rest of the app doesn't care as long as the exported functions keep their signatures.

If you do deploy read-only pages to Vercel (browsing services with an out-of-band admin), you can get away with the current setup, but the admin panel will be broken.

## Health check

`GET /api/health` returns `{ status: "ok", time, uptime }`. Point your load balancer / uptime monitor at it. The Docker image runs this every 30 seconds already.

## Backups

The entire application state is two JSON files in `DATA_DIR`. A cron job that copies them to S3 (or anywhere) is enough:

```bash
0 * * * * cp /srv/saftey/data/*.json /backup/saftey/$(date +\%Y-\%m-\%d-\%H)/
```

## Rotating admin credentials

1. `npm run hash-password` on any machine
2. Update `ADMIN_PASSWORD_HASH` in your env
3. Restart the app (`docker compose restart web` or `systemctl restart saftey`)
4. Existing admin sessions remain valid until they expire (7 days). To invalidate them immediately, also change `SESSION_SECRET`.

## What's already hardened

- Security headers (CSP, HSTS, X-Frame-Options, etc.) — see [next.config.mjs](next.config.mjs)
- Rate limiting on `/api/auth/login` (5 per 5 min per IP) and `/api/orders` POST (5 per min per IP)
- Password hashing with scrypt when `ADMIN_PASSWORD_HASH` is set
- HMAC-signed session cookie, `httpOnly` + `secure` in production
- Input validation on every API route
- Atomic file writes + per-file locking so concurrent orders don't clobber each other
- `output: "standalone"` so the Docker image is minimal

## What to add before real traffic

- **Email notifications** on new orders (Resend, SendGrid, Postmark)
- **Backups** running on a schedule (see above)
- **Uptime monitoring** hitting `/api/health`
- **CDN / TLS terminator** in front (Cloudflare, Caddy, nginx)
- **Real database** if you expect more than a handful of orders per minute or want to deploy to serverless
