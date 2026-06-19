export type AssetKind = "image" | "video";

export type AssetValue = {
  id: string;
  key: string;
  url: string;
  kind: AssetKind;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  originalName: string;
};

export type PropertyMedia = {
  assetId: string;
  url: string;
  alt: string;
};

export type ListingType = "sale" | "long-term" | "short-term";
export type PropertyType = "apartment" | "house";

export type CategoryValue = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export type PropertyValue = {
  id: string;
  slug: string;
  title: string;
  cityId: string;
  city: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  university: string;
  description: string;
  media: PropertyMedia[];
  featured: boolean;
  featuredOrder: number;
  order: number;
};

export type PropertyFilters = {
  cityId?: string;
  listingType?: ListingType;
  propertyType?: PropertyType;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  university?: string;
};

export type BannerValue = {
  id: string;
  assetId: string;
  type: AssetKind;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  link: string;
  order: number;
};

export type MarqueeValue = {
  id: string;
  assetId: string;
  src: string;
  alt: string;
  order: number;
};

export type SocialLinkValue = {
  label: string;
  href: string;
  iconAssetId: string;
  icon: string;
};

export type SiteSettingsValue = {
  id?: string;
  companyName: string;
  logoAssetId: string;
  logoUrl: string;
  slogan: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  socialLinks: SocialLinkValue[];
};

export type HomeCmsData = {
  banners: BannerValue[];
  properties: PropertyValue[];
  categories: CategoryValue[];
  marquee: MarqueeValue[];
  settings: SiteSettingsValue;
};

export type ContactSubmissionValue = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  projectBrief: string;
  createdAt: string;
};
