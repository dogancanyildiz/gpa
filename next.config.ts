import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // TypeScript hatalarını build sırasında kontrol et
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // GitHub Pages için basePath (repo adı)
  // Eğer custom domain kullanıyorsanız bu satırı kaldırın
  basePath: process.env.GITHUB_PAGES === 'true' ? '/gpa' : '',
  
  // GitHub Pages için static export
  // Not: API routes çalışmayacak, sadece static sayfalar deploy edilecek
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
  
  // Static export için image optimization'ı devre dışı bırak
  images: process.env.GITHUB_PAGES === 'true' ? {
    unoptimized: true,
  } : undefined,
};

export default nextConfig;
