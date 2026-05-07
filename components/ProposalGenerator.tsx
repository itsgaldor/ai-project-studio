"use client";

import { useState } from "react";
import type { ProposalContent, ProposalTone } from "@/lib/types";

interface ProposalGeneratorProps {
  projectId: string;
  hasExisting: boolean;
  onGenerated: (content: ProposalContent, proposalId: string, createdAt: string) => void;
}

const TONES: { value: ProposalTone; label: string; desc: string }[] = [
  { value: "formal",    label: "Formal",    desc: "Enterprise, professional" },
  { value: "casual",    label: "Casual",    desc: "Friendly, approachable"   },
  { value: "technical", label: "Technical", desc: "Detail-focused, precise"  },
];

export default function ProposalGenerator({
  projectId,
  hasExisting,
  onGenerated,
}: ProposalGeneratorProps) {
  const [tone, setTone] = useState<ProposalTone>("formal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, tone }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to generate proposal");
      }

      onGenerated(
        json.data.content as ProposalContent,
        json.data.proposal_id as string,
        json.data.created_at as string
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
      <div>
        <p className="font-medium text-white text-sm mb-1">
          {hasExisting ? "Generate New Proposal" : "Generate Proposal"}
        </p>
        <p className="text-xs text-zinc-500">
          Claude Opus will create a tailored proposal using the discovery data.
          Takes 10–20 seconds.
        </p>
      </div>

      {/* Tone selector */}
      <div>
        <p className="text-xs text-zinc-600 mb-2">Tone</p>
        <div className="flex gap-2 flex-wrap">
          {TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              disabled={loading}
              className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
                tone === t.value
                  ? "border-indigo-500/60 bg-indigo-500/15 text-indigo-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="font-medium">{t.label}</span>
              <span className="text-zinc-600 ml-1">— {t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
            Generating with Claude Opus…
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.633.633l-.551.183a1 1 0 0 0 0 1.898l.551.184a1 1 0 0 1 .633.632l.184.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.633l-.183-.551Z" />
            </svg>
            {hasExisting ? "Regenerate Proposal" : "Generate Proposal"}
          </>
        )}
      </button>
    </div>
  );
}
