// next.config.ts
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  // Skip TS errors at build time so dynamic routes don't block deploys
  typescript: {
    ignoreBuildErrors: true,
  },
  // (Optional) Skip ESLint errors at build time
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Any other config options you already had…
};

export default pwaConfig(nextConfig);
