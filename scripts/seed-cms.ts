import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { S3Client, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { hash } from "bcryptjs";
import mongoose from "mongoose";
import { projects as mockProjects } from "../src/data/projects";
import { connectToDatabase } from "../src/lib/db";
import {
  AdminUser,
  Asset,
  Banner,
  Category,
  MarqueeItem,
  Project,
  SiteSettings,
} from "../src/lib/models";
import { slugify } from "../src/lib/utils";

type SeedAsset = {
  id: string;
  key: string;
  url: string;
  kind: "image" | "video";
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  originalName: string;
};

type AssetSource =
  | { kind: "image" | "video"; source: "remote"; url: string; originalName?: string }
  | { kind: "image" | "video"; source: "local"; filePath: string; originalName?: string };

const root = process.cwd();
const publicBaseUrl = requiredEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, "");
const bucket = requiredEnv("R2_BUCKET_NAME");

function requiredEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Thiếu biến môi trường ${key}.`);
  }
  return value;
}

function getS3Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${requiredEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

function extensionFromMime(mimeType: string) {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };
  return map[mimeType] || "bin";
}

function mimeFromPath(filePath: string, kind: "image" | "video") {
  const extension = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
  };
  return map[extension] || (kind === "video" ? "video/mp4" : "image/png");
}

function stableKey(sourceId: string, kind: "image" | "video", mimeType: string) {
  const hashValue = createHash("sha256").update(sourceId).digest("hex").slice(0, 24);
  return `cms/seed/${kind}/${hashValue}.${extensionFromMime(mimeType)}`;
}

async function objectExists(client: S3Client, key: string) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function readAssetSource(source: AssetSource) {
  if (source.source === "local") {
    const absolutePath = path.join(root, source.filePath);
    const body = await fs.readFile(absolutePath);
    const mimeType = mimeFromPath(absolutePath, source.kind);
    return {
      body,
      sourceId: `local:${source.filePath}`,
      mimeType,
      originalName: source.originalName || path.basename(source.filePath),
      size: body.byteLength,
    };
  }

  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(`Không thể tải mock asset: ${source.url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const mimeType =
    response.headers.get("content-type")?.split(";")[0] ||
    (source.kind === "video" ? "video/mp4" : "image/jpeg");

  return {
    body: buffer,
    sourceId: `remote:${source.url}`,
    mimeType,
    originalName: source.originalName || `${createHash("sha1").update(source.url).digest("hex").slice(0, 10)}.${extensionFromMime(mimeType)}`,
    size: buffer.byteLength,
  };
}

