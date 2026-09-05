# Cataply v0.4 — Accounts + Database

This version replaces browser-only demo storage with real account authentication and PostgreSQL persistence.

## Required Vercel environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for Production (and Preview if desired):

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — long random secret
- `OPENAI_API_KEY` — keep the existing Cataply OpenAI key

Do **not** prefix secrets with `NEXT_PUBLIC_`.

## Database

Create a PostgreSQL database (Neon/Postgres is a good fit). The Vercel build runs `prisma migrate deploy` automatically before `next build`, so the included initial migration creates the User, Business, and Campaign tables.

## What is new

- Email/password sign up and sign in
- Secure HTTP-only signed session cookie
- Hashed passwords with bcrypt
- Business profile stored in PostgreSQL
- Campaigns stored in PostgreSQL
- Existing Cataply AI generator remains available
- Browser localStorage is no longer used for account data

## Important

This is the foundation for v0.5 payments. Stripe should be connected only after account/database persistence is confirmed in production.
