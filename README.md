# AI SaaS Starter Kit

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748.svg)](https://www.prisma.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-green.svg)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Production-ready AI SaaS boilerplate** — auth, credit-based usage, background job queue, admin panel, and API-first design. Launch your AI startup in days, not months. Built with the same architecture used in real product-studio client work.

By **[Anwita Digital](https://anwitadigital.com)** — AI and product studio.

---

## Table of Contents

- [Features](#features)
- [Why This Starter](#why-this-starter)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User authentication** — Signup, login, JWT in HTTP-only-style cookie; protected routes via middleware
- **Dashboard** — Sidebar layout, credits widget, job status indicator
- **Credit-based usage** — Configurable credits per AI request; initial credits for new users; deduct on consumption
- **AI generation endpoint** — `POST /api/ai/generate` enqueues a job; worker calls OpenAI and records usage
- **Background job queue** — BullMQ + Redis; worker runs in a separate process (`npm run worker`)
- **Usage history** — Per-user usage logs and list endpoint
- **Admin panel** — Stats (users, jobs, credits used) and user list; ADMIN role required
- **API-first** — All actions available via REST; dashboard is one client; same endpoints for external integrations

## Why This Starter

Launching an AI product usually means wiring auth, usage limits, background jobs, and an admin surface from scratch every time. This starter gives you a **single codebase** with those decisions made: JWT auth, credits per request, Redis-backed job queue, usage logging, and an admin panel. Customize the product, not the plumbing.

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
- **API-first:** same endpoints power the dashboard and external clients (e.g. API keys in headers for server-to-server).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend & API | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Database | PostgreSQL, Prisma ORM |
| Queue | Redis, BullMQ |
| AI | OpenAI API |
| Auth | JWT (jose), HTTP-only-style cookie |

---

## Quick Start

```bash
git clone <repo-url> ai-saas-starter
cd ai-saas-starter
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, REDIS_URL, JWT_SECRET, OPENAI_API_KEY
npm run db:push
npm run db:seed   # optional: ADMIN_EMAIL, ADMIN_PASSWORD for admin user
npm run dev       # Terminal 1: Next.js
npm run worker    # Terminal 2: job worker
```

---

## Installation

### Prerequisites

- **Node 18+**
- **PostgreSQL**
- **Redis**

### Steps

1. **Clone and install**
   ```bash
   git clone <repo-url> ai-saas-starter
   cd ai-saas-starter
   npm install
   ```

2. **Environment**  
   Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` — PostgreSQL connection string
   - `REDIS_URL` — Redis (e.g. `redis://localhost:6379`)
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

## Configuration

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection (e.g. `redis://localhost:6379`) |
| `JWT_SECRET` | Secret for JWT (min 32 chars) |
| `OPENAI_API_KEY` | OpenAI API key |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | Public API URL (e.g. `http://localhost:3000/api`) |
| `DEFAULT_CREDITS_PER_REQUEST` | Credits deducted per AI request (default: 10) |
| `INITIAL_CREDITS_FOR_NEW_USER` | Credits for new signups (default: 100) |

---

## Project Structure

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
├── examples/            # astrology-ai-generator, seo-content-generator, keyword-tracker-demo
├── .env.example
├── package.json
└── README.md
```

---

## API Overview

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

**Auth:** Cookie `token` (set by login/signup) or header `Authorization: Bearer <token>` for API clients.

---

## Examples

Same starter, different products. See **[/examples](examples)**:

- **[astrology-ai-generator](examples/astrology-ai-generator)** — AI horoscope / astrology content
- **[seo-content-generator](examples/seo-content-generator)** — Meta titles, descriptions, blog outlines
- **[keyword-tracker-demo](examples/keyword-tracker-demo)** — Keyword tracking and reporting

Use these as templates for your own AI product (prompts, credits, job types).

---

## Contributing

Issues and pull requests are welcome. For large changes, open an issue first to align on direction.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**Built by [Anwita Digital](https://anwitadigital.com)** — AI and product studio.
