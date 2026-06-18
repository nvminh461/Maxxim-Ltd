import ProjectsClient from "@/app/projects/projects-client";
import { getAllProjects } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectsClient projects={projects} />;
}
