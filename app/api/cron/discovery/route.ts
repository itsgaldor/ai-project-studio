// ============================================================
// GET /api/cron/discovery — Scheduled Discovery Runner
// Called by Vercel Cron every 6 hours
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getProjectsForDiscovery, updateProject } from "@/lib/db";
import { runDiscoveryAnalysis } from "@/lib/claude";
import { sendSlackNotification, notifyCriticalError } from "@/lib/slack";
import type { ApiResponse, CronJobResult } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel Pro max

// ─── GET /api/cron/discovery ──────────────────────────────────

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<CronJobResult>>> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const startedAt = new Date().toISOString();

  // Verify Vercel Cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log(`[Cron/Discovery] Starting job — requestId: ${requestId}`);

  let processed = 0;
  let errors = 0;
  const details: Record<string, string> = {};

  try {
    // Fetch projects that need discovery
    const projects = await getProjectsForDiscovery();
    console.log(`[Cron/Discovery] Found ${projects.length} projects to process`);

    if (projects.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          job: "cron/discovery",
          started_at: startedAt,
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - start,
          processed: 0,
          errors: 0,
          details: { message: "No projects require discovery at this time" },
        },
        message: "No projects to process",
        meta: { request_id: requestId },
      });
    }

    // Process each project sequentially to avoid rate limits
    for (const project of projects) {
      try {
        console.log(`[Cron/Discovery] Processing project: ${project.id} — ${project.name}`);

        const discovery = await runDiscoveryAnalysis(project);

        await updateProject(project.id, {
          discovery_data: discovery,
          status: project.status === "intake" ? "discovery" : project.status,
        });

        sendSlackNotification({
          event: "discovery.completed",
          project,
          message: `Auto-discovery completed for *${project.name}*`,
          details: {
            competitors_found: String(discovery.competitors?.length ?? 0),
            opportunities_found: String(discovery.opportunities?.length ?? 0),
          },
        }).catch(console.error);

        processed++;
        details[project.id] = `✅ ${project.name} — discovery complete`;

        // Small delay to avoid API rate limits
        if (projects.indexOf(project) < projects.length - 1) {
          await sleep(2000);
        }
      } catch (projectError) {
        errors++;
        const errMsg = projectError instanceof Error ? projectError.message : "Unknown error";
        console.error(`[Cron/Discovery] Failed for project ${project.id}:`, errMsg);
        details[project.id] = `❌ ${project.name} — ${errMsg}`;

        // Notify on critical per-project errors
        notifyCriticalError(
          projectError instanceof Error ? projectError : new Error(errMsg),
          `cron/discovery — project ${project.id}`
        ).catch(console.error);
      }
    }

    const result: CronJobResult = {
      job: "cron/discovery",
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - start,
      processed,
      errors,
      details,
    };

    console.log(`[Cron/Discovery] Done — processed: ${processed}, errors: ${errors}`);

    // Summary Slack notification
    if (processed > 0) {
      sendSlackNotification({
        event: "discovery.completed",
        message: `Cron discovery run complete: *${processed}* projects processed, *${errors}* errors`,
        details: {
          duration_s: String(Math.round(result.duration_ms / 1000)),
          processed: String(processed),
          errors: String(errors),
        },
        severity: errors > 0 ? "warning" : "info",
      }).catch(console.error);
    }

    return NextResponse.json({
      success: errors === 0,
      data: result,
      message: `Discovery cron completed: ${processed} processed, ${errors} errors`,
      meta: {
        request_id: requestId,
        duration_ms: result.duration_ms,
      },
    });
  } catch (fatalError) {
    console.error("[Cron/Discovery] Fatal error:", fatalError);

    notifyCriticalError(
      fatalError instanceof Error ? fatalError : new Error("Unknown cron error"),
      "cron/discovery — fatal"
    ).catch(console.error);

    return NextResponse.json(
      {
        success: false,
        error: "Cron job failed with a fatal error",
        data: {
          job: "cron/discovery",
          started_at: startedAt,
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - start,
          processed,
          errors: errors + 1,
        },
        meta: { request_id: requestId },
      },
      { status: 500 }
    );
  }
}

// ─── Helpers ─────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
