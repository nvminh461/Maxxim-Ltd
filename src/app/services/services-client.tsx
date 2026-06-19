"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header/Header";
import { customerJourney, servicesContent } from "@/lib/services-content";
import styles from "../page.module.css";

const serviceIds = ["consultation", "renovation", "lettings"] as const;

const serviceImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUidleh_dFwRrJHuI0aJqBBi1jLZ7yPLwUU2bQlt4iYd64G9Cg7Tfz9eYKR7jS1SQdXEEd10kyvhBR_jP8MDZbzvY4cQ9t_lMBUtjRQTrXYAk8uzl26JctEO2ysIgK-OFtE6q9jUxWdXCaWY-5TQ9AqYp3-XdQRFh9M_D6r1jWlK2aUg1BGlmMqHXZwCaUbnmv7ZRN_KK0YyxWCErKNw6on49ZK6TNMYW7k0zxGSAxkD-bdJ6fSqh3NwsW6Ma8c0xLK-Htcs-xy5I5", // lobby
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBettvba4fBk2qTnDxh2fdq7jGVz9wMGbPsJ8nUnRyXAWK5bchxC8qm7NPl8W8y9geS-aYuCaQjS3-yqRlun-GJPT9AZczvp8dydW8pl7_wEOdYOk6gid_aIyypJxAxmMQOOc6VOP9zpCYl_WODzU8IjbQJltL8lzFIfqbrn_UvxjKavwZKENXg_zFk7LRKBMa46umW7wPJGdwLIwAUOwqUQZqt-n1a8-zuG_Z923rXu63NhS8AijuhIzLebXeiGWp732-m9cjhSa8O", // kitchen
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAx-liMlFDg9CxSrlk8bBaSEKQnivcTyyFvvdmR2rLaZPdbApqZznstyGT-q4B3M7Xkcjo38NXQtCV-I5bI72hJoTxYnhvaHX0tiuiSMCjxR0t3RV0ahMnasslTkuvYcDacLdF8JBqfuPTSSH0LzBha4ePBlgRWzc5FHUkikKL740vjd5gJTJ0U5SS6VQ7RGPNSszazzi0t3sbvPiyrjLyGRwjp7boTifJR7bxAhu_wGu-Uirkax1hJQP0NffmxzisRr5WHARCDgrQm"  // studio
];

export default function ServicesClient() {
  return (
    <div className={styles.page}>
      <Header activePath="/services" />

      <main>
        <section
          className={styles.hero}
          style={{
            minHeight: "auto",
            paddingTop: "clamp(128px, 14vw, 180px)",
            paddingBottom: "60px",
            paddingLeft: "var(--side-pad)",
            paddingRight: "var(--side-pad)",
            maxWidth: "1320px",
            margin: "0 auto"
          }}
        >
          <p className={styles.eyebrow}>Our services</p>
          <h1
            className={styles.heroTitle}
            style={{ fontSize: "clamp(2.55rem, 5.8vw, 5.25rem)" }}
          >
            Full UK Property Lifecycle
          </h1>
          <p className={styles.heroSub}>
            Consultation, renovation, and lettings — one trusted partner for overseas
            buyers and their families studying in the UK.
          </p>
        </section>

        <section className={styles.servicesListSection}>
          {servicesContent.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <article
                className={[
                  styles.serviceRow,
                  isEven ? "" : styles.serviceRowReverse,
                ].filter(Boolean).join(" ")}
                id={serviceIds[index]}
                key={service.num}
              >
                <div className={styles.serviceVisual}>
                  <Image
                    src={serviceImages[index]}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className={styles.serviceVisualOverlay} />
                </div>
                <div className={styles.serviceText}>
                  <span className={styles.serviceNum}>{service.num}</span>
                  <p className={styles.serviceSubtitle}>{service.subtitle}</p>
                  <h2>{service.title}</h2>
                  <p className={styles.serviceDesc}>{service.desc}</p>
                  <Link className={styles.textLink} href="/#contact">
                    Inquire about {service.title.toLowerCase()} &rarr;
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {/* Airbnb for Students Section */}
        <section className={styles.aboutSection} style={{ background: "var(--surface-soft)", borderTop: "1px solid var(--line)" }}>
          <div className={styles.calcDetails} style={{ maxWidth: "960px", margin: "0 auto" }}>
            <p className={styles.eyebrow} style={{ textAlign: "center" }}>Airbnb for Students</p>
            <h2 style={{ textAlign: "center", fontFamily: "var(--font-display)", color: "var(--gold)", fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}>
              MONETISE YOUR SPARE BEDROOMS
            </h2>
            <p style={{ textAlign: "center", margin: "16px auto 40px", color: "var(--stone)", maxWidth: "70ch" }}>
              Are you a student living in a UK flat with extra rooms? Maxxim helps you convert unused space into monthly revenue.
              We handle the interior styling, local UK licensing, Airbnb management, and 24/7 guest support.
            </p>
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}>🛋️</div>
                <h3>1. Assess & Refurbish</h3>
                <p>We check your lease compliance, furnish empty rooms to premium photogenic standards, and set up security locks.</p>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}>🛎️</div>
                <h3>2. Setup & Host</h3>
                <p>We publish optimized listings on Airbnb, screen guests to verify ID, and manage check-ins and handovers.</p>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}>🧹</div>
                <h3>3. Clean & Maintain</h3>
                <p>Professional housekeeping cleans rooms and provides fresh linens after every guest. Zero effort for you.</p>
              </div>
            </div>
            <div className={styles.centerAction} style={{ marginTop: "40px" }}>
              <Link className={styles.primaryButton} href="/#yield-calculator">
                Calculate your Airbnb yield
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.aboutSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Customer journey</p>
            <h2>HOW WE WORK WITH YOU</h2>
            <p>
              Whether you are a parent buying near your child&apos;s university or a
              student looking to monetise spare rooms, Maxxim supports every stage.
            </p>
          </div>
          <div className={styles.aboutGrid}>
            {customerJourney.map((step, index) => (
              <div className={styles.aboutPillar} key={step.stage}>
                <div className={styles.pillarBg}>
                  <Image alt={step.stage} fill sizes="33vw" src={serviceImages[index]} />
                </div>
                <div className={styles.pillarOverlay} />
                <div className={styles.pillarContent}>
                  <span className={styles.pillarNum}>{step.service}</span>
                  <h3 className={styles.pillarTitle}>{step.stage}</h3>
                  <span className={styles.pillarSubtitle}>{step.audience}</span>
                  <p className={styles.pillarDesc}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.centerAction}>
            <Link className={styles.primaryButton} href="/#contact">
              Get in touch
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
