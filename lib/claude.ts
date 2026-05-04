// ============================================================
// AI Product Studio — Claude AI Integration
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import type {
  ClaudeMessage,
  ClaudeRequestOptions,
  ClaudeResponse,
  IntakeFormData,
  DiscoveryData,
  Project,
} from "./types";

// ─── Client ──────────────────────────────────────────────────

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

export const DEFAULT_MODEL = "claude-opus-4-6";
export const FAST_MODEL = "claude-sonnet-4-6";

// ─── Core ────────────────────────────────────────────────────

export async function claudeChat(
  messages: ClaudeMessage[],
  opts: ClaudeRequestOptions = {}
): Promise<ClaudeResponse> {
  const client = getClient();
  const {
    model = DEFAULT_MODEL,
    max_tokens = 4096,
    system,
  } = opts;

  try {
    const response = await client.messages.create({
      model,
      max_tokens,
      system,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    return {
      content,
      model: response.model,
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      stop_reason: response.stop_reason ?? "end_turn",
    };
  } catch (error) {
    console.error("[Claude] API error:", error);
    throw new ClaudeError(
      `Claude API call failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function claudeHealthCheck(): Promise<{
  ok: boolean;
  latency_ms: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await claudeChat(
      [{ role: "user", content: "ping" }],
      { model: FAST_MODEL, max_tokens: 10 }
    );
    return { ok: true, latency_ms: Date.now() - start };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Claude] healthCheck error:', msg);
    return { ok: false, latency_ms: Date.now() - start, error: msg };
  }
}

// ─── Intake Analysis ─────────────────────────────────────────

export async function analyzeIntakeForm(
  intake: IntakeFormData
): Promise<string> {
  const system = `You are an expert AI product strategist and business analyst.
Your job is to analyze new project intake forms and produce a concise, insightful
executive summary for the internal team. Be direct, specific, and highlight risks.`;

  const prompt = `Analyze this new project intake and provide an executive summary:

CLIENT: ${intake.client_name} (${intake.company_name ?? "Unknown company"})
PROJECT: ${intake.project_name}
INDUSTRY: ${intake.industry}
PROBLEM: ${intake.problem_statement}
TARGET USERS: ${intake.target_users}
PLATFORM: ${intake.platform}
KEY FEATURES: ${intake.key_features.join(", ")}
BUDGET: ${intake.budget_range}
TIMELINE: ${intake.timeline_weeks} weeks
COMPETITORS: ${intake.competitors?.join(", ") ?? "Not specified"}
NOTES: ${intake.additional_notes ?? "None"}

Provide:
1. Project Viability Score (1-10) with reasoning
2. Key Opportunities (2-3 bullet points)
3. Main Risks (2-3 bullet points)
4. Recommended Next Steps
5. Estimated complexity: Simple / Medium / Complex / Enterprise

Keep it concise and actionable.`;

  const response = await claudeChat(
    [{ role: "user", content: prompt }],
    { system, model: DEFAULT_MODEL, max_tokens: 1000 }
  );

  return response.content;
}

// ─── Discovery ───────────────────────────────────────────────

export async function runDiscoveryAnalysis(
  project: Project
): Promise<DiscoveryData> {
  const system = `You are an expert market researcher and product strategist.
Analyze the provided project information and generate comprehensive discovery data.
Always respond with valid JSON matching the requested schema exactly.`;

  const prompt = `Run a discovery analysis for this AI product project and return a JSON object.

PROJECT: ${project.name}
DESCRIPTION: ${project.description}
INDUSTRY: ${project.industry ?? "Not specified"}
CLIENT: ${project.client_name}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "market_size": "estimated market size and growth",
  "target_audience": "detailed target audience description",
  "unique_value_proposition": "suggested UVP for this product",
  "competitors": [
    {
      "name": "competitor name",
      "url": "url or null",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "pricing": "pricing model or null"
    }
  ],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "risks": ["risk1", "risk2", "risk3"],
  "recommended_features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
  "tech_stack_suggestions": ["tech1", "tech2", "tech3"],
  "monetization_models": ["model1", "model2"],
  "last_run_at": "${new Date().toISOString()}"
}`;

  const response = await claudeChat(
    [{ role: "user", content: prompt }],
    { system, model: DEFAULT_MODEL, max_tokens: 2000 }
  );

  try {
    const cleaned = response.content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as DiscoveryData;
  } catch {
    throw new ClaudeError("Failed to parse discovery analysis JSON from Claude response");
  }
}

// ─── PRD Generation ──────────────────────────────────────────

export async function generatePRD(project: Project): Promise<string> {
  const system = `You are a world-class product manager writing production-ready PRDs.
Write comprehensive, developer-ready Product Requirements Documents.`;

  const discovery = project.discovery_data;

  const prompt = `Write a complete PRD (Product Requirements Document) for:

PROJECT: ${project.name}
CLIENT: ${project.client_name}
DESCRIPTION: ${project.description}
INDUSTRY: ${project.industry ?? "Not specified"}
${discovery ? `
TARGET AUDIENCE: ${discovery.target_audience ?? ""}
UVP: ${discovery.unique_value_proposition ?? ""}
KEY FEATURES: ${discovery.recommended_features?.join(", ") ?? ""}
TECH STACK: ${discovery.tech_stack_suggestions?.join(", ") ?? ""}
` : ""}

Include:
1. Executive Summary
2. Problem Statement
3. Goals & Success Metrics (KPIs)
4. User Personas (2-3)
5. User Stories & Acceptance Criteria
6. Functional Requirements
7. Non-Functional Requirements (performance, security, scalability)
8. Technical Architecture Overview
9. API Endpoints Overview
10. Data Model Overview
11. Integration Requirements
12. Timeline & Milestones
13. Risks & Mitigations
14. Out of Scope

Be thorough and production-ready.`;

  const response = await claudeChat(
    [{ role: "user", content: prompt }],
    { system, model: DEFAULT_MODEL, max_tokens: 6000 }
  );

  return response.content;
}

// ─── Technical Spec Generation ───────────────────────────────

export async function generateTechnicalSpec(project: Project): Promise<string> {
  const system = `You are a senior software architect writing detailed technical specifications.`;

  const discovery = project.discovery_data;

  const prompt = `Write a detailed Technical Specification for:

PROJECT: ${project.name}
DESCRIPTION: ${project.description}
${discovery?.tech_stack_suggestions ? `SUGGESTED TECH: ${discovery.tech_stack_suggestions.join(", ")}` : ""}

Include:
1. System Architecture (with component diagram in ASCII)
2. Tech Stack with justifications
3. Database Schema
4. API Design (RESTful endpoints with request/response examples)
5. Authentication & Authorization
6. Caching Strategy
7. Error Handling Strategy
8. Testing Strategy (unit, integration, e2e)
9. CI/CD Pipeline
10. Infrastructure & Deployment
11. Security Considerations
12. Monitoring & Observability
13. Performance Benchmarks
14. Scalability Plan

Be specific with technologies, versions, and implementation details.`;

  const response = await claudeChat(
    [{ role: "user", content: prompt }],
    { system, model: DEFAULT_MODEL, max_tokens: 6000 }
  );

  return response.content;
}

// ─── Custom Prompt ───────────────────────────────────────────

export async function generateCustomDeliverable(
  prompt: string,
  context: string
): Promise<ClaudeResponse> {
  const system = `You are an expert AI product consultant.
Context about the project: ${context}`;

  return claudeChat(
    [{ role: "user", content: prompt }],
    { system, model: DEFAULT_MODEL, max_tokens: 4096 }
  );
}

// ─