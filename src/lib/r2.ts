import { randomUUID } from "crypto";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { connectToDatabase } from "@/lib/db";
import {
  CMS_IMAGE_MAX_MB,
  CMS_VIDEO_MAX_MB,
  imageMimeTypes,
  isAllowedMediaMime,
  videoMimeTypes,
} from "@/lib/media-policy";
import {
  Asset,
  Banner,
  MarqueeItem,
  Property,
  SiteSettings,
} from "@/lib/models";

function requireR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    throw new Error("Cấu hình Cloudflare R2 chưa đầy đủ.");
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

function getClient() {
  const config = requireR2Config();
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export function validateMediaFile(kind: "image" | "video", mimeType: string, size: number) {
  const maxMb = Number(
    kind === "image"
      ? process.env.R2_MAX_IMAGE_MB || CMS_IMAGE_MAX_MB
      : process.env.R2_MAX_VIDEO_MB || CMS_VIDEO_MAX_MB,
  );

  if (!isAllowedMediaMime(kind, mimeType)) {
    throw new Error(
      kind === "image"
        ? `Ảnh chỉ hỗ trợ ${imageMimeTypes.join(", ")}.`
        : `Video chỉ hỗ trợ ${videoMimeTypes.join(", ")}.`,
    );
  }

  if (size > maxMb * 1024 * 1024) {
    throw new Error(`Tệp vượt quá giới hạn ${maxMb} MB.`);
  }
}

export async function createUploadUrl(input: {
  fileName: string;
  mimeType: string;
  size: number;
  kind: "image" | "video";
}) {
  validateMediaFile(input.kind, input.mimeType, input.size);
  const config = requireR2Config();
  const extension = input.fileName.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
  const date = new Date().toISOString().slice(0, 10);
  const key = `cms/${input.kind}/${date}/${randomUUID()}.${extension.toLowerCase()}`;
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: input.mimeType,
    ContentLength: input.size,
  });

  return {
    key,
    uploadUrl: await getSignedUrl(client, command, { expiresIn: 300 }),
    publicUrl: `${config.publicBaseUrl.replace(/\/$/, "")}/${key}`,
    expiresIn: 300,
  };
}

export async function finalizeUpload(input: {
  key: string;
  fileName: string;
  mimeType: string;
  size: number;
  kind: "image" | "video";
  width?: number;
  height?: number;
  duration?: number;
}) {
  validateMediaFile(input.kind, input.mimeType, input.size);
  const config = requireR2Config();
  const head = await getClient().send(
    new HeadObjectCommand({ Bucket: config.bucket, Key: input.key }),
  );

  if (head.ContentLength !== input.size || head.ContentType !== input.mimeType) {
    throw new Error("Metadata tệp trên R2 không khớp với yêu cầu upload.");
  }

  await connectToDatabase();
  const asset = await Asset.findOneAndUpdate(
    { key: input.key },
    {
      $set: {
        url: `${config.publicBaseUrl.replace(/\/$/, "")}/${input.key}`,
        kind: input.kind,
        mimeType: input.mimeType,
        size: input.size,
        width: input.width,
        height: input.height,
        duration: input.duration,
        originalName: input.fileName,
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

export async function cleanupUnusedAssets(assetIds: string[]) {
  const uniqueIds = [...new Set(assetIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return;
  }

  await connectToDatabase();
  const config = requireR2Config();

  for (const assetId of uniqueIds) {
    const references = await Promise.all([
      Property.countDocuments({ "media.assetId": assetId }),
      Banner.countDocuments({ assetId }),
      MarqueeItem.countDocuments({ assetId }),
      SiteSettings.countDocuments({
        $or: [{ logoAssetId: assetId }, { "socialLinks.iconAssetId": assetId }],
      }),
    ]);

    if (references.some((count) => count > 0)) {
      continue;
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      continue;
    }

    await getClient().send(
      new DeleteObjectCommand({ Bucket: config.bucket, Key: asset.key }),
    );
    await asset.deleteOne();
  }
}
