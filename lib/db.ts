// ============================================================
// AI Product Studio — Database Helpers (Neon / PostgreSQL)
// ============================================================

import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
  Deliverable,
  DeliverableCreateInput,
  DbQueryOptions,
} from "./types";

// ─── Connection ──────────────────────────────────────────────

let _sql: NeonQueryFunction<false, false> | null = null;

function getDb(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _sql = neon(url);
  }
  return _sql;
}

// ─── Generic Helpers ─────────────────────────────────────────

export async function dbQuery<T = unknown>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  const sql = getDb();
  try {
    const result = await sql(query, params);
    return result as T[];
  } catch (error) {
    console.error("[DB] Query error:", { query: query.slice(0, 100), error });
    throw new DatabaseError(
      `Query failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function dbQueryOne<T = unknown>(
  query: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await dbQuery<T>(query, params);
  return rows[0] ?? null;
}

export async function dbHealthCheck(): Promise<{
  ok: boolean;
  latency_ms: number;
}> {
  const start = Date.now();
  try {
    await dbQuery("SELECT 1 AS ping");
    return { ok: true, latency_ms: Date.now() - start };
  } catch {
    return { ok: false, latency_ms: Date.now() - start };
  }
}

// ─── Projects ────────────────────────────────────────────────

export async function getProjects(
  opts: DbQueryOptions & { status?: string } = {}
): Promise<Project[]> {
  const { limit = 50, offset = 0, status, order_by = "created_at", order_dir = "DESC" } = opts;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (status) {
    conditions.push(`status = $${idx++}`);
    params.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderCol = sanitizeIdentifier(order_by);
  const orderDir = order_dir === "ASC" ? "ASC" : "DESC";

  params.push(limit, offset);

  return dbQuery<Project>(
    `SELECT * FROM projects ${where}
     ORDER BY ${orderCol} ${orderDir}
     LIMIT $${idx++} OFFSET $${idx++}`,
    params
  );
}

export async function getProjectById(id: string): Promise<Project | null> {
  return dbQueryOne<Project>(
    "SELECT * FROM projects WHERE id = $1",
    [id]
  );
}

export async function createProject(input: ProjectCreateInput): Promise<Project> {
  const row = await dbQueryOne<Project>(
    `INSERT INTO projects (
       name, description, client_name, client_email,
       industry, budget_range, timeline_weeks, status
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'intake')
     RETURNING *`,
    [
      input.name,
      input.description,
      input.client_name,
      input.client_email,
      input.industry ?? null,
      input.budget_range ?? null,
      input.timeline_weeks ?? null,
    ]
  );
  if (!row) throw new DatabaseError("Failed to create project");
  return row;
}

export async function updateProject(
  id: string,
  input: ProjectUpdateInput
): Promise<Project | null> {
  const fields: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  const allowed: (keyof ProjectUpdateInput)[] = [
    "name", "description", "status", "client_name", "client_email",
    "industry", "budget_range", "timeline_weeks", "ai_summary", "discovery_data",
  ];

  for (const key of allowed) {
    if (input[key] !== undefined) {
      const col = sanitizeIdentifier(key);
      const value = key === "discovery_data"
        ? JSON.stringify(input[key])
        : input[key];
      fields.push(`${col} = $${idx++}`);
      params.push(value);
    }
  }

  if (fields.length === 0) return getProjectById(id);

  fields.push(`updated_at = NOW()`);
  params.push(id);

  return dbQueryOne<Project>(
    `UPDATE projects SET ${fields.join(", ")}
     WHERE id = $${idx}
     RETURNING *`,
    params
  );
}

export async function getProjectsForDiscovery(): Promise<Project[]> {
  return dbQuery<Project>(
    `SELECT * FROM projects
     WHERE status IN ('intake', 'discovery')
       AND (discovery_data IS NULL
         OR (discovery_data->>'last_run_at')::timestamptz < NOW() - INTERVAL '24 hours')
     ORDER BY created_at ASC
     LIMIT 10`
  );
}

// ─── Deliverables ────────────────────────────────────────────

export async function getDeliverables(projectId: string): Promise<Deliverable[]> {
  return dbQuery<Deliverable>(
    "SELECT * FROM deliverables WHERE project_id = $1 ORDER BY created_at DESC",
    [projectId]
  );
}

export async function getDeliverableById(id: string): Promise<Deliverable | null> {
  return dbQueryOne<Deliverable>(
    "SELECT * FROM deliverables WHERE id = $1",
    [id]
  );
}

export async function createDeliverable(
  input: DeliverableCreateInput
): Promise<Deliverable> {
  const row = await dbQueryOne<Deliverable>(
    `INSERT INTO deliverables (project_id, type, title, content, status, version)
     VALUES ($1, $2, $3, $4, 'pending', 1)
     RETURNING *`,
    [input.project_id, input.type, input.title, input.content ?? null]
  );
  if (!row) throw new DatabaseError("Failed to create deliverable");
  return row;
}

export async function updateDeliverable(
  id: string,
  fields: Partial<Pick<Deliverable, "content" | "status" | "file_url" | "ai_model_used" | "tokens_used">>
): Promise<Deliverable | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (fields.content !== undefined) { setClauses.push(`content = $${idx++}`); params.push(fields.content); }
  if (fields.status !== undefined) { setClauses.push(`status = $${idx++}`); params.push(fields.status); }
  if (fields.file_url !== undefined) { setClauses.push(`file_url = $${idx++}`); params.push(fields.file_url); }
  if (fields.ai_model_used !== undefined) { setClauses.push(`ai_model_used = $${idx++}`); params.push(fields.ai_model_used); }
  if (fields.tokens_used !== undefined) { setClauses.push(`tokens_used = $${idx++}`); params.push(fields.tokens_used); }

  if (setClauses.length === 0) return getDeliverableById(id);

  setClauses.push(`updated_at = NOW()`);
  params.push(id);

  return dbQueryOne<Deliverable>(
    `UPDATE deliverables SET ${setClauses.join(", ")}
     WHERE id = $${idx}
     RETURNING *`,
    params
  );
}

// ─── Utilities ───────────────────────────────────────────────

function sanitizeIdentifier(name: string): string {
  // Only allow alphanumeric + underscores to prevent SQL injection via column names
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new DatabaseError(`Invalid identifier: ${name}`);
  }
  return name;
}

// ─── Custom Error ────────────────────────────────────────────

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}
