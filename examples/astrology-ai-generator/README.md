# Astrology AI Generator

**Example:** Use the AI SaaS Starter to build a product that generates personalized horoscopes, birth chart insights, or compatibility reports using AI.

## What you get from the starter

- **Auth & credits** — Users sign up, get free credits, pay for more. Same flow.
- **Dashboard** — Swap “Generate” for “My chart” / “Daily horoscope” / “Compatibility”.
- **AI endpoint** — Send birth details + question; worker calls OpenAI with a system prompt tuned for astrology tone and structure.
- **Usage** — Each reading costs X credits; history shows “Horoscope”, “Chart insight”, etc.

## Customize

- **Prompt layer** — System prompt + templates (zodiac, house, aspect language). See `prompts.ts`.
- **Credits** — Different cost for “daily” vs “full chart” (e.g. 5 vs 20 credits).
- **Output** — Store results in DB or return inline; optional PDF/email via job completion.

## Try it

1. Copy this folder’s `prompts.ts` (or the pattern) into your app.
2. Add a route or extend `POST /api/ai/generate` with `type: 'astrology'` and your prompt builder.
3. Run worker; users consume credits per reading.

Your product: **Astrology AI** — same starter, your branding and prompts.
