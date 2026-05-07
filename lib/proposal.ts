// ============================================================
// AI Product Studio — Proposal Generation (Claude Opus)
// ============================================================

import { claudeChat, DEFAULT_MODEL } from "./claude";
import type { Project } from "./types";

// ─── Types ───────────────────────────────────────────────────

export type ProposalTone = "formal" | "casual" | "technical";

export interface ProposalSection {
  title: string;
  content: string;
  key_features?: string[];
  metrics?: string[];
  deliverables?: string[];
  timeline_weeks?: number;
}

export interface ProposalPricing {
  tier: string;
  price: number;
  description: string;
  includes: string[];
}

export interface ProposalContent {
  title: string;
  executive_summary: string;
  sections: ProposalSection[];
  pricing: ProposalPricing[];
  terms: string;
  next_steps: string;
}

// ─── Generator ───────────────────────────────────────────────

export async function generateProposal(
  project: Project,
  tone: ProposalTone = "formal"
): Promise<ProposalContent> {
  const discovery = project.discovery_data;

  const toneGuide: Record<ProposalTone, string> = {
    formal: "professional, formal business language suitable for enterprise clients",
    casual: "friendly, approachable language that feels personal and direct",
    technical: "technical, precise language with emphasis on implementation details and architecture",
  };

  const system = `You are an elite business consultant and proposal writer with 15+ years experience closing enterprise deals.
You write compelling, high-converting proposals that clearly communicate value and drive action.
Your tone is ${toneGuide[tone]}.
Always respond with valid JSON matching the requested schema exactly. No markdown, no explanation outside the JSON.`;

  const budgetHint = project.budget_range ?? "TBD";
  const timelineHint = project.timeline_weeks ? `${project.timeline_weeks} weeks` : "12 weeks";

  const discoverySection = discovery
    ? `DISCOVERY INSIGHTS (use these to make the proposal highly specific):
- Target Audience: ${discovery.target_audience ?? "Not specified"}
- Unique Value Proposition: ${discovery.unique_value_proposition ?? "Not specified"}
- Key Opportunities: ${discovery.opportunities?.slice(0, 3).join("; ") ?? "None"}
- Main Risks to Address: ${discovery.risks?.slice(0, 3).join("; ") ?? "None"}
- Recommended Features: ${discovery.recommended_features?.slice(0, 5).join(", ") ?? "None"}
- Competitors to Differentiate From: ${discovery.competitors?.slice(0, 3).map((c) => c.name).join(", ") ?? "None"}
- Market Size Context: ${discovery.market_size ?? "Not available"}`
    : "";

  const prompt = `Generate a professional business proposal for the following project.

PROJECT DETAILS:
- Project Name: ${project.name}
- Client Company: ${project.client_name}
- Industry: ${project.industry ?? "Technology"}
- Description: ${project.description}
- Budget Range: ${budgetHint}
- Timeline: ${timelineHint}

${discoverySection}

Return ONLY a valid JSON object (no markdown fences, no commentary) with this exact structure:
{
  "title": "Proposal for ${project.client_name}",
  "executive_summary": "Two to three paragraphs that open with the core problem, present your solution with confidence, and close with a compelling statement about expected transformation. Be specific to this client.",
  "sections": [
    {
      "title": "Problem Statement",
      "content": "3-4 sentences describing the specific pain this client faces and its business cost. Be concrete."
    },
    {
      "title": "Proposed Solution",
      "content": "3-4 sentences describing the solution approach and why it fits this client uniquely.",
      "key_features": ["Feature 1 with brief value statement", "Feature 2 with brief value statement", "Feature 3 with brief value statement", "Feature 4 with brief value statement", "Feature 5 with brief value statement"]
    },
    {
      "title": "Expected Outcomes",
      "content": "What the client's world looks like after successful implementation.",
      "metrics": ["Outcome metric 1 with specific target (e.g. 40% reduction in X)", "Outcome metric 2 with specific target", "Outcome metric 3 with specific target"]
    },
    {
      "title": "Timeline & Deliverables",
      "content": "Brief overview of how the project unfolds in phases.",
      "timeline_weeks": 12,
      "deliverables": ["Phase 1 deliverable", "Phase 2 deliverable", "Phase 3 deliverable", "Final deliverable"]
    }
  ],
  "pricing": [
    {
      "tier": "Starter",
      "price": 5000,
      "description": "Core functionality to validate the concept and get early wins.",
      "includes": ["Item 1", "Item 2", "Item 3"]
    },
    {
      "tier": "Standard",
      "price": 15000,
      "description": "Full-featured solution covering the primary use cases.",
      "includes": ["Everything in Starter", "Item 4", "Item 5", "Item 6"]
    },
    {
      "tier": "Premium",
      "price": 35000,
      "description": "Enterprise-grade implementation with integrations and ongoing support.",
      "includes": ["Everything in Standard", "Item 7", "Item 8", "Item 9", "3 months support"]
    }
  ],
  "terms": "Specific payment terms (e.g. 50% upfront, 50% on delivery), warranty period, revision policy, and IP ownership. Make these clear and fair.",
  "next_steps": "3-4 concrete, specific next steps with a sense of urgency. Include a suggested kickoff timeline."
}

IMPORTANT RULES:
1. Pricing tiers MUST be realistic for the ${budgetHint} budget range and ${project.industry ?? "technology"} industry
2. All content must be specific to ${project.client_name}, never generic placeholder text
3. The proposal should feel like it was written by someone who deeply understands this client's business
4. timeline_weeks must be a number (integer), price must be a number (no $ sign)`;

  const response = await claudeChat(
    [{ role: "user", content: prompt }],
    { system, model: DEFAULT_MODEL, max_tokens: 4096 }
  );

  const cleaned = response.content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as ProposalContent;
  } catch {
    throw new Error(
      "Failed to parse proposal JSON from Claude. Raw response: " +
        response.content.slice(0, 200)
    );
  }
}
