# Kafei - Coffee Brewing Log - TEST

Production-ready Next.js 15 App Router app for brew tracking, deterministic recommendations, and feedback analytics.

## Stack
- Next.js + TypeScript + Tailwind
- Prisma ORM
- SQLite (dev), PostgreSQL-compatible Prisma schema flow for Vercel

## Setup
1. `npm install`
2. `cp .env.example .env`
3. `npx prisma migrate dev --name init`
4. `npm run prisma:seed`
5. `npm run dev`

## Tests and build
- `npm test`
- `npm run build`

## Vercel deployment
1. Push repo to GitHub.
2. Import in Vercel.
3. Set `DATABASE_URL` to managed Postgres.
4. Run `npx prisma migrate deploy` in build command or post-deploy.

## Features
- Brew logs with full brewing parameters
- Taste chips + custom adjective support
- Original compass-style visualization and rule-driven advice
- Better/Same/Worse feedback tracking
- Export JSON and CSV
- Analytics charts

## Privacy
Brew data is stored for personal analysis and recommendation improvement.
