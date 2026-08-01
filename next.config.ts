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
  /**
   * Dauerhafte Weiterleitungen (301).
   *
   * Wird gebraucht, sobald ein Ratgeber-Slug umzieht: Die alte URL ist dann
   * sofort tot, und daran hängen Rankings, externe Links und Lesezeichen.
   * Eine 301 überträgt die aufgebaute Bewertung auf die neue Adresse.
   *
   * REGEL BEIM UMBENENNEN EINES SLUGS:
   *   1. Datei in app/content/ratgeber/ umbenennen und das Feld `slug` anpassen
   *      (Dateiname und slug MÜSSEN übereinstimmen).
   *   2. Interne Verweise auf die alte URL suchen und anpassen.
   *   3. Hier einen Eintrag ergänzen — und ihn NIE wieder entfernen.
   *
   * Zu Punkt 3: Alte Einträge kosten nichts und werden nur dann noch
   * gebraucht, wenn irgendwo im Netz ein Link auf die alte Adresse steht.
   * Genau das lässt sich nicht überblicken. Also stehen lassen.
   *
   * `permanent: true` = 301. Für zeitlich begrenzte Umleitungen `false`
   * (307) nehmen, sonst cachen Browser die Weiterleitung dauerhaft.
   */
  async redirects() {
    return [
      // 31.07.2026 – Umstellung auf Suchsprache. Die alten Slugs trugen den
      // Fachbegriff "Mediation", nach dem Betroffene nicht suchen.
      // Hintergrund: docs/ratgeber-suchsprache.md
      {
        source: '/ratgeber/familien-und-erbmediation',
        destination: '/ratgeber/streit-ums-erbe-in-der-familie',
        permanent: true,
      },
      {
        source: '/ratgeber/pflichtteil-mediation',
        destination: '/ratgeber/pflichtteil-einfordern',
        permanent: true,
      },
      {
        source: '/ratgeber/sorgerecht-umgang-mediation',
        destination: '/ratgeber/sorgerecht-und-umgangsrecht',
        permanent: true,
      },
      {
        source: '/ratgeber/nachbarschaftsstreit-mediation',
        destination: '/ratgeber/nachbarschaftsstreit-was-tun',
        permanent: true,
      },
      // 01.08.2026 – Fallbeispiel-URLs von Namen auf Problem/Lösung umgestellt.
      // "maria-thomas" sagt niemandem etwas, "trennung-mit-kindern" ist das,
      // wonach gesucht wird.
      {
        source: '/cases/maria-thomas',
        destination: '/cases/trennung-mit-kindern',
        permanent: true,
      },
      {
        source: '/cases/alexa-david',
        destination: '/cases/trennung-patchwork-familie',
        permanent: true,
      },
      {
        source: '/cases/peter-sarah',
        destination: '/cases/trennung-vermoegen-aufteilen',
        permanent: true,
      },
      {
        source: '/cases/rolf-helga',
        destination: '/cases/trennung-nach-langer-ehe',
        permanent: true,
      },
      {
        source: '/cases/carla-marco',
        destination: '/cases/trennung-gemeinsame-firma',
        permanent: true,
      },
      {
        source: '/cases/jens-katarina',
        destination: '/cases/internationale-trennung',
        permanent: true,
      },
      {
        source: '/cases/anna-klaus',
        destination: '/cases/erbstreit-haus-geschwister',
        permanent: true,
      },
      {
        source: '/cases/marie-sophie',
        destination: '/cases/streit-ums-testament',
        permanent: true,
      },
      {
        source: '/cases/familie-weber',
        destination: '/cases/unternehmen-geerbt',
        permanent: true,
      },
    ];
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
