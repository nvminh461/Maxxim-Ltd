import mongoose, { Schema } from "mongoose";

const assetSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    kind: { type: String, enum: ["image", "video"], required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: Number,
    height: Number,
    duration: Number,
    originalName: { type: String, required: true },
  },
  { timestamps: true },
);

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const projectMediaSchema = new Schema(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    url: { type: String, required: true },
    alt: { type: String, required: true },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    year: { type: String, required: true },
    location: { type: String, required: true },
    area: { type: String, required: true },
    summary: { type: String, required: true },
    media: {
      type: [projectMediaSchema],
      validate: [(value: unknown[]) => value.length >= 2, "Dự án cần ít nhất 2 ảnh"],
    },
    featured: { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number, default: 0 },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const bannerSchema = new Schema(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    ctaLabel: { type: String, default: "" },
    link: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const marqueeSchema = new Schema(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    src: { type: String, required: true },
    alt: { type: String, required: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const socialSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    iconAssetId: { type: Schema.Types.ObjectId, ref: "Asset" },
    icon: { type: String, required: true },
  },
  { _id: false },
);

const settingsSchema = new Schema(
  {
    key: { type: String, default: "global", unique: true },
    companyName: { type: String, required: true },
    logoAssetId: { type: Schema.Types.ObjectId, ref: "Asset" },
    logoUrl: { type: String, default: "" },
    slogan: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    copyright: { type: String, required: true },
    socialLinks: { type: [socialSchema], default: [] },
  },
  { timestamps: true },
);

const contactSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, index: true },
    projectBrief: { type: String, required: true },
  },
  { timestamps: true },
);

const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema, "assets");
export const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema, "admin_users");
export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema, "categories");
export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema, "projects");
export const Banner =
  mongoose.models.Banner || mongoose.model("Banner", bannerSchema, "banners");
export const MarqueeItem =
  mongoose.models.MarqueeItem ||
  mongoose.model("MarqueeItem", marqueeSchema, "marquee_items");
export const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", settingsSchema, "site_settings");
export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", contactSchema, "contact_submissions");
export const RateLimitBucket =
  mongoose.models.RateLimitBucket ||
  mongoose.model("RateLimitBucket", rateLimitSchema, "rate_limit_buckets");
