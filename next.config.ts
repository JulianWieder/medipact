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

    // Seit Next 16 ist `qualities` eine Allowlist mit Default `[75]` — ein
    // `quality`-Prop, das hier nicht steht, wird stillschweigend auf den
    // nächsten erlaubten Wert gerundet. 55 ist für die Hero-Fotos gedacht
    // (HeroBackdrop): die liegen hinter kräftigen Schwarz-Gradienten, dort
    // sieht man den Unterschied zu 75 nicht, spart auf dem Handy aber Bytes.
    // 75 bleibt der Default für alle übrigen Bilder.
    qualities: [55, 75],

    // Ein Jahr statt der 4 Stunden Default. Die Quellbilder sind alle statische
    // Imports aus fotos/ — ihr Dateiname enthält einen Inhalts-Hash, ändert
    // sich der Inhalt, ändert sich die URL. Ein kurzes TTL bringt hier also
    // nichts und kostet nur: nach jedem Ablauf transkodiert der VPS dieselbe
    // Variante neu, und AVIF-Encoding eines 1600px-Fotos dauert auf einem
    // geteilten Kern rund eine Sekunde. Genau das trifft das LCP-Bild.
    minimumCacheTTL: 31536000,
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
      // 15.08.2026 – Die Angebotsseite fuer Trennung/Scheidung traegt das
      // Keyword-Kompositum jetzt auch in der URL. "trennung" war der Begriff
      // aus der eigenen Angebotslogik, gesucht wird nach "Scheidungsmediation"
      // (beste Position der Domain im Cluster: "scheidungsmediation kosten",
      // Pos. 5,5). Die alte URL hatte in drei Monaten 6 Impressionen, es ging
      // also keine Historie verloren – anders als bei /konflikte und
      // /konflikte/odr, weshalb der Umzug am 27.07. noch abgelehnt wurde.
      // Hintergrund: docs/kaufabsicht-scheidung.md
      {
        source: '/konflikte/trennung',
        destination: '/scheidungsmediation',
        permanent: true,
      },
      {
        source: '/en/konflikte/trennung',
        destination: '/en/scheidungsmediation',
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
      // Der Service Worker darf NIE aus dem Browser-Cache kommen. Er ist die
      // einzige Datei, die sich selbst ersetzt: liefert ein Zwischenspeicher
      // die alte Fassung aus, bleibt ein fehlerhafter Worker beliebig lange
      // aktiv, und niemand kann ihn per Deploy loswerden.
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/kalender.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
