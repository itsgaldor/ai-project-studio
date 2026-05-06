import ProjectsList from "@/components/ProjectsList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — AI Product Studio",
  description: "Manage your AI product projects.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stats bar */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Projects", value: "—", icon: "📁" },
            { label: "In Discovery", value: "—", icon: "🔍" },
            { label: "Active Builds", value: "—", icon: "⚡" },
            { label: "Completed", value: "—", icon: "✓" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 flex items-center gap-3"
            >
              <span className="text-xl">{stat.icon}</span>
              <div>
                <p className="text-xs text-zinc-500">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <ProjectsList />
      </div>
    </div>
  );
}
