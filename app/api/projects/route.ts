// ============================================================
// GET    /api/projects        — List all projects
// POST   /api/projects        — Create a project
// GET    /api/projects/[id]   — Get a single project
// PATCH  /api/projects/[id]   — Update a project
// DELETE /api/projects/[id]   — Archive a project
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
} from "@/lib/db";
import { sendSlackNotification } from "@/lib/slack";
import type {
  ApiResponse,
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
  PaginationParams,
} from "@/lib/types";

export const dynamic = "force-dynamic";

// ─── GET /api/projects ────────────────────────────────────────

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Project[]>>> {
  const requestId = crypto.randomUUID();

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const pagination: PaginationParams & { status?: string } = {
      page: params.page ? Number(params.page) : 1,
      per_page: params.per_page ? Math.min(Number(params.per_page), 100) : 20,
      sort_by: params.sort_by ?? "created_at",
      sort_order: (params.sort_order as "asc" | "desc") ?? "desc",
      status: params.status,
    };

    const page = pagination.page ?? 1;
    const perPage = pagination.per_page ?? 20;
    const offset = (page - 1) * perPage;

    const projects = await getProjects({
      limit: perPage,
      offset,
      order_by: pagination.sort_by ?? "created_at",
      order_dir: pagination.sort_order === "asc" ? "ASC" : "DESC",
      status: pagination.status,
    });

    return NextResponse.json({
      success: true,
      data: projects,
      meta: {
        request_id: requestId,
        total: projects.length,
        page,
        per_page: perPage,
        has_more: projects.length === perPage,
      },
    });
  } catch (error) {
    console.error("[Projects GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}

// ─── POST /api/projects ───────────────────────────────────────

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Project>>> {
  const requestId = crypto.randomUUID();

  try {
    let body: ProjectCreateInput;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const errors = validateProjectCreate(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed", message: errors.join(", ") },
        { status: 422 }
      );
    }

    const project = await createProject(body);

    sendSlackNotification({
      event: "project.created",
      project,
      message: `New project *${project.name}* created for *${project.client_name}*`,
    }).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project created successfully",
        meta: { request_id: requestId },
      },
      {
        status: 201,
        headers: { "X-Project-Id": project.id },
      }
    );
  } catch (error) {
    console.error("[Projects POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project", meta: { request_id: requestId } },
      { status: 500 }
    );
  }
}

// ─── Validation ──────────────────────────────────────────────

function validateProjectCreate(data: Partial<ProjectCreateInput>): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("name is required");
  if (!data.description?.trim()) errors.push("description is required");
  if (!data.client_name?.trim()) errors.push("client_name is required");
  if (!data.client_email?.trim()) errors.push("client_email is required");
  if (data.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.client_email)) {
    errors.push("client_email is invalid");
  }
  if (data.timeline_weeks !== undefined && data.timeline_weeks < 1) {
    errors.push("timeline_weeks must be positive");
  }
  return errors;
}

// ─── Dynamic route: /api/projects/[id] ───────────────────────
// Next.js requires a separate file for dynamic segments.
// See: app/api/projects/[id]/route.ts
//
// Alternatively, export a named handler here and use segment config.
// The handlers below cover /api/projects/[id] if you use the
// catch-all pattern via middleware or a wrapper.
//
// For a standard Next.js setup, create app/api/projects/[id]/route.ts
