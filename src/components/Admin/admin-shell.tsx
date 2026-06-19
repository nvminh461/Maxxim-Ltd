"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Bảng điều khiển" },
  { href: "/admin/banners", label: "Banner" },
  { href: "/admin/properties", label: "Bất động sản" },
  { href: "/admin/categories", label: "Thành phố" },
  { href: "/admin/marquee", label: "Ảnh marquee" },
  { href: "/admin/contacts", label: "Liên hệ" },
  { href: "/admin/settings", label: "Cấu hình footer" },
];

export default function AdminShell({
  children,
  email,
}: {
  children: ReactNode;
  email: string;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-kicker">Maxxim Ltd.</p>
          <strong>Quản trị nội dung</strong>
        </div>
        <nav>
          {links.map((link) => (
            <Link
              className={
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href))
                  ? "active"
                  : ""
              }
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-account">
          <small>{email}</small>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} type="button">
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
