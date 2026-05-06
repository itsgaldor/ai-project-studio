"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { IntakeFormData, BudgetRange } from "@/lib/types";

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance & Fintech", "E-commerce & Retail",
  "Education & EdTech", "Real Estate", "Legal", "Marketing & Advertising",
  "Logistics & Supply Chain", "Hospitality & Travel", "Media & Entertainment",
  "Non-profit", "Government", "Other",
];

const BUDGET_OPTIONS: { label: string; value: BudgetRange; description: string }[] = [
  { label: "Starter", value: "< $10k", description: "Under $10,000 — MVP or proof of concept" },
  { label: "Growth", value: "$10k - $25k", description: "$10k – $25k — Full-featured product" },
  { label: "Premium", value: "$25k - $50k", description: "$25k – $50k — Complex, scalable solution" },
  { label: "Enterprise", value: "$50k - $100k", description: "$50k – $100k — Enterprise-grade build" },
  { label: "Custom", value: "> $250k", description: "Let's talk — custom scope & pricing" },
];

type ProjectType = "one_shot" | "retainer";

interface FormState {
  email: string;
  company_name: string;
  website: string;
  industry: string;
  objective: string;
  budget: BudgetRange | "";
  project_type: ProjectType;
}

const INITIAL: FormState = {
  email: "",
  company_name: "",
  website: "",
  industry: "",
  objective: "",
  budget: "",
  project_type: "one_shot",
};

function isValidUrl(value: string): boolean {
  if (!value) return true; // optional
  try {
    const u = new URL(value.startsWith("http") ? value : `https://${value}`);
    return !!u.hostname;
  } catch {
    return false;
  }
}

export default function IntakeForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string>("");

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.company_name.trim()) e.company_name = "Company name is required.";
    if (form.website && !isValidUrl(form.website)) e.website = "Enter a valid URL (e.g. https://example.com).";
    if (!form.industry) e.industry = "Please select an industry.";
    if (!form.objective.trim()) e.objective = "Tell us about your project.";
    else if (form.objective.trim().length < 30) e.objective = "Please describe your project in at least 30 characters.";
    if (!form.budget) e.budget = "Please select a budget range.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerError("");

    // Map simplified form → IntakeFormData
    const payload: IntakeFormData = {
      client_name: form.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      client_email: form.email,
      company_name: form.company_name,
      project_name: `${form.company_name} — AI Product`,
      project_description: form.objective,
      industry: form.industry,
      problem_statement: form.objective,
      target_users: "To be defined during discovery",
      key_features: [],
      platform: "web",
      budget_range: form.budget as BudgetRange,
      timeline_weeks: 12,
      additional_notes: [
        form.website ? `Website: ${form.website}` : "",
        `Project type: ${form.project_type === "one_shot" ? "One-time project" : "Ongoing retainer"}`,
      ].filter(Boolean).join("\n"),
      source: "landing_page",
    };

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Server error (${res.status})`);
      }

      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-3xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-white">You&apos;re in!</h2>
        <p className="text-zinc-400 max-w-sm">
          We&apos;ve received your project details. Redirecting you to the dashboard…
        </p>
        <div className="h-1 w-48 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 animate-[progress_1.8s_linear_forwards] rounded-full" style={{ width: "100%" }} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Contact */}
      <section className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Work email *" error={errors.email}>
            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputCls(!!errors.email)}
            />
          </Field>
          <Field label="Company name *" error={errors.company_name}>
            <input
              type="text"
              placeholder="Acme Inc."
              value={form.company_name}
              onChange={(e) => set("company_name", e.target.value)}
              className={inputCls(!!errors.company_name)}
            />
          </Field>
        </div>
        <Field label="Website" error={errors.website} hint="Optional">
          <input
            type="url"
            placeholder="https://yourcompany.com"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            className={inputCls(!!errors.website)}
          />
        </Field>
      </section>

      <Divider />

      {/* Project */}
      <section className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Project</h3>
        <Field label="Industry *" error={errors.industry}>
          <select
            value={form.industry}
            onChange={(e) => set("industry", e.target.value)}
            className={inputCls(!!errors.industry)}
          >
            <option value="">Select your industry…</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </Field>
        <Field label="What do you want to build? *" error={errors.objective}>
          <textarea
            rows={4}
            placeholder="Describe the problem you're solving, who the users are, and what success looks like…"
            value={form.objective}
            onChange={(e) => set("objective", e.target.value)}
            className={`${inputCls(!!errors.objective)} resize-none`}
          />
        </Field>
      </section>

      <Divider />

      {/* Budget */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Budget</h3>
        {errors.budget && <p className="text-sm text-red-400">{errors.budget}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUDGET_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`relative flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all select-none ${
                form.budget === opt.value
                  ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_0_1px_rgba(99,102,241,0.4)]"
                  : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
              }`}
            >
              <input
                type="radio"
                name="budget"
                value={opt.value}
                checked={form.budget === opt.value}
                onChange={() => set("budget", opt.value as BudgetRange)}
                className="sr-only"
              />
              <span className="font-semibold text-white text-sm">{opt.label}</span>
              <span className="text-xs text-zinc-400">{opt.description}</span>
              {form.budget === opt.value && (
                <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">✓</span>
              )}
            </label>
          ))}
        </div>
      </section>

      <Divider />

      {/* Engagement Type */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Engagement Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            { value: "one_shot", label: "One-time Project", desc: "Defined scope, fixed deliverables, clear end date." },
            { value: "retainer", label: "Ongoing Retainer", desc: "Continuous collaboration, iteration, and support." },
          ] as const).map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all select-none ${
                form.project_type === opt.value
                  ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_0_1px_rgba(99,102,241,0.4)]"
                  : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
              }`}
            >
              <input
                type="radio"
                name="project_type"
                value={opt.value}
                checked={form.project_type === opt.value}
                onChange={() => set("project_type", opt.value)}
                className="sr-only"
              />
              <span className="font-semibold text-white text-sm">{opt.label}</span>
              <span className="text-xs text-zinc-400">{opt.desc}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Server error */}
      {status === "error" && serverError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting…
          </span>
        ) : (
          "Submit Project →"
        )}
      </button>
      <p className="text-center text-xs text-zinc-600">
        No commitment required. We&apos;ll reach out within 24 hours.
      </p>
    </form>
  );
}

// ─── Helpers ──────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl bg-zinc-900 border text-white text-sm placeholder-zinc-600",
    "focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-colors",
    "appearance-none",
    hasError ? "border-red-500/60" : "border-zinc-700 hover:border-zinc-600",
  ].join(" ");
}

function Divider() {
  return <hr className="border-zinc-800" />;
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        {hint && <span className="text-xs text-zinc-600">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
