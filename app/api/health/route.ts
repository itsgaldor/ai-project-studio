// ============================================================
// GET /api/health — System Health Check
// ============================================================

import { NextResponse } from "next/server";
import { dbHealthCheck } from "@/lib/db";
import { claudeHealthCheck } from "@/lib/claude";
import { slackHealthCheck } from "@/lib/slack";
import type { HealthStatus, ApiResponse } from "@/lib/types";

const START_TIME = Date.now();

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ApiResponse<HealthStatus>>> {
  const timestamp = new Date().toISOString();
  const requestId = crypto.randomUUID();
  const start = Date.now();

  // Run all health checks in parallel
  const [db, claude, slack] = await Promise.all([
    dbHealthCheck(),
    claudeHealthCheck(),
    slackHealthCheck(),
  ]);

  const allOk = db.ok && claude.ok;
  const anyDown = !db.ok || !claude.ok;

  const status: HealthStatus = {
    status: anyDown ? "down" : slack.ok ? "ok" : "degraded",
    version: process.env.npm_package_version ?? "1.0.0",
    timestamp,
    services: {
      database: {
        status: db.ok ? "ok" : "down",
        latency_ms: db.latency_ms,
        error: db.ok ? undefined : "Connection failed",
      },
      claude_api: {
        status: claude.ok ? "ok" : "down",
        latency_ms: claude.latency_ms,
        error: claude.ok ? undefined : "API unreachable",
      },
      slack: {
        status: slack.ok ? "ok" : "degraded",
        latency_ms: slack.latency_ms,
        error: slack.ok ? undefined : "Webhook not configured or unreachable",
      },
    },
    uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
  };

  const httpStatus = allOk ? 200 : anyDown ? 503 : 200;

  return NextResponse.json(
    {
      success: allOk,
      data: status,
      meta: {
        request_id: requestId,
        duration_ms: Date.now() - start,
      },
    },
    {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Request-Id": requestId,
      },
    }
  );
}
