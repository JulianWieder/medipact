import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // Image optimization: Next.js liefert Bilder automatisch als AVIF/WebP
  // und in der zur Viewport-Größe passenden Auflösung aus (die `sizes`-Props
  // in den Komponenten greifen erst dadurch). `unoptimized: true` hatte das
  // komplett deaktiviert — 2-3 MB große Original-JPGs gingen 1:1 ans Handy.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
