import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/auth/",
        "/workspace/",
        "/invite/",
        // /newsletter/ steht bewusst NICHT mehr hier (13.11.2026): die
        // Bestaetigungs- und Abmeldeseiten tragen noindex
        // (app/newsletter/layout.tsx). Eine Sperre hier verhinderte, dass
        // Google dieses noindex ueberhaupt sieht.
      ],
    },
    sitemap: "https://medipact.de/sitemap.xml",
  };
}
