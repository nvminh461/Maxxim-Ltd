import Image from "next/image";
import Link from "next/link";
import type { SiteSettingsValue } from "@/lib/cms-types";
import styles from "./Footer.module.css";

type FooterProps = {
  settings: SiteSettingsValue;
};

export default function Footer({ settings }: FooterProps) {
  const socialLinks = settings.socialLinks || [];

  return (
    <footer className={styles.footer}>
      <div>
        <Link
          className={styles.logo}
          href="/"
          aria-label={`${settings.companyName} home`}
        >
          {settings.logoUrl ? (
            <Image
              alt=""
              className={styles.logoMark}
              height={40}
              src={settings.logoUrl}
              width={40}
            />
          ) : null}
          <span>{settings.companyName}</span>
        </Link>
        <p className={styles.footerSlogan}>{settings.slogan}</p>
        <p className={styles.footerDescription}>{settings.description}</p>
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
          {settings.address}
          <br />
          {settings.phone}
          <br />
          {settings.email}
        </address>
      </div>
      <div>
        <h2>Quick links</h2>
        <ul>
          <li>
            <Link href="/#about">About</Link>
          </li>
          <li>
            <Link href="/properties">Properties</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
        </ul>
      </div>
      <small className={styles.footerCredit}>
        {settings.copyright} Design by{" "}
        <a href="https://minhnv.id.vn/" rel="noopener noreferrer" target="_blank">
          Hip Nguyen
        </a>
      </small>
    </footer>
  );
}
