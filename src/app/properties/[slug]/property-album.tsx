"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { PropertyMedia } from "@/lib/cms-types";
import styles from "../properties.module.css";

export default function PropertyAlbum({
  images,
  title,
}: {
  images: PropertyMedia[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const nextIndex = useMemo(
    () => (activeIndex === null ? 0 : (activeIndex + 1) % images.length),
    [activeIndex, images.length],
  );
  const previousIndex = useMemo(
    () =>
      activeIndex === null
        ? images.length - 1
        : (activeIndex - 1 + images.length) % images.length,
    [activeIndex, images.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    [images[nextIndex], images[previousIndex]].forEach((image) => {
      const preloadImage = new window.Image();
      preloadImage.src = image.url;
    });
  }, [activeIndex, images, nextIndex, previousIndex]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex(nextIndex);
      if (event.key === "ArrowLeft") setActiveIndex(previousIndex);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, nextIndex, previousIndex]);

  return (
    <section className={styles.albumSection}>
      <div className={styles.albumHeader}>
        <p className={styles.eyebrow}>Gallery</p>
        <h2>Property Photo Album</h2>
      </div>

      <div className={styles.albumGrid}>
        {images.map((image, index) => (
          <button
            className={styles.albumTile}
            key={`${image.url}-${index}`}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <Image
              alt={`${title} - ${image.alt}`}
              fill
              priority={index < 2}
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              src={image.url}
            />
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          aria-label={`View image ${(activeIndex ?? 0) + 1} of ${title}`}
          aria-modal="true"
          className={styles.lightbox}
          role="dialog"
        >
          <button
            aria-label="Close album"
            className={styles.closeButton}
            onClick={() => setActiveIndex(null)}
            type="button"
          >
            Close
          </button>
          <button
            aria-label="Previous image"
            className={`${styles.albumNavButton} ${styles.previousButton}`}
            onClick={() => setActiveIndex(previousIndex)}
            type="button"
          >
            &lt;
          </button>
          <div className={styles.lightboxImage}>
            <Image
              alt={`${title} - ${activeImage.alt}`}
              fill
              priority
              sizes="100vw"
              src={activeImage.url}
            />
          </div>
          <button
            aria-label="Next image"
            className={`${styles.albumNavButton} ${styles.nextButton}`}
            onClick={() => setActiveIndex(nextIndex)}
            type="button"
          >
            &gt;
          </button>
          <p className={styles.lightboxCounter}>
            {(activeIndex ?? 0) + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}
