# SEO Content Generator

**Example:** Use the AI SaaS Starter to build a product that generates meta titles, descriptions, blog outlines, or full SEO briefs.

## What you get from the starter

- **Auth & credits** — Freemium or pay-per-piece. Same credits system.
- **Dashboard** — “Projects” or “Campaigns” instead of generic Generate; list past outputs.
- **AI endpoint** — Send URL/keyword + content type; worker returns SEO copy. Charge by word count or by “piece” (e.g. 10 credits per meta set).
- **Usage** — Log “meta_title”, “blog_outline”, “full_article” so users see what they spent credits on.

## Customize

- **Templates** — Different system prompts per output type (meta, outline, full post). See `templates.ts`.
- **Credits** — Tier by output: e.g. meta = 5, outline = 15, full = 50.
- **Storage** — Save generated content to DB linked to user/project for re-use and export.

## Try it

1. Copy `templates.ts` into your app.
2. Add `POST /api/ai/generate` body params: `type`, `keyword`, `targetUrl`, `outputType`.
3. Worker builds prompt from template, calls OpenAI, deducts credits, stores result.

Your product: **SEO Content AI** — same starter, your templates and positioning.
