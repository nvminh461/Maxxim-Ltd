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

export type ProjectMedia = {
  assetId: string;
  url: string;
  alt: string;
};

export type CategoryValue = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export type ProjectValue = {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  category: string;
  year: string;
  location: string;
  area: string;
  summary: string;
  media: ProjectMedia[];
  featured: boolean;
  featuredOrder: number;
  order: number;
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
  projects: ProjectValue[];
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
