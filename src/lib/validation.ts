import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "ID không hợp lệ");
const imageMedia = z.object({
  assetId: objectId,
  url: z.string().url(),
  alt: z.string().trim().min(1).max(180),
});

export const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z.email().max(180),
  projectBrief: z.string().trim().min(10).max(5000),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(100),
  order: z.coerce.number().int().min(0).default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().min(1).max(200),
  categoryId: objectId,
  year: z.string().trim().min(1).max(20),
  location: z.string().trim().min(1).max(160),
  area: z.string().trim().min(1).max(80),
  summary: z.string().trim().min(1).max(5000),
  media: z.array(imageMedia).min(2, "Dự án cần ít nhất một ảnh chính và một ảnh phụ"),
  featured: z.boolean().default(false),
  featuredOrder: z.coerce.number().int().min(0).default(0),
  order: z.coerce.number().int().min(0).default(0),
});

export const bannerSchema = z.object({
  assetId: objectId,
  type: z.enum(["image", "video"]),
  src: z.string().url(),
  alt: z.string().trim().max(180).default(""),
  title: z.string().trim().min(1).max(180),
  subtitle: z.string().trim().min(1).max(240),
  ctaLabel: z.string().trim().max(80).default(""),
  link: z.string().trim().max(500).default(""),
  order: z.coerce.number().int().min(0).default(0),
});

export const marqueeSchema = z.object({
  assetId: objectId,
  src: z.string().url(),
  alt: z.string().trim().min(1).max(180),
  order: z.coerce.number().int().min(0).default(0),
});

export const settingsSchema = z.object({
  companyName: z.string().trim().min(1).max(160),
  logoAssetId: z.union([objectId, z.literal("")]),
  logoUrl: z.union([z.string().url(), z.literal("")]),
  slogan: z.string().trim().min(1).max(240),
  description: z.string().trim().min(1).max(1000),
  address: z.string().trim().min(1).max(500),
  phone: z.string().trim().min(1).max(80),
  email: z.email().max(180),
  copyright: z.string().trim().min(1).max(240),
  socialLinks: z.array(
    z.object({
      label: z.string().trim().min(1).max(80),
      href: z.string().trim().min(1).max(500),
      iconAssetId: z.union([objectId, z.literal("")]),
      icon: z.union([z.string().url(), z.string().startsWith("/")]),
    }),
  ),
});

export const presignSchema = z.object({
  fileName: z.string().trim().min(1).max(240),
  mimeType: z.string().trim().min(1).max(120),
  size: z.coerce.number().int().positive(),
  kind: z.enum(["image", "video"]),
});

export const finalizeAssetSchema = presignSchema.extend({
  key: z.string().trim().min(1).max(500),
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
  duration: z.coerce.number().positive().optional(),
});
