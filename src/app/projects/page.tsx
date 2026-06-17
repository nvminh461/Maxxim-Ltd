"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import Header from "@/components/Header/Header";
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

  // Reveal-on-scroll with stagger
  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>(
      `.${styles.reveal}`,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const parentMap = new Map<Element | null, HTMLElement[]>();

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            if (!parentMap.has(parent)) {
              parentMap.set(parent, []);
            }
            parentMap.get(parent)!.push(entry.target as HTMLElement);
          }
        });

        parentMap.forEach((elements) => {
          elements.forEach((el, index) => {
            el.style.setProperty("--reveal-delay", `${index * 80}ms`);
            requestAnimationFrame(() => {
              el.classList.add(styles.visible);
            });
          });
        });
      },
      { threshold: 0.08 },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [visibleCount]);

  const getCardStyle = (index: number) => {
    const layoutPatterns = [
      styles.cardWide,
      styles.cardTall,
      styles.cardTall,
      styles.cardWide,
      styles.cardSquare,
      styles.cardTall,
      styles.cardSquare,
      styles.cardTall,
    ];
    return layoutPatterns[index % layoutPatterns.length];
  };

  return (
    <div className={styles.page}>
      <Header activePath="/projects" />

      <main>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Portfolio</p>
          <h1>All Projects</h1>
          <p>
            Architectural projects load progressively as you scroll. Focus is placed on
            the precision of physical construction.
          </p>
        </section>

        <section className={styles.gridSection} aria-label="Project list">
          <div className={styles.projectGrid}>
            {visibleProjects.map((project, index) => (
              <Link
                className={[styles.projectCard, getCardStyle(index), styles.reveal].join(" ")}
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
                  <span className={styles.projectCardOverlay} />
                </span>
                <span className={styles.projectMeta}>
                  {project.category} / {project.year} / {project.location}
                </span>
                <span className={styles.projectTitle}>{project.title}</span>
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
