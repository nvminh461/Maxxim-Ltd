# Maxxim Ltd. Construction Company

Next.js App Router website with a Vietnamese CMS at `/admin`.

## CMS scope

- Banner hero: image/video, English title/subtitle/CTA, drag-and-drop order.
- Projects: category, detail fields, Featured Projects, drag-and-drop media order.
- Categories: English names/slugs, drag-and-drop order.
- Home marquee images: upload, preview, drag-and-drop order.
- Contact form submissions: saved to MongoDB with IP HMAC rate limiting.
- Footer settings: logo, company info, socials, contact info, copyright. Quick Links and design credit stay hardcoded.

Admin labels are Vietnamese. Public FE content remains English.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill MongoDB Atlas, Auth, and Cloudflare R2 values.

3. Configure R2 CORS for your site origin so browser PUT uploads are allowed.

4. Seed the initial CMS data from current mock content:

```bash
npm run seed:cms
```

The seed is idempotent: it upserts MongoDB records and uses deterministic R2 keys for mock assets.

5. Start development:

```bash
npm run dev
```

Open `http://localhost:3000/admin/login` and sign in with `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`.

## Useful commands

```bash
npm run lint
npm test
npm run build
```

`npm test` uses `tsx --test`. In restricted sandboxes it may need permission to create an IPC pipe in `/tmp`.
