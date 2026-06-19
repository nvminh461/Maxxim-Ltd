import type { Metadata } from "next";
import ServicesClient from "@/app/services/services-client";

export const metadata: Metadata = {
  title: "Services | Maxxim Ltd.",
  description:
    "UK property consultation, renovation, and lettings for overseas buyers and student families.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
