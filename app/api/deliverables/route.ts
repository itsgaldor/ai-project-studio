// ============================================================
// GET  /api/deliverables?project_id=xxx  — List deliverables
// POST /api/deliverables                 — Generate deliverable
// GET  /api/deliverables/[id]            — Get single deliverable
// PATCH /api/deliverables/[id]           — Update status
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  getDeliverables,
  getDeliverableById,
  createDeliverable,
  updateDeliverable,
  getProjectById,
} from "@/lib/db";
import {
  generatePRD,
  generateTechnicalSpec,
  generateCustomDeliverable,
  DEFAULT_MODEL,
} from "@/lib/claude";
import { notifyDeliverableGenerated } from "@/lib/slack";
import type {
  ApiResponse,
  Deliverable,
  DeliverableCreateInput,
  DeliverableType,
} from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ─── GET /api/deliverables ────────────────────────────────────

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Deliverable[]>>> {
  const requestId = crypto.randomUUID();
  const projectId = req.nextUrl.searchParams.get("project_id");

  if (!projectId) {
    return NextResponse.json(
      { success: false, error: "project_id query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const deliverables = await getDeliverables(projectId);

    return NextResponse.json({
      success: true,
      data: deliverables,
      meta: {
        request_id: requestId,
        total: deliverables.length,
      },
    });
  } catch (error) {
    console.error("[Deliverables GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deliverables", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}

// ─── POST /api/deliverables ───────────────────────────────────

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Deliverable>>> {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  try {
    let body: {
      project_id?: string;
      type?: DeliverableType;
      title?: string;
      custom_prompt?: string;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { project_id, type, title, custom_prompt } = body;

    // Validate
    if (!project_id) {
      return NextResponse.json(
        { success: false, error: "project_id is required" },
        { status: 400 }
      );
    }
    if (!type) {
      return NextResponse.json(
        { success: false, error: "type is required" },
        { status: 400 }
      );
    }
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "title is required" },
        { status: 400 }
      );
    }

    const project = await getProjectById(project_id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Create deliverable record (status: pending → generating)
    const deliverable = await createDeliverable({
      project_id,
      type,
      title,
    } as DeliverableCreateInput);

    await updateDeliverable(deliverable.id, { status: "generating" });

    // Generate content with Claude
    let content: string;
    let tokensUsed = 0;

    try {
      if (type === "prd") {
        content = await generatePRD(project);
      } else if (type === "technical_spec") {
        content = await generateTechnicalSpec(project);
      } else if (type === "custom" && custom_prompt) {
        const context = `Project: ${project.name}. ${project.description}`;
        const response = await generateCustomDeliverable(custom_prompt, context);
        content = response.content;
        tokensUsed = response.input_tokens + response.output_tokens;
      } else {
        content = await generateGenericDeliverable(type, project.name, project.description);
      }

      await updateDeliverable(deliverable.id, {
        content,
        status: "review",
        ai_model_used: DEFAULT_MODEL,
        tokens_used: tokensUsed || undefined,
      });

      // Notify Slack
      notifyDeliverableGenerated(project, type).catch(console.error);

    } catch (genError) {
      console.error("[Deliverables] Generation error:", genError);
      await updateDeliverable(deliverable.id, { status: "pending" });
      return NextResponse.json(
        {
          success: false,
          error: "Deliverable generation failed",
          message: genError instanceof Error ? genError.message : "Unknown error",
          meta: { request_id: requestId },
        },
        { status: 502 }
      );
    }

    const updated = await getDeliverableById(deliverable.id);

    return NextResponse.json(
      {
        success: true,
        data: updated!,
        message: `${type} generated successfully and ready for review`,
        meta: {
          request_id: requestId,
          duration_ms: Date.now() - start,
        },
      },
      {
        status: 201,
        headers: { "X-Deliverable-Id": deliverable.id },
      }
    );
  } catch (error) {
    console.error("[Deliverables POST] Unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}

// ─── Generic Generator Fallback ──────────────────────────────

async function generateGenericDeliverable(
  type: DeliverableType,
  projectName: string,
  description: string
): Promise<string> {
  const { claudeChat, DEFAULT_MODEL } = await import("@/lib/claude");

  const typeLabels: Record<DeliverableType, string> = {
    prd: "Product Requirements Document",
    technical_spec: "Technical Specification",
    market_analysis: "Market Analysis Report",
    wireframe_brief: "Wireframe & UX Brief",
    pitch_deck: "Pitch Deck Outline",
    roadmap: "Product Roadmap",
    custom: "Custom Document",
  };

  const label = typeLabels[type] ?? type;

  const response = await claudeChat(
    [
      {
        role: "user",
        content: `Write a comprehensive ${label} for the following project:

PROJECT NAME: ${projectName}
DESCRIPTION: ${description}

Be thorough, professional, and production-ready.`,
      },
    ],
    { model: DEFAULT_MODEL, max_tokens: 4096 }
  );

  return response.content;
}
