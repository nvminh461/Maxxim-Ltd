import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { S3Client, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { hash } from "bcryptjs";
import mongoose from "mongoose";
import { properties as mockProperties } from "../src/data/properties";
import { connectToDatabase } from "../src/lib/db";
import {
  AdminUser,
  Asset,
  Banner,
  Category,
  MarqueeItem,
  Property,
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
  console.log("Seed mode: upsert (existing records are updated, new ones are inserted)");
  await seedAdmin();

  const cityNames = Array.from(new Set(mockProperties.map((property) => property.city)));
  const cityMap = new Map<string, string>();
  await Promise.all(
    cityNames.map(async (name, order) => {
      const category = await Category.findOneAndUpdate(
        { slug: slugify(name) },
        { $set: { name, slug: slugify(name), order } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      cityMap.set(name, category._id.toString());
    }),
  );
  console.log(`Upserted ${cityNames.length} cities`);

  const propertyAssets = new Map<string, SeedAsset>();
  for (const property of mockProperties) {
    const album = uniqueByUrl([
      { src: property.cover, alt: property.alt },
      ...property.album,
    ]);
    for (const image of album) {
      if (!propertyAssets.has(image.src)) {
        propertyAssets.set(
          image.src,
          await ensureAsset(client, {
            kind: "image",
            source: "remote",
            url: image.src,
            originalName: `${slugify(image.alt || property.title)}.jpg`,
          }),
        );
      }
    }
  }

  for (const [order, property] of mockProperties.entries()) {
    const album = uniqueByUrl([
      { src: property.cover, alt: property.alt },
      ...property.album,
    ]);
    const media = album.map((image) => {
      const asset = propertyAssets.get(image.src);
      if (!asset) throw new Error(`Missing asset for ${image.src}`);
      return {
        assetId: asset.id,
        url: asset.url,
        alt: image.alt || property.title,
      };
    });
    const featuredOrder = order < 8 ? order : 0;

    await Property.findOneAndUpdate(
      { slug: property.slug },
      {
        $set: {
          slug: property.slug,
          title: property.title,
          cityId: cityMap.get(property.city),
          listingType: property.listingType,
          propertyType: property.propertyType,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          university: property.university,
          description: property.description,
          media,
          featured: order < 8,
          featuredOrder,
          order,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
  console.log(`Upserted ${mockProperties.length} properties`);

  const heroSpecs = [
    {
      type: "video" as const,
      source: { kind: "video" as const, source: "local" as const, filePath: "public/banner.mp4" },
      title: "MAXXIM UK PROPERTY SERVICES",
      subtitle: "BUY · RENOVATE · LET — TRUSTED PARTNER IN THE UK",
      alt: "",
      ctaLabel: "View properties",
      link: "/properties",
    },
    {
      type: "image" as const,
      property: mockProperties.find((item) => item.slug === "kensington-student-flat"),
      title: "KENSINGTON STUDENT FLAT",
      subtitle: "LONDON / FOR SALE / NEAR IMPERIAL COLLEGE",
      ctaLabel: "View property",
      link: "/properties/kensington-student-flat",
    },
    {
      type: "image" as const,
      property: mockProperties.find((item) => item.slug === "manchester-canal-apartment"),
      title: "MANCHESTER CANAL APARTMENT",
      subtitle: "MANCHESTER / FOR SALE / 2 BED",
      ctaLabel: "View property",
      link: "/properties/manchester-canal-apartment",
    },
    {
      type: "image" as const,
      property: mockProperties.find((item) => item.slug === "london-shoreditch-airbnb"),
      title: "SHOREDITCH AIRBNB SUITE",
      subtitle: "LONDON / SHORT-TERM LET / STUDENT INCOME",
      ctaLabel: "View property",
      link: "/properties/london-shoreditch-airbnb",
    },
  ];

  for (const [order, spec] of heroSpecs.entries()) {
    const source =
      spec.type === "video"
        ? spec.source
        : ({
            kind: "image",
            source: "remote",
            url: spec.property?.cover || "",
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
          alt: spec.type === "image" ? spec.property?.alt || spec.title : "",
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
  console.log(`Upserted ${heroSpecs.length} banners`);

  const marqueeProperties = [
    ["birmingham-family-house", "Birmingham family house"],
    ["edinburgh-old-town-flat", "Edinburgh old town flat"],
    ["bristol-harbour-apartment", "Bristol harbour apartment"],
    ["manchester-student-house", "Manchester student house"],
  ] as const;

  for (const [order, [slug, alt]] of marqueeProperties.entries()) {
    const property = mockProperties.find((item) => item.slug === slug);
    if (!property) throw new Error(`Missing mock property ${slug}`);
    const asset = await ensureAsset(client, {
      kind: "image",
      source: "remote",
      url: property.cover,
      originalName: `${slugify(alt)}.jpg`,
    });
    await MarqueeItem.findOneAndUpdate(
      { alt },
      { $set: { assetId: asset.id, src: asset.url, alt, order } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
  console.log(`Upserted ${marqueeProperties.length} marquee images`);

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
        slogan: "Your trusted UK property partner",
        description:
          "End-to-end UK property services for overseas buyers — consultation, renovation, and lettings near top universities.",
        address: "London, United Kingdom",
        phone: "+44 20 7946 0958",
        email: "contact@maxximltd.com",
        copyright: "© 2026 Maxxim Ltd. All rights reserved.",
        socialLinks,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log("Upserted footer settings");
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
