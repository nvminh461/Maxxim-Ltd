"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

type HeaderProps = {
  /** Which nav link is currently active */
  activePath?: "/" | "/projects" | "/#about" | "/#contact";
};

export default function Header({ activePath = "/" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/", label: "Home", isAnchor: false },
    { href: "/projects", label: "Projects", isAnchor: false },
    { href: "/#about", label: "About", isAnchor: true },
    { href: "/#contact", label: "Contact", isAnchor: true },
  ];

  return (
    <>
      <header
        className={[
          styles.header,
          scrolled ? styles.headerScrolled : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
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
          {navLinks.map((link) => {
            const isActive =
              activePath === link.href ||
              (activePath === "/" && link.href === "/");
            const className = isActive ? styles.navActive : "";

            if (link.isAnchor && activePath !== "/") {
              return (
                <Link className={className} href={link.href} key={link.href}>
                  {link.label}
                </Link>
              );
            }

            if (link.isAnchor) {
              return (
                <a className={className} href={link.href} key={link.href}>
                  {link.label}
                </a>
              );
            }

            return (
              <Link className={className} href={link.href} key={link.href}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.headerRight}>
          <Link className={styles.headerCta} href="/#contact">
            Request consultation
          </Link>

          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={[
              styles.menuToggle,
              menuOpen ? styles.menuToggleOpen : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={[styles.mobileMenu, menuOpen ? styles.mobileMenuOpen : ""]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const isActive = activePath === link.href;

            if (link.isAnchor && activePath !== "/") {
              return (
                <Link
                  className={isActive ? styles.mobileNavActive : ""}
                  href={link.href}
                  key={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            }

            if (link.isAnchor) {
              return (
                <a
                  className={isActive ? styles.mobileNavActive : ""}
                  href={link.href}
                  key={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                className={isActive ? styles.mobileNavActive : ""}
                href={link.href}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            className={styles.mobileCta}
            href="/#contact"
            onClick={() => setMenuOpen(false)}
          >
            Request consultation
          </Link>
        </nav>
      </div>
    </>
  );
}
