import type { Metadata } from "next";

// Bestaetigungs- und Abmeldeseiten des Newsletters: tragen ein Token in der
// URL und haben ohne Token keinen Inhalt. Die Seiten selbst sind
// Client-Komponenten und koennen keine Metadaten exportieren, deshalb hier.
// Nicht zusaetzlich in robots.ts sperren - sonst sieht Google das noindex nie.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
