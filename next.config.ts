// next.config.ts
import path from "path";
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  // Skip TS/ESLint errors at build time
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },

  // add this block:
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": path.resolve(__dirname),          // "@/foo" → "<repo-root>/foo"
    };
    return config;
  },
};

export default pwaConfig(nextConfig);
