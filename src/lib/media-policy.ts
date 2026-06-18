import type { AssetKind } from "@/lib/cms-types";

export const CMS_IMAGE_MAX_MB = 10;
export const CMS_VIDEO_MAX_MB = 100;
export const CMS_JSON_BODY_MAX_BYTES = 256 * 1024;

export const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const videoMimeTypes = ["video/mp4", "video/webm"];

export function getDefaultMediaMaxBytes(kind: AssetKind) {
  return (kind === "image" ? CMS_IMAGE_MAX_MB : CMS_VIDEO_MAX_MB) * 1024 * 1024;
}

export function getDefaultMediaMaxMb(kind: AssetKind) {
  return kind === "image" ? CMS_IMAGE_MAX_MB : CMS_VIDEO_MAX_MB;
}

export function isAllowedMediaMime(kind: AssetKind, mimeType: string) {
  return (kind === "image" ? imageMimeTypes : videoMimeTypes).includes(mimeType);
}

export function assertSmallJsonRequest(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);

  if (contentLength > CMS_JSON_BODY_MAX_BYTES) {
    throw new Error(
      "Payload JSON quá lớn. Không gửi file/base64 qua API Vercel; hãy upload trực tiếp lên R2 bằng presigned URL.",
    );
  }
}
