"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Children,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import Header from "@/components/Header/Header";
import type { HomeCmsData } from "@/lib/cms-types";
import styles from "./page.module.css";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Daniel Tran",
    role: "CEO at TechVision",
    quote:
      "Maxxim Ltd. won my trust through precision in every detail. The home is not only beautiful, it feels calm, complete, and deeply personal.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbxydgXFH0jehjvjpbrOlfv0AF7BzMqEpWWuoQoa7gWSkdijNNZEVODWbNsrwYgDW2ffP5YQguH0QdrTgSDi-9IxVsIFYZZyWLNYhtEEPBVIAsaY9DGdDZ_N_ldFq07WvGNc3gsOZJggWSEgOX1Hg87--zaokjjArH22eW2FRdBdU_Pd-Onvix-se0VapsY83Z_ph42gfmKHJW6KuCeiLzjT8IilYjMvRqa7sJ2ybalGE80hwDIbbub7LQEdOh05A0FIrxHnZAbJTJ",
  },
  {
    name: "Sophia Nguyen",
    role: "Fashion designer",
    quote:
      "The interiors feel artistic without becoming impractical. I could sense a real understanding of lifestyle, materials, and atmosphere.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhOO_XNOpNCCeaTySpdrNNi2bZ_CK1SDdy9bPx5ITQYN4Yf2uBvVmKUl5jr8_eDrn4xKdGgNdihi4KRLW3UqcADN71uauh6CUZVgfpUjyCwMMOChdv3GpMwoEhpSvJeRtPgk01UqCmNoZPUufnp0fWh589eiWgKdn-fD6ikM-IwCA9dZKqTNyBsvLOKKDR5PKkDw_q9uK8IUBaCRj5je1c1izWW125oW_4-S2oecXj82HEaTcsSSWuV6vPjJMVjpxRNeMMxIYW4LtM",
  },
  {
    name: "Michael Pham",
    role: "Real estate investor",
    quote:
      "The team delivered on schedule and exceeded my expectations for finish quality. They are one of the most professional partners I have worked with.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNSoee7iOY_0hLmBz7H_nL3mcGiAO3DKu9pikvcWL1IHn8179iPSsRQ8bF_RtM3787hqs0riCqCa9-a_Vuop3zSM0qv5u6wNS9ebTOZxPqIyqBDxTGUsQfvyWzOyhLjlig9AmmD10bMbrhrlol5QwzNMZT7fD49YeXMcgEHQrsTxvOVV0SB3tihDWz1a7OlNMgOLqmO63ZFkfAvkhl6FsKs91ccEsKSGFI2eJQ6jU-Pvh2323XY4uJB6RYdijJOKyE7DlWJl237ebp",
  },
];

const normalizeOffset = (value: number, width: number) => {
  if (width <= 0) {
    return 0;
  }

  return ((value % width) + width) % width;
};

