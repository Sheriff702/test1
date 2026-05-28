# Cloudflare backend

This folder holds every piece of code and config that talks to Cloudflare.
The rest of the app is backend-agnostic — it just imports from here.

```
cloudflare/
├── d1-http.ts    # Tiny D1 REST client, wrapped for drizzle-orm/sqlite-proxy
├── r2.ts         # R2 client (S3-compatible) used by uploadImage
├── schema.sql    # Schema to apply when creating a fresh D1 database
└── README.md     # This file
```

Production runtime stays on Vercel; the app talks to D1 and R2 over HTTP.
Locally (`npm run dev`) the same code falls back to a libsql file at
`./data/mares.db` and `./public/uploads/`, so the Cloudflare envs are
optional during development.

## One-time setup

### 1. Create the D1 database

In the Cloudflare dashboard for the account you want to use:

- Workers & Pages → D1 → **Create database**, name it `mares`, pick a region
  close to your users.
- Copy the **database ID** from the overview tab — you'll need it as
  `D1_DATABASE_ID`.

Apply the schema once. Easiest from the D1 console: paste each `CREATE`
statement from [`schema.sql`](./schema.sql). Or with Wrangler:

```bash
npx wrangler d1 execute mares --remote --file=cloudflare/schema.sql
```

### 2. Create an R2 bucket

- R2 → **Create bucket**, name it (e.g. `mares-uploads`).
- Open the bucket → Settings → **Public Access** → enable `r2.dev` (or
  attach a custom domain). Copy the public URL — you'll need it as
  `R2_PUBLIC_URL` (no trailing slash).

### 3. Generate API credentials

- **D1 API token** — Profile → API Tokens → Create Token → Custom:
  - Permission: `Account → D1 → Edit` (scoped to the right account).
  - Save the token as `CLOUDFLARE_D1_API_TOKEN`.

- **R2 access keys** — R2 → Manage R2 API Tokens → Create API Token:
  - Permissions: Object Read & Write, scoped to the bucket.
  - Save the Access Key ID + Secret Access Key.

### 4. Pin the envs

In Vercel (Project → Settings → Environment Variables) add the values
from [`.env.example`](../.env.example):

```
ADMIN_PASSWORD
SESSION_SECRET                # openssl rand -hex 32
CLOUDFLARE_ACCOUNT_ID
D1_DATABASE_ID
CLOUDFLARE_D1_API_TOKEN
R2_ACCOUNT_ID                 # same as CLOUDFLARE_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET                     # e.g. mares-uploads
R2_PUBLIC_URL                 # https://pub-xxxxx.r2.dev (no trailing slash)
```

Redeploy. On the first request the products table is auto-seeded from
`lib/products.ts`; admin uploads go straight to R2.

## How the app picks a backend

Both files are pure runtime — `db/index.ts` looks at env to decide:

| Env present                              | Database used     |
| ---------------------------------------- | ----------------- |
| `CLOUDFLARE_ACCOUNT_ID` + `D1_DATABASE_ID` + `CLOUDFLARE_D1_API_TOKEN` | D1 over HTTP (this folder's `d1-http.ts`) |
| Otherwise                                | local libsql file |

| Env present              | Image uploads go to       |
| ------------------------ | ------------------------- |
| All `R2_*` env vars      | R2 (`r2.ts` here)         |
| Otherwise (dev/VPS)      | `./public/uploads/`       |
| Vercel without R2 envs   | Refused with a clear error |
