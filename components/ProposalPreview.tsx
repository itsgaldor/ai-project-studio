"use client";

import type { ProposalContent, ProposalSection, ProposalPricing } from "@/lib/types";

interface ProposalPreviewProps {
  proposal: ProposalContent;
  proposalId: string;
  createdAt?: string;
  onRegenerate?: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function ProposalSectionCard({ section }: { section: ProposalSection }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="font-semibold text-white mb-3 text-sm">{section.title}</h3>
      <p className="text-sm text-zinc-300 leading-relaxed mb-4">{section.content}</p>

      {section.key_features && section.key_features.length > 0 && (
        <div>
          <p className="text-xs text-zinc-600 mb-2">Key Features</p>
          <ul className="space-y-1.5">
            {section.key_features.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-300">
                <span className="text-indigo-400 shrink-0">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.metrics && section.metrics.length > 0 && (
        <div>
          <p className="text-xs text-zinc-600 mb-2">Success Metrics</p>
          <div className="grid gap-2">
            {section.metrics.map((m, i) => (
              <div key={i} className="flex gap-2 items-start text-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-300">{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.deliverables && section.deliverables.length > 0 && (
        <div>
          {section.timeline_weeks && (
            <div className="mb-4">
              <p className="text-xs text-zinc-600 mb-2">Timeline</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full"
                    style={{ width: `${Math.min((section.timeline_weeks / 24) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white shrink-0">
                  {section.timeline_weeks} weeks
                </span>
              </div>
            </div>
          )}
          <p className="text-xs text-zinc-600 mb-2">Deliverables</p>
          <ul className="space-y-1.5">
            {section.deliverables.map((d, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-300">
                <span className="text-zinc-600 shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const TIER_STYLES: Record<string, { ring: string; badge: string; price: string; popular?: boolean }> = {
  Starter:  { ring: "border-zinc-700",       badge: "bg-zinc-800 text-zinc-400",        price: "text-white" },
  Standard: { ring: "border-indigo-500/50",  badge: "bg-indigo-500/20 text-indigo-300", price: "text-indigo-300", popular: true },
  Premium:  { ring: "border-violet-500/40",  badge: "bg-violet-500/15 text-violet-300", price: "text-violet-300" },
};

function PricingCard({ pricing, index }: { pricing: ProposalPricing; index: number }) {
  const styles = TIER_STYLES[pricing.tier] ?? TIER_STYLES.Starter;

  return (
    <div className={`relative rounded-2xl border ${styles.ring} bg-zinc-900 p-6 flex flex-col gap-4 hover:border-opacity-80 transition-all`}>
      {styles.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
          Most Popular
        </div>
      )}
      <div>
        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium mb-3 ${styles.badge}`}>
          {pricing.tier}
        </span>
        <p className={`text-3xl font-bold ${styles.price}`}>
          ${pricing.price.toLocaleString()}
        </p>
        <p className="text-xs text-zinc-500 mt-1">{pricing.description}</p>
      </div>

      <div className="border-t border-zinc-800" />

      <ul className="space-y-2 flex-1">
        {pricing.includes.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-300">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      <button
        disabled
        className={`w-full py-2.5 rounded-lg text-sm font-medium border transition-colors ${
          index === 1
            ? "border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
            : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
        } cursor-not-allowed opacity-60`}
      >
        Select Plan
      </button>
    </div>
  );
}

export default function ProposalPreview({
  proposal,
  proposalId,
  createdAt,
  onRegenerate,
}: ProposalPreviewProps) {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Draft
            </span>
            {createdAt && (
              <span className="text-xs text-zinc-600">
                Generated {new Date(createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white">{proposal.title}</h2>
        </div>
        <div className="flex gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
              </svg>
              Regenerate
            </button>
          )}
          <button
            disabled
            title="Coming soon"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 text-zinc-600 text-sm cursor-not-allowed border border-zinc-700"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
              <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
            </svg>
            Send to Client
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div>
        <SectionLabel>Executive Summary</SectionLabel>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          {proposal.executive_summary.split("\n\n").map((para, i) => (
            <p key={i} className={`text-sm text-zinc-300 leading-relaxed ${i > 0 ? "mt-3" : ""}`}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Sections */}
      {proposal.sections && proposal.sections.length > 0 && (
        <div>
          <SectionLabel>Proposal Details</SectionLabel>
          <div className="space-y-4">
            {proposal.sections.map((section, i) => (
              <ProposalSectionCard key={i} section={section} />
            ))}
          </div>
        </div>
      )}

      {/* Pricing */}
      {proposal.pricing && proposal.pricing.length > 0 && (
        <div>
          <SectionLabel>Pricing Options</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {proposal.pricing.map((tier, i) => (
              <PricingCard key={i} pricing={tier} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Terms */}
      {proposal.terms && (
        <div>
          <SectionLabel>Terms & Conditions</SectionLabel>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-sm text-zinc-400 leading-relaxed">{proposal.terms}</p>
          </div>
        </div>
      )}

      {/* Next Steps */}
      {proposal.next_steps && (
        <div>
          <SectionLabel>Next Steps</SectionLabel>
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <p className="text-sm text-indigo-200 leading-relaxed">{proposal.next_steps}</p>
          </div>
        </div>
      )}
    </div>
  );
}
