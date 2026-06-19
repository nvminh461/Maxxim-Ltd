import { notFound } from "next/navigation";
import AdminResource from "@/components/Admin/admin-resource";

const sections = new Set([
  "banners",
  "properties",
  "categories",
  "marquee",
  "contacts",
  "settings",
]);

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sections.has(section)) notFound();
  return <AdminResource section={section} />;
}
