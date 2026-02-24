# Keyword Tracker Demo

**Example:** Use the AI SaaS Starter to build a product that tracks keywords, suggests new ones, or generates “tracking reports” with AI summaries.

## What you get from the starter

- **Auth & credits** — Credits per report or per keyword add. Same system.
- **Dashboard** — “Keywords”, “Reports”, “Add keyword” instead of generic Generate. Credits widget stays.
- **AI endpoint** — Send keyword list or topic; worker returns suggestions or a short AI summary. Charge per report (e.g. 20 credits).
- **Usage** — Log “keyword_suggestions”, “ranking_report”; users see clear history.
- **Jobs** — Long-running “report” jobs; user polls status like any other job.

## Customize

- **Data** — Add a `Keyword` or `Project` model in Prisma; link usage to projects.
- **Worker** — One job type = “keyword_report”: call your own logic (or a placeholder) then OpenAI for a 2–3 sentence summary. See `report-job.ts`.
- **Credits** — Deduct when report is generated; optional tier (e.g. 10 keywords = 10 credits, 50 = 30).

## Try it

1. Copy the `report-job.ts` pattern into your worker (or a new queue).
2. Add `POST /api/keywords/report` that creates a job with keyword IDs or topic, enqueues, returns jobId.
3. Worker “generates” report (e.g. mock data + AI summary), deducts credits, saves output to Job.

Your product: **Keyword Tracker** or **SEO Rank Reporter** — same starter, your data model and UI.
