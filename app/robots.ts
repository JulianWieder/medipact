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
        // Bestätigungs- und Abmeldeseiten des Newsletters: tragen Token in der
        // URL und haben ohne Token keinen Inhalt.
        "/newsletter/",
      ],
    },
    sitemap: "https://medipact.de/sitemap.xml",
  };
}
