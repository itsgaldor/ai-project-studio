// ============================================================
// POST /api/discover — Trigger AI Discovery for a Project
// GET  /api/discover?project_id=xxx — Get Discovery Results
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProject } from "@/lib/db";
import { runDiscoveryAnalysis } from "@/lib/claude";
import { notifyDiscoveryCompleted, sendSlackNotification } from "@/lib/slack";
import type { ApiResponse, DiscoveryData } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Pro: up to 300s

// ─── GET /api/discover ────────────────────────────────────────

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<DiscoveryData | null>>> {
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

    return NextResponse.json({
      success: true,
      data: project.discovery_data ?? null,
      message: project.discovery_data
        ? "Discovery data retrieved"
        : "No discovery data yet — run POST /api/discover to trigger analysis",
      meta: { request_id: requestId },
    });
  } catch (error) {
    console.error("[Discover GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}

// ─── POST /api/discover ───────────────────────────────────────

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<{ project_id: string; discovery: DiscoveryData }>>> {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  try {
    const body = await req.json().catch(() => ({}));
    const { project_id, force = false } = body as {
      project_id?: string;
      force?: boolean;
    };

    if (!project_id) {
      return NextResponse.json(
        { success: false, error: "project_id is required" },
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

    // Check if discovery already ran recently (unless forced)
    if (!force && project.discovery_data?.last_run_at) {
      const lastRun = new Date(project.discovery_data.last_run_at);
      const hoursSince = (Date.now() - lastRun.getTime()) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        return NextResponse.json({
          success: true,
          data: { project_id, discovery: project.discovery_data },
          message: `Discovery data is fresh (last run ${Math.round(hoursSince)}h ago). Use force=true to re-run.`,
          meta: { request_id: requestId },
        });
      }
    }

    // Notify discovery started
    sendSlackNotification({
      event: "discovery.started",
      project,
      message: `Discovery analysis started for *${project.name}*`,
    }).catch(console.error);

    // Run AI discovery
    const discovery = await runDiscoveryAnalysis(project);

    // Save to DB and update status
    await updateProject(project_id, {
      discovery_data: discovery,
      status: project.status === "intake" ? "discovery" : project.status,
    });

    // Notify completion
    notifyDiscoveryCompleted(project).catch(console.error);

    return NextResponse.json({
      success: true,
      data: { project_id, discovery },
      message: "Discovery analysis completed successfully",
      meta: {
        request_id: requestId,
        duration_ms: Date.now() - start,
      },
    });
  } catch (error) {
    console.error("[Discover POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Discovery analysis failed", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}
