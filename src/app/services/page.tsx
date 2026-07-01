import type { Metadata } from "next";
import ServicesClient from "@/app/services/services-client";
import { getSiteSettings } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services | Maxxim Ltd.",
  description:
    "UK property consultation, renovation, and lettings for overseas buyers and student families.",
};

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  return <ServicesClient settings={settings} />;
}
