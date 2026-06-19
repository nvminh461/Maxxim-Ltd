import type {
  BannerValue,
  CategoryValue,
  ContactSubmissionValue,
  HomeCmsData,
  MarqueeValue,
  PropertyFilters,
  PropertyValue,
  SiteSettingsValue,
} from "@/lib/cms-types";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db";
import {
  Banner,
  Category,
  ContactSubmission,
  MarqueeItem,
  Property,
  SiteSettings,
} from "@/lib/models";
import { escapeRegExp } from "@/lib/utils";

type CategoryDoc = {
  _id: unknown;
  name: string;
  slug: string;
  order: number;
};

type PropertyDoc = {
  _id: unknown;
  slug: string;
  title: string;
  cityId: CategoryDoc | unknown;
  listingType: "sale" | "long-term" | "short-term";
  propertyType: "apartment" | "house";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  university: string;
  description: string;
  media: Array<{ assetId: unknown; url: string; alt: string }>;
  featured: boolean;
  featuredOrder: number;
  order: number;
};

type BannerDoc = {
  _id: unknown;
  assetId: unknown;
  type: "image" | "video";
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  link: string;
  order: number;
};

type MarqueeDoc = {
  _id: unknown;
  assetId: unknown;
  src: string;
  alt: string;
  order: number;
};

type SettingsDoc = {
  _id: unknown;
  companyName: string;
  logoAssetId?: unknown;
  logoUrl: string;
  slogan: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  socialLinks: Array<{
    label: string;
    href: string;
    iconAssetId?: unknown;
    icon: string;
  }>;
};

const emptySettings: SiteSettingsValue = {
  companyName: "Maxxim Ltd.",
  logoAssetId: "",
  logoUrl: "",
  slogan: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  copyright: "",
  socialLinks: [],
};

function serializeCategory(doc: CategoryDoc): CategoryValue {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    order: doc.order,
  };
}

function serializeProperty(doc: PropertyDoc): PropertyValue {
  const populatedCity =
    typeof doc.cityId === "object" && doc.cityId && "name" in doc.cityId
      ? (doc.cityId as CategoryDoc)
      : null;

  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    cityId: populatedCity ? String(populatedCity._id) : String(doc.cityId),
    city: populatedCity?.name || "",
    listingType: doc.listingType,
    propertyType: doc.propertyType,
    price: doc.price,
    bedrooms: doc.bedrooms,
    bathrooms: doc.bathrooms,
    area: doc.area,
    university: doc.university || "",
    description: doc.description,
    media: doc.media.map((item) => ({
      assetId: String(item.assetId),
      url: item.url,
      alt: item.alt,
    })),
    featured: doc.featured,
    featuredOrder: doc.featuredOrder,
    order: doc.order,
  };
}

function serializeBanner(doc: BannerDoc): BannerValue {
  return {
    id: String(doc._id),
    assetId: String(doc.assetId),
    type: doc.type,
    src: doc.src,
    alt: doc.alt,
    title: doc.title,
    subtitle: doc.subtitle,
    ctaLabel: doc.ctaLabel,
    link: doc.link,
    order: doc.order,
  };
}

function serializeMarquee(doc: MarqueeDoc): MarqueeValue {
  return {
    id: String(doc._id),
    assetId: String(doc.assetId),
    src: doc.src,
    alt: doc.alt,
    order: doc.order,
  };
}

function serializeSettings(doc: SettingsDoc | null): SiteSettingsValue {
  if (!doc) {
    return emptySettings;
  }

  return {
    id: String(doc._id),
    companyName: doc.companyName,
    logoAssetId: doc.logoAssetId ? String(doc.logoAssetId) : "",
    logoUrl: doc.logoUrl || "",
    slogan: doc.slogan,
    description: doc.description,
    address: doc.address,
    phone: doc.phone,
    email: doc.email,
    copyright: doc.copyright,
    socialLinks: doc.socialLinks.map((item) => ({
      label: item.label,
      href: item.href,
      iconAssetId: item.iconAssetId ? String(item.iconAssetId) : "",
      icon: item.icon,
    })),
  };
}

function buildPropertyFilter(filters?: PropertyFilters) {
  if (!filters) return {};

  const query: Record<string, unknown> = {};

  if (filters.cityId) query.cityId = filters.cityId;
  if (filters.listingType) query.listingType = filters.listingType;
  if (filters.propertyType) query.propertyType = filters.propertyType;
  if (filters.bedrooms !== undefined) query.bedrooms = { $gte: filters.bedrooms };
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) {
      (query.price as Record<string, number>).$gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      (query.price as Record<string, number>).$lte = filters.maxPrice;
    }
  }
  if (filters.university) {
    query.university = { $regex: escapeRegExp(filters.university), $options: "i" };
  }

  return query;
}

