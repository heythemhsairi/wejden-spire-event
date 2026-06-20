# WejdenSpire — Event Experience Platform

A standalone Next.js 15 app: a premium, Bloomberg-grade event website for **WejdenSpire**
(Workforce Wellbeing Intelligence). Five interactive experiences that turn invisible
workforce signals into board-room business intelligence.

> This is a **separate app** from the agency CRM in `../src`. It has its own Supabase
> project and its own deploy. Nothing here touches the CRM.

## The five experiences
| # | Route | What it does |
|---|---|---|
| 1 | `/experience/cost-calculator` | Hidden Cost Calculator — live € impact of psychosocial risk |
| 2 | `/experience/risk-scanner` | 10-question executive diagnostic → Workforce Risk Score |
| 3 | `/experience/dashboard` | **Hero** — simulated live CEO terminal per industry/size |
| 4 | `/experience/advisor` | AI Workforce Advisor (streaming, consulting-grade) |
| 5 | `/experience/pulse` + `/pulse/live` | Live Human Signal — 30s input + realtime projector wall |

Plus: `/` home, `/about`, `/briefing` (high-intent lead), `/report/[token]` (shareable
executive report), and `/admin` (leads pipeline + live-pulse control).

## Stack
Next.js 15 · React 19 · TypeScript · Tailwind · Supabase (Postgres + Realtime + RLS) ·
Vercel AI Gateway (advisor) · Framer Motion · Zod.

## Run locally
```bash
cd wejdenspire
npm install
# .env.local is already populated with the WejdenSpire Supabase project.
npm run dev        # http://localhost:3000
```

## Environment (`.env.local`)
| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase (Realtime, public inserts) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only: lead/report writes, admin reads |
| `AI_GATEWAY_API_KEY` | **Enables Experience 4.** Without it the advisor shows a graceful "not configured" state |
| `ADMIN_PASSWORD` | Password gate for `/admin` |

> ⚠️ The Supabase keys + DB password in `.env.local` were shared in chat during the build.
> **Rotate them** in the Supabase dashboard before the event.

## Database
Schema + RLS + seed live in `supabase/migrations/`. To apply to a Supabase project:
```bash
SUPABASE_PAT=sbp_xxx SUPABASE_PROJECT_REF=<ref> node ../scripts/apply-migrations.mjs
```
Tables: `event_sessions`, `pulse_signals`, `leads`, `experience_results`,
`advisor_messages`, `industry_benchmarks`. Aggregates via the security-definer
`pulse_session_stats(uuid)` RPC; reports via `get_report(text)`.

**Security model (verified):** anon can *insert* pulses & leads but cannot *read* raw
rows; live-wall aggregates come only through the RPC. Reports are gated by an
unguessable token.

## Event operations
1. `/admin` → sign in (ADMIN_PASSWORD) → **Pulse** → "Start new session" before doors open.
2. Open `/pulse/live` full-screen on the projector/LED wall.
3. Print a QR to `/experience/pulse` for phones; put `/experience` on booth tablets.
4. During: monitor leads + freeze/reset the wall from `/admin/pulse`.
5. After: export leads CSV from `/admin/leads`.

## Deploy
Push `wejdenspire/` to Vercel as its own project. Set the env vars above in the Vercel
dashboard. Supabase Realtime works out of the box.

## What's stubbed for later
- **Email delivery** of reports (Resend) — leads + report tokens are persisted; wiring
  the send is a drop-in (`src/app/actions/lead.ts`).
- **AI report narrative** — the `experience_results.summary` column + report UI already
  support it; generate it with one Gateway call when `AI_GATEWAY_API_KEY` is set.
- **FR/EN toggle** — copy is centralized enough to add an i18n layer.

See `../WEJDENSPIRE_EVENT_PLATFORM.md` for the full product/UX/architecture plan.
