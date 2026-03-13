import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sanitize-html"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;
