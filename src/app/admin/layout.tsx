import type { ReactNode } from "react";
import "./admin.css";

export const metadata = {
  title: "CMS Maxxim Ltd.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
