"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  draft:      { dot: "bg-zinc-500",   text: "text-zinc-400",   bg: "bg-zinc-800"    },
  intake:     { dot: "bg-amber-400",  text: "text-amber-400",  bg: "bg-amber-400/10" },
  discovery:  { dot: "bg-blue-400",   text: "text-blue-400",   bg: "bg-blue-400/10"  },
  proposal:   { dot: "bg-violet-400", text: "text-violet-400", bg: "bg-violet-400/10"},
  active:     { dot: "bg-emerald-400",text: "text-emerald-400",bg: "bg-emerald-400/10"},
  completed:  { dot: "bg-teal-400",   text: "text-teal-400",   bg: "bg-teal-400/10"  },
  archived:   { dot: "bg-zinc-600",   text: "text-zinc-500",   bg: "bg-zinc-800"     },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/dashboard/${project.id}`}
      className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-white text-base truncate group-hover:text-indigo-300 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-zinc-500 mt-0.5">{project.client_name}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="mt-3 text-sm text-zinc-400 line-clamp-2">{project.description}</p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
        <span>{project.industry ?? "—"}</span>
        <span>{timeAgo(project.updated_at ?? project.created_at)}</span>
      </div>

      {/* Progress indicators */}
      <div className="mt-3 flex gap-2">
        {(["discovery_data", "ai_summary"] as const).map((key) => {
          const has = !!project[key];
          const labels: Record<string, string> = {
            discovery_data: "Discovery",
            ai_summary: "AI Summary",
          };
          return (
            <span
              key={key}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                has ? "bg-indigo-500/20 text-indigo-400" : "bg-zinc-800 text-zinc-600"
              }`}
            >
              {labels[key]}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl">
        📋
      </div>
      <h3 className="text-lg font-semibold text-white">No projects yet</h3>
      <p className="text-sm text-zinc-500 max-w-xs">
        Submit an intake form to create your first AI product project.
      </p>
      <Link
        href="/intake"
        className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
      >
        Start a project →
      </Link>
    </div>
  );
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
      const data = await res.json();
      setProjects(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const statuses = ["all", ...Array.from(new Set(projects.map((p) => p.status)))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-white">Projects</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {loading ? "Loading…" : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
            className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition-all text-sm"
            title="Refresh"
          >
            ↻
          </button>
          <Link
            href="/intake"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            + New Project
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      {!loading && projects.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {projects.filter((p) => p.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 animate-pulse">
              <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-800 rounded w-1/2 mb-4" />
              <div className="h-8 bg-zinc-800 rounded mb-3" />
              <div className="h-3 bg-zinc-800 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button onClick={fetchProjects} className="text-red-300 hover:text-white underline text-xs">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
