"use client";

import { useState } from "react";
import type { AssetKind, AssetValue } from "@/lib/cms-types";
import {
  getDefaultMediaMaxBytes,
  getDefaultMediaMaxMb,
  isAllowedMediaMime,
} from "@/lib/media-policy";

async function readMetadata(file: File, kind: AssetKind) {
  const url = URL.createObjectURL(file);
  try {
    if (kind === "image") {
      const image = new Image();
      image.src = url;
      await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Không thể đọc metadata video."));
    });
    return {
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function uploadFile(file: File, kind: AssetKind) {
  if (!isAllowedMediaMime(kind, file.type)) {
    throw new Error(
      kind === "image"
        ? "Ảnh chỉ hỗ trợ JPEG, PNG, WebP hoặc AVIF."
        : "Video chỉ hỗ trợ MP4 hoặc WebM.",
    );
  }

  if (file.size > getDefaultMediaMaxBytes(kind)) {
    throw new Error(
      `Tệp vượt quá giới hạn ${getDefaultMediaMaxMb(kind)} MB. File không được gửi qua Vercel API.`,
    );
  }

  const metadata = await readMetadata(file, kind);
  const requestBody = {
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    kind,
  };
  const presignResponse = await fetch("/api/admin/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  const presign = await presignResponse.json();
  if (!presignResponse.ok) throw new Error(presign.error);

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!uploadResponse.ok) throw new Error("Không thể upload tệp lên R2.");

  const finalizeResponse = await fetch("/api/admin/upload/finalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...requestBody, ...metadata, key: presign.key }),
  });
  const asset = await finalizeResponse.json();
  if (!finalizeResponse.ok) throw new Error(asset.error);
  return asset as AssetValue;
}

export default function MediaUploader({
  accept,
  kind,
  label,
  multiple = false,
  onUploaded,
}: {
  accept: string;
  kind: AssetKind;
  label: string;
  multiple?: boolean;
  onUploaded: (asset: AssetValue) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setLoading(true);
    setError("");
    setUploadProgress(null);

    const errors: string[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (files.length > 1) {
        setUploadProgress(`Đang upload ${index + 1}/${files.length}...`);
      }

      try {
        const asset = await uploadFile(file, kind);
        onUploaded(asset);
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : "Upload thất bại.";
        errors.push(`${file.name}: ${message}`);
      }
    }

    if (errors.length) {
      setError(errors.join(" "));
    }

    setUploadProgress(null);
    setLoading(false);
  }

  const buttonLabel = loading
    ? uploadProgress || "Đang upload..."
    : label;

  return (
    <div className="admin-uploader">
      <label className="admin-upload-button">
        {buttonLabel}
        <input
          accept={accept}
          disabled={loading}
          multiple={multiple}
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.currentTarget.value = "";
          }}
          type="file"
        />
      </label>
      {error ? <small className="admin-error">{error}</small> : null}
    </div>
  );
}
