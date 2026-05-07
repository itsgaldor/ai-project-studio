import ProjectBoard from "@/components/ProjectBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — AI Product Studio",
  description: "Manage your AI product projects.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Track and manage all your projects.</p>
        </div>
        <ProjectBoard />
      </div>
    </div>
  );
}
