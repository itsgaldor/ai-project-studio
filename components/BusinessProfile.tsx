"use client";

import type { DiscoveryData, Competitor } from "@/lib/types";

interface BusinessProfileProps {
  discovery: DiscoveryData;
  clientName: string;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function Tag({ children, color = "zinc" }: { children: React.ReactNode; color?: "zinc" | "indigo" | "emerald" | "amber" | "red" }) {
  const colors = {
    zinc: "bg-zinc-800 text-zinc-300 border-zinc-700",
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    red: "bg-red-500/15 text-red-300 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs border ${colors[color]}`}>
      {children}
    </span>
  );
}

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium text-white text-sm">{competitor.name}</p>
        {competitor.pricing && (
          <span className="text-xs text-zinc-500">{competitor.pricing}</span>
        )}
      </div>
      <div className="space-y-2">
        {competitor.strengths.length > 0 && (
          <div>
            <p className="text-xs text-zinc-600 mb-1">Strengths</p>
            <div className="flex flex-wrap gap-1">
              {competitor.strengths.map((s, i) => (
                <Tag key={i} color="zinc">{s}</Tag>
              ))}
            </div>
          </div>
        )}
        {competitor.weaknesses.length > 0 && (
          <div>
            <p className="text-xs text-zinc-600 mb-1">Weaknesses</p>
            <div className="flex flex-wrap gap-1">
              {competitor.weaknesses.map((w, i) => (
                <Tag key={i} color="amber">{w}</Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusinessProfile({ discovery, clientName }: BusinessProfileProps) {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-indigo-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-white text-sm">Discovery Report</p>
          <p className="text-xs text-zinc-500">{clientName}</p>
        </div>
      </div>

      {/* Market Size */}
      {discovery.market_size && (
        <div>
          <SectionLabel>Market Size</SectionLabel>
          <p className="text-sm text-zinc-300 leading-relaxed">{discovery.market_size}</p>
        </div>
      )}

      {/* Target Audience (ICP) */}
      {discovery.target_audience && (
        <div>
          <SectionLabel>Ideal Customer Profile</SectionLabel>
          <p className="text-sm text-zinc-300 leading-relaxed">{discovery.target_audience}</p>
        </div>
      )}

      {/* UVP */}
      {discovery.unique_value_proposition && (
        <div>
          <SectionLabel>Unique Value Proposition</SectionLabel>
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
            <p className="text-sm text-indigo-200 leading-relaxed italic">
              &ldquo;{discovery.unique_value_proposition}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Opportunities */}
      {discovery.opportunities && discovery.opportunities.length > 0 && (
        <div>
          <SectionLabel>Opportunities</SectionLabel>
          <ul className="space-y-2">
            {discovery.opportunities.map((o, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-zinc-300">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks */}
      {discovery.risks && discovery.risks.length > 0 && (
        <div>
          <SectionLabel>Risks to Address</SectionLabel>
          <ul className="space-y-2">
            {discovery.risks.map((r, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-zinc-300">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Features */}
      {discovery.recommended_features && discovery.recommended_features.length > 0 && (
        <div>
          <SectionLabel>Recommended Features</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {discovery.recommended_features.map((f, i) => (
              <Tag key={i} color="indigo">{f}</Tag>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {discovery.tech_stack_suggestions && discovery.tech_stack_suggestions.length > 0 && (
        <div>
          <SectionLabel>Suggested Tech Stack</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {discovery.tech_stack_suggestions.map((t, i) => (
              <Tag key={i} color="zinc">{t}</Tag>
            ))}
          </div>
        </div>
      )}

      {/* Monetization */}
      {discovery.monetization_models && discovery.monetization_models.length > 0 && (
        <div>
          <SectionLabel>Monetization Models</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {discovery.monetization_models.map((m, i) => (
              <Tag key={i} color="emerald">{m}</Tag>
            ))}
          </div>
        </div>
      )}

      {/* Competitors */}
      {discovery.competitors && discovery.competitors.length > 0 && (
        <div>
          <SectionLabel>Competitive Landscape</SectionLabel>
          <div className="grid gap-3">
            {discovery.competitors.map((c, i) => (
              <CompetitorCard key={i} competitor={c} />
            ))}
          </div>
        </div>
      )}

      {/* Last run */}
      {discovery.last_run_at && (
        <p className="text-xs text-zinc-600">
          Analysis run {new Date(discovery.last_run_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
