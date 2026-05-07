# AI Product Studio — API Reference

Base URL: `https://ai-product-studio.vercel.app` (or `http://localhost:3000` locally)

All endpoints return JSON with the following envelope:

```json
{
  "success": true | false,
  "data": { ... },
  "error": "string (on failure)",
  "message": "string (optional)",
  "meta": {
    "request_id": "uuid",
    "duration_ms": 123,
    "total": 10,
    "page": 1,
    "per_page": 20
  }
}
```

---

## GET /api/health

System health check. Returns status of all services.

**Response 200**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "1.0.0",
    "timestamp": "2025-01-15T12:00:00.000Z",
    "services": {
      "database": { "status": "ok", "latency_ms": 12 },
      "claude_api": { "status": "ok", "latency_ms": 340 },
      "slack":      { "status": "ok", "latency_ms": 87 }
    },
    "uptime_seconds": 3600
  }
}
```

**Response 503** — When database or Claude API is down.

---

## POST /api/intake

Submit a new client project intake. Creates a project and generates an AI executive summary.

**Request Body**
```json
{
  "client_name":          "string (required)",
  "client_email":         "string (required, valid email)",
  "company_name":         "string (optional)",
  "project_name":         "string (required)",
  "project_description":  "string (required)",
  "industry":             "string (required)",
  "problem_statement":    "string (required)",
  "target_users":         "string (required)",
  "platform":             "web | mobile | both | api | other (required)",
  "key_features":         ["string"] "(required, min 1 item)",
  "integrations":         ["string"] "(optional)",
  "budget_range":         "< $10k | $10k - $25k | $25k - $50k | $50k - $100k | $100k - $250k | > $250k | TBD",
  "timeline_weeks":       "number (required, > 0)",
  "competitors":          ["string"] "(optional)",
  "additional_notes":     "string (optional)"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "uuid",
      "name": "AI Dashboard",
      "status": "intake",
      "client_name": "Acme Corp",
      "client_email": "cto@acme.com",
      "created_at": "2025-01-15T12:00:00.000Z"
    },
    "ai_summary": "Viability Score: 8/10\n\nKey Opportunities:\n..."
  },
  "message": "Intake received successfully."
}
```

**Response 422** — Validation errors.
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "client_email is invalid, key_features must be a non-empty array"
}
```

---

## GET /api/projects

List all projects with optional filtering and pagination.

**Query Parameters**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `per_page` | number | 20 | Results per page (max 100) |
| `status` | string | — | Filter by status: `intake`, `discovery`, `analysis`, `delivery`, `completed`, `archived` |
| `sort_by` | string | `created_at` | Sort column |
| `sort_order` | string | `desc` | `asc` or `desc` |

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "AI Dashboard",
      "status": "discovery",
      "client_name": "Acme Corp",
      "client_email": "cto@acme.com",
      "industry": "E-commerce",
      "budget_range": "$50k - $100k",
      "timeline_weeks": 16,
      "created_at": "2025-01-15T12:00:00.000Z",
      "updated_at": "2025-01-15T14:00:00.000Z"
    }
  ],
  "meta": { "total": 1, "page": 1, "per_page": 20, "has_more": false }
}
```

---

## POST /api/projects

Create a project directly (without full intake form).

**Request Body**
```json
{
  "name":           "string (required)",
  "description":    "string (required)",
  "client_name":    "string (required)",
  "client_email":   "string (required)",
  "industry":       "string (optional)",
  "budget_range":   "string (optional)",
  "timeline_weeks": "number (optional)"
}
```

**Response 201** — Same shape as single project response.

---

## GET /api/projects/:id

Get a single project by ID, including discovery data.

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "AI Dashboard",
    "status": "discovery",
    "discovery_data": {
      "market_size": "$4.5B global market, growing 23% YoY",
      "competitors": [...],
      "opportunities": [...],
      "risks": [...],
      "recommended_features": [...],
      "last_run_at": "2025-01-15T12:00:00.000Z"
    }
  }
}
```

**Response 404** — Project not found.

---

## PATCH /api/projects/:id

Update a project's fields or status.

**Request Body** — All fields optional
```json
{
  "name":           "string",
  "description":    "string",
  "status":         "intake | discovery | analysis | delivery | completed | archived",
  "client_name":    "string",
  "client_email":   "string",
  "industry":       "string",
  "budget_range":   "string",
  "timeline_weeks": "number",
  "ai_summary":     "string"
}
```

**Response 200** — Returns updated project.

---

## DELETE /api/projects/:id

Soft-delete (archive) a project.

**Response 200**
```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Project archived successfully"
}
```

---

## GET /api/discover?project_id=:id

Get existing discovery data for a project.

**Response 200** — Returns `DiscoveryData` or `null` if not yet run.

---

## POST /api/discover

Run AI discovery analysis for a project.

**Request Body**
```json
{
  "project_id": "uuid (required)",
  "force":      "boolean (optional, default false — re-run even if recent data exists)"
}
```

**Response 200** (cached)
```json
{
  "success": true,
  "data": {
    "project_id": "uuid",
    "discovery": {
      "market_size": "...",
      "target_audience": "...",
      "unique_value_proposition": "...",
      "competitors": [...],
      "opportunities": [...],
      "risks": [...],
      "recommended_features": [...],
      "tech_stack_suggestions": [...],
      "monetization_models": [...],
      "last_run_at": "2025-01-15T12:00:00.000Z"
    }
  },
  "message": "Discovery data is fresh (2h ago). Use force=true to re-run."
}
```

**Notes:**
- Max duration: 60 seconds
- Cached for 24 hours unless `force: true`
- Sends Slack notification on completion

---

## GET /api/deliverables?project_id=:id

List all deliverables for a project.

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "type": "prd",
      "title": "Product Requirements Document",
      "status": "review",
      "version": 1,
      "ai_model_used": "claude-opus-4-6",
      "tokens_used": 4200,
      "created_at": "2025-01-15T12:00:00.000Z"
    }
  ]
}
```

---

## POST /api/deliverables

Generate a new AI deliverable for a project.

**Request Body**
```json
{
  "project_id":    "uuid (required)",
  "type":          "prd | technical_spec | market_analysis | wireframe_brief | pitch_deck | roadmap | custom (required)",
  "title":         "string (required)",
  "custom_prompt": "string (required only when type = 'custom')"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "prd",
    "title": "Product Requirements Document",
    "content": "# Executive Summary\n\n...",
    "status": "review",
    "ai_model_used": "claude-opus-4-6",
    "tokens_used": 5800
  },
  "message": "prd generated successfully and ready for review"
}
```

**Supported Types:**
| Type | Description |
|------|-------------|
| `prd` | Full Product Requirements Document |
| `technical_spec` | Detailed technical specification |
| `market_analysis` | Market research report |
| `wireframe_brief` | UX/wireframe design brief |
| `pitch_deck` | Investor pitch deck outline |
| `roadmap` | Product roadmap |
| `custom` | Any document via custom prompt |

---

## GET /api/cron/discovery

Triggered automatically by Vercel Cron every 6 hours. Processes all projects needing discovery.

**Headers (required)**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "job": "cron/discovery",
    "started_at": "2025-01-15T12:00:00.000Z",
    "completed_at": "2025-01-15T12:01:30.000Z",
    "duration_ms": 90000,
    "processed": 3,
    "errors": 0,
    "details": {
      "uuid-1": "✅ Project A — discovery complete",
      "uuid-2": "✅ Project B — discovery complete"
    }
  }
}
```

---

## Error 