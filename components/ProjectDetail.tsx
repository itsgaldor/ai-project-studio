"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BusinessProfile from "@/components/BusinessProfile";
import ProposalPreview from "@/components/ProposalPreview";
import ProposalGenerator from "@/components/ProposalGenerator";
import type { Project, ProposalContent } from "@/lib/types";
import type { Deliverable } from "@/lib/types";

interface ActiveProposal {
  content: ProposalContent;
  proposalId: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  intake:    { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20"  },
  discovery: { dot: "bg-blue-400",    text: "text-blue-400",    bg: "bg-blue-400/10 border-blue-400/20"    },
  analysis:  { dot: "bg-violet-400",  text: "text-violet-400",  bg: "bg-violet-400/10 border-violet-400/20"},
  delivery:  { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20"},
  completed: { dot: "bg-teal-400",    text: "text-teal-400",    bg: "bg-teal-400/10 border-teal-400/20"   },
  archived:  { dot: "bg-zinc-600",    text: "text-zinc-500",    bg: "bg-zinc-800 border-zinc-700"          },
};

function parseProposalFromDeliverable(d: Deliverable): ActiveProposal | null {
  if (!d.content) return null;
  try {
    return {
      content: JSON.parse(d.content) as ProposalContent,
      proposalId: d.id,
      createdAt: d.created_at,
    };
  } catch {
    return null;
  }
}

export default function ProjectDetail({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProposal, setActiveProposal] = useState<ActiveProposal | null>(null);
  const [proposalsLoading, setProposalsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projRes, propRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch(`/api/proposals?project_id=${projectId}`),
        ]);

        const projJson = await projRes.json();
        if (!projRes.ok || !projJson.success) {
          throw new Error(projJson.error ?? "Project not found");
        }
        setProject(projJson.data as Project);

        const propJson = await propRes.json();
        if (propJson.success && Array.isArray(propJson.data) && propJson.data.length > 0) {
          const parsed = parseProposalFromDeliverable(propJson.data[0] as Deliverable);
          if (parsed) setActiveProposal(parsed);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
        setProposalsLoading(false);
      }
    }
    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-zinc-800 rounded-lg w-64" />
          <div className="h-4 bg-zinc-800 rounded w-48" />
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <div className="h-96 bg-zinc-900 rounded-2xl" />
            <div className="h-96 bg-zinc-900 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-zinc-400">{error ?? "Project not found"}</p>
          <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[project.status] ?? STATUS_STYLES.intake;

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            Dashboard
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400 truncate max-w-xs">{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              {project.budget_range && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {project.budget_range}
                </span>
              )}
              {project.industry && (
                <span className="text-xs text-zinc-600">{project.industry}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-zinc-500 mt-1 text-sm">{project.client_name}</p>
          </div>
          <div className="text-right text-xs text-zinc-600 space-y-1 shrink-0">
            <p>Created {new Date(project.created_at).toLocaleDateString()}</p>
            {project.timeline_weeks && <p>{project.timeline_weeks} week timeline</p>}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4">
            <p className="text-sm text-zinc-300 leading-relaxed">{project.description}</p>
          </div>
        )}

        {/* AI Summary */}
        {project.ai_summary && (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-5 py-4">
            <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2 font-medium">AI Summary</p>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{project.ai_summary}</p>
          </div>
        )}

        {/* Main 2-col layout */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* Left: Discovery / Business Profile */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            {project.discovery_data ? (
              <BusinessProfile
                discovery={project.discovery_data}
                clientName={project.client_name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-zinc-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-400 font-medium">No discovery data yet</p>
                <p className="text-xs text-zinc-600 max-w-xs">
                  Discovery analysis runs automatically in the background after intake.
                </p>
              </div>
            )}
          </div>

          {/* Right: Proposals */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
            <ProposalGenerator
              projectId={projectId}
              hasExisting={!!activeProposal}
              onGenerated={(content, proposalId, createdAt) => {
                setActiveProposal({ content, proposalId, createdAt });
              }}
            />

            {proposalsLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded w-32" />
                <div className="h-20 bg-zinc-900 rounded-xl" />
              </div>
            ) : activeProposal ? (
              <ProposalPreview
                proposal={activeProposal.content}
                proposalId={activeProposal.proposalId}
                createdAt={activeProposal.createdAt}
                onRegenerate={() => setActiveProposal(null)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-zinc-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-400 font-medium">No proposals yet</p>
                <p className="text-xs text-zinc-600">
                  Click &ldquo;Generate Proposal&rdquo; above to create one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