async function ensureAsset(client: S3Client, source: AssetSource): Promise<SeedAsset> {
  const data = await readAssetSource(source);
  const key = stableKey(data.sourceId, source.kind, data.mimeType);
  const url = `${publicBaseUrl}/${key}`;

  if (!(await objectExists(client, key))) {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: data.body,
        ContentLength: data.size,
        ContentType: data.mimeType,
      }),
    );
    console.log(`Uploaded ${key}`);
  }

  const asset = await Asset.findOneAndUpdate(
    { key },
    {
      $set: {
        url,
        kind: source.kind,
        mimeType: data.mimeType,
        size: data.size,
        originalName: data.originalName,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return {
    id: asset._id.toString(),
    key: asset.key,
    url: asset.url,
    kind: asset.kind,
    mimeType: asset.mimeType,
    size: asset.size,
    width: asset.width,
    height: asset.height,
    duration: asset.duration,
    originalName: asset.originalName,
  };
}

function uniqueByUrl<T extends { src?: string; cover?: string; url?: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const url = item.src || item.cover || item.url || "";
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

async function seedAdmin() {
  const email = requiredEnv("ADMIN_SEED_EMAIL").toLowerCase().trim();
  const password = requiredEnv("ADMIN_SEED_PASSWORD");
  const passwordHash = await hash(password, 12);
  await AdminUser.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, role: "admin" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log(`Seeded admin user: ${email}`);
}

async function main() {
  const client = getS3Client();
  await connectToDatabase();
  await seedAdmin();

  const categoryNames = Array.from(new Set(mockProjects.map((project) => project.category)));
  const categoryMap = new Map<string, string>();
  await Promise.all(
    categoryNames.map(async (name, order) => {
      const category = await Category.findOneAndUpdate(
        { slug: slugify(name) },
        { $set: { name, slug: slugify(name), order } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      categoryMap.set(name, category._id.toString());
    }),
  );
  console.log(`Seeded ${categoryNames.length} categories`);

  const projectAssets = new Map<string, SeedAsset>();
  for (const project of mockProjects) {
    const album = uniqueByUrl([
      { src: project.cover, alt: project.alt },
      ...project.album,
    ]);
    for (const image of album) {
      if (!projectAssets.has(image.src)) {
        projectAssets.set(
          image.src,
          await ensureAsset(client, {
            kind: "image",
            source: "remote",
            url: image.src,
            originalName: `${slugify(image.alt || project.title)}.jpg`,
          }),
        );
      }
    }
  }

  for (const [order, project] of mockProjects.entries()) {
    const album = uniqueByUrl([
      { src: project.cover, alt: project.alt },
      ...project.album,
    ]);
    const media = album.map((image) => {
      const asset = projectAssets.get(image.src);
      if (!asset) throw new Error(`Thiếu asset cho ${image.src}`);
      return {
        assetId: asset.id,
        url: asset.url,
        alt: image.alt || project.title,
      };
    });
    const featuredOrder = order < 8 ? order : 0;

    await Project.findOneAndUpdate(
      { slug: project.slug },
      {
        $set: {
          slug: project.slug,
          title: project.title,
          categoryId: categoryMap.get(project.category),
          year: project.year,
          location: project.location,
          area: project.area,
          summary: project.summary,
          media,
          featured: order < 8,
          featuredOrder,
          order,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
  console.log(`Seeded ${mockProjects.length} projects`);

  const heroSpecs = [
    {
      type: "video" as const,
      source: { kind: "video" as const, source: "local" as const, filePath: "public/banner.mp4" },
      title: "MAXXIM ARCHITECTURE & BUILD",
      subtitle: "PREMIUM SPACES / ARCHITECTURE / INTERIOR",
      alt: "",
      ctaLabel: "View selected works",
      link: "#projects",
    },
    {
      type: "image" as const,
      project: mockProjects.find((project) => project.slug === "aurora-villa"),
      title: "AURORA VILLA",
      subtitle: "VILLA / PHU QUOC / 2024",
      ctaLabel: "Explore Project",
      link: "/projects/aurora-villa",
    },
    {
      type: "image" as const,
      project: mockProjects.find((project) => project.slug === "zen-water-house"),
      title: "ZEN WATER HOUSE",
      subtitle: "VILLA / LONG AN / 2023",
      ctaLabel: "Explore Project",
      link: "/projects/zen-water-house",
    },
    {
      type: "image" as const,
      project: mockProjects.find((project) => project.slug === "serenity-interior"),
      title: "SERENITY INTERIOR",
      subtitle: "INTERIOR / HANOI / 2023",
      ctaLabel: "Explore Project",
      link: "/projects/serenity-interior",
    },
  ];

  for (const [order, spec] of heroSpecs.entries()) {
    const source =
      spec.type === "video"
        ? spec.source
        : ({
            kind: "image",
            source: "remote",
            url: spec.project?.cover || "",
            originalName: `${slugify(spec.title)}.jpg`,
          } as const);
    const asset = await ensureAsset(client, source);
    await Banner.findOneAndUpdate(
      { title: spec.title },
      {
        $set: {
          assetId: asset.id,
          type: spec.type,
          src: asset.url,
          alt: spec.type === "image" ? spec.project?.alt || spec.title : "",
          title: spec.title,
          subtitle: spec.subtitle,
          ctaLabel: spec.ctaLabel,
          link: spec.link,
          order,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
  console.log(`Seeded ${heroSpecs.length} banners`);

  const marqueeProjects = [
    ["shadow-courtyard", "Concrete facade detail"],
    ["quiet-lane-home", "Luxury villa hallway"],
    ["terrace-loop", "Double height living room"],
    ["gallery-stair-house", "Sculptural staircase"],
  ] as const;

  for (const [order, [slug, alt]] of marqueeProjects.entries()) {
    const project = mockProjects.find((item) => item.slug === slug);
    if (!project) throw new Error(`Không tìm thấy project mock ${slug}`);
    const asset = await ensureAsset(client, {
      kind: "image",
      source: "remote",
      url: project.cover,
      originalName: `${slugify(alt)}.jpg`,
    });
    await MarqueeItem.findOneAndUpdate(
      { alt },
      { $set: { assetId: asset.id, src: asset.url, alt, order } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
  console.log(`Seeded ${marqueeProjects.length} marquee images`);

  const logo = await ensureAsset(client, {
    kind: "image",
    source: "local",
    filePath: "public/logo.png",
  });
  const socialSpecs = [
    { label: "Facebook", href: "#", filePath: "public/icons/Facebook.svg.webp" },
    { label: "YouTube", href: "#", filePath: "public/icons/YouTube.svg.webp" },
    { label: "TikTok", href: "#", filePath: "public/icons/Tiktok.svg.png" },
    { label: "Zalo", href: "#", filePath: "public/icons/Zalo.svg.png" },
  ];
  const socialLinks = [];
  for (const social of socialSpecs) {
    const asset = await ensureAsset(client, {
      kind: "image",
      source: "local",
      filePath: social.filePath,
    });
    socialLinks.push({
      label: social.label,
      href: social.href,
      iconAssetId: asset.id,
      icon: asset.url,
    });
  }

  await SiteSettings.findOneAndUpdate(
    { key: "global" },
    {
      $set: {
        companyName: "Maxxim Ltd.",
        logoAssetId: logo.id,
        logoUrl: logo.url,
        slogan: "Building Today - Creating Tomorrow",
        description: "Premium design and construction for spaces built to last.",
        address: "123 Nam Ky Khoi Nghia Street, District 1, Ho Chi Minh City",
        phone: "+84 28 3930 1234",
        email: "contact@maxximltd.com",
        copyright: "© 2026 Maxxim Ltd. All rights reserved.",
        socialLinks,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log("Seeded footer settings");
}

main()
  .then(async () => {
    await mongoose.disconnect();
    console.log("CMS seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  });
