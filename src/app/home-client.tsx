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
import Footer from "@/components/Footer/Footer";
import type { HomeCmsData } from "@/lib/cms-types";
import { formatPrice, listingTypeLabel } from "@/lib/format";
import { servicesContent } from "@/lib/services-content";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import {
  ScrollReveal,
  ScrollRevealContainer,
  ScrollRevealItem,
  zoomInVariants,
} from "@/components/ScrollReveal/ScrollReveal";

const MotionLink = motion.create(Link);

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Lan Nguyen",
    role: "Parent of a UCL student",
    quote:
      "We bought a flat in London without ever visiting the UK. Maxxim guided us through every step — from choosing the area to handling the legal paperwork.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbxydgXFH0jehjvjpbrOlfv0AF7BzMqEpWWuoQoa7gWSkdijNNZEVODWbNsrwYgDW2ffP5YQguH0QdrTgSDi-9IxVsIFYZZyWLNYhtEEPBVIAsaY9DGdDZ_N_ldFq07WvGNc3gsOZJggWSEgOX1Hg87--zaokjjArH22eW2FRdBdU_Pd-Onvix-se0VapsY83Z_ph42gfmKHJW6KuCeiLzjT8IilYjMvRqa7sJ2ybalGE80hwDIbbub7LQEdOh05A0FIrxHnZAbJTJ",
  },
  {
    name: "Ahmed Al-Rashid",
    role: "Property investor, Dubai",
    quote:
      "Maxxim renovated our Manchester apartment and set up Airbnb for the spare rooms. My son uses one bedroom — the other two now generate steady income.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhOO_XNOpNCCeaTySpdrNNi2bZ_CK1SDdy9bPx5ITQYN4Yf2uBvVmKUl5jr8_eDrn4xKdGgNdihi4KRLW3UqcADN71uauh6CUZVgfpUjyCwMMOChdv3GpMwoEhpSvJeRtPgk01UqCmNoZPUufnp0fWh589eiWgKdn-fD6ikM-IwCA9dZKqTNyBsvLOKKDR5PKkDw_q9uK8IUBaCRj5je1c1izWW125oW_4-S2oecXj82HEaTcsSSWuV6vPjJMVjpxRNeMMxIYW4LtM",
  },
  {
    name: "Michael Pham",
    role: "Overseas property owner",
    quote:
      "Having a trusted team on the ground in the UK changed everything. They manage tenants, maintenance, and rent collection — I never worry about the property.",
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
    title: "TRUST",
    subtitle: "Your partner on the ground",
    desc: "We are based in the UK and manage everything locally — so overseas buyers never feel alone in an unfamiliar market.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAx-liMlFDg9CxSrlk8bBaSEKQnivcTyyFvvdmR2rLaZPdbApqZznstyGT-q4B3M7Xkcjo38NXQtCV-I5bI72hJoTxYnhvaHX0tiuiSMCjxR0t3RV0ahMnasslTkuvYcDacLdF8JBqfuPTSSH0LzBha4ePBlgRWzc5FHUkikKL740vjd5gJTJ0U5SS6VQ7RGPNSszazzi0t3sbvPiyrjLyGRwjp7boTifJR7bxAhu_wGu-Uirkax1hJQP0NffmxzisRr5WHARCDgrQm",
  },
  {
    num: "02",
    title: "TRANSPARENCY",
    subtitle: "Clear process, no surprises",
    desc: "From property selection to legal completion, every step is explained in plain language — pricing, timelines, and obligations included.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O",
  },
  {
    num: "03",
    title: "END-TO-END",
    subtitle: "One team, full lifecycle",
    desc: "Buy, renovate, and let — Maxxim stays with you from the first viewing to monthly rental income, without switching providers.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpwspu5rRlHFxTs7WFNWzt62c5g_4g4hpjR7RxpRQCAXHpFYOl4ex8C2JQDlRPe70AKXbvZ0AC5VXSLNEj397VvFL0FeRaOLEp7ee0Tvo4mZcfVtQbd8psQ8YwhvYlV0nYD0UPMQ_RII9FeL3ED2JDkzurXqxFY5HzqFPAh8XSfcpVGWhTryheTyhiB3gaaAEBmkYDBuP3e5fWMhnNLVKLPbQGhDNNx0dCa6E2QEVwLLVr9SPzQiPBONbmj1IPqIBQO4iZyij7sJ6m",
  },
];

const testimonialImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJhc0IYAiBRKojICfbZmMmvy1i1vAtqFshLdy2C-dnNRY3MrTNoZabE4uCvioWe_7Rnxk-pT0zwrmLItzCJ5-NilAwJ0yXEbdsl8uxyDJa_PmtMvKgZKMKwS2n9YaNErL95qGoxBq3vpMhVScHv65jZKvAI88T3GwvAQiOvn_7Pt3AC-KTtPeVctlOCvlPAg1Rl0eXEQbrXIOPnNEIeHk1q7LTSMAuV-DfQ10j_g046msW9SU8XTNKdO8zMYh1qnhaL_PlcJ8qcxAz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUidleh_dFwRrJHuI0aJqBBi1jLZ7yPLwUU2bQlt4iYd64G9Cg7Tfz9eYKR7jS1SQdXEEd10kyvhBR_jP8MDZbzvY4cQ9t_lMBUtjRQTrXYAk8uzl26JctEO2ysIgK-OFtE6q9jUxWdXCaWY-5TQ9AqYp3-XdQRFh9M_D6r1jWlK2aUg1BGlmMqHXZwCaUbnmv7ZRN_KK0YyxWCErKNw6on49ZK6TNMYW7k0zxGSAxkD-bdJ6fSqh3NwsW6Ma8c0xLK-Htcs-xy5I5",
];

const servicePillarImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUidleh_dFwRrJHuI0aJqBBi1jLZ7yPLwUU2bQlt4iYd64G9Cg7Tfz9eYKR7jS1SQdXEEd10kyvhBR_jP8MDZbzvY4cQ9t_lMBUtjRQTrXYAk8uzl26JctEO2ysIgK-OFtE6q9jUxWdXCaWY-5TQ9AqYp3-XdQRFh9M_D6r1jWlK2aUg1BGlmMqHXZwCaUbnmv7ZRN_KK0YyxWCErKNw6on49ZK6TNMYW7k0zxGSAxkD-bdJ6fSqh3NwsW6Ma8c0xLK-Htcs-xy5I5", // lobby
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O", // kitchen
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAx-liMlFDg9CxSrlk8bBaSEKQnivcTyyFvvdmR2rLaZPdbApqZznstyGT-q4B3M7Xkcjo38NXQtCV-I5bI72hJoTxYnhvaHX0tiuiSMCjxR0t3RV0ahMnasslTkuvYcDacLdF8JBqfuPTSSH0LzBha4ePBlgRWzc5FHUkikKL740vjd5gJTJ0U5SS6VQ7RGPNSszazzi0t3sbvPiyrjLyGRwjp7boTifJR7bxAhu_wGu-Uirkax1hJQP0NffmxzisRr5WHARCDgrQm"  // studio
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
      <ScrollReveal className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Renovation showcase</p>
        <h2>Before vs After</h2>
        <p>Drag the slider to see how we transform properties — from dated interiors to rental-ready spaces.</p>
      </ScrollReveal>
      <ScrollReveal
        className={styles.sliderContainer}
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
            alt="Before renovation"
            className={styles.blueprintImage}
            draggable={false}
            fill
            sizes="100vw"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARjdzqSBpXbZI2WDGp8k-psEeC0USsN5PR5hidAqiOXPtjNV3HcfON3P1OyuWfRfjomjQc6semvJpRUnqOScgrcEynNfmhqDn8jSrMwu1JrREHPGvRrv_Mzv3QE5eAV17436lG3EdJ-Ljs5f3_P8sRw7CKmRzMiGrffC0H8B0Q_y6LRwzTUe6y-fvQ_ndW0DhTz9JNz8oA3nOaJioeLY4QDxkKDb-GP2rJtdW-sUmoOA7RDyRLusu9eTChgAOwnK8ZueYIh2DL_TDp"
          />
          <div className={styles.blueprintGridOverlay} />
          <div className={styles.blueprintLabel}>BEFORE</div>
        </div>

        <div
          className={styles.buildSlide}
          style={{
            clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`,
          }}
        >
          <Image
            alt="After renovation"
            className={styles.completedImage}
            draggable={false}
            fill
            sizes="100vw"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARjdzqSBpXbZI2WDGp8k-psEeC0USsN5PR5hidAqiOXPtjNV3HcfON3P1OyuWfRfjomjQc6semvJpRUnqOScgrcEynNfmhqDn8jSrMwu1JrREHPGvRrv_Mzv3QE5eAV17436lG3EdJ-Ljs5f3_P8sRw7CKmRzMiGrffC0H8B0Q_y6LRwzTUe6y-fvQ_ndW0DhTz9JNz8oA3nOaJioeLY4QDxkKDb-GP2rJtdW-sUmoOA7RDyRLusu9eTChgAOwnK8ZueYIh2DL_TDp"
          />
          <div className={styles.buildLabel}>AFTER</div>
        </div>

        <div className={styles.sliderHandle} style={{ left: `${position}%` }}>
          <div className={styles.sliderLine} />
          <div className={styles.sliderButton}>
            <span className={styles.sliderArrow}>&#8592;</span>
            <span className={styles.sliderArrow}>&#8594;</span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function AirbnbCalculator() {
  const [city, setCity] = useState("London");
  const [rooms, setRooms] = useState(2);

  const cityRates: Record<string, number> = {
    London: 145,
    Manchester: 95,
    Birmingham: 80,
    Edinburgh: 105,
    Bristol: 90,
  };

  const rate = cityRates[city] || 100;
  const occupancy = 0.75;
  const monthlyEst = Math.round(rate * rooms * 30 * occupancy);
  const yearlyEst = monthlyEst * 12;

  return (
    <section className={styles.calculatorSection} id="yield-calculator">
      <ScrollReveal className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Monetise Spare Rooms</p>
        <h2>AIRBNB YIELD ESTIMATOR</h2>
        <p>
          Students or parents: if you have spare rooms in your UK property, turn them into passive income.
          Maxxim sets up and fully manages your Airbnb listings on the ground.
        </p>
      </ScrollReveal>

      <ScrollRevealContainer className={styles.calcGrid} staggerDelay={0.15}>
        <ScrollRevealItem className={styles.calcCard}>
          <div className={styles.calcInputs}>
            <label className={styles.calcLabel}>
              <span>Select UK City</span>
              <select
                className={styles.calcSelect}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="London">London</option>
                <option value="Manchester">Manchester</option>
                <option value="Birmingham">Birmingham</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="Bristol">Bristol</option>
              </select>
            </label>

            <label className={styles.calcLabel}>
              <span>Number of Spare Rooms</span>
              <div className={styles.roomButtons}>
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`${styles.roomBtn} ${rooms === num ? styles.roomBtnActive : ""}`}
                    onClick={() => setRooms(num)}
                  >
                    {num} {num === 1 ? "Room" : "Rooms"}
                  </button>
                ))}
              </div>
            </label>
          </div>

          <div className={styles.calcResults}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Est. Monthly Earnings</span>
              <span className={styles.resultValue}>£{monthlyEst.toLocaleString("en-GB")}</span>
            </div>
            <div className={styles.resultDivider} />
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Est. Yearly Yield</span>
              <span className={styles.resultValueSecondary}>£{yearlyEst.toLocaleString("en-GB")} / year</span>
            </div>
            <p className={styles.calcDisclaimer}>
              *Based on a conservative 75% average occupancy rate. Actual results may vary depending on local university semesters.
            </p>
          </div>
        </ScrollRevealItem>

        <ScrollRevealItem className={styles.calcDetails}>
          <h3 className={styles.calcDetailsTitle}>How Maxxim Makes It Easy</h3>
          <p className={styles.calcDetailsIntro}>
            Your child focuses on studying, while we turn empty rooms into rental revenue.
            We handle 100% of the daily operations locally in the UK:
          </p>
          <ul className={styles.calcChecklist}>
            <li>
              <strong>Design & Refurbishment:</strong> We style and furnish the spare rooms to attract high-paying short-term guests.
            </li>
            <li>
              <strong>Airbnb Listing & Marketing:</strong> Professional photography and optimization to keep bookings high.
            </li>
            <li>
              <strong>24/7 Guest Operations:</strong> We manage check-ins, guest inquiries, key handovers, and security vetting.
            </li>
            <li>
              <strong>Professional Housekeeping:</strong> Regular cleaning and laundry between guest stays, keeping your property pristine.
            </li>
          </ul>
          <a href="#contact" className={styles.calcCta}>
            Get a Free Airbnb Strategy Plan &rarr;
          </a>
        </ScrollRevealItem>
      </ScrollRevealContainer>
    </section>
  );
}

function HeroVideo({
  src,
  isActive,
  onEnded,
  videoRef,
}: {
  src: string;
  isActive: boolean;
  onEnded: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const localRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = localRef.current;
    if (!video) return;

    if (isActive) {
      if (videoRef) {
        const writableRef = videoRef as { current: HTMLVideoElement | null };
        writableRef.current = video;
      }
      video.currentTime = 0;
      video.play().catch((err) => {
        console.warn("Autoplay block or playback error:", err);
      });
    } else {
      video.pause();
    }
  }, [isActive, videoRef]);

  return (
    <video
      ref={localRef}
      className={styles.heroMedia}
      muted
      playsInline
      onEnded={onEnded}
      preload="auto"
    >
      <source src={src} type="video/mp4" />
    </video>
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
  const properties = cms.properties;
  const socialLinks = cms.settings.socialLinks;
  const activeHero = heroSlides[activeSlide];
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewImage =
    galleryPreview === null || galleryImages.length === 0
      ? null
      : galleryImages[galleryPreview % galleryImages.length];

  const categories = ["All", ...cms.categories.map((category) => category.name)];

  const filteredProperties = useMemo(() => {
    if (activeCategory === "All") {
      return properties.slice(0, 8);
    }
    return properties.filter((p) => p.city === activeCategory).slice(0, 8);
  }, [activeCategory, properties]);

  // Legacy IntersectionObserver removed in favor of declarative Framer Motion scroll reveals

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

    const enquiryType = data.get("enquiryType") as string;
    const brief = data.get("projectBrief") as string;
    const combinedBrief = `[Enquiry: ${enquiryType}] ${brief}`;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          phone: data.get("phone"),
          email: data.get("email"),
          projectBrief: combinedBrief,
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
                <HeroVideo
                  src={slide.src}
                  isActive={index === activeSlide}
                  onEnded={goToNextSlide}
                  videoRef={videoRef}
                />
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
                  {activeHero.ctaLabel || "View property"}{" "}
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              ) : (
                <a className={styles.heroLink} href="#properties">
                  View properties <span aria-hidden="true">-&gt;</span>
                </a>
              )}
            </div>
          ) : (
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>MAXXIM UK PROPERTY SERVICES</h1>
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
          <ScrollReveal className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Why Maxxim</p>
            <h2>TRUSTED PARTNER FOR OVERSEAS BUYERS</h2>
            <p>
              Buying property in the UK from abroad is a major decision. We provide
              transparent, end-to-end support so you always have someone on the ground.
            </p>
          </ScrollReveal>

          <ScrollRevealContainer className={styles.aboutGrid} staggerDelay={0.15}>
            {aboutPillars.map((pillar) => (
              <ScrollRevealItem className={styles.aboutPillar} key={pillar.num}>
                <div className={styles.pillarBg}>
                  <Image alt={pillar.title} fill sizes="33vw" src={pillar.image} />
                </div>
                <div className={styles.pillarContent}>
                  <span className={styles.pillarNum}>{pillar.num}</span>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <span className={styles.pillarSubtitle}>{pillar.subtitle}</span>
                  <p className={styles.pillarDesc}>{pillar.desc}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealContainer>

        </section>

        {/* Services */}
        <section className={styles.aboutSection} id="services">
          <ScrollReveal className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Our services</p>
            <h2>FROM SEARCH TO RENTAL INCOME</h2>
            <p>
              Three integrated services that follow your journey — whether you are buying
              for your child&apos;s studies or investing from overseas.
            </p>
          </ScrollReveal>
          <ScrollRevealContainer className={styles.aboutGrid} staggerDelay={0.15}>
            {servicesContent.map((service, index) => (
              <MotionLink
                className={styles.aboutPillar}
                href={service.href}
                key={service.num}
                variants={zoomInVariants}
              >
                <div className={styles.pillarBg}>
                  <Image alt={service.title} fill sizes="33vw" src={servicePillarImages[index]} />
                </div>
                <div className={styles.pillarContent}>
                  <span className={styles.pillarNum}>{service.num}</span>
                  <h3 className={styles.pillarTitle}>{service.title}</h3>
                  <span className={styles.pillarSubtitle}>{service.subtitle}</span>
                  <p className={styles.pillarDesc}>{service.desc}</p>
                </div>
              </MotionLink>
            ))}
          </ScrollRevealContainer>
          <ScrollReveal className={styles.centerAction}>
            <Link className={styles.primaryButton} href="/services">
              Learn about our services
            </Link>
          </ScrollReveal>
        </section>

        {/* Airbnb Yield Calculator */}
        <AirbnbCalculator />

        {/* Peace of Mind Section */}
        <section className={styles.trustSection}>
          <ScrollReveal className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Peace of Mind</p>
            <h2>BUYING FROM ABROAD SECURELY</h2>
            <p>
              We understand the anxiety of investing in an unfamiliar market.
              Maxxim operates with strict compliance and transparency protocols to safeguard your assets.
            </p>
          </ScrollReveal>
          <ScrollRevealContainer className={styles.trustGrid} staggerDelay={0.1}>
            <ScrollRevealItem className={styles.trustItem}>
              <h3>100% Local Representation</h3>
              <p>We act as your local representatives in the UK, supervising building projects and coordinating lawyers.</p>
            </ScrollRevealItem>
            <ScrollRevealItem className={styles.trustItem}>
              <h3>Plain Language Contracts</h3>
              <p>Clear, straightforward English agreements with upfront fees. No hidden markups or commission loops.</p>
            </ScrollRevealItem>
            <ScrollRevealItem className={styles.trustItem}>
              <h3>Real-Time Progress Portal</h3>
              <p>Weekly photo/video status updates of all renovations directly to your WhatsApp or email.</p>
            </ScrollRevealItem>
            <ScrollRevealItem className={styles.trustItem}>
              <h3>Compliance Certified</h3>
              <p>All listings meet UK rental compliance, fire safety rules, and local council student letting licenses.</p>
            </ScrollRevealItem>
          </ScrollRevealContainer>
        </section>

        {/* Before/After renovation slider */}
        <ConceptBuildSlider />

        {/* Featured Properties with City Filter */}
        <section className={styles.projectsSection} id="properties">
          <ScrollReveal className={styles.sectionIntro}>
            <p className={styles.eyebrow}>UK listings</p>
            <h2>FEATURED PROPERTIES</h2>
            <p>Hand-picked properties for sale and rent across the UK, near top universities.</p>
          </ScrollReveal>

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

          <ScrollRevealContainer
            className={styles.projectGrid}
            staggerDelay={0.08}
            key={activeCategory}
          >
            {filteredProperties.map((property, index) => (
              <MotionLink
                className={[
                  styles.projectCard,
                  getCardStyle(index),
                ].join(" ")}
                href={`/properties/${property.slug}`}
                key={property.slug}
                prefetch={index < 3}
                variants={zoomInVariants}
                layout
              >
                <div className={styles.projectImage}>
                  <Image
                    alt={property.media[0]?.alt || property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={property.media[0]?.url || ""}
                  />
                  <div className={styles.projectCardOverlay} />
                  <span className={styles.propertyBadge}>
                    {listingTypeLabel(property.listingType)}
                  </span>
                </div>
                <div className={styles.projectCardText}>
                  <p className={styles.projectCardMeta}>
                    {property.city.toUpperCase()}
                  </p>
                  <h3 className={styles.projectCardTitle}>{property.title}</h3>
                  {property.university ? (
                    <p className={styles.projectCardUni}>
                      🎓 Near {property.university}
                    </p>
                  ) : null}
                  <p className={styles.projectCardMeta} style={{ marginTop: "6px" }}>
                    {formatPrice(property.price, property.listingType)} · {property.bedrooms} bed
                  </p>
                </div>
              </MotionLink>
            ))}
          </ScrollRevealContainer>

          <ScrollReveal className={styles.centerAction}>
            <Link className={styles.primaryButton} href="/properties">
              View all properties
            </Link>
          </ScrollReveal>
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
        <section className={styles.gallerySection} aria-label="Property gallery">
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
          <ScrollReveal className={styles.contactPanel}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Start your journey</p>
              <h2>Book A Consultation</h2>
              <p>Tell us about your UK property goals — buying, renovating, or letting.</p>
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
              <div className={styles.formGrid}>
                <label>
                  <span>Email</span>
                  <input name="email" placeholder="example@gmail.com" required type="email" />
                </label>
                <label>
                  <span>Enquiry Type</span>
                  <select name="enquiryType" required className={styles.formSelect}>
                    <option value="Consultation">UK Property Purchase & Consultation</option>
                    <option value="Renovation">Property Refurbishment & Renovation</option>
                    <option value="Airbnb">Airbnb Setup & Spare Room Lettings</option>
                    <option value="Management">Full Property Management</option>
                  </select>
                </label>
              </div>
              <label>
                <span>Your enquiry</span>
                <textarea
                  minLength={10}
                  name="projectBrief"
                  placeholder="Tell us about your property needs..."
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
          </ScrollReveal>
        </section>
      </main>
      <Footer settings={cms.settings} />
    </div>
  );
}
