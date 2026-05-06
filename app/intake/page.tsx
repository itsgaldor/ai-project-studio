import IntakeForm from "@/components/IntakeForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Project — AI Product Studio",
  description: "Tell us about your project and we'll build an AI-powered product strategy for you.",
};

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
            New Project
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Tell us about your vision
          </h1>
          <p className="text-zinc-400 text-base max-w-md mx-auto">
            Fill out the form below and our AI will generate a full discovery report,
            PRD, and technical spec within minutes.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
          <IntakeForm />
        </div>
      </div>
    </div>
  );
}
