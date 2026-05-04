# AI Product Studio

AI-powered product studio that automates client intake, market discovery, and deliverable generation using Claude AI, Next.js, and Neon PostgreSQL.

---

## What It Does

- **Intake** — Accepts client project briefs via API, generates an AI executive summary instantly
- **Discovery** — Automatically researches market, competitors, opportunities, and risks using Claude
- **Deliverables** — Generates PRDs, Technical Specs, Market Analyses, and more on demand
- **Notifications** — Sends Slack notifications at every key step
- **Cron** — Auto-runs discovery every 6 hours on new/stale projects

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Database | Neon (serverless PostgreSQL) |
| AI | Anthropic Claude (claude-opus-4-6) |
| Notifications | Slack Incoming Webhooks |
| Hosting | Vercel |
| Cron | Vercel Cron Jobs |

---

## Project Structure

```
├── app/api/
│   ├── health/route.ts          # GET  — System health check
│   ├── intake/route.ts          # POST — Client intake form
│   ├── discover/route.ts        # GET/POST — AI discovery
│   ├── projects/route.ts        # GET/POST — List/create projects
│   ├── projects/[id]/route.ts   # GET/PATCH/DELETE — Single project
│   ├── deliverables/route.ts    # GET/POST — List/generate deliverables
│   └── cron/discovery/route.ts  # GET — Scheduled discovery runner
├── lib/
│   ├── types.ts                 # All TypeScript interfaces
│   ├── db.ts                    # Neon database helpers
│   ├── claude.ts                # Claude AI integration
│   └── slack.ts                 # Slack webhook notifications
├── schema.sql                   # PostgreSQL schema
├── vercel.json                  # Vercel + Cron config
└── .env.example                 # Environment variable template
```

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/itsgaldor/ai-project-studio.git
cd ai-project-studio
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
# Edit .env.local with your actual keys
```

Required variables:
- `DATABASE_URL` — Neon connection string
- `ANTHROPIC_API_KEY` — From console.anthropic.com
- `SLACK_WEBHOOK_URL` — From api.slack.com (optional but recommended)
- `CRON_SECRET` — Random secret for cron security

### 3. Initialize database

```bash
psql $DATABASE_URL -f schema.sql
# Or paste schema.sql contents in Neon SQL Editor
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Test the API

```bash
# Health check
curl http://localhost:3000/api/health

# Submit intake
curl -X POST http://localhost:3000/api/intake \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Acme Corp",
    "client_email": "cto@acme.com",
    "project_name": "AI Dashboard",
    "project_description": "Real-time AI analytics dashboard for e-commerce",
    "industry": "E-commerce",
    "problem_statement": "No visibility into customer behavior patterns",
    "target_users": "E-commerce store owners and analysts",
    "platform": "web",
    "key_features": ["Real-time analytics", "AI predictions", "Export reports"],
    "budget_range": "$50k - $100k",
    "timeline_weeks": 16
  }'
```

---

## Deployment

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for the full step-by-step guide.

```bash
npm i -g vercel
vercel --prod
```

---

## API Documentation

See [API.md](./API.md) for full API reference with request/response examples.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic Claude API key |
| `SLACK_WEBHOOK_URL` | ⚠️ | Slack incoming webhook URL |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your app's public URL |
| `CRON_SECRET` | ✅ | Secret to secure cron endpoint |

---

## License

MIT
