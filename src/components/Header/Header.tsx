"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.css";

type HeaderProps = {
  activePath?: "/" | "/properties" | "/services" | "/#about" | "/#contact";
};

export default function Header({ activePath = "/" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
    { href: "/properties", label: "Properties", isAnchor: false },
    { href: "/services", label: "Services", isAnchor: false },
    { href: "/#about", label: "About", isAnchor: true },
    { href: "/#contact", label: "Contact", isAnchor: true },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
        className={[
          styles.header,
          activePath === "/" ? styles.headerHome : "",
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

            const linkContent = (
              <span className={styles.linkTextWrapper}>
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className={styles.activeUnderline}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 22,
                    }}
                  />
                )}
              </span>
            );

            if (link.isAnchor && activePath !== "/") {
              return (
                <Link className={className} href={link.href} key={link.href}>
                  {linkContent}
                </Link>
              );
            }

            if (link.isAnchor) {
              return (
                <a className={className} href={link.href} key={link.href}>
                  {linkContent}
                </a>
              );
            }

            return (
              <Link className={className} href={link.href} key={link.href}>
                {linkContent}
              </Link>
            );
          })}
        </nav>

        <div className={styles.headerRight}>


          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={[styles.menuToggle, menuOpen ? styles.menuToggleOpen : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
          </button>
        </div>
      </motion.header>

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


        </nav>
      </div>
    </>
  );
}
