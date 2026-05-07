-- ============================================================
-- AI Product Studio — Database Schema (PostgreSQL / Neon)
-- ============================================================
-- Run this once against your Neon database to initialize.
-- Compatible with Neon serverless PostgreSQL.
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy text search

-- ─── ENUM Types ──────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM (
    'intake',
    'discovery',
    'analysis',
    'delivery',
    'completed',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE deliverable_type AS ENUM (
    'prd',
    'technical_spec',
    'market_analysis',
    'wireframe_brief',
    'pitch_deck',
    'roadmap',
    'custom'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE deliverable_status AS ENUM (
    'pending',
    'generating',
    'review',
    'approved',
    'delivered'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Projects ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  description      TEXT NOT NULL,
  status           project_status NOT NULL DEFAULT 'intake',
  client_name      TEXT NOT NULL,
  client_email     TEXT NOT NULL,
  industry         TEXT,
  budget_range     TEXT,
  timeline_weeks   INTEGER CHECK (timeline_weeks > 0),
  ai_summary       TEXT,
  discovery_data   JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_status      ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_client_email ON projects (client_email);
CREATE INDEX IF NOT EXISTS idx_projects_created_at  ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_discovery   ON projects USING GIN (discovery_data);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Deliverables ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS deliverables (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type           deliverable_type NOT NULL,
  title          TEXT NOT NULL,
  content        TEXT,
  status         deliverable_status NOT NULL DEFAULT 'pending',
  version        INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  file_url       TEXT,
  ai_model_used  TEXT,
  tokens_used    INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON deliverables (project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_status     ON deliverables (status);
CREATE INDEX IF NOT EXISTS idx_deliverables_type       ON deliverables (type);
CREATE INDEX IF NOT EXISTS idx_deliverables_created_at ON deliverables (created_at DESC);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS set_deliverables_updated_at ON deliverables;
CREATE TRIGGER set_deliverables_updated_at
  BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Audit Log (optional but recommended) ────────────────────

CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name  TEXT NOT NULL,
  record_id   UUID NOT NULL,
  action      TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data    JSONB,
  new_data    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_record    ON audit_log (table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created   ON audit_log (created_at DESC);

-- ─── Seed Data (development only) ────────────────────────────

-- Uncomment to insert sample data:
/*
INSERT INTO projects (name, description, client_name, client_email, industry, status, budget_range, timeline_weeks)
VALUES
  ('HealthTrack AI', 'AI-powered personal health monitoring app', 'Acme Corp', 'contact@acme.com', 'Healthcare', 'intake', '$50k - $100k', 12),
  ('LegalEase Pro', 'Legal document automation for SMBs', 'LexTech Ltd', 'hello@lextech.io', 'Legal', 'discovery', '$25k - $50k', 8),
  ('EduBot Platform', 'Adaptive learning platform for K-12', 'EduStart Inc', 'cto@edustart.com', 'Education', 'analysis', '$100k - $250k', 20)
;
*/

-- ─── Useful Views ────────────────────────────────────────────

CREATE OR REPLACE VIEW projects_summary AS
SELECT
  p.id,
  p.name,
  p.client_name,
  p.status,
  p.industry,
  p.budget_range,
  p.timeline_weeks,
  COUNT(d.id) AS deliverable_count,
  COUNT(d.id) FILTER (WHERE d.status = 'approved') AS approved_deliverables,
  p.created_at,
  p.updated_at
FROM projects p
LEFT JOIN deliverables d ON d.project_id = p.id
GROUP BY p.id;

-- ─── Done ────────────────────────────────────────────────────

SELECT 'Schema initialized successfully' AS message;
