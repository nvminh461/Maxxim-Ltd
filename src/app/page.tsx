import HomeClient from "@/app/home-client";
import { getHomeCmsData } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cms = await getHomeCmsData();
  return <HomeClient cms={cms} />;
}