export async function getHomeCmsData(): Promise<HomeCmsData> {
  if (!hasDatabaseConfig()) {
    return {
      banners: [],
      properties: [],
      categories: [],
      marquee: [],
      settings: emptySettings,
    };
  }

  try {
    await connectToDatabase();
    const [banners, properties, categories, marquee, settings] = await Promise.all([
      Banner.find().sort({ order: 1 }).lean(),
      Property.find({ featured: true })
        .sort({ featuredOrder: 1 })
        .limit(8)
        .populate("cityId")
        .lean(),
      Category.find().sort({ order: 1 }).lean(),
      MarqueeItem.find().sort({ order: 1 }).lean(),
      SiteSettings.findOne({ key: "global" }).lean(),
    ]);

    return {
      banners: (banners as unknown as BannerDoc[]).map(serializeBanner),
      properties: (properties as unknown as PropertyDoc[]).map(serializeProperty),
      categories: (categories as unknown as CategoryDoc[]).map(serializeCategory),
      marquee: (marquee as unknown as MarqueeDoc[]).map(serializeMarquee),
      settings: serializeSettings(settings as unknown as SettingsDoc | null),
    };
  } catch (error) {
    console.error("Không thể tải dữ liệu CMS trang chủ:", error);
    return {
      banners: [],
      properties: [],
      categories: [],
      marquee: [],
      settings: emptySettings,
    };
  }
}

export async function getAllProperties(filters?: PropertyFilters): Promise<PropertyValue[]> {
  if (!hasDatabaseConfig()) {
    return [];
  }

  await connectToDatabase();
  const properties = await Property.find(buildPropertyFilter(filters))
    .sort({ order: 1, createdAt: -1 })
    .populate("cityId")
    .lean();
  return (properties as unknown as PropertyDoc[]).map(serializeProperty);
}

export async function getPropertyBySlugFromCms(slug: string) {
  if (!hasDatabaseConfig()) {
    return null;
  }

  await connectToDatabase();
  const property = await Property.findOne({ slug }).populate("cityId").lean();
  return property ? serializeProperty(property as unknown as PropertyDoc) : null;
}

export async function getAdminResource(resource: string, query?: string, page = 1) {
  await connectToDatabase();

  if (resource === "dashboard") {
    const [banners, properties, categories, marquee, contacts] = await Promise.all([
      Banner.countDocuments(),
      Property.countDocuments(),
      Category.countDocuments(),
      MarqueeItem.countDocuments(),
      ContactSubmission.countDocuments(),
    ]);
    return { banners, properties, categories, marquee, contacts };
  }

  if (resource === "categories") {
    const docs = await Category.find().sort({ order: 1 }).lean();
    return (docs as unknown as CategoryDoc[]).map(serializeCategory);
  }

  if (resource === "properties") {
    const docs = await Property.find().sort({ order: 1 }).populate("cityId").lean();
    return (docs as unknown as PropertyDoc[]).map(serializeProperty);
  }

  if (resource === "banners") {
    const docs = await Banner.find().sort({ order: 1 }).lean();
    return (docs as unknown as BannerDoc[]).map(serializeBanner);
  }

  if (resource === "marquee") {
    const docs = await MarqueeItem.find().sort({ order: 1 }).lean();
    return (docs as unknown as MarqueeDoc[]).map(serializeMarquee);
  }

  if (resource === "settings") {
    const doc = await SiteSettings.findOne({ key: "global" }).lean();
    return serializeSettings(doc as unknown as SettingsDoc | null);
  }

  if (resource === "contacts") {
    const safePage = Math.max(1, page);
    const limit = 20;
    const safeQuery = query ? escapeRegExp(query) : "";
    const filter = safeQuery
      ? {
          $or: [
            { fullName: { $regex: safeQuery, $options: "i" } },
            { email: { $regex: safeQuery, $options: "i" } },
            { phone: { $regex: safeQuery, $options: "i" } },
          ],
        }
      : {};
    const [docs, total] = await Promise.all([
      ContactSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * limit)
        .limit(limit)
        .lean(),
      ContactSubmission.countDocuments(filter),
    ]);

    return {
      items: docs.map((doc) => ({
        id: String(doc._id),
        fullName: doc.fullName,
        phone: doc.phone,
        email: doc.email,
        projectBrief: doc.projectBrief,
        createdAt: doc.createdAt.toISOString(),
      })) as ContactSubmissionValue[],
      total,
      page: safePage,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  throw new Error("Tài nguyên CMS không hợp lệ.");
}