function DraggableMarquee({
  children,
  className = "",
  trackClassName = "",
  speed = 40,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  speed?: number;
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(0);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const pausedRef = useRef(false);
  const capturedRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const items = Children.toArray(children);

  const applyTransform = () => {
    if (!trackRef.current) {
      return;
    }

    trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  };

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const measure = () => {
      widthRef.current = track.scrollWidth / 2;
      offsetRef.current = normalizeOffset(offsetRef.current, widthRef.current);
      applyTransform();
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    let frame = 0;

    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const deltaSeconds = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!draggingRef.current && !pausedRef.current && widthRef.current > 0) {
        const direction = reverse ? -1 : 1;
        offsetRef.current = normalizeOffset(
          offsetRef.current + direction * speed * deltaSeconds,
          widthRef.current,
        );
        applyTransform();
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [reverse, speed]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = event.clientX;
    lastXRef.current = event.clientX;
    capturedRef.current = false;
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || widthRef.current <= 0) {
      return;
    }

    event.preventDefault();
    const delta = event.clientX - lastXRef.current;
    movedRef.current = movedRef.current || Math.abs(event.clientX - startXRef.current) > 6;

    if (movedRef.current && !capturedRef.current) {
      event.currentTarget.setPointerCapture(event.pointerId);
      capturedRef.current = true;
    }

    lastXRef.current = event.clientX;
    offsetRef.current = normalizeOffset(offsetRef.current - delta, widthRef.current);
    applyTransform();
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!movedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    movedRef.current = false;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) {
      return;
    }

    draggingRef.current = false;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    capturedRef.current = false;
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      pausedRef.current = true;
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      pausedRef.current = false;
    }

    if (!capturedRef.current) {
      stopDragging(event);
    }
  };

  return (
    <div
      className={[styles.marqueeViewport, dragging ? styles.dragging : "", className]
        .filter(Boolean)
        .join(" ")}
      onPointerCancel={stopDragging}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onClickCapture={handleClickCapture}
      onDragStart={(event) => event.preventDefault()}
      role="presentation"
    >
      <div
        className={[styles.marqueeTrack, trackClassName].filter(Boolean).join(" ")}
        ref={trackRef}
      >
        {(["a", "b"] as const).map((setName) => (
          <div className={styles.marqueeSet} key={setName}>
            {items.map((child, index) => (
              <div className={styles.marqueeItem} key={`${setName}-${index}`}>
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const aboutPillars = [
  {
    num: "01",
    title: "ARCHITECTURE",
    subtitle: "Sleek Monolithic Design",
    desc: "Bespoke structural forms built with precision alignment, natural materials, and quiet luxury.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAx-liMlFDg9CxSrlk8bBaSEKQnivcTyyFvvdmR2rLaZPdbApqZznstyGT-q4B3M7Xkcjo38NXQtCV-I5bI72hJoTxYnhvaHX0tiuiSMCjxR0t3RV0ahMnasslTkuvYcDacLdF8JBqfuPTSSH0LzBha4ePBlgRWzc5FHUkikKL740vjd5gJTJ0U5SS6VQ7RGPNSszazzi0t3sbvPiyrjLyGRwjp7boTifJR7bxAhu_wGu-Uirkax1hJQP0NffmxzisRr5WHARCDgrQm",
  },
  {
    num: "02",
    title: "INTERIORS",
    subtitle: "Tactile Atmosphere",
    desc: "Curated stone slabs, brushed metals, and custom cabinetry tailored to private living.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O",
  },
  {
    num: "03",
    title: "CRAFT",
    subtitle: "Enduring Build Quality",
    desc: "Meticulous construction detailing, raw textured concrete, and solid timber structures.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpwspu5rRlHFxTs7WFNWzt62c5g_4g4hpjR7RxpRQCAXHpFYOl4ex8C2JQDlRPe70AKXbvZ0AC5VXSLNEj397VvFL0FeRaOLEp7ee0Tvo4mZcfVtQbd8psQ8YwhvYlV0nYD0UPMQ_RII9FeL3ED2JDkzurXqxFY5HzqFPAh8XSfcpVGWhTryheTyhiB3gaaAEBmkYDBuP3e5fWMhnNLVKLPbQGhDNNx0dCa6E2QEVwLLVr9SPzQiPBONbmj1IPqIBQO4iZyij7sJ6m",
  },
];

const testimonialImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJhc0IYAiBRKojICfbZmMmvy1i1vAtqFshLdy2C-dnNRY3MrTNoZabE4uCvioWe_7Rnxk-pT0zwrmLItzCJ5-NilAwJ0yXEbdsl8uxyDJa_PmtMvKgZKMKwS2n9YaNErL95qGoxBq3vpMhVScHv65jZKvAI88T3GwvAQiOvn_7Pt3AC-KTtPeVctlOCvlPAg1Rl0eXEQbrXIOPnNEIeHk1q7LTSMAuV-DfQ10j_g046msW9SU8XTNKdO8zMYh1qnhaL_PlcJ8qcxAz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUidleh_dFwRrJHuI0aJqBBi1jLZ7yPLwUU2bQlt4iYd64G9Cg7Tfz9eYKR7jS1SQdXEEd10kyvhBR_jP8MDZbzvY4cQ9t_lMBUtjRQTrXYAk8uzl26JctEO2ysIgK-OFtE6q9jUxWdXCaWY-5TQ9AqYp3-XdQRFh9M_D6r1jWlK2aUg1BGlmMqHXZwCaUbnmv7ZRN_KK0YyxWCErKNw6on49ZK6TNMYW7k0zxGSAxkD-bdJ6fSqh3NwsW6Ma8c0xLK-Htcs-xy5I5",
];

function ConceptBuildSlider() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length > 0) {
      handleMove(event.touches[0].clientX);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1 || isDragging.current) {
      handleMove(event.clientX);
    }
  };

  const handleStartDrag = () => {
    isDragging.current = true;
  };

  const handleStopDrag = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const stopDrag = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  return (
    <section className={styles.sliderSection}>
      <div className={[styles.sectionIntro, styles.reveal].join(" ")}>
        <p className={styles.eyebrow}>Concept to execution</p>
        <h2>Vision vs Reality</h2>
        <p>Drag the slider to transition between our structural layout blueprint and the completed luxury build.</p>
      </div>
      <div
        className={[styles.sliderContainer, styles.reveal].join(" ")}
        onMouseDown={handleStartDrag}
        onMouseLeave={handleStopDrag}
        onMouseMove={handleMouseMove}
        onMouseUp={handleStopDrag}
        onTouchMove={handleTouchMove}
        onTouchStart={handleStartDrag}
        ref={containerRef}
      >
        <div className={styles.conceptSlide}>
          <Image
            alt="Concept Blueprint"
            className={styles.blueprintImage}
            draggable={false}
            fill
            sizes="100vw"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARjdzqSBpXbZI2WDGp8k-psEeC0USsN5PR5hidAqiOXPtjNV3HcfON3P1OyuWfRfjomjQc6semvJpRUnqOScgrcEynNfmhqDn8jSrMwu1JrREHPGvRrv_Mzv3QE5eAV17436lG3EdJ-Ljs5f3_P8sRw7CKmRzMiGrffC0H8B0Q_y6LRwzTUe6y-fvQ_ndW0DhTz9JNz8oA3nOaJioeLY4QDxkKDb-GP2rJtdW-sUmoOA7RDyRLusu9eTChgAOwnK8ZueYIh2DL_TDp"
          />
          <div className={styles.blueprintGridOverlay} />
          <div className={styles.blueprintLabel}>CONCEPT SCHEMA</div>
        </div>

        <div
          className={styles.buildSlide}
          style={{
            clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`,
          }}
        >
          <Image
            alt="Completed Build"
            className={styles.completedImage}
            draggable={false}
            fill
            sizes="100vw"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARjdzqSBpXbZI2WDGp8k-psEeC0USsN5PR5hidAqiOXPtjNV3HcfON3P1OyuWfRfjomjQc6semvJpRUnqOScgrcEynNfmhqDn8jSrMwu1JrREHPGvRrv_Mzv3QE5eAV17436lG3EdJ-Ljs5f3_P8sRw7CKmRzMiGrffC0H8B0Q_y6LRwzTUe6y-fvQ_ndW0DhTz9JNz8oA3nOaJioeLY4QDxkKDb-GP2rJtdW-sUmoOA7RDyRLusu9eTChgAOwnK8ZueYIh2DL_TDp"
          />
          <div className={styles.buildLabel}>COMPLETED RESIDENCE</div>
        </div>

        <div className={styles.sliderHandle} style={{ left: `${position}%` }}>
          <div className={styles.sliderLine} />
          <div className={styles.sliderButton}>
            <span className={styles.sliderArrow}>&#8592;</span>
            <span className={styles.sliderArrow}>&#8594;</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeClient({ cms }: { cms: HomeCmsData }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [galleryPreview, setGalleryPreview] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [contactStatus, setContactStatus] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const heroSlides = cms.banners;
  const galleryImages = cms.marquee;
  const projects = cms.projects;
  const socialLinks = cms.settings.socialLinks;
  const activeHero = heroSlides[activeSlide];
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewImage =
    galleryPreview === null || galleryImages.length === 0
      ? null
      : galleryImages[galleryPreview % galleryImages.length];

  const categories = ["All", ...cms.categories.map((category) => category.name)];

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") {
      return projects.slice(0, 8); // show top 8
    }
    return projects.filter((p) => p.category === activeCategory).slice(0, 8);
  }, [activeCategory, projects]);

  // Reveal-on-scroll with stagger
  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>(
      `.${styles.reveal}`,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        // Group by their parent to calculate stagger within the same container
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
            // Small delay to let the CSS variable take effect
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
  }, [activeCategory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!activeHero) {
      return;
    }

    if (activeHero.type === "video") {
      const video = videoRef.current;
      let ignorePlaybackError = false;
      let fallbackTimer = 0;

      if (video) {
        video.currentTime = 0;
        video
          .play()
          .catch(() => {
            if (ignorePlaybackError) {
              return;
            }

            fallbackTimer = window.setTimeout(() => {
              setActiveSlide((current) => (current + 1) % heroSlides.length);
            }, 900);
          });
      }

      return () => {
        ignorePlaybackError = true;
        window.clearTimeout(fallbackTimer);
      };
    }

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [activeHero, heroSlides.length]);

  const goToNextSlide = () => {
    if (heroSlides.length === 0) return;
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  useEffect(() => {
    if (galleryPreview === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setGalleryPreview(null);
      }

      if (event.key === "ArrowRight") {
        setGalleryPreview((current) =>
          current === null ? 0 : (current + 1) % galleryImages.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setGalleryPreview((current) =>
          current === null
            ? galleryImages.length - 1
            : (current - 1 + galleryImages.length) % galleryImages.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [galleryImages.length, galleryPreview]);

  const showPreviousGalleryImage = () => {
    if (galleryImages.length === 0) return;
    setGalleryPreview((current) =>
      current === null
        ? galleryImages.length - 1
        : (current - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const showNextGalleryImage = () => {
    if (galleryImages.length === 0) return;
    setGalleryPreview((current) =>
      current === null ? 0 : (current + 1) % galleryImages.length,
    );
  };

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

  const submitContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactSubmitting(true);
    setContactStatus("");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          phone: data.get("phone"),
          email: data.get("email"),
          projectBrief: data.get("projectBrief"),
        }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      setContactStatus(result.message || result.error || "Unable to send your request.");
      if (response.ok) form.reset();
    } catch {
      setContactStatus("Unable to send your request. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header activePath="/" />

      <main>
        <section className={styles.hero} id="home">
          <div className={styles.heroShade} />
          {heroSlides.map((slide, index) => (
            <div
              className={[
                styles.heroSlide,
                index === activeSlide ? styles.heroSlideActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={`${slide.type}-${slide.src}`}
            >
              {slide.type === "video" ? (
                <video
                  autoPlay
                  className={styles.heroMedia}
                  muted
                  onEnded={goToNextSlide}
                  playsInline
                  preload="auto"
                  ref={index === 0 ? videoRef : undefined}
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  alt={slide.alt}
                  className={styles.heroMedia}
                  fill
                  priority={index === 1}
                  sizes="100vw"
                  src={slide.src}
                />
              )}
            </div>
          ))}
          {activeHero ? (
            <div className={styles.heroContent}>
              <span className={styles.heroNumber}>
                0{activeSlide + 1} / 0{heroSlides.length}
              </span>
              <h1 className={styles.heroTitle}>{activeHero.title}</h1>
              <p className={styles.heroSub}>{activeHero.subtitle}</p>
              {activeHero.link ? (
                <Link className={styles.heroLink} href={activeHero.link}>
                  {activeHero.ctaLabel || "Explore Project"}{" "}
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              ) : (
                <a className={styles.heroLink} href="#projects">
                  View selected works <span aria-hidden="true">-&gt;</span>
                </a>
              )}
            </div>
          ) : (
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>MAXXIM ARCHITECTURE & BUILD</h1>
            </div>
          )}
          <div className={styles.slideDots} aria-label="Slide controls">
            {heroSlides.map((slide, index) => (
              <button
                aria-label={`Go to ${slide.type} slide ${index + 1}`}
                className={index === activeSlide ? styles.slideDotActive : ""}
                key={`${slide.type}-dot-${index}`}
                onClick={() => setActiveSlide(index)}
                type="button"
              />
            ))}
          </div>
        </section>

        {/* About Section - Principles Collage */}
        <section className={styles.aboutSection} id="about">
          <div className={[styles.sectionIntro, styles.reveal].join(" ")}>
            <p className={styles.eyebrow}>Our philosophy</p>
            <h2>CREATIVE DESIGN & RESOLUTE CRAFT</h2>
            <p>
              We craft monolithic spaces that balance structural precision, tactile
              interior materials, and visual atmosphere.
            </p>
          </div>

          <div className={styles.aboutGrid}>
            {aboutPillars.map((pillar) => (
              <div className={styles.aboutPillar} key={pillar.num}>
                <div className={styles.pillarBg}>
                  <Image alt={pillar.title} fill sizes="33vw" src={pillar.image} />
                </div>
                <div className={styles.pillarOverlay} />
                <div className={styles.pillarContent}>
                  <span className={styles.pillarNum}>{pillar.num}</span>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <span className={styles.pillarSubtitle}>{pillar.subtitle}</span>
                  <p className={styles.pillarDesc}>{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Vision vs Reality Spotlight Section */}
        <ConceptBuildSlider />

        {/* Selected Projects with Category Filter & Asymmetrical Layout */}
        <section className={styles.projectsSection} id="projects">
          <div className={[styles.sectionIntro, styles.reveal].join(" ")}>
            <p className={styles.eyebrow}>Selected works</p>
            <h2>FEATURED PROJECTS</h2>
            <p>A curated view of our completed architectural works and custom spaces.</p>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <button
                className={[
                  styles.filterBtn,
                  activeCategory === cat ? styles.filterBtnActive : "",
                ].join(" ")}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.projectGrid}>
            {filteredProjects.map((project, index) => (
              <Link
                className={[
                  styles.projectCard,
                  getCardStyle(index),
                  styles.reveal,
                ].join(" ")}
                href={`/projects/${project.slug}`}
                key={project.slug}
                prefetch={index < 3}
              >
                <div className={styles.projectImage}>
                  <Image
                    alt={project.media[0]?.alt || project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={project.media[0]?.url || ""}
                  />
                  <div className={styles.projectCardOverlay} />
                </div>
                <div className={styles.projectCardText}>
                  <p className={styles.projectCardMeta}>
                    {project.category.toUpperCase()} / {project.year}
                  </p>
                  <h3 className={styles.projectCardTitle}>{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className={[styles.centerAction, styles.reveal].join(" ")}>
            <Link className={styles.primaryButton} href="/projects">
              View all projects
            </Link>
          </div>
        </section>

        {/* Visual testimonial slider */}
        <section className={styles.testimonialSection}>
          <div className={styles.testimonialContainer}>
            <div className={styles.testimonialVisual}>
              {testimonialImages.map((imgSrc, idx) => (
                <div
                  className={[
                    styles.testimonialBgSlide,
                    idx === activeTestimonial ? styles.bgActive : "",
                  ].join(" ")}
                  key={idx}
                >
                  <Image
                    alt="Completed Client Home"
                    className={styles.testimonialBgImage}
                    fill
                    sizes="60vw"
                    src={imgSrc}
                  />
                </div>
              ))}
              <div className={styles.testimonialVisualOverlay} />
            </div>

            <div className={styles.testimonialContentPanel}>
              <p className={styles.eyebrow}>Client testimonials</p>
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}>
                CLIENT TRUST
              </h2>

              <div className={styles.testimonialQuoteBlock}>
                <blockquote>
                  &quot;{testimonials[activeTestimonial].quote}&quot;
                </blockquote>

                <div className={styles.testimonialClientMeta}>
                  <div className={styles.testimonialClientAvatar}>
                    <Image
                      alt={testimonials[activeTestimonial].name}
                      fill
                      sizes="48px"
                      src={testimonials[activeTestimonial].image}
                    />
                  </div>
                  <div>
                    <h3>{testimonials[activeTestimonial].name}</h3>
                    <p>{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialNavControls}>
                {testimonials.map((_, idx) => (
                  <button
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={[
                      styles.testimonialDot,
                      idx === activeTestimonial ? styles.dotActive : "",
                    ].join(" ")}
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {galleryImages.length > 0 ? (
        <section className={styles.gallerySection} aria-label="Project details">
          <DraggableMarquee reverse speed={52} trackClassName={styles.galleryTrack}>
            {galleryImages.map((image, index) => (
              <button
                aria-label={`Preview ${image.alt}`}
                className={styles.galleryImage}
                key={image.src}
                onClick={() => setGalleryPreview(index)}
                type="button"
              >
                <Image
                  alt={image.alt}
                  draggable={false}
                  fill
                  sizes="560px"
                  src={image.src}
                />
              </button>
            ))}
          </DraggableMarquee>
          {previewImage ? (
            <div
              aria-label={`Preview ${previewImage.alt}`}
              aria-modal="true"
              className={styles.galleryPreview}
              role="dialog"
            >
              <button
                className={styles.previewClose}
                onClick={() => setGalleryPreview(null)}
                type="button"
              >
                Close
              </button>
              <button
                aria-label="Previous image"
                className={`${styles.previewNav} ${styles.previewPrevious}`}
                onClick={showPreviousGalleryImage}
                type="button"
              >
                &lt;
              </button>
              <div className={styles.previewImage}>
                <Image
                  alt={previewImage.alt}
                  fill
                  priority
                  sizes="100vw"
                  src={previewImage.src}
                />
              </div>
              <button
                aria-label="Next image"
                className={`${styles.previewNav} ${styles.previewNext}`}
                onClick={showNextGalleryImage}
                type="button"
              >
                &gt;
              </button>
              <p className={styles.lightboxCounter}>
                {(galleryPreview ?? 0) + 1} / {galleryImages.length}
              </p>
            </div>
          ) : null}
        </section>
        ) : null}

        <section className={styles.contactSection} id="contact">
          <div className={[styles.contactPanel, styles.reveal].join(" ")}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Start a project</p>
              <h2>Book A Consultation</h2>
              <p>Let us help you shape the space you have been imagining.</p>
            </div>
            <form className={styles.form} onSubmit={submitContact}>
              <div className={styles.formGrid}>
                <label>
                  <span>Full name</span>
                  <input name="fullName" placeholder="Alex Nguyen" required type="text" />
                </label>
                <label>
                  <span>Phone number</span>
                  <input name="phone" placeholder="0900 000 000" required type="tel" />
                </label>
              </div>
              <label>
                <span>Email</span>
                <input name="email" placeholder="example@gmail.com" required type="email" />
              </label>
              <label>
                <span>Project brief</span>
                <textarea
                  minLength={10}
                  name="projectBrief"
                  placeholder="Tell us about your idea..."
                  required
                  rows={4}
                />
              </label>
              <button
                className={styles.primaryButton}
                disabled={contactSubmitting}
                type="submit"
              >
                {contactSubmitting ? "Sending..." : "Send request"}
              </button>
              {contactStatus ? <p aria-live="polite">{contactStatus}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <a
            className={styles.logo}
            href="#home"
            aria-label={`${cms.settings.companyName} home`}
          >
            {cms.settings.logoUrl ? (
              <Image
                alt=""
                className={styles.logoMark}
                height={40}
                src={cms.settings.logoUrl}
                width={40}
              />
            ) : null}
            <span>{cms.settings.companyName}</span>
          </a>
          <p className={styles.footerSlogan}>{cms.settings.slogan}</p>
          <p className={styles.footerDescription}>{cms.settings.description}</p>
          <div className={styles.socials}>
            {socialLinks.map((social) => (
              <a href={social.href} key={social.label} aria-label={social.label}>
                <Image alt="" height={28} src={social.icon} width={28} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2>Contact</h2>
          <address>
            {cms.settings.address}
            <br />
            {cms.settings.phone}
            <br />
            {cms.settings.email}
          </address>
        </div>
        <div>
          <h2>Quick links</h2>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
        <small className={styles.footerCredit}>
          {cms.settings.copyright} Design by{" "}
          <a href="https://minhnv.id.vn/" rel="noopener noreferrer" target="_blank">
            Hip Nguyen
          </a>
        </small>
      </footer>
    </div>
  );
}
