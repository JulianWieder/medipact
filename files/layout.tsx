import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'medipact – KI-Mediation ab €499',
  description:
    'Konflikte lösen ohne Gericht. KI-basierte Mediation nach dem Harvard-Prinzip. Schneller, günstiger, menschlicher als klassische Mediation.',
  keywords: [
    'Mediation',
    'KI-Mediation',
    'Konfliktlösung',
    'Harvard-Prinzip',
    'Trennung',
    'Erbschaft',
    'Nachbarschaftsstreit',
  ],
  authors: [{ name: 'medipact' }],
  creator: 'medipact',
  publisher: 'medipact',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://medipact.de',
    siteName: 'medipact',
    title: 'medipact – KI-Mediation ab €499',
    description: 'Konflikte lösen ohne Gericht.',
    images: [
      {
        url: 'https://medipact.de/og-image.png',
        width: 1200,
        height: 630,
        alt: 'medipact',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'medipact – KI-Mediation ab €499',
    description: 'Konflikte lösen ohne Gericht.',
    creator: '@medipact_de',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
