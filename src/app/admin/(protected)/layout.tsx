import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AdminShell from "@/components/Admin/admin-shell";
import { authOptions } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  return <AdminShell email={session.user.email || ""}>{children}</AdminShell>;
}
