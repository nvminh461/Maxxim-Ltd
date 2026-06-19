"use client";

import Link from "next/link";
import Header from "@/components/Header/Header";
import { customerJourney, servicesContent } from "@/lib/services-content";
import styles from "../page.module.css";

const serviceIds = ["consultation", "renovation", "lettings"] as const;

export default function ServicesClient() {
  return (
    <div className={styles.page}>
      <Header activePath="/services" />

      <main>
        <section
          className={styles.hero}
          style={{ minHeight: "auto", paddingBottom: 0 }}
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

        <section className={styles.aboutSection}>
          {servicesContent.map((service, index) => (
            <article
              className={styles.contactPanel}
              id={serviceIds[index]}
              key={service.num}
            >
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>{service.subtitle}</p>
                <h2>{service.title}</h2>
                <p>{service.desc}</p>
              </div>
            </article>
          ))}
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
            {customerJourney.map((step) => (
              <div className={styles.aboutPillar} key={step.stage}>
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
