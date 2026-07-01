"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.css";

type HeaderProps = {
  activePath?: "/" | "/properties" | "/services" | "/#about" | "/#contact";
};

export default function Header({ activePath = "/" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollY = useRef(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20 && !hasScrolled) {
        setHasScrolled(true);
      }

      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (menuOpen) {
        return;
      }

      if (currentScrollY < 50) {
        setVisible(true);
      } else {
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          setVisible(true);
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen, hasScrolled]);

  const navLinks = [
    { href: "/", label: "Home", isAnchor: false },
    { href: "/services", label: "Services", isAnchor: false },
    { href: "/properties", label: "Properties", isAnchor: false },
    { href: "/#about", label: "About", isAnchor: true },
    { href: "/#contact", label: "Contact", isAnchor: true },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: visible ? 0 : "-100%",
          opacity: visible ? 1 : 0,
        }}
        transition={
          hasScrolled
            ? { duration: 0.3, ease: "easeInOut" }
            : { duration: 2.8, ease: [0.16, 1, 0.3, 1] }
        }
        className={[
          styles.header,
          activePath === "/" && !scrolled ? styles.headerHome : "",
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
