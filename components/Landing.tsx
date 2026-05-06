import Link from "next/link";

const valueProps = [
  {
    icon: "⚡",
    title: "AI-Powered Discovery",
    desc: "Market research, competitor analysis, and strategic insights generated automatically for every project.",
  },
  {
    icon: "📋",
    title: "Auto-Generated PRDs",
    desc: "Professional Product Requirements Documents, technical specs, and roadmaps created in minutes, not weeks.",
  },
  {
    icon: "🎯",
    title: "Structured Intake",
    desc: "Capture every project detail with a smart intake form that feeds directly into AI analysis pipelines.",
  },
  {
    icon: "🚀",
    title: "From Idea to Action",
    desc: "Go from initial client conversation to a fully scoped, production-ready project brief automatically.",
  },
];

export default function Landing() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            AI-Powered Product Studio
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
            Convert ideas
            <br />
            <span className="text-blue-600">into action</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI Product Studio automates the entire project discovery process —
            from client intake to PRDs, tech specs, and market analysis.
            Powered by Claude AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
            >
              Start a Project
              <span>→</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 shadow-sm"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Stop spending weeks on discovery and documentation.
              Let AI handle the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group bg-white"
              >
                <div className="text-3xl mb-4">{prop.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {prop.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-600 mb-14">Three steps from idea to deliverable</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Submit Intake", desc: "Fill in the project details form. Takes 3 minutes." },
              { step: "2", title: "AI Discovery", desc: "Claude analyzes the market, competitors, and opportunities automatically." },
              { step: "3", title: "Get Deliverables", desc: "Receive PRDs, tech specs, and strategic documents ready to share." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start your first project?
          </h2>
          <p className="text-blue-100 mb-8">
            Submit your intake form and let AI do the discovery work.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-700 font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl"
          >
            Get Started — It&apos;s Free
            <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
