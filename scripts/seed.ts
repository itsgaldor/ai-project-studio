// ============================================================
// AI Product Studio — Database Seed Script
// ============================================================
// Run: npm run seed   (or: npx tsx scripts/seed.ts)
// ============================================================

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

// ─── Load .env.local ─────────────────────────────────────────

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set. Add it to .env.local");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// ─── Seed Data ───────────────────────────────────────────────

const CLIENTS = [
  // ── 1. TechFlow Analytics — SaaS B2B, discovery only ──────
  {
    name: "TechFlow Analytics Platform",
    description: "B2B SaaS platform for real-time pipeline analytics and revenue attribution. Helps RevOps teams track deal velocity and forecast accuracy across the entire GTM stack. (one_shot)",
    client_name: "Marcus Chen",
    client_email: "marcus.chen@techflow.example.com",
    industry: "SaaS",
    budget_range: "$25k - $50k",
    timeline_weeks: 10,
    status: "discovery",
    ai_summary: "TechFlow is targeting mid-market B2B SaaS companies struggling with fragmented analytics across CRM, billing, and product. Strong product-market fit signal — 3 major competitors lack real-time attribution. Recommended focus: RevOps automation and Salesforce-native integration.",
    discovery_data: {
      market_size: "The B2B revenue analytics market is valued at $4.2B in 2024, growing at 18% CAGR. Mid-market segment (50–500 employees) represents the largest underserved opportunity with ~$1.1B addressable market.",
      target_audience: "RevOps Managers, VP of Sales, and CFOs at mid-market B2B SaaS companies (50–500 employees) generating $5M–$50M ARR. They use Salesforce or HubSpot as CRM and struggle with multi-touch attribution and churn prediction.",
      unique_value_proposition: "The only revenue analytics platform that auto-reconciles CRM, billing, and product usage data in real-time — giving RevOps teams one source of truth without engineering support.",
      opportunities: [
        "No dominant player offers native Salesforce + Stripe + Segment integration without custom ETL",
        "RevOps function growing 40% YoY — dedicated budgets now standard at Series B+ companies",
        "AI-powered forecast nudges represent a premium upsell layer with high perceived value",
        "PLG motion enables self-serve onboarding, reducing CAC by up to 60%",
      ],
      risks: [
        "Salesforce is building native analytics features that could commoditize basic reporting",
        "Long sales cycles (60–90 days) create cash flow pressure at early stage",
        "Data privacy regulations (GDPR, SOC 2) add compliance overhead before enterprise deals",
      ],
      recommended_features: [
        "Multi-touch attribution engine",
        "Real-time pipeline health score",
        "Churn risk predictor",
        "Salesforce + HubSpot native sync",
        "Slack & email digest reports",
        "Custom dashboard builder",
      ],
      tech_stack_suggestions: [
        "Next.js (frontend)",
        "PostgreSQL + TimescaleDB",
        "Kafka (event streaming)",
        "Salesforce API",
        "Stripe Billing API",
        "Segment CDP",
      ],
      monetization_models: [
        "Per-seat SaaS ($49–$199/seat/mo)",
        "Data volume tiers",
        "Enterprise flat-rate ($2k–$8k/mo)",
      ],
      competitors: [
        {
          name: "Clari",
          url: "https://clari.com",
          pricing: "$100k+/yr enterprise",
          strengths: ["Strong enterprise brand", "AI forecasting maturity", "Deep Salesforce integration"],
          weaknesses: ["Prohibitive price for mid-market", "Requires 3-month implementation", "No product usage data"],
        },
        {
          name: "Gong Revenue Intelligence",
          url: "https://gong.io",
          pricing: "$1,400/seat/yr",
          strengths: ["Conversation intelligence leader", "Massive data moat", "Strong coaching tools"],
          weaknesses: ["Focused on deals, not pipeline health", "Expensive for full RevOps suite", "Limited billing integration"],
        },
        {
          name: "ChartMogul",
          url: "https://chartmogul.com",
          pricing: "$79–$449/mo",
          strengths: ["Affordable", "Good billing analytics", "Easy setup"],
          weaknesses: ["No CRM integration", "No predictive features", "Limited for complex GTM motions"],
        },
      ],
      last_run_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    proposal: null,
  },

  // ── 2. StorePro Solutions — E-commerce, has proposal ───────
  {
    name: "StorePro AI Commerce Suite",
    description: "E-commerce optimization platform that uses AI to personalize product recommendations, optimize inventory levels, and automate promotional campaigns for mid-size online retailers. (one_shot)",
    client_name: "Sarah Okonkwo",
    client_email: "sarah.okonkwo@storepro.example.com",
    industry: "E-commerce",
    budget_range: "$100k - $250k",
    timeline_weeks: 16,
    status: "analysis",
    ai_summary: "StorePro targets Shopify and WooCommerce merchants doing $1M–$20M GMV who outgrow native analytics. Key insight: 78% of their target segment uses only default Shopify reports. AI personalization and inventory forecasting are the highest-value differentiators. Recommend launching with inventory optimizer as lead feature.",
    discovery_data: {
      market_size: "Global e-commerce analytics and personalization market reached $12.8B in 2024. The SMB/mid-market segment (Shopify merchants $1M–$20M GMV) represents $2.3B of that — significantly underpenetrated by enterprise solutions.",
      target_audience: "E-commerce directors and founders at online retailers with $1M–$20M annual GMV running on Shopify or WooCommerce. They have 5–50 SKUs, seasonal spikes, and struggle with stockouts and low email conversion.",
      unique_value_proposition: "StorePro's AI learns your store's seasonality in 7 days and reduces overstock by 30% while increasing conversion by 25% — without changing your existing Shopify setup.",
      opportunities: [
        "Shopify's native analytics are basic — 2.1M merchants are underserved",
        "AI personalization delivers measurable ROI within 30 days — easy to prove value",
        "Inventory optimization has direct P&L impact, making budget approval easier",
        "Partnership distribution via Shopify App Store = low CAC growth channel",
      ],
      risks: [
        "Shopify is continuously expanding native AI features in their admin dashboard",
        "Seasonal businesses create uneven revenue — subscription churn after Q4 peak",
        "Integration complexity varies widely across legacy WooCommerce setups",
        "Data quality from small merchants often poor, undermining AI model accuracy",
      ],
      recommended_features: [
        "AI product recommendations widget",
        "Inventory demand forecasting",
        "Automated discount engine",
        "Customer lifetime value predictor",
        "Shopify & WooCommerce native connector",
        "One-click A/B testing",
        "Real-time revenue dashboard",
      ],
      tech_stack_suggestions: [
        "React + Next.js",
        "Python (ML models)",
        "Shopify Storefront API",
        "BigQuery (analytics warehouse)",
        "Klaviyo API (email)",
        "Redis (caching)",
      ],
      monetization_models: [
        "GMV-based percentage (0.5–1.5%)",
        "Flat monthly SaaS ($299–$999/mo)",
        "Success fee on attributed revenue",
      ],
      competitors: [
        {
          name: "Klaviyo",
          url: "https://klaviyo.com",
          pricing: "$150–$700/mo",
          strengths: ["Market leader in e-commerce email", "Strong Shopify integration", "Large template library"],
          weaknesses: ["Email-only, no inventory features", "Complex for non-marketers", "Expensive at scale"],
        },
        {
          name: "Rebuy Engine",
          url: "https://rebuyengine.com",
          pricing: "$99–$749/mo",
          strengths: ["Strong upsell/cross-sell", "Shopify-native", "Good ROI tracking"],
          weaknesses: ["Recommendations only, no inventory", "Limited to Shopify", "No demand forecasting"],
        },
      ],
      last_run_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    proposal: {
      title: "AI Commerce Growth Strategy for StorePro Solutions",
      executive_summary: "StorePro Solutions is positioned to capture a significant share of the $2.3B mid-market e-commerce analytics gap. This proposal outlines a 16-week engagement to build and launch an AI-powered commerce suite featuring personalized recommendations, inventory demand forecasting, and automated promotional campaigns — projected to deliver 30% inventory cost reduction and 25% conversion lift for beta merchants.",
      sections: [
        {
          title: "Problem Statement",
          content: "Mid-size e-commerce merchants ($1M–$20M GMV) are stuck using basic Shopify reports designed for beginners. They face three critical pain points: stockouts during peak season cost an average of 12% of annual revenue; generic product pages convert at 2.1% versus 4.8% with personalization; and manual campaign management consumes 15+ hours per week of marketing time.",
        },
        {
          title: "Proposed Solution",
          content: "A three-module AI commerce suite that installs as a Shopify app in under 10 minutes: (1) Smart Recommendations Engine using collaborative filtering and real-time browsing signals; (2) Inventory IQ for demand forecasting with 92% accuracy up to 90 days out; (3) Campaign Autopilot that triggers personalized promotions based on customer behavior segments.",
          key_features: [
            "One-click Shopify installation, zero developer time",
            "AI personalization live within 7 days of data collection",
            "Inventory forecasting with seasonal adjustment",
            "Automated email + SMS campaign triggers",
            "Live dashboard with revenue attribution",
          ],
        },
        {
          title: "Expected Outcomes",
          content: "Based on comparable implementations, merchants in the $1M–$20M GMV range can expect measurable improvements across inventory efficiency, conversion rate, and marketing ROI within the first 60 days.",
          metrics: [
            "30% reduction in overstock carrying costs",
            "25% improvement in product page conversion rate",
            "40% time savings on campaign management",
            "2.8x ROI within first 90 days",
            "Average merchant revenue uplift: $180k/yr",
          ],
        },
        {
          title: "Timeline & Deliverables",
          content: "The 16-week project is structured in three phases: Discovery & Architecture (weeks 1–4), Core Platform Build (weeks 5–12), and Beta Launch & Optimization (weeks 13–16).",
          timeline_weeks: 16,
          deliverables: [
            "Phase 1: Technical architecture, Shopify app scaffolding, ML pipeline setup",
            "Phase 2: Recommendation engine, inventory forecasting module, campaign automation",
            "Phase 3: Beta merchant onboarding, performance tuning, Shopify App Store submission",
          ],
        },
      ],
      pricing: [
        {
          tier: "Starter",
          price: 45000,
          description: "Core platform foundation",
          includes: [
            "Shopify app (recommendations only)",
            "Basic inventory dashboard",
            "3 months post-launch support",
            "Technical documentation",
          ],
        },
        {
          tier: "Standard",
          price: 95000,
          description: "Full suite — most popular",
          includes: [
            "Everything in Starter",
            "Inventory IQ forecasting module",
            "Campaign Autopilot (email + SMS)",
            "Custom reporting dashboard",
            "6 months support + 2 training sessions",
          ],
        },
        {
          tier: "Premium",
          price: 180000,
          description: "End-to-end with GTM support",
          includes: [
            "Everything in Standard",
            "Shopify App Store listing optimization",
            "First 50 merchant onboarding support",
            "ML model retraining pipeline",
            "12 months support + dedicated success manager",
          ],
        },
      ],
      terms: "50% due on contract signing, 25% at Phase 2 kickoff, 25% on final delivery. All IP transfers to client upon final payment. 30-day bug-fix warranty included.",
      next_steps: "We recommend a 45-minute technical discovery call to finalize the Shopify API integration approach and confirm Phase 1 scope. Please share your current Shopify analytics data export so we can begin the demand forecasting model training plan.",
    },
  },

  // ── 3. ConsultLab — Professional Services, active ──────────
  {
    name: "ConsultLab Client Intelligence Suite",
    description: "AI-powered client management and project intelligence platform for boutique consulting firms. Automates client reporting, tracks engagement health, and surfaces upsell opportunities using communication patterns. (retainer)",
    client_name: "Priya Nambiar",
    client_email: "priya.nambiar@consultlab.example.com",
    industry: "Consulting",
    budget_range: "$25k - $50k",
    timeline_weeks: 24,
    status: "delivery",
    ai_summary: "ConsultLab serves boutique strategy and management consulting firms (5–30 consultants) that rely on Excel and email for client management. High-intent segment — average partner billing rate is $350/hr, making software ROI easy to justify. Priority features: automated status reports and client health scoring.",
    discovery_data: {
      market_size: "Professional services automation market is $14.7B globally, with boutique consulting firms (under $10M revenue) representing a $1.8B underserved segment. These firms have the budget but lack enterprise PSA vendor attention.",
      target_audience: "Managing Partners and Operations Directors at boutique consulting firms with 5–30 consultants doing $2M–$15M in annual revenue. They use Notion or Excel for project tracking, suffer from inconsistent client updates, and lose renewal conversations because they lack health data.",
      unique_value_proposition: "ConsultLab gives every consulting partner a real-time client health score — so they can have the upsell conversation before the client starts shopping for alternatives.",
      opportunities: [
        "Boutique firms have zero CRM designed for their workflow — massive whitespace",
        "AI-generated status reports save 3–5 hours per partner per week at $350/hr rates",
        "Client health scoring reduces churn — consulting retention is 70% without structured touchpoints",
        "Network effects: firms refer each other, enabling community-led growth",
      ],
      risks: [
        "Long relationship sales cycles — partners need to see ROI before committing annual contract",
        "Consultants are resistant to workflow change; adoption requires strong onboarding",
        "Competing with generic CRMs (HubSpot, Pipedrive) requires strong vertical positioning",
      ],
      recommended_features: [
        "AI client health score (0–100)",
        "Automated weekly status report generator",
        "Meeting notes → action item extractor",
        "Revenue at risk dashboard",
        "Proposal generation from project templates",
        "Client satisfaction pulse surveys",
        "Utilization rate tracker",
      ],
      tech_stack_suggestions: [
        "Next.js + TypeScript",
        "PostgreSQL",
        "OpenAI / Claude API",
        "Google Calendar API",
        "Notion API",
        "SendGrid (reports)",
      ],
      monetization_models: [
        "Per-consultant seat ($89–$149/seat/mo)",
        "Firm flat rate ($499–$2,499/mo)",
        "Annual contract with 20% discount",
      ],
      competitors: [
        {
          name: "Teamwork.com",
          pricing: "$10–$18/user/mo",
          strengths: ["Purpose-built for agencies", "Good time tracking", "Client portal"],
          weaknesses: ["No AI features", "Weak reporting", "Not designed for consulting"],
        },
        {
          name: "Accelo",
          pricing: "$24–$39/user/mo",
          strengths: ["Professional services focus", "Revenue forecasting", "Automated billing"],
          weaknesses: ["Complex UI", "Slow onboarding (weeks)", "No health scoring"],
        },
        {
          name: "HubSpot CRM",
          pricing: "Free–$1,200/mo",
          strengths: ["Market leader", "Extensive integrations", "Strong marketing tools"],
          weaknesses: ["Built for sales, not project delivery", "No consulting-specific features", "Requires heavy customization"],
        },
      ],
      last_run_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    proposal: {
      title: "Client Intelligence Platform for ConsultLab",
      executive_summary: "ConsultLab's 12-person strategy practice is losing an estimated $340k annually to preventable churn and missed upsell opportunities — all because client health data lives in email threads and spreadsheets. This 24-week retainer engagement delivers a purpose-built client intelligence platform: AI health scoring, automated status reports, and a real-time revenue-at-risk dashboard. Expected outcome: 40% reduction in surprise churn and 2 additional upsell conversions per quarter.",
      sections: [
        {
          title: "Problem Statement",
          content: "Boutique consulting firms manage complex client relationships without the tooling to see problems coming. Partners spend 4–6 hours per week manually compiling status updates. Client health deteriorates invisibly — by the time a partner notices dissatisfaction, the client has already begun evaluating alternatives. Without structured engagement data, renewal conversations happen reactively instead of strategically.",
        },
        {
          title: "Proposed Solution",
          content: "A three-layer client intelligence platform built specifically for boutique consulting workflows: Layer 1 — data ingestion from email, calendar, and project tools; Layer 2 — AI processing to extract sentiment, action items, and relationship signals; Layer 3 — partner dashboard with health scores, revenue alerts, and automated client reports.",
          key_features: [
            "AI health score updated after every client interaction",
            "One-click weekly status report from meeting notes",
            "Revenue at risk alerts 30 days before contract renewal",
            "Client sentiment trend analysis",
            "Partner utilization and billing forecast",
          ],
        },
        {
          title: "Expected Outcomes",
          content: "Based on the 12-person firm profile, we project meaningful improvement in client retention and partner efficiency within the first quarter of deployment.",
          metrics: [
            "40% reduction in surprise client churn",
            "3.5 hours saved per partner per week on status reporting",
            "2+ additional upsell conversations per quarter identified",
            "$280k estimated annual value from churn prevention alone",
            "90% partner adoption rate by week 8 (with structured onboarding)",
          ],
        },
        {
          title: "Timeline & Deliverables",
          content: "Structured as a 24-week retainer with monthly milestones and weekly check-ins. The first 8 weeks focus on core platform; weeks 9–16 on AI layer and integrations; weeks 17–24 on refinement and expansion.",
          timeline_weeks: 24,
          deliverables: [
            "Phase 1 (Weeks 1–8): Core CRM, project tracking, client portal",
            "Phase 2 (Weeks 9–16): AI health scoring, auto-reports, Google/Notion integration",
            "Phase 3 (Weeks 17–24): Revenue dashboard, partner analytics, onboarding program",
          ],
        },
      ],
      pricing: [
        {
          tier: "Starter",
          price: 18000,
          description: "Core platform only",
          includes: [
            "Client CRM and project tracking",
            "Basic reporting dashboard",
            "Up to 5 consultant seats",
            "3 months support",
          ],
        },
        {
          tier: "Standard",
          price: 32000,
          description: "Full platform — recommended",
          includes: [
            "Everything in Starter",
            "AI health scoring and sentiment analysis",
            "Automated status report generator",
            "Google Calendar + Notion integration",
            "6 months support + 3 onboarding sessions",
          ],
        },
        {
          tier: "Premium",
          price: 55000,
          description: "Platform + ongoing retainer",
          includes: [
            "Everything in Standard",
            "Revenue at risk dashboard",
            "Custom AI model tuning for firm's context",
            "12 months retainer (weekly iteration)",
            "Dedicated success manager",
          ],
        },
      ],
      terms: "Monthly retainer billed on the 1st of each month. 30-day cancellation notice required after month 3. All code and data remain property of ConsultLab upon contract completion.",
      next_steps: "Next step is a 60-minute workflow audit with 2–3 partners to map your current client reporting process. This directly informs the Week 1–2 sprint plan. Please send us 3 anonymized examples of your current status report format before the call.",
    },
  },

  // ── 4. CloudNow — SaaS B2C, analysis/proposal ──────────────
  {
    name: "CloudNow Personal Productivity OS",
    description: "B2C SaaS productivity platform that unifies tasks, notes, calendar, and files into a single AI-powered workspace. Targets knowledge workers frustrated with juggling 5+ tools daily. (one_shot)",
    client_name: "James Whitfield",
    client_email: "james.whitfield@cloudnow.example.com",
    industry: "SaaS",
    budget_range: "$10k - $25k",
    timeline_weeks: 12,
    status: "analysis",
    ai_summary: "CloudNow targets the 'productivity fatigue' segment — knowledge workers actively seeking tool consolidation after Notion/Todoist/Google Calendar overwhelm. Market is crowded but fragmented at the personal tier. Recommended differentiation: AI that proactively restructures your day based on energy patterns and deadline proximity. Budget is starter-tier — MVP approach strongly recommended.",
    discovery_data: {
      market_size: "Personal productivity software market is $58B globally, growing at 14% CAGR. The AI-enhanced segment is nascent at $4.2B but growing 3x faster. Key insight: the average knowledge worker uses 7.2 different tools per day — consolidation is a genuine pain with willingness to pay.",
      target_audience: "Independent knowledge workers, freelancers, and remote employees (25–40 years old) managing complex personal workflows. They currently use a combination of Notion, Todoist, Google Calendar, and Obsidian, and spend 45+ minutes daily on tool-switching overhead.",
      unique_value_proposition: "CloudNow is the only productivity OS that learns your energy patterns and automatically restructures your day — so you do deep work when you're sharp and admin when you're not.",
      opportunities: [
        "AI scheduling assistants are proven ($3.8B Notion valuation shows category appetite)",
        "Subscription fatigue means users will consolidate — winner-takes-most dynamic emerging",
        "Energy-based scheduling is a scientifically validated approach with no mainstream product",
        "Creator economy growth = more solopreneurs needing personal OS solutions",
      ],
      risks: [
        "Market is extremely crowded — Notion, Linear, ClickUp, Todoist all expanding scope",
        "Consumer SaaS has high churn — strong habit formation required in first 14 days",
        "Apple and Google are building native AI productivity into OS — potential platform risk",
        "Starter budget limits the quality of initial AI features — risk of weak first impression",
      ],
      recommended_features: [
        "Unified inbox (tasks + email + calendar)",
        "AI daily schedule optimizer",
        "Energy level tracker",
        "Smart task prioritization",
        "Cross-tool context search",
        "Weekly review AI assistant",
      ],
      tech_stack_suggestions: [
        "React Native (mobile-first)",
        "Supabase",
        "Claude API (AI features)",
        "Google Calendar API",
        "Todoist API",
        "Notion API",
      ],
      monetization_models: [
        "Freemium with $12/mo Pro",
        "Annual plan ($99/yr)",
        "Team plan ($8/seat/mo)",
      ],
      competitors: [
        {
          name: "Notion",
          url: "https://notion.so",
          pricing: "Free–$16/mo",
          strengths: ["Massive user base", "Infinite flexibility", "Strong community"],
          weaknesses: ["No native AI scheduling", "Overwhelming for new users", "Slow on mobile"],
        },
        {
          name: "Todoist",
          url: "https://todoist.com",
          pricing: "Free–$6/mo",
          strengths: ["Best-in-class task management", "Clean UX", "All-platform availability"],
          weaknesses: ["No notes or calendar", "AI features basic", "No energy-awareness"],
        },
      ],
      last_run_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    proposal: {
      title: "Productivity OS MVP Strategy for CloudNow",
      executive_summary: "CloudNow has an opportunity to own the 'AI-first personal OS' category before Notion and Google close the gap. This 12-week MVP engagement focuses on the single most defensible feature — energy-aware scheduling — wrapped in a clean, opinionated UX that converts the Notion-overwhelmed segment. With a $10k–$25k budget, we recommend a tight MVP: AI daily planner + unified task view, designed for viral organic growth via the creator economy.",
      sections: [
        {
          title: "Problem Statement",
          content: "Knowledge workers are drowning in productivity tools. The average user switches between 7.2 apps per day, losing 45 minutes to context-switching overhead. Every major tool has added AI features in 2024, but none address the root cause: tools don't know when you work best. Users get generic reminders at wrong times, causing task avoidance and guilt — not productivity.",
        },
        {
          title: "Proposed Solution",
          content: "An opinionated MVP focused on one killer workflow: the AI Daily Brief. Every morning, CloudNow analyzes your task backlog, calendar, and 30-day energy pattern to generate a personalized daily schedule — telling you exactly what to work on and when. Launch with web + iOS, Todoist and Google Calendar integration, and a sharp onboarding flow designed to show value in the first session.",
          key_features: [
            "AI Daily Brief — personalized schedule generated each morning",
            "Energy pattern learning from 2-question daily check-in",
            "Unified task view from Google Tasks + Todoist",
            "Google Calendar read/write integration",
            "Streak and momentum tracking",
          ],
        },
        {
          title: "Expected Outcomes",
          content: "The MVP strategy prioritizes a fast path to 500 engaged beta users within 60 days of launch — the threshold needed to validate PMF and raise a pre-seed round.",
          metrics: [
            "500 active beta users within 60 days of launch",
            "65%+ Day-7 retention (benchmark: Todoist achieves 42%)",
            "4.5+ App Store rating targeting from launch design decisions",
            "$5k MRR within 90 days via annual plan conversions",
            "3 viral Product Hunt moments planned for launch sequence",
          ],
        },
        {
          title: "Timeline & Deliverables",
          content: "12-week sprint with weekly demos and a public beta launch at week 10, followed by 2 weeks of rapid iteration based on real user behavior.",
          timeline_weeks: 12,
          deliverables: [
            "Phase 1 (Weeks 1–4): Design system, onboarding flow, Todoist + GCal integration",
            "Phase 2 (Weeks 5–9): AI Daily Brief engine, energy tracking, web + iOS MVP",
            "Phase 3 (Weeks 10–12): Beta launch, user feedback loop, monetization setup",
          ],
        },
      ],
      pricing: [
        {
          tier: "Starter",
          price: 12000,
          description: "Web MVP only",
          includes: [
            "Web app (React)",
            "Google Calendar integration",
            "Basic AI task scheduling",
            "6 weeks post-launch support",
          ],
        },
        {
          tier: "Standard",
          price: 22000,
          description: "Web + iOS MVP",
          includes: [
            "Everything in Starter",
            "React Native iOS app",
            "Energy pattern learning engine",
            "Todoist + Google Tasks integration",
            "App Store submission support",
            "3 months support",
          ],
        },
        {
          tier: "Premium",
          price: 38000,
          description: "Full launch package",
          includes: [
            "Everything in Standard",
            "Android app",
            "Stripe subscription billing integration",
            "Analytics dashboard (Mixpanel setup)",
            "Product Hunt launch strategy + assets",
            "6 months support + monthly strategy calls",
          ],
        },
      ],
      terms: "50% upfront to begin development, 50% on final delivery. Includes 30-day bug-fix guarantee post-launch. Source code delivered via private GitHub repository.",
      next_steps: "Let's schedule a 30-minute call to review the AI scheduling algorithm approach and confirm the Todoist vs. Google Tasks integration priority. Share your current Figma mockups (if any) before the call so we can assess design re-use opportunities.",
    },
  },

  // ── 5. PayFlow Digital — Fintech, completed ────────────────
  {
    name: "PayFlow Digital Wallet Infrastructure",
    description: "Fintech platform enabling SMBs in Latin America to send cross-border B2B payments and manage multi-currency balances via a developer-friendly API and white-label dashboard. (retainer)",
    client_name: "Valentina Torres",
    client_email: "valentina.torres@payflow.example.com",
    industry: "Fintech",
    budget_range: "$100k - $250k",
    timeline_weeks: 20,
    status: "completed",
    ai_summary: "PayFlow is tackling LATAM cross-border payment friction — a genuine $4.2B problem. Regulatory complexity (SPEI, PIX, CLP integrations) is the primary moat. Strong founding team: ex-Stripe and ex-Nubank backgrounds. The delivered solution included a multi-currency wallet, FX rate engine, and white-label dashboard. All 3 pilot customers went live successfully.",
    discovery_data: {
      market_size: "Latin America cross-border B2B payments market is $740B annually with $4.2B in fees — growing at 22% CAGR. SPEI (Mexico), PIX (Brazil), and CLP (Chile) integrations cover 78% of regional volume. Regulatory complexity is the primary barrier to entry, creating durable competitive moats for early movers.",
      target_audience: "CFOs and Heads of Finance at SMBs in Mexico, Brazil, and Chile doing $500k–$10M in annual cross-border payments. They currently use wire transfers (3–5 business days, 3–5% fees) or PayPal Business (high FX markup, poor API). Key frustration: no real-time FX visibility before executing.",
      unique_value_proposition: "PayFlow gives LATAM SMBs real-time multi-currency balances and cross-border transfers in under 4 hours at 0.8% FX markup — versus the 3–5 day, 3–5% standard banking wire.",
      opportunities: [
        "SPEI Instant (Mexico's 24/7 instant payment rail) launched in 2023 — infrastructure advantage window open",
        "Brazil's PIX has 140M+ users — B2B adoption growing 180% YoY with no dominant SMB API player",
        "Stablecoin settlement layer (USDC) reduces FX risk while cutting transfer time to minutes",
        "Embedded payments for LATAM B2B SaaS platforms = distribution without direct sales motion",
      ],
      risks: [
        "Regulatory licensing timelines in Mexico (CNBV) can take 18–24 months — use partner banks initially",
        "USD strength volatility creates hedging complexity for multi-currency balance holders",
        "Mercado Pago and Bitso entering the B2B space with significant distribution advantages",
        "KYC/AML compliance costs are high — $150k–$300k annually at early stage",
      ],
      recommended_features: [
        "Multi-currency wallet (USD, MXN, BRL, CLP)",
        "Real-time FX rate engine with 30-day lock",
        "Developer API with webhook events",
        "White-label dashboard for resellers",
        "KYC/AML onboarding flow",
        "SPEI + PIX native integration",
        "Stablecoin settlement option",
      ],
      tech_stack_suggestions: [
        "Node.js + TypeScript (API)",
        "PostgreSQL + TimescaleDB",
        "Plaid (US bank connections)",
        "Belvo (LATAM bank data)",
        "Stripe Treasury (partner bank layer)",
        "Redis (rate engine cache)",
        "AWS (multi-region: us-east-1, sa-east-1)",
      ],
      monetization_models: [
        "FX spread (0.8–1.5% per transaction)",
        "API access fee ($500–$3,000/mo)",
        "White-label license ($2,000–$8,000/mo)",
        "Float income on held balances",
      ],
      competitors: [
        {
          name: "Tribal Credit",
          pricing: "1.5–2.5% FX spread",
          strengths: ["Strong LATAM focus", "Good credit product", "Series B funded"],
          weaknesses: ["Credit-focused, not payments-first", "Limited API quality", "Mexico-only initially"],
        },
        {
          name: "Airwallex",
          pricing: "0.5% FX + API fees",
          strengths: ["Excellent API", "Global coverage", "Strong developer docs"],
          weaknesses: ["Limited LATAM local rails", "Enterprise-focused minimum volumes", "Slow LATAM onboarding"],
        },
        {
          name: "dLocal",
          pricing: "1.5–3% blended",
          strengths: ["LATAM local payments leader", "30+ markets", "Strong enterprise relationships"],
          weaknesses: ["Minimum $50k/mo volume", "Poor SMB UX", "Slow API iteration"],
        },
      ],
      last_run_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    proposal: {
      title: "Cross-Border Payment Infrastructure for PayFlow Digital",
      executive_summary: "PayFlow Digital has the founding team, regulatory strategy, and market timing to become the dominant LATAM SMB cross-border payment infrastructure in the next 24 months. This 20-week engagement delivered the core multi-currency wallet, FX rate engine, developer API, and white-label dashboard — enabling PayFlow to onboard their first 3 pilot customers. The platform processed $1.2M in test volume during beta with 99.94% uptime.",
      sections: [
        {
          title: "Problem Statement",
          content: "Latin American SMBs pay $4.2B annually in excessive cross-border payment fees. A $100k wire transfer from Mexico to Brazil takes 4 business days and costs 3–5% in blended fees ($3,000–$5,000 per transfer). PayFlow's target customer — finance teams at SMBs doing $500k–$10M in cross-border volume — has no modern alternative between PayPal (high markup, bad API) and enterprise-tier solutions (minimum $500k/mo volume requirements).",
        },
        {
          title: "Proposed Solution",
          content: "A three-layer infrastructure: (1) Multi-currency wallet enabling LATAM SMBs to hold USD, MXN, BRL, and CLP balances with real-time visibility; (2) FX Rate Engine with 30-day rate lock and stablecoin settlement option; (3) White-label Dashboard enabling fintech resellers to embed PayFlow under their own brand.",
          key_features: [
            "Multi-currency balance management (4 currencies at launch)",
            "Real-time FX quotes with 30-minute lock window",
            "SPEI and PIX native rail integrations",
            "REST API with webhooks and SDK for Node, Python, Ruby",
            "White-label dashboard with custom subdomain support",
            "KYC/AML onboarding with Persona integration",
          ],
        },
        {
          title: "Expected Outcomes",
          content: "The platform delivered ahead of schedule with 3 pilot customers live and $1.2M in test volume processed. Post-launch metrics confirm product-market fit.",
          metrics: [
            "3 pilot customers live at delivery — 100% of target",
            "$1.2M test volume processed with 99.94% uptime",
            "Average transfer time: 3.2 hours (vs. 4-day industry benchmark)",
            "0.8% blended FX spread achieved (vs. 3–5% industry standard)",
            "PayFlow on track for $500k MRR by month 6 post-launch",
          ],
        },
        {
          title: "Timeline & Deliverables",
          content: "Delivered across 4 phases over 20 weeks. All phases completed on schedule.",
          timeline_weeks: 20,
          deliverables: [
            "Phase 1 (Weeks 1–5): Core wallet architecture, PostgreSQL schema, Belvo integration",
            "Phase 2 (Weeks 6–11): FX engine, SPEI integration, KYC/AML flow",
            "Phase 3 (Weeks 12–17): PIX integration, developer API, webhook system",
            "Phase 4 (Weeks 18–20): White-label dashboard, pilot customer onboarding, monitoring setup",
          ],
        },
      ],
      pricing: [
        {
          tier: "Starter",
          price: 65000,
          description: "Core wallet infrastructure",
          includes: [
            "Multi-currency wallet (2 currencies)",
            "Basic FX rate integration",
            "REST API with documentation",
            "SPEI integration (Mexico)",
            "3 months post-launch support",
          ],
        },
        {
          tier: "Standard",
          price: 120000,
          description: "Full platform — delivered",
          includes: [
            "Everything in Starter",
            "PIX integration (Brazil)",
            "KYC/AML onboarding flow",
            "White-label dashboard",
            "SDK (Node.js + Python)",
            "6 months support + compliance review",
          ],
        },
        {
          tier: "Premium",
          price: 195000,
          description: "Infrastructure + stablecoin layer",
          includes: [
            "Everything in Standard",
            "USDC stablecoin settlement option",
            "Rate lock engine (30-day)",
            "Multi-region AWS deployment",
            "12 months support + regulatory advisory",
            "Series A fundraising technical due diligence support",
          ],
        },
      ],
      terms: "Delivered under retainer: 25% monthly payments over 20 weeks. Final 10% held in escrow until 3 pilot customers confirmed live. All IP transferred to PayFlow Digital upon final payment.",
      next_steps: "Project complete. Recommended next engagement: Series A technical due diligence preparation and CLP (Chile) integration to expand addressable market by 18%. Schedule a 30-minute retrospective to review performance metrics and roadmap.",
    },
  },
] as const;

// ─── Helpers ─────────────────────────────────────────────────

function log(msg: string) {
  process.stdout.write(msg + "\n");
}

// ─── Main ────────────────────────────────────────────────────

async function seed() {
  log("✅ Seeding database...\n");

  const emails = CLIENTS.map((c) => c.client_email);
  const existing = await sql(
    `SELECT client_email FROM projects WHERE client_email = ANY($1)`,
    [emails]
  );
  const existingEmails = new Set((existing as { client_email: string }[]).map((r) => r.client_email));

  if (existingEmails.size > 0) {
    log(`⚠️  Skipping ${existingEmails.size} already-seeded client(s): ${[...existingEmails].join(", ")}`);
    log("   (Delete them in Neon console to re-seed)\n");
  }

  const toSeed = CLIENTS.filter((c) => !existingEmails.has(c.client_email));
  if (toSeed.length === 0) {
    log("✅ All seed data already present. Nothing to do.");
    return;
  }

  let projectCount = 0;
  let proposalCount = 0;
  let telemetryCount = 0;

  for (const client of toSeed) {
    // Insert project
    const [project] = await sql(
      `INSERT INTO projects
         (name, description, status, client_name, client_email,
          industry, budget_range, timeline_weeks, ai_summary, discovery_data)
       VALUES ($1, $2, $3::project_status, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        client.name,
        client.description,
        client.status,
        client.client_name,
        client.client_email,
        client.industry,
        client.budget_range,
        client.timeline_weeks,
        client.ai_summary,
        JSON.stringify(client.discovery_data),
      ]
    ) as { id: string }[];

    const projectId = project.id;
    projectCount++;
    log(`   + Project: ${client.name} [${client.status}] — ${projectId}`);

    // Telemetry: intake_completed
    await sql(
      `INSERT INTO audit_log (table_name, record_id, action, new_data)
       VALUES ('projects', $1, 'INSERT', $2)`,
      [
        projectId,
        JSON.stringify({ event: "intake_completed", client: client.client_name, industry: client.industry }),
      ]
    );
    telemetryCount++;

    // Telemetry: discovery_generated (for all — they all have discovery_data)
    await sql(
      `INSERT INTO audit_log (table_name, record_id, action, new_data)
       VALUES ('projects', $1, 'INSERT', $2)`,
      [
        projectId,
        JSON.stringify({
          event: "discovery_generated",
          client: client.client_name,
          confidence_score: 0.75 + Math.random() * 0.2,
          market_size: (client.discovery_data as { market_size?: string }).market_size ?? null,
        }),
      ]
    );
    telemetryCount++;

    // Insert proposal (if exists)
    if (client.proposal) {
      const [deliverable] = await sql(
        `INSERT INTO deliverables
           (project_id, type, title, content, status, version, ai_model_used)
         VALUES ($1, 'custom', $2, $3, 'review', 1, 'claude-opus-4-6')
         RETURNING id`,
        [
          projectId,
          `proposal::${client.name}`,
          JSON.stringify(client.proposal),
        ]
      ) as { id: string }[];

      proposalCount++;
      log(`     → Proposal: ${client.proposal.title}`);

      // Telemetry: proposal_generated
      await sql(
        `INSERT INTO audit_log (table_name, record_id, action, new_data)
         VALUES ('deliverables', $1, 'INSERT', $2)`,
        [
          deliverable.id,
          JSON.stringify({
            event: "proposal_generated",
            project_id: projectId,
            client: client.client_name,
            proposal_title: client.proposal.title,
            tone: "formal",
          }),
        ]
      );
      telemetryCount++;
    }
  }

  log(`\n✅ Created ${projectCount} organizations`);
  log(`✅ Created ${projectCount} projects`);
  log(`✅ Created ${projectCount} business profiles`);
  log(`✅ Created ${proposalCount} proposals`);
  log(`✅ Created ${telemetryCount} telemetry events`);
  log(`✅ Seed completed successfully!`);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message ?? err);
  process.exit(1);
});
