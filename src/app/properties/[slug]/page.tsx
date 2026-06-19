import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header/Header";
import { getPropertyBySlugFromCms } from "@/lib/cms-data";
import type { PropertyValue } from "@/lib/cms-types";
import { formatPrice, listingTypeLabel, propertyTypeLabel } from "@/lib/format";
import PropertyAlbum from "./property-album";
import styles from "../properties.module.css";

type PropertyPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlugFromCms(slug);

  if (!property) {
    return { title: "Property not found | Maxxim Ltd." };
  }

  return {
    title: `${property.title} | Maxxim Ltd.`,
    description: property.description,
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlugFromCms(slug);

  if (!property) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <Header activePath="/properties" />
      <main>
        <PropertyHero property={property} />
        <PropertyAlbum images={property.media.slice(1)} title={property.title} />
      </main>
    </div>
  );
}

function PropertyHero({ property }: { property: PropertyValue }) {
  return (
    <section className={styles.detailHero}>
      <div className={styles.detailImage}>
        <Image
          alt={property.media[0]?.alt || property.title}
          fill
          priority
          sizes="100vw"
          src={property.media[0]?.url || ""}
        />
      </div>
      <div className={styles.detailOverlay} />
      <div className={styles.detailIntro}>
        <Link className={styles.backLink} href="/properties">
          &lt;- All properties
        </Link>
        <p className={styles.eyebrow}>
          {property.city} / {listingTypeLabel(property.listingType)} /{" "}
          {property.bedrooms} bed
        </p>
        <h1>{property.title}</h1>
        <p className={styles.propertyPrice}>
          {formatPrice(property.price, property.listingType)}
        </p>
        <p>{property.description}</p>
        <dl className={styles.projectFacts}>
          <div>
            <dt>Area</dt>
            <dd>{property.area}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{propertyTypeLabel(property.propertyType)}</dd>
          </div>
          <div>
            <dt>Bedrooms</dt>
            <dd>{property.bedrooms}</dd>
          </div>
          <div>
            <dt>Bathrooms</dt>
            <dd>{property.bathrooms}</dd>
          </div>
          {property.university ? (
            <div>
              <dt>Near university</dt>
              <dd>{property.university}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}
