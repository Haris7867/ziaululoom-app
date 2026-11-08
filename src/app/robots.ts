import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://alnoor.edu.pk").replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/qurbani/pay/", "/qurbani/receipt/", "/donate/thank-you"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
