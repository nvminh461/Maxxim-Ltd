"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import styles from "./projects.module.css";

const batchSize = 6;

export default function ProjectsPage() {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const visibleProjects = useMemo(
    () => projects.slice(0, visibleCount),
    [visibleCount],
  );
  const hasMore = visibleCount < projects.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + batchSize, projects.length),
          );
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Portfolio</p>
          <h1>All Projects</h1>
          <p>
            Projects load progressively as you scroll, keeping the first visit fast
            while still giving you access to the full portfolio.
          </p>
        </section>

        <section className={styles.gridSection} aria-label="Project list">
          <div className={styles.projectGrid}>
            {visibleProjects.map((project, index) => (
              <Link
                className={styles.projectCard}
                href={`/projects/${project.slug}`}
                key={project.slug}
                prefetch={index < 6}
              >
                <span className={styles.projectImage}>
                  <Image
                    alt={project.alt}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    src={project.cover}
                  />
                </span>
                <span className={styles.projectMeta}>
                  {project.category} / {project.year} / {project.location}
                </span>
                <span className={styles.projectTitle}>{project.title}</span>
                <span className={styles.projectSummary}>{project.summary}</span>
              </Link>
            ))}
          </div>

          <div className={styles.loadState} ref={sentinelRef}>
            {hasMore ? "Loading more projects..." : "All projects are visible."}
          </div>
        </section>
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
