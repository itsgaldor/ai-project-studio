// ============================================================
// GET    /api/projects/[id]  — Get a single project
// PATCH  /api/projects/[id]  — Update a project
// DELETE /api/projects/[id]  — Archive a project
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProject } from "@/lib/db";
import { sendSlackNotification } from "@/lib/slack";
import type { ApiResponse, Project, ProjectUpdateInput } from "@/lib/types";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/projects/[id] ───────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<Project>>> {
  const requestId = crypto.randomUUID();
  const { id } = await params;

  try {
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
      meta: { request_id: requestId },
    });
  } catch (error) {
    console.error("[Projects/:id GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/projects/[id] ─────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<Project>>> {
  const requestId = crypto.randomUUID();
  const { id } = await params;

  try {
    const body: ProjectUpdateInput = await req.json().catch(() => ({}));

    const existing = await getProjectById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Update failed" },
        { status: 500 }
      );
    }

    // Notify on status changes
    if (body.status && body.status !== existing.status) {
      const event =
        body.status === "completed" ? "project.completed" : "project.updated";
      sendSlackNotification({
        event,
        project: updated,
        message: `Project *${updated.name}* status changed: \`${existing.status}\` → \`${updated.status}\``,
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Project updated successfully",
      meta: { request_id: requestId },
    });
  } catch (error) {
    console.error("[Projects/:id PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/projects/[id] (Archive) ──────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  const requestId = crypto.randomUUID();
  const { id } = await params;

  try {
    const existing = await getProjectById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Soft delete: set status to archived
    await updateProject(id, { status: "archived" });

    return NextResponse.json({
      success: true,
      data: { id },
      message: "Project archived successfully",
      meta: { request_id: requestId },
    });
  } catch (error) {
    console.error("[Projects/:id DELETE] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to archive project", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}
