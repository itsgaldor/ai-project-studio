import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProject } from "@/lib/db";
import type { ApiResponse, ProjectUpdateInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>({ success: true, data: project });
  } catch (err) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: err instanceof Error ? err.message : "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const body = await req.json() as ProjectUpdateInput;
    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: err instanceof Error ? err.message : "Failed to update project" },
      { status: 500 }
    );
  }
}
