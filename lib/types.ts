// ============================================================
// AI Product Studio — Core TypeScript Interfaces
// ============================================================

// ─── Project ─────────────────────────────────────────────────

export type ProjectStatus =
  | "intake"
  | "discovery"
  | "analysis"
  | "delivery"
  | "completed"
  | "archived";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  client_name: string;
  client_email: string;
  industry?: string;
  budget_range?: string;
  timeline_weeks?: number;
  ai_summary?: string;
  discovery_data?: DiscoveryData;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreateInput {
  name: string;
  description: string;
  client_name: string;
  client_email: string;
  industry?: string;
  budget_range?: string;
  timeline_weeks?: number;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  client_name?: string;
  client_email?: string;
  industry?: string;
  budget_range?: string;
  timeline_weeks?: number;
  ai_summary?: string;
  discovery_data?: DiscoveryData;
}

// ─── Discovery ───────────────────────────────────────────────

export interface DiscoveryData {
  market_size?: string;
  competitors?: Competitor[];
  opportunities?: string[];
  risks?: string[];
  recommended_features?: string[];
  tech_stack_suggestions?: string[];
  monetization_models?: string[];
  target_audience?: string;
  unique_value_proposition?: string;
  raw_sources?: DiscoverySource[];
  last_run_at?: string;
}

export interface Competitor {
  name: string;
  url?: string;
  strengths: string[];
  weaknesses: string[];
  pricing?: string;
}

export interface DiscoverySource {
  url: string;
  title: string;
  summary: string;
  relevance_score: number;
}

// ─── Deliverable ─────────────────────────────────────────────

export type DeliverableType =
  | "prd"
  | "technical_spec"
  | "market_analysis"
  | "wireframe_brief"
  | "pitch_deck"
  | "roadmap"
  | "custom";

export type DeliverableStatus =
  | "pending"
  | "generating"
  | "review"
  | "approved"
  | "delivered";

export interface Deliverable {
  id: string;
  project_id: string;
  type: DeliverableType;
  title: string;
  content?: string;
  status: DeliverableStatus;
  version: number;
  file_url?: string;
  ai_model_used?: string;
  tokens_used?: number;
  created_at: string;
  updated_at: string;
}

export interface DeliverableCreateInput {
  project_id: string;
  type: DeliverableType;
  title: string;
  content?: string;
}

// ─── Intake Form ─────────────────────────────────────────────

export interface IntakeFormData {
  // Client Info
  client_name: string;
  client_email: string;
  company_name?: string;
  phone?: string;

  // Project Info
  project_name: string;
  project_description: string;
  industry: string;
  problem_statement: string;
  target_users: string;

  // Scope
  key_features: string[];
  integrations?: string[];
  platform: "web" | "mobile" | "both" | "api" | "other";

  // Budget & Timeline
  budget_range: BudgetRange;
  timeline_weeks: number;
  launch_date?: string;

  // Additional
  competitors?: string[];
  inspiration_urls?: string[];
  additional_notes?: string;

  // Metadata
  source?: string;
  utm_campaign?: string;
}

export type BudgetRange =
  | "< $10k"
  | "$10k - $25k"
  | "$25k - $50k"
  | "$50k - $100k"
  | "$100k - $250k"
  | "> $250k"
  | "TBD";

// ─── API Responses ───────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  total?: number;
  page?: number;
  per_page?: number;
  has_more?: boolean;
  request_id?: string;
  duration_ms?: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// ─── Health ──────────────────────────────────────────────────

export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  version: string;
  timestamp: string;
  services: {
    database: ServiceHealth;
    claude_api: ServiceHealth;
    slack: ServiceHealth;
  };
  uptime_seconds: number;
}

export interface ServiceHealth {
  status: "ok" | "degraded" | "down";
  latency_ms?: number;
  error?: string;
}

// ─── Slack ───────────────────────────────────────────────────

export type SlackEventType =
  | "project.created"
  | "project.updated"
  | "project.completed"
  | "intake.received"
  | "discovery.started"
  | "discovery.completed"
  | "deliverable.generated"
  | "deliverable.approved"
  | "error.critical";

export interface SlackNotificationPayload {
  event: SlackEventType;
  project?: Pick<Project, "id" | "name" | "client_name" | "status">;
  message?: string;
  details?: Record<string, string | number | boolean>;
  severity?: "info" | "warning" | "error";
}

// ─── Claude ──────────────────────────────────────────────────

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeRequestOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  system?: string;
}

export interface ClaudeResponse {
  content: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  stop_reason: string;
}

// ─── Cron ────────────────────────────────────────────────────

export interface CronJobResult {
  job: string;
  started_at: string;
  completed_at: string;
  duration_ms: number;
  processed: number;
  errors: number;
  details?: unknown;
}

// ─── Database 