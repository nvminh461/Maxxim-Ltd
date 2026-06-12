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
} from "react";
import { featuredProjects } from "@/data/projects";
import styles from "./page.module.css";

type HeroSlide =
  | {
      type: "video";
      src: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
    };

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  image: string;
};

type GalleryImage = {
  alt: string;
  src: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: string;
};

const heroSlides: HeroSlide[] = [
  {
    type: "video",
    src: "/banner.mp4",
  },
  {
    type: "image",
    alt: "Luxury modern villa at dusk",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdFbJOxOsWcTgiAFTpR09mCz64BQeY0rBIImayNFQXO3kq9V8OIlaE0WpM8ddVdryWex3PnARCyihHk4xnh0qQLEY2VnoVOAJvTBwzmAbgGmI9K6JTFzeP29YHswt9DkJheuC5ohFzYsgwaaNwej1GaHQDYDqARROeeuXK9vamrIWz0YEavJUaQhzEmeC2reFzFvhLVevMHPcMidp36FFY5eFRKvWDypkWE_k03xtP2N6LVhD0S4J4d67s4RKAZzZyPwWCf5dMUv74",
  },
  {
    type: "image",
    alt: "Minimal villa with reflection pool",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuARjdzqSBpXbZI2WDGp8k-psEeC0USsN5PR5hidAqiOXPtjNV3HcfON3P1OyuWfRfjomjQc6semvJpRUnqOScgrcEynNfmhqDn8jSrMwu1JrREHPGvRrv_Mzv3QE5eAV17436lG3EdJ-Ljs5f3_P8sRw7CKmRzMiGrffC0H8B0Q_y6LRwzTUe6y-fvQ_ndW0DhTz9JNz8oA3nOaJioeLY4QDxkKDb-GP2rJtdW-sUmoOA7RDyRLusu9eTChgAOwnK8ZueYIh2DL_TDp",
  },
  {
    type: "image",
    alt: "Luxury interior with marble kitchen island",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O",
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Trần Minh Quân",
    role: "CEO tại TechVision",
    quote:
      "Sự tỉ mỉ trong từng chi tiết của ARCHITECTS đã hoàn toàn thuyết phục tôi. Ngôi nhà không chỉ đẹp mà còn mang lại cảm giác bình yên tuyệt đối.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbxydgXFH0jehjvjpbrOlfv0AF7BzMqEpWWuoQoa7gWSkdijNNZEVODWbNsrwYgDW2ffP5YQguH0QdrTgSDi-9IxVsIFYZZyWLNYhtEEPBVIAsaY9DGdDZ_N_ldFq07WvGNc3gsOZJggWSEgOX1Hg87--zaokjjArH22eW2FRdBdU_Pd-Onvix-se0VapsY83Z_ph42gfmKHJW6KuCeiLzjT8IilYjMvRqa7sJ2ybalGE80hwDIbbub7LQEdOh05A0FIrxHnZAbJTJ",
  },
  {
    name: "Nguyễn Thu Thảo",
    role: "Nhà thiết kế thời trang",
    quote:
      "Không gian nội thất do ARCHITECTS thiết kế mang đậm tính nghệ thuật. Tôi cảm nhận được sự tinh tế và am hiểu sâu sắc về phong cách sống.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhOO_XNOpNCCeaTySpdrNNi2bZ_CK1SDdy9bPx5ITQYN4Yf2uBvVmKUl5jr8_eDrn4xKdGgNdihi4KRLW3UqcADN71uauh6CUZVgfpUjyCwMMOChdv3GpMwoEhpSvJeRtPgk01UqCmNoZPUufnp0fWh589eiWgKdn-fD6ikM-IwCA9dZKqTNyBsvLOKKDR5PKkDw_q9uK8IUBaCRj5je1c1izWW125oW_4-S2oecXj82HEaTcsSSWuV6vPjJMVjpxRNeMMxIYW4LtM",
  },
  {
    name: "Phạm Đức Anh",
    role: "Nhà đầu tư BĐS",
    quote:
      "Đúng tiến độ và vượt mong đợi về chất lượng hoàn thiện. Đây là đơn vị thiết kế chuyên nghiệp nhất tôi từng hợp tác.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNSoee7iOY_0hLmBz7H_nL3mcGiAO3DKu9pikvcWL1IHn8179iPSsRQ8bF_RtM3787hqs0riCqCa9-a_Vuop3zSM0qv5u6wNS9ebTOZxPqIyqBDxTGUsQfvyWzOyhLjlig9AmmD10bMbrhrlol5QwzNMZT7fD49YeXMcgEHQrsTxvOVV0SB3tihDWz1a7OlNMgOLqmO63ZFkfAvkhl6FsKs91ccEsKSGFI2eJQ6jU-Pvh2323XY4uJB6RYdijJOKyE7DlWJl237ebp",
  },
];

