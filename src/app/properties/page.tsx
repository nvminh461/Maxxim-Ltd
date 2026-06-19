import PropertiesClient from "@/app/properties/properties-client";
import { getAllProperties } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await getAllProperties();
  return <PropertiesClient properties={properties} />;
}
