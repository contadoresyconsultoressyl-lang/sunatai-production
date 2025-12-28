import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de performance
  compress: true,

  // Optimizar imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Headers de caché optimizados
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Optimizar producción
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
