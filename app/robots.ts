import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/auth/", "/workspace/", "/invite/"],
    },
    sitemap: "https://medipact.de/sitemap.xml",
  };
}
