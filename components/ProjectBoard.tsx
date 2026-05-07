"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";

// ─── Kanban config ───────────────────────────────────────────

const COLUMNS = [
  {
    id: "intake",
    label: "Intake",
    statuses: ["intake"],
    dot: "bg-amber-400",
    text: "text-amber-400",
    empty: "New project received",
  },
  {
    id: "discovery",
    label: "Discovery",
    statuses: ["discovery", "analysis"],
    dot: "bg-blue-400",
    text: "text-blue-400",
    empty: "Analyzing market & opportunities",
  },
  {
    id: "delivery",
    label: "Active",
    statuses: ["delivery"],
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    empty: "In active development",
  },
  {
    id: "completed",
    label: "Completed",
    statuses: ["completed", "archived"],
    dot: "bg-teal-400",
    text: "text-teal-400",
    empty: "Delivered projects",
  },
] as const;

function daysAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days}d ago`;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-medium text-white text-sm leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
          {project.client_name}
        </p>
        {project.discovery_data && (
          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" title="Discovery data available" />
        )}
      </div>

      {project.name !== project.client_name && (
        <p className="text-xs text-zinc-500 mb-2 line-clamp-1">{project.name}</p>
      )}

      {project.industry && (
        <p className="text-xs text-zinc-600 mb-3">{project.industry}</p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        {project.budget_range ? (
          <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400">
            {project.budget_range}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs text-zinc-600">{daysAgo(project.created_at)}</span>
      </div>
    </Link>
  );
}

function Column({
  col,
  projects,
}: {
  col: (typeof COLUMNS)[number];
  projects: Project[];
}) {
  return (
    <div className="flex flex-col min-w-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2 h-2 rounded-full ${col.dot}`} />
        <span className={`text-sm font-medium ${col.text}`}>{col.label}</span>
        <span className="text-xs text-zinc-600 ml-auto">{projects.length}</span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center">
            <p className="text-xs text-zinc-700">{col.empty}</p>
          </div>
        ) : (
          projects.map((p) => <ProjectCard key={p.id} project={p} />)
        )}
      </div>
    </div>
  );
}

export default function ProjectBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed to load");
      setProjects(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  // Stats
  const stats = [
    { label: "Total",     value: projects.length },
    { label: "Discovery", value: projects.filter((p) => ["discovery", "analysis"].includes(p.status)).length },
    { label: "Active",    value: projects.filter((p) => p.status === "delivery").length },
    { label: "Completed", value: projects.filter((p) => ["completed", "archived"].includes(p.status)).length },
  ];

  // Bucket projects into columns
  const bucketed = COLUMNS.map((col) => ({
    col,
    projects: projects.filter((p) => (col.statuses as readonly string[]).includes(p.status)),
  }));

  return (
    <div className="space-y-6">

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
          >
            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-white">
              {loading ? <span className="text-zinc-700">—</span> : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Board</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={fetch_}
            disabled={loading}
            className="p-2 rounded-lg border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-all disabled:opacity-40"
            title="Refresh"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}>
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
            </svg>
          </button>
          <Link
            href="/intake"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            New Project
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetch_} className="text-red-300 hover:text-white text-xs underline">
            Retry
          </button>
        </div>
      )}

      {/* Kanban grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((c) => (
            <div key={c.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <div className="h-4 bg-zinc-800 rounded w-20 animate-pulse" />
              </div>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 animate-pulse space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bucketed.map(({ col, projects: colProjects }) => (
            <Column key={col.id} col={col} projects={colProjects} />
          ))}
        </div>
      )}
    </div>
  );
}
