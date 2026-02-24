# 🚀 AI SaaS Starter Kit (Production Ready)

**Launch your AI startup in days, not months.**

Built using real product-studio architecture used in client projects.

---

⭐ **Features** — Auth, dashboard, usage history, admin panel, API-first  
⭐ **Live Architecture** — Next.js 14, PostgreSQL, Redis, BullMQ, OpenAI  
⭐ **Built for scalability** — Job queue, credits, modular structure  
⭐ **Credit-based monetization system** — Configurable pricing, usage tracking, ready to charge

**Imagine your product:** see [**/examples**](examples) — [astrology-ai-generator](examples/astrology-ai-generator), [seo-content-generator](examples/seo-content-generator), [keyword-tracker-demo](examples/keyword-tracker-demo). Same starter, your idea.

---

## Problem solved

Launching an AI product means wiring auth, billing logic, usage limits, background jobs, and an admin surface—again and again. This starter gives you a **single codebase** with those decisions made: JWT auth, credits per request, a Redis-backed job queue, usage logging, and an admin panel. Customize the product, not the plumbing.

---

## Features

- **User authentication** — Signup, login, JWT in HTTP-only-style cookie; protected routes via middleware
- **Dashboard** — Sidebar layout, credits widget, job status indicator
- **Credit-based usage** — Configurable credits per AI request; initial credits for new users; deduct-on-consumption
- **AI generation endpoint** — `POST /api/ai/generate` enqueues a job; worker calls OpenAI and records usage
- **Background job queue** — BullMQ + Redis; worker runs in a separate process (`npm run worker`)
- **Usage history** — Per-user usage logs and list endpoint
- **Admin panel** — Stats (users, jobs, credits used) and user list; ADMIN role required
- **API-first** — All actions available via REST; dashboard is one client

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js (App    │────▶│  PostgreSQL │
│   / React   │     │  Router + API)   │     │  (Prisma)   │
└─────────────┘     └────────┬─────────┘     └─────────────┘
                             │
                             │ enqueue
                             ▼
                    ┌──────────────────┐     ┌─────────────┐
                    │  Redis (BullMQ)  │────▶│  Worker     │
                    │  job queue       │     │  (OpenAI)   │
                    └──────────────────┘     └─────────────┘
```

- **Next.js** serves the app and API routes (App Router). Auth is JWT; middleware guards `/dashboard` and `/admin`.
- **PostgreSQL** holds users, usage logs, and jobs. **Prisma** is the ORM.
- **Redis** backs the BullMQ queue. The **worker** (separate Node process) consumes jobs, calls OpenAI, deducts credits, and updates job status.
- **API-first**: same endpoints power the dashboard and external clients (e.g. API keys in headers for server-to-server).

---

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **TailwindCSS**
- **Node** (API routes inside Next.js)
- **PostgreSQL** + **Prisma**
- **Redis** + **BullMQ**
- **OpenAI** API
- **JWT** (jose) for auth

---

## Getting started

### Prerequisites

- Node 18+
- PostgreSQL
- Redis

### Setup

1. **Clone and install**

   ```bash
   git clone <repo-url> ai-saas-starter && cd ai-saas-starter
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` — PostgreSQL connection string
   - `REDIS_URL` — Redis connection string (e.g. `redis://localhost:6379`)
   - `JWT_SECRET` — Min 32 characters
   - `OPENAI_API_KEY` — OpenAI API key
   - Optional: `DEFAULT_CREDITS_PER_REQUEST`, `INITIAL_CREDITS_FOR_NEW_USER`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`

3. **Database**

   ```bash
   npm run db:push
   npm run db:seed   # optional: set ADMIN_EMAIL and ADMIN_PASSWORD to create admin
   ```

4. **Run**

   ```bash
   npm run dev        # Next.js
   npm run worker     # in another terminal: job worker
   ```

5. **Admin user** (if not using seed)

   Sign up normally, then set `role = 'ADMIN'` for your user in the database (e.g. via `npx prisma studio`).

---

## Project structure

```
ai-saas-starter/
├── prisma/
│   ├── schema.prisma    # User, UsageLog, Job
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/         # Auth, credits, usage, ai/generate, jobs, admin
│   │   ├── dashboard/   # Dashboard layout, generate, usage, jobs
│   │   ├── admin/       # Admin layout and panel
│   │   ├── login/       # Login page
│   │   └── signup/      # Signup page
│   ├── components/
│   │   └── dashboard/   # Sidebar, Header, CreditsWidget, JobStatusIndicator
│   ├── lib/             # db, redis, auth, errors, credits, queue
│   ├── worker/          # BullMQ worker (OpenAI)
│   └── middleware.ts
├── .env.example
├── package.json
└── README.md
```

---

## API overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register; returns user + token |
| POST | `/api/auth/login` | Login; returns user + token |
| GET | `/api/auth/me` | Current user (cookie auth) |
| GET | `/api/credits` | Current user's credits |
| GET | `/api/usage` | Usage history (query: limit, offset) |
| POST | `/api/ai/generate` | Enqueue AI job (body: prompt, model?) |
| GET | `/api/jobs` | List jobs (query: limit, status?) |
| GET | `/api/jobs/[id]` | Job detail + output |
| GET | `/api/admin/stats` | Admin: counts and credits used |
| GET | `/api/admin/users` | Admin: user list |

**Auth:** Cookie `token` (set by login/signup) or header `Authorization: Bearer <token>` for API-first clients.

---

## Keywords (discoverability)

AI SaaS, Next.js starter, TypeScript SaaS, credit system, usage-based billing, OpenAI integration, BullMQ, Redis queue, Prisma PostgreSQL, JWT authentication, SaaS boilerplate, product studio, startup template, AI API, App Router.

---

## License

MIT.

---

**Built by [AnwitaDigital](https://anwitadigital.com) - Product Studio**
