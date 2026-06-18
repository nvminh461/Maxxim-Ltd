import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header/Header";
import { getProjectBySlugFromCms } from "@/lib/cms-data";
import type { ProjectValue } from "@/lib/cms-types";
import ProjectAlbum from "./project-album";
import styles from "../projects.module.css";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugFromCms(slug);

  if (!project) {
    return {
      title: "Project not found | Maxxim Ltd.",
    };
  }

  return {
    title: `${project.title} | Maxxim Ltd.`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugFromCms(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <Header activePath="/projects" />

      <main>
        <ProjectHero project={project} />
        <ProjectAlbum images={project.media.slice(1)} title={project.title} />
      </main>
    </div>
  );
}

function ProjectHero({ project }: { project: ProjectValue }) {
  return (
    <section className={styles.detailHero}>
      <div className={styles.detailImage}>
        <Image
          alt={project.media[0]?.alt || project.title}
          fill
          priority
          sizes="100vw"
          src={project.media[0]?.url || ""}
        />
      </div>
      <div className={styles.detailOverlay} />
      <div className={styles.detailIntro}>
        <Link className={styles.backLink} href="/projects">
          &lt;- All projects
        </Link>
        <p className={styles.eyebrow}>
          {project.category} / {project.year} / {project.location}
        </p>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <dl className={styles.projectFacts}>
          <div>
            <dt>Area</dt>
            <dd>{project.area}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
