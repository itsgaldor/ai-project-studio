import { NextResponse } from "next/server";
import { dbHealthCheck } from "@/lib/db";
import { claudeHealthCheck } from "@/lib/claude";
import type { HealthStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const start = Date.now();

  const [db, claude] = await Promise.all([
    dbHealthCheck(),
    claudeHealthCheck(),
  ]);

  const allOk = db.ok && claude.ok;
  const status: HealthStatus["status"] = allOk ? "ok" : "degraded";

  const body: HealthStatus = {
    status,
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: db.ok ? "ok" : "down",
        latency_ms: db.latency_ms,
      },
      claude_api: {
        status: claude.ok ? "ok" : "down",
        latency_ms: claude.latency_ms,
        error: claude.error,
      },
      slack: { status: "ok" },
    },
    uptime_seconds: Math.floor(process.uptime()),
  };

  return NextResponse.json(body, { status: allOk ? 200 : 503 });
}
