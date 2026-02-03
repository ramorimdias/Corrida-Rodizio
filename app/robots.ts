import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/sala/"],
    },
    sitemap: "https://rodiziorace.mechama.eu/sitemap.xml",
  };
}
