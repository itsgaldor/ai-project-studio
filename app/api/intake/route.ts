// ============================================================
// POST /api/intake — Project Intake Form Submission
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createProject, updateProject } from "@/lib/db";
import { analyzeIntakeForm } from "@/lib/claude";
import { notifyIntakeReceived } from "@/lib/slack";
import type { IntakeFormData, ApiResponse, Project } from "@/lib/types";

export const dynamic = "force-dynamic";

// ─── POST /api/intake ─────────────────────────────────────────

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<{ project: Project; ai_summary: string }>>> {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  try {
    // Parse body
    let body: IntakeFormData;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate required fields
    const validation = validateIntakeForm(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: validation.errors.join(", "),
        },
        { status: 422 }
      );
    }

    // Create project in DB
    const project = await createProject({
      name: body.project_name,
      description: body.project_description,
      client_name: body.client_name,
      client_email: body.client_email,
      industry: body.industry,
      budget_range: body.budget_range,
      timeline_weeks: body.timeline_weeks,
    });

    // Generate AI summary (non-blocking on error)
    let aiSummary = "";
    try {
      aiSummary = await analyzeIntakeForm(body);
      await updateProject(project.id, { ai_summary: aiSummary });
    } catch (err) {
      console.error("[Intake] AI analysis failed:", err);
      aiSummary = "AI analysis pending — will be available shortly.";
    }

    // Notify Slack (non-blocking)
    notifyIntakeReceived(project).catch((err) =>
      console.error("[Intake] Slack notification failed:", err)
    );

    return NextResponse.json(
      {
        success: true,
        data: { project, ai_summary: aiSummary },
        message: "Intake received successfully. Our team will be in touch within 24 hours.",
        meta: {
          request_id: requestId,
          duration_ms: Date.now() - start,
        },
      },
      {
        status: 201,
        headers: {
          "X-Request-Id": requestId,
          "X-Project-Id": project.id,
        },
      }
    );
  } catch (error) {
    console.error("[Intake] Unhandled error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        meta: { request_id: requestId },
      },
      { status: 500 }
    );
  }
}

// ─── Validation ──────────────────────────────────────────────

function validateIntakeForm(data: Partial<IntakeFormData>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.client_name?.trim()) errors.push("client_name is required");
  if (!data.client_email?.trim()) errors.push("client_email is required");
  if (!isValidEmail(data.client_email ?? "")) errors.push("client_email is invalid");
  if (!data.project_name?.trim()) errors.push("project_name is required");
  if (!data.project_description?.trim()) errors.push("project_description is required");
  if (!data.industry?.trim()) errors.push("industry is required");
  if (!data.problem_statement?.trim()) errors.push("problem_statement is required");
  if (!data.target_users?.trim()) errors.push("target_users is required");
  if (!data.platform) errors.push("platform is required");
  if (!data.budget_range) errors.push("budget_range is required");
  if (!data.timeline_weeks || data.timeline_weeks < 1) {
    errors.push("timeline_weeks must be a positive number");
  }
  if (!Array.isArray(data.key_features) || data.key_features.length === 0) {
    errors.push("key_features must be a non-empty array");
  }

  return { valid: errors.l