const galleryImages: GalleryImage[] = [
  {
    alt: "Concrete facade detail",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpwspu5rRlHFxTs7WFNWzt62c5g_4g4hpjR7RxpRQCAXHpFYOl4ex8C2JQDlRPe70AKXbvZ0AC5VXSLNEj397VvFL0FeRaOLEp7ee0Tvo4mZcfVtQbd8psQ8YwhvYlV0nYD0UPMQ_RII9FeL3ED2JDkzurXqxFY5HzqFPAh8XSfcpVGWhTryheTyhiB3gaaAEBmkYDBuP3e5fWMhnNLVKLPbQGhDNNx0dCa6E2QEVwLLVr9SPzQiPBONbmj1IPqIBQO4iZyij7sJ6m",
  },
  {
    alt: "Luxury villa hallway",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfDRTxjiY14vqZftp_JZH1vreZoFK5yVMxjdZybHtdDPSBoKDIjSPrRdCKzzLUpUKMX9kNrgDfOf7so3RlgqO5CxvoeAD6VVMxYm91j04V_0JK6r-kVtF7XDehqpbHeNW2N_ympVYwanleapXU_BBZJwtCMlyKhwUOn7BAYdZLMwMuRbseipaiidTBmgy1GYWoTus9mdhzlTZFZYuK0w_aqaRhylm5547_0ZGvfoCl7XTYrJNOP8_OOORDSn4gsEbwt9c0Y8KUaqGH",
  },
  {
    alt: "Double height living room",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtyEfbi5WO9zDJmLRQAzB1-q9bgRB2fET9H-Dfe2u5ojfkc91PIjz-6r-yacSxONG2BRgQs1a9z_VEZewBdyGZAh4PvsbycJ6Idb5eR3EzLTvzXceL_IhTDq-qR0CKJSimN1GOBDKa8rZBsONF0PR-P1ynR424OsIwFQZ9QxHf2Jrp90Hw73UrdOjIx1KI5gYL8Vf9VsID2XJNo6ycVsWIEht2CacRTC7rKAqy7HxSkvMDbidhAecZovo1T1nOL8dNsFm_5uptqCbE",
  },
  {
    alt: "Sculptural staircase",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJcGF8L34G7v_qllDtdLumDtxrMYiTDGlN4yslWif66dBQyYp0RLYTlklbtdvFIw2VVDsQq0y5DGf2VwXXlCLnn7DHApMOzM-8RW3c3PCmWTpf6sRhsKut7apLUoJHxZ9KsIuaTLgkcIb8xVUCC8HP1rWHdAfhkgkusGcMkauC-pTcos7JfGEvh5I941H6eZvx2MudC-nkPKzQEjxf9k7jc0R1w0eYLSCHiCsFm9ju5ijs1D-N7Vr9Bz2N1wQIAttnaL21eBhI36dt",
  },
];

