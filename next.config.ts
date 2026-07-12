import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js to optimize images from Firebase Storage & common CDNs
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Serve images as modern WebP/AVIF, much smaller than JPEG/PNG
    formats: ["image/avif", "image/webp"],
  },
  // Compress all responses
  compress: true,
  devIndicators: false,
};

export default nextConfig;
