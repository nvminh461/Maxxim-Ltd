import type {
  BannerValue,
  CategoryValue,
  ContactSubmissionValue,
  HomeCmsData,
  MarqueeValue,
  ProjectValue,
  SiteSettingsValue,
} from "@/lib/cms-types";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db";
import {
  Banner,
  Category,
  ContactSubmission,
  MarqueeItem,
  Project,
  SiteSettings,
} from "@/lib/models";
import { escapeRegExp } from "@/lib/utils";

type CategoryDoc = {
  _id: unknown;
  name: string;
  slug: string;
  order: number;
};

type ProjectDoc = {
  _id: unknown;
  slug: string;
  title: string;
  categoryId: CategoryDoc | unknown;
  year: string;
  location: string;
  area: string;
  summary: string;
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

function serializeProject(doc: ProjectDoc): ProjectValue {
  const populatedCategory =
    typeof doc.categoryId === "object" && doc.categoryId && "name" in doc.categoryId
      ? (doc.categoryId as CategoryDoc)
      : null;

  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    categoryId: populatedCategory ? String(populatedCategory._id) : String(doc.categoryId),
    category: populatedCategory?.name || "",
    year: doc.year,
    location: doc.location,
    area: doc.area,
    summary: doc.summary,
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

export async function getHomeCmsData(): Promise<HomeCmsData> {
  if (!hasDatabaseConfig()) {
    return {
      banners: [],
      projects: [],
      categories: [],
      marquee: [],
      settings: emptySettings,
    };
  }

  try {
    await connectToDatabase();
    const [banners, projects, categories, marquee, settings] = await Promise.all([
      Banner.find().sort({ order: 1 }).lean(),
      Project.find({ featured: true })
        .sort({ featuredOrder: 1 })
        .limit(8)
        .populate("categoryId")
        .lean(),
      Category.find().sort({ order: 1 }).lean(),
      MarqueeItem.find().sort({ order: 1 }).lean(),
      SiteSettings.findOne({ key: "global" }).lean(),
    ]);

    return {
      banners: (banners as unknown as BannerDoc[]).map(serializeBanner),
      projects: (projects as unknown as ProjectDoc[]).map(serializeProject),
      categories: (categories as unknown as CategoryDoc[]).map(serializeCategory),
      marquee: (marquee as unknown as MarqueeDoc[]).map(serializeMarquee),
      settings: serializeSettings(settings as unknown as SettingsDoc | null),
    };
  } catch (error) {
    console.error("Không thể tải dữ liệu CMS trang chủ:", error);
    return {
      banners: [],
      projects: [],
      categories: [],
      marquee: [],
      settings: emptySettings,
    };
  }
}

export async function getAllProjects(): Promise<ProjectValue[]> {
  if (!hasDatabaseConfig()) {
    return [];
  }

  await connectToDatabase();
  const projects = await Project.find()
    .sort({ order: 1, createdAt: -1 })
    .populate("categoryId")
    .lean();
  return (projects as unknown as ProjectDoc[]).map(serializeProject);
}

export async function getProjectBySlugFromCms(slug: string) {
  if (!hasDatabaseConfig()) {
    return null;
  }

  await connectToDatabase();
  const project = await Project.findOne({ slug }).populate("categoryId").lean();
  return project ? serializeProject(project as unknown as ProjectDoc) : null;
}

export async function getAdminResource(resource: string, query?: string, page = 1) {
  await connectToDatabase();

  if (resource === "dashboard") {
    const [banners, projects, categories, marquee, contacts] = await Promise.all([
      Banner.countDocuments(),
      Project.countDocuments(),
      Category.countDocuments(),
      MarqueeItem.countDocuments(),
      ContactSubmission.countDocuments(),
    ]);
    return { banners, projects, categories, marquee, contacts };
  }

  if (resource === "categories") {
    const docs = await Category.find().sort({ order: 1 }).lean();
    return (docs as unknown as CategoryDoc[]).map(serializeCategory);
  }

  if (resource === "projects") {
    const docs = await Project.find().sort({ order: 1 }).populate("categoryId").lean();
    return (docs as unknown as ProjectDoc[]).map(serializeProject);
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
