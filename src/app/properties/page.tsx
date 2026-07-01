import PropertiesClient from "@/app/properties/properties-client";
import { getAllProperties, getSiteSettings } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const [properties, settings] = await Promise.all([
    getAllProperties(),
    getSiteSettings(),
  ]);
  return <PropertiesClient properties={properties} settings={settings} />;
}
