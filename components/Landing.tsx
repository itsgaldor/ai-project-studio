import Link from "next/link";

const features = [
  {
    title: "AI-Powered Discovery",
    desc: "Market research, competitor analysis, and strategic insights generated automatically for every project.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
  },
  {
    title: "Auto-Generated PRDs",
    desc: "Professional Product Requirements Documents, technical specs, and roadmaps created in minutes, not weeks.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    title: "Structured Intake",
    desc: "Capture every project detail with a smart form that feeds directly into AI analysis pipelines.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
  },
  {
    title: "From Idea to Action",
    desc: "Go from a client conversation to a fully scoped, production-ready project brief — automatically.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
];

const steps = [
  {
    num: "01",
    title: "Submit Intake",
    desc: "Fill the smart project form. 3 minutes to capture everything Claude needs.",
  },
  {
    num: "02",
    title: "AI Discovery",
    desc: "Claude analyzes the market, competitors, risks, and opportunities automatically.",
  },
  {
    num: "03",
    title: "Get Deliverables",
    desc: "Receive PRDs, tech specs, and strategic docs — ready to share with stakeholders.",
  },
];

const metrics = [
  { value: "< 2 min", label: "PRD generation" },
  { value: "100+", label: "Projects analyzed" },
  { value: "12×", label: "Faster than manual" },
  { value: "4 docs", label: "Per project" },
];

const techTags = ["Next.js", "React Native", "PostgreSQL", "Redis", "Stripe"];

export default function Landing() {
  return (
    <main className="flex-1 bg-black text-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Dot-grid atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(99,102,241,0.13)_1px,_transparent_1px)] [background-size:32px_32px]" />
        {/* Radial glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Powered by Claude AI
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                Turn client briefs
                <br />
                into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  shipping specs
                </span>
              </h1>

              <p className="text-zinc-400 text-lg sm:text-xl max-w-lg leading-relaxed mb-10">
                AI Product Studio automates the entire discovery process — from intake
                to PRDs, tech specs, and market analysis.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/intake"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
                >
                  Start a Project
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-zinc-800 text-zinc-300 font-semibold hover:border-zinc-700 hover:text-white transition-colors"
                >
                  View Dashboard
                </Link>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-zinc-900">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-xl font-bold text-white">{m.value}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — mock PRD output */}
            <div className="relative">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl shadow-black/60">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/60">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="ml-3 text-xs text-zinc-500 font-mono">project-brief.md</span>
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Generated in 1.8s
                  </div>
                </div>

                <div className="p-5 font-mono text-sm space-y-4">
                  <div>
                    <div className="text-indigo-400 text-xs uppercase tracking-widest mb-2">
                      Product Requirements Document
                    </div>
                    <div className="text-white font-semibold text-base">E-Commerce Mobile App</div>
                    <div className="text-zinc-500 text-xs mt-1">Acme Corp · Retail · $50k–$100k</div>
                  </div>

                  <div className="border-t border-zinc-800" />

                  <div>
                    <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Executive Summary</div>
                    <div className="space-y-1.5">
                      {[
                        "Target market: Urban professionals 25–40",
                        "Core problem: Fragmented purchase experience",
                        "Solution: AI-curated unified commerce layer",
                      ].map((line) => (
                        <div key={line} className="flex gap-2">
                          <span className="text-zinc-600 shrink-0">→</span>
                          <span className="text-zinc-300 text-xs">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-800" />

                  <div>
                    <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Market Analysis</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: "$847B", l: "TAM", color: "text-indigo-400" },
                        { v: "12", l: "Competitors", color: "text-indigo-400" },
                        { v: "4", l: "Opportunities", color: "text-emerald-400" },
                      ].map((stat) => (
                        <div key={stat.l} className="rounded-lg bg-zinc-900 p-2.5 text-center">
                          <div className={`font-bold text-sm ${stat.color}`}>{stat.v}</div>
                          <div className="text-zinc-600 text-xs mt-0.5">{stat.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-800" />

                  <div>
                    <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Suggested Stack</div>
                    <div className="flex flex-wrap gap-1.5">
                      {techTags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-zinc-600 text-xs">4 documents generated</span>
                    <Link href="/intake" className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors">
                      View full brief →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-900/50">
                AI-Generated ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="border-t border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <div className="text-xs text-indigo-400 uppercase tracking-widest mb-3 font-medium">
              Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-md">
              Everything the discovery process needs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-black p-8 group hover:bg-zinc-950 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 mb-5 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 transition-all">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="border-t border-zinc-900 py-24 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs text-indigo-400 uppercase tracking-widest mb-3 font-medium">
              Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Three steps to a complete brief
            </h2>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Connecting line (desktop only) */}
            <div className="hidden sm:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-zinc-800 via-indigo-500/40 to-zinc-800" />

            {steps.map((s) => (
              <div key={s.num} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl border border-zinc-800 bg-black flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-black/50">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-violet-500">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="border-t border-zinc-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.12)_0%,_transparent_65%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs text-indigo-400 uppercase tracking-widest mb-5 font-medium">
            Get started
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Your next project brief
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              in under 2 minutes
            </span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Submit an intake form and watch Claude generate a complete discovery
            package — market analysis, PRD, tech spec, and strategic roadmap.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-xl shadow-indigo-900/30"
            >
              Start a Project
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-zinc-800 text-zinc-300 font-semibold hover:border-zinc-700 hover:text-white transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-zinc-600 text-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            No account required · Powered by Claude AI
          </div>
        </div>
      </section>

    </main>
  );
}
