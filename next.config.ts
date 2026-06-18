import type { NextConfig } from "next";

const r2PublicHost = process.env.R2_PUBLIC_BASE_URL
  ? new URL(process.env.R2_PUBLIC_BASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    // Images are served from R2/CDN; skip Vercel Image Optimization to avoid free-tier 402 quota limits.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      ...(r2PublicHost
        ? [
            {
              protocol: "https" as const,
              hostname: r2PublicHost,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
