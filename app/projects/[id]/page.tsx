import ProjectDetail from "@/components/ProjectDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Detail — AI Product Studio",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetail projectId={id} />;
}