const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    href: "#",
    icon: "/icons/Facebook.svg.webp",
  },
  {
    label: "YouTube",
    href: "#",
    icon: "/icons/YouTube.svg.webp",
  },
  {
    label: "TikTok",
    href: "#",
    icon: "/icons/Tiktok.svg.png",
  },
  {
    label: "Zalo",
    href: "#",
    icon: "/icons/Zalo.svg.png",
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

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewImage =
    galleryPreview === null ? null : galleryImages[galleryPreview % galleryImages.length];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>(
      `.${styles.reveal}`,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (heroSlides[activeSlide].type === "video") {
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
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [activeSlide]);

  const goToNextSlide = () => {
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
  }, [galleryPreview]);

  const showPreviousGalleryImage = () => {
    setGalleryPreview((current) =>
      current === null
        ? galleryImages.length - 1
        : (current - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const showNextGalleryImage = () => {
    setGalleryPreview((current) =>
      current === null ? 0 : (current + 1) % galleryImages.length,
    );
  };

  return (
    <div className={styles.page}>
      <header className={[styles.header, scrolled ? styles.headerScrolled : ""].join(" ")}>
        <a className={styles.logo} href="#home" aria-label="ARCHITECTS home">
          ARCHITECTS
        </a>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a className={styles.navActive} href="#home">
            Home
          </a>
          <Link href="/projects">Projects</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className={styles.headerCta} href="#contact">
          Yêu cầu tư vấn
        </a>
      </header>

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
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Architecture / Interior / Build</p>
            <h1>THIẾT KẾ KIẾN TRÚC & NỘI THẤT CAO CẤP</h1>
            <p className={styles.heroText}>
              Kiến tạo không gian sống mang dấu ấn riêng, nơi sự sang trọng giao thoa
              cùng công năng tối ưu.
            </p>
            <a className={styles.heroLink} href="#projects">
              Xem dự án
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
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

        <section className={styles.aboutSection} id="about">
          <div className={[styles.aboutImage, styles.reveal].join(" ")}>
            <Image
              alt="Sophisticated architectural office interior"
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx-liMlFDg9CxSrlk8bBaSEKQnivcTyyFvvdmR2rLaZPdbApqZznstyGT-q4B3M7Xkcjo38NXQtCV-I5bI72hJoTxYnhvaHX0tiuiSMCjxR0t3RV0ahMnasslTkuvYcDacLdF8JBqfuPTSSH0LzBha4ePBlgRWzc5FHUkikKL740vjd5gJTJ0U5SS6VQ7RGPNSszazzi0t3sbvPiyrjLyGRwjp7boTifJR7bxAhu_wGu-Uirkax1hJQP0NffmxzisRr5WHARCDgrQm"
            />
          </div>
          <div className={[styles.aboutCopy, styles.reveal].join(" ")}>
            <p className={styles.eyebrow}>Về chúng tôi</p>
            <h2>Định hình phong cách sống thượng lưu qua từng nét vẽ.</h2>
            <p>
              Tại ARCHITECTS, chúng tôi không chỉ xây dựng những ngôi nhà; chúng tôi
              kiến tạo những di sản. Mỗi dự án là một hành trình tìm kiếm sự cân bằng
              hoàn hảo giữa thẩm mỹ đương đại và bản sắc cá nhân của gia chủ.
            </p>
            <p>
              Với đội ngũ kiến trúc sư dày dặn kinh nghiệm, chúng tôi cam kết mang đến
              những giải pháp thiết kế đột phá, sử dụng vật liệu cao cấp và công nghệ thi
              công tiên tiến.
            </p>
            <a className={styles.textLink} href="#contact">
              Tìm hiểu thêm
            </a>
          </div>
        </section>

        <section className={styles.projectsSection} id="projects">
          <div className={[styles.sectionIntro, styles.reveal].join(" ")}>
            <p className={styles.eyebrow}>Selected works</p>
            <h2>Dự Án Nổi Bật</h2>
            <p>Một số công trình tiêu biểu đã thực hiện với sự tâm huyết và tỉ mỉ.</p>
          </div>

          <div className={styles.projectGrid}>
            {featuredProjects.map((project, index) => (
              <Link
                className={[styles.projectCard, styles.reveal].join(" ")}
                href={`/projects/${project.slug}`}
                key={project.slug}
                prefetch={index < 3}
                style={{ transitionDelay: `${(index % 3) * 90}ms` }}
              >
                <div className={styles.projectImage}>
                  <Image
                    alt={project.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    src={project.cover}
                  />
                </div>
                <p>
                  {project.category.toUpperCase()} / {project.year}
                </p>
                <h3>{project.title}</h3>
              </Link>
            ))}
          </div>

          <div className={[styles.centerAction, styles.reveal].join(" ")}>
            <Link className={styles.primaryButton} href="/projects">
              Xem tất cả dự án
            </Link>
          </div>
        </section>

        <section className={styles.testimonialSection}>
          <DraggableMarquee
            speed={34}
            trackClassName={styles.testimonialTrack}
          >
            {testimonials.map((testimonial) => (
              <article className={styles.testimonialCard} key={testimonial.name}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.avatar}>
                    <Image
                      alt={testimonial.name}
                      fill
                      sizes="64px"
                      src={testimonial.image}
                    />
                  </div>
                  <div>
                    <h3>{testimonial.name}</h3>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <blockquote>&quot;{testimonial.quote}&quot;</blockquote>
              </article>
            ))}
          </DraggableMarquee>
        </section>

        <section className={styles.gallerySection} aria-label="Project details">
          <DraggableMarquee
            reverse
            speed={52}
            trackClassName={styles.galleryTrack}
          >
            {galleryImages.map((image, index) => (
              <button
                aria-label={`Xem ảnh ${image.alt}`}
                className={styles.galleryImage}
                key={image.src}
                onClick={() => setGalleryPreview(index)}
                type="button"
              >
                <Image
                  alt={image.alt}
                  draggable={false}
                  fill
                  sizes="520px"
                  src={image.src}
                />
              </button>
            ))}
          </DraggableMarquee>
          {previewImage ? (
            <div
              aria-label={`Xem ảnh ${previewImage.alt}`}
              aria-modal="true"
              className={styles.galleryPreview}
              role="dialog"
            >
              <button
                className={styles.previewClose}
                onClick={() => setGalleryPreview(null)}
                type="button"
              >
                Đóng
              </button>
              <button
                aria-label="Ảnh trước"
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
                aria-label="Ảnh tiếp theo"
                className={`${styles.previewNav} ${styles.previewNext}`}
                onClick={showNextGalleryImage}
                type="button"
              >
                &gt;
              </button>
            </div>
          ) : null}
        </section>

        <section className={styles.contactSection} id="contact">
          <div className={[styles.contactPanel, styles.reveal].join(" ")}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Start a project</p>
              <h2>Đăng Ký Tư Vấn</h2>
              <p>Hãy để chúng tôi cùng bạn xây dựng không gian sống mơ ước.</p>
            </div>
            <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
              <div className={styles.formGrid}>
                <label>
                  <span>Họ và Tên</span>
                  <input placeholder="Nguyễn Văn A" type="text" />
                </label>
                <label>
                  <span>Số điện thoại</span>
                  <input placeholder="0900 000 000" type="tel" />
                </label>
              </div>
              <label>
                <span>Email</span>
                <input placeholder="example@gmail.com" type="email" />
              </label>
              <label>
                <span>Nội dung yêu cầu</span>
                <textarea placeholder="Chia sẻ ý tưởng của bạn..." rows={4} />
              </label>
              <button className={styles.primaryButton} type="submit">
                Gửi thông tin
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <a className={styles.logo} href="#home" aria-label="ARCHITECTS home">
            ARCHITECTS
          </a>
          <p>
            Nơi những giấc mơ kiến trúc trở thành hiện thực với sự hoàn hảo và đẳng cấp
            nhất.
          </p>
          <div className={styles.socials}>
            {socialLinks.map((social) => (
              <a href={social.href} key={social.label} aria-label={social.label}>
                <Image alt="" height={28} src={social.icon} width={28} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2>Liên hệ</h2>
          <address>
            123 Đường Nam Kỳ Khởi Nghĩa, Quận 1, TP. HCM
            <br />
            +84 28 3930 1234
            <br />
            contact@architects.vn
          </address>
        </div>
        <div>
          <h2>Liên kết nhanh</h2>
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
          <small>© 2026 ARCHITECTS. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
