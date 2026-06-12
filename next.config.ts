import type { NextConfig } from "next";

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
    ],
  },
};

export default nextConfig;
