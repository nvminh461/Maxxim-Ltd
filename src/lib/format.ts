import type { ListingType } from "@/lib/cms-types";

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number, listingType: ListingType): string {
  const formatted = gbpFormatter.format(price);
  if (listingType === "long-term") return `${formatted}/mo`;
  if (listingType === "short-term") return `${formatted}/night`;
  return formatted;
}

export function listingTypeLabel(listingType: ListingType): string {
  if (listingType === "sale") return "For sale";
  if (listingType === "long-term") return "Long-term let";
  return "Short-term / Airbnb";
}

export function propertyTypeLabel(propertyType: "apartment" | "house"): string {
  return propertyType === "apartment" ? "Apartment" : "House";
}
