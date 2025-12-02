import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // TypeScript hatalarını build sırasında kontrol et
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
