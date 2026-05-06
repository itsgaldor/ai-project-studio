# AI Product Studio — Deployment Checklist

Follow these steps in order for a successful production deployment.

---

## Phase 1: Prerequisites

- [ ] Node.js >= 18.17 installed locally
- [ ] Git installed and configured
- [ ] Vercel account at vercel.com
- [ ] Neon account at neon.tech
- [ ] Anthropic account at console.anthropic.com
- [ ] Slack workspace with permission to create apps (optional)

---

## Phase 2: Database Setup (Neon)

- [ ] Go to https://console.neon.tech → Create new project
- [ ] Name it `ai-product-studio`
- [ ] Select region closest to your users (e.g., `us-east-1`)
- [ ] Copy the **Connection string** (starts with `postgresql://`)
- [ ] Open the **SQL Editor** in Neon console
- [ ] Paste and run the entire contents of `schema.sql`
- [ ] Verify tables created: `projects`, `deliverables`, `audit_log`
- [ ] Verify view created: `projects_summary`

---

## Phase 3: Anthropic API Key

- [ ] Go to https://console.anthropic.com → API Keys
- [ ] Click **Create Key**
- [ ] Name it `ai-product-studio-prod`
- [ ] Copy the key (starts with `sk-ant-api03-...`)
- [ ] Store it securely — it won't be shown again

---

## Phase 4: Slack Webhook (Optional but Recommended)

- [ ] Go to https://api.slack.com/apps → Create New App → From scratch
- [ ] Name: `AI Product Studio`, pick your workspace
- [ ] Go to **Incoming Webhooks** → Toggle ON
- [ ] Click **Add New Webhook to Workspace**
- [ ] Select your `#ai-studio-notifications` channel (create it first)
- [ ] Copy the Webhook URL (starts with `https://hooks.slack.com/...`)

---

## Phase 5: Local Setup & Test

```bash
# 1. Clone repo
git clone https://github.com/YOUR_USERNAME/ai-product-studio.git
cd ai-product-studio

# 2. Install dependencies
npm install

# 3. Set up local env
cp .env.example .env.local
# Edit .env.local with your keys

# 4. Run locally
npm run dev

# 5. Test health endpoint
curl http://localhost:3000/api/health
# Expected: { "success": true, "data": { "status": "ok" } }

# 6. Test intake
curl -X POST http://localhost:3000/api/intake \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Test Client",
    "client_email": "test@example.com",
    "project_name": "Test Project",
    "project_description": "A test project to validate the setup",
    "industry": "Technology",
    "problem_statement": "Testing the deployment",
    "target_users": "Developers",
    "platform": "web",
    "key_features": ["Feature A", "Feature B"],
    "budget_range": "$10k - $25k",
    "timeline_weeks": 4
  }'
# Expected: { "success": true, "data": { "project": {...} } }
```

- [ ] Health check returns `"status": "ok"` for all services
- [ ] Intake creates a project in Neon (verify in Neon SQL Editor)
- [ ] Slack notification received in channel
- [ ] AI summary is generated in response

---

## Phase 6: Generate Cron Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
# Copy the output — you'll need it in Phase 7 and 8
```

- [ ] Secret generated and saved securely

---

## Phase 7: Vercel Deployment

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

During setup, Vercel will ask:
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N** (first time)
- Project name? → `ai-product-studio`
- Directory? → **./** (current directory)

- [ ] Vercel deployment succeeds
- [ ] Copy your production URL (e.g., `https://ai-product-studio.vercel.app`)

---

## Phase 8: Add Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables.

Add each variable for **Production** (and optionally Preview):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `SLACK_WEBHOOK_URL` | Your Slack webhook URL |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |
| `CRON_SECRET` | Your generated secret from Phase 6 |

- [ ] All 5 variables added in Vercel
- [ ] Redeploy after adding variables: `vercel --prod`

---

## Phase 9: Configure Vercel Cron

- [ ] Go to Vercel Dashboard → Your Project → Settings → Cron Jobs
- [ ] Verify cron job appears: `GET /api/cron/discovery — 0 */6 * * *`
- [ ] Add your `CRON_SECRET` as the **Cron Job Secret** in Vercel settings

---

## Phase 10: Production Smoke Tests

```bash
export API_URL="https://your-project.vercel.app"

# Health check
curl $API_URL/api/health

# Create a project
curl -X POST $API_URL/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Prod Test","description":"Production test","client_name":"Test","client_email":"test@example.com"}'

# Run discovery (use the project ID from above)
curl -X POST $API_URL/api/discover \
  -H "Content-Type: application/json" \
  -d '{"project_id":"YOUR_PROJECT_ID"}'

# Generate a deliverable
curl -X POST $API_URL/api/deliverables \
  -H "Content-Type: application/json" \
  -d '{"project_id":"YOUR_PROJECT_ID","type":"prd","title":"Product Requirements Document"}'
```

- [ ] Health check shows all services green
- [ ] Project created successfully
- [ ] Discovery analysis runs and returns data
- [ ] Deliverable generated with content
- [ ] All Slack notifications received

---

## Phase 11: Monitoring

- [ ] Set up Vercel Analytics (Vercel Dashboard → Analytics tab)
- [ ] Enable Vercel Speed Insights
- [ ] Check Vercel Logs for any errors (Dashboard → Logs)
- [ ] Set up error alerting in Slack (already integrated via `notifyCriticalError`)

---

## Rollback Plan

If deployment fails:
```bash
# Redeploy previous version
vercel rollback

# Or pin to a specific deployment
vercel alias set DEPLOYMENT_URL your-project.vercel.app
```

---