// ============================================================
// POST /api/proposals  — generate proposal for a project
// GET  /api/proposals?project_id=  — list proposals
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  getProjectById,
  createDeliverable,
  getDeliverables,
  updateDeliverable,
} from "@/lib/db";
import { generateProposal, type ProposalTone } from "@/lib/proposal";
import type { ApiResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

// In-memory rate limit (resets on cold start — good enough for now)
const rateLimitMap = new Map<string, number>();

function isRateLimited(projectId: string): boolean {
  const last = rateLimitMap.get(projectId);
  if (!last) return false;
  return Date.now() - last < 60_000;
}

// ─── GET ─────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  const projectId = req.nextUrl.searchParams.get("project_id");

  if (!projectId) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "project_id query param is required" },
      { status: 400 }
    );
  }

  try {
    const all = await getDeliverables(projectId);
    const proposals = all.filter(
      (d) => d.type === "custom" && d.title.startsWith("proposal::")
    );
    return NextResponse.json<ApiResponse>({ success: true, data: proposals });
  } catch (err) {
    console.error("[Proposals GET] Error:", err);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch proposals",
      },
      { status: 500 }
    );
  }
}

// ─── POST ────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { project_id, tone = "formal" } = body as {
      project_id: string;
      tone?: ProposalTone;
    };

    if (!project_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "project_id is required" },
        { status: 400 }
      );
    }

    const validTones: ProposalTone[] = ["formal", "casual", "technical"];
    const safeTone = validTones.includes(tone) ? tone : "formal";

    if (isRateLimited(project_id)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Please wait 1 minute between proposal generations" },
        { status: 429 }
      );
    }

    const project = await getProjectById(project_id);
    if (!project) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Mark rate limit before the (slow) Claude call
    rateLimitMap.set(project_id, Date.now());

    const proposalContent = await generateProposal(project, safeTone);

    const deliverable = await createDeliverable({
      project_id,
      type: "custom",
      title: `proposal::${project.name}`,
      content: JSON.stringify(proposalContent),
    });

    await updateDeliverable(deliverable.id, {
      status: "review",
      ai_model_used: "claude-opus-4-6",
    });

    console.log("[Telemetry] proposal_generated", {
      project_id,
      proposal_id: deliverable.id,
      client: project.client_name,
      tone: safeTone,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        proposal_id: deliverable.id,
        status: "draft",
        content: proposalContent,
        created_at: deliverable.created_at,
      },
      message: "Proposal generated successfully",
    });
  } catch (err) {
    console.error("[Proposals POST] Error:", err);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to generate proposal",
      },
      { status: 500 }
    );
  }
}
