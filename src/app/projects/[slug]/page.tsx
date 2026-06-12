import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  projects,
  type ProjectRecord,
} from "@/data/projects";
import ProjectAlbum from "./project-album";
import styles from "../projects.module.css";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

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
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main>
        <ProjectHero project={project} />
        <ProjectAlbum images={project.album} title={project.title} />
      </main>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/" aria-label="Maxxim Ltd. home">
        <Image
          alt=""
          className={styles.logoMark}
          height={40}
          priority
          src="/logo.png"
          width={40}
        />
        <span>Maxxim Ltd.</span>
      </Link>
      <nav className={styles.nav} aria-label="Primary navigation">
        <Link href="/">Home</Link>
        <Link className={styles.activeNav} href="/projects">
          Projects
        </Link>
        <Link href="/#about">About</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <Link className={styles.headerCta} href="/#contact">
        Request consultation
      </Link>
    </header>
  );
}

function ProjectHero({ project }: { project: ProjectRecord }) {
  return (
    <section className={styles.detailHero}>
      <div className={styles.detailImage}>
        <Image
          alt={project.alt}
          fill
          priority
          sizes="100vw"
          src={project.cover}
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
