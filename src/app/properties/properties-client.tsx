"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import type { ListingType, PropertyType, PropertyValue, SiteSettingsValue } from "@/lib/cms-types";
import { formatPrice, listingTypeLabel, propertyTypeLabel } from "@/lib/format";
import styles from "./properties.module.css";
import { motion } from "framer-motion";
import {
  ScrollReveal,
  ScrollRevealContainer,
  zoomInVariants,
} from "@/components/ScrollReveal/ScrollReveal";

const MotionLink = motion.create(Link);

const batchSize = 6;

type Filters = {
  city: string;
  listingType: string;
  propertyType: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  university: string;
};

const emptyFilters: Filters = {
  city: "",
  listingType: "",
  propertyType: "",
  bedrooms: "",
  minPrice: "",
  maxPrice: "",
  university: "",
};

export default function PropertiesClient({
  properties,
  settings,
}: {
  properties: PropertyValue[];
  settings: SiteSettingsValue;
}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const cities = useMemo(
    () => [...new Set(properties.map((property) => property.city))].sort(),
    [properties],
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (filters.city && property.city !== filters.city) return false;
      if (filters.listingType && property.listingType !== filters.listingType) return false;
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
      if (filters.bedrooms && property.bedrooms < Number(filters.bedrooms)) return false;
      if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;
      if (
        filters.university &&
        !property.university.toLowerCase().includes(filters.university.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [filters, properties]);

  const visibleProperties = useMemo(
    () => filteredProperties.slice(0, visibleCount),
    [filteredProperties, visibleCount],
  );
  const hasMore = visibleCount < filteredProperties.length;


  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + batchSize, filteredProperties.length),
          );
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredProperties.length]);

  // Legacy IntersectionObserver removed in favor of Framer Motion scroll reveals

  const getCardStyle = (index: number) => {
    const layoutPatterns = [
      styles.cardWide,
      styles.cardTall,
      styles.cardTall,
      styles.cardWide,
      styles.cardSquare,
      styles.cardTall,
      styles.cardSquare,
      styles.cardTall,
    ];
    return layoutPatterns[index % layoutPatterns.length];
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setVisibleCount(batchSize);
  };

  return (
    <div className={styles.page}>
      <Header activePath="/properties" />

      <main>
        <section className={styles.hero}>
          <ScrollReveal>
            <p className={styles.eyebrow}>UK Property Listings</p>
            <h1>Find Your Property</h1>
            <p>
              Browse properties across the UK — for sale, long-term lets, and short-term
              Airbnb opportunities near leading universities.
            </p>
          </ScrollReveal>
        </section>

        <section className={styles.filtersSection} aria-label="Property filters">
          <ScrollReveal className={styles.filtersGrid}>
            <label>
              City
              <select
                onChange={(event) => updateFilter("city", event.target.value)}
                value={filters.city}
              >
                <option value="">All cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Listing type
              <select
                onChange={(event) => updateFilter("listingType", event.target.value)}
                value={filters.listingType}
              >
                <option value="">All types</option>
                <option value="sale">For sale</option>
                <option value="long-term">Long-term let</option>
                <option value="short-term">Short-term / Airbnb</option>
              </select>
            </label>
            <label>
              Property type
              <select
                onChange={(event) => updateFilter("propertyType", event.target.value)}
                value={filters.propertyType}
              >
                <option value="">All</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
              </select>
            </label>
            <label>
              Min bedrooms
              <select
                onChange={(event) => updateFilter("bedrooms", event.target.value)}
                value={filters.bedrooms}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={String(count)}>
                    {count}+
                  </option>
                ))}
              </select>
            </label>
            <label>
              Min price (£)
              <input
                min={0}
                onChange={(event) => updateFilter("minPrice", event.target.value)}
                placeholder="0"
                type="number"
                value={filters.minPrice}
              />
            </label>
            <label>
              Max price (£)
              <input
                min={0}
                onChange={(event) => updateFilter("maxPrice", event.target.value)}
                placeholder="Any"
                type="number"
                value={filters.maxPrice}
              />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Near university
              <input
                onChange={(event) => updateFilter("university", event.target.value)}
                placeholder="Search by university name"
                type="search"
                value={filters.university}
              />
            </label>
          </ScrollReveal>
        </section>

        <section className={styles.gridSection} aria-label="Property list">
          <ScrollRevealContainer
            className={styles.projectGrid}
            staggerDelay={0.08}
            key={`${filters.city}-${filters.listingType}-${filters.propertyType}-${filters.bedrooms}-${filters.minPrice}-${filters.maxPrice}-${filters.university}-${visibleCount}`}
          >
            {visibleProperties.map((property, index) => (
              <MotionLink
                className={[styles.projectCard, getCardStyle(index)].join(" ")}
                href={`/properties/${property.slug}`}
                key={property.slug}
                prefetch={index < 6}
                variants={zoomInVariants}
                layout
              >
                <span className={styles.projectImage}>
                  <Image
                    alt={property.media[0]?.alt || property.title}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    src={property.media[0]?.url || ""}
                  />
                  <span className={styles.projectCardOverlay} />
                  <span className={styles.propertyBadge}>
                    {listingTypeLabel(property.listingType as ListingType)}
                  </span>
                </span>
                <span className={styles.projectMeta}>
                  {property.city} · {property.bedrooms} bed · {propertyTypeLabel(property.propertyType as PropertyType)}
                </span>
                <span className={styles.projectTitle}>{property.title}</span>
                {property.university ? (
                  <span className={styles.projectCardUni} style={{ display: "block", marginTop: "4px" }}>
                    Near {property.university}
                  </span>
                ) : null}
                <span className={styles.propertyPrice} style={{ marginTop: "8px", display: "block" }}>
                  {formatPrice(property.price, property.listingType as ListingType)}
                </span>
              </MotionLink>
            ))}
          </ScrollRevealContainer>

          <div className={styles.loadState} ref={sentinelRef}>
            {filteredProperties.length === 0
              ? "No properties match your filters."
              : hasMore
                ? "Loading more properties..."
                : `${filteredProperties.length} properties shown.`}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
