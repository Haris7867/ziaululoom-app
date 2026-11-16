import type { MetadataRoute } from "next";
import { getEvents, getFatawa, getPdfResources, getProgrammes } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://ziaululoom.com").replace(/\/$/, "");
  const staticPaths = [
    "", "/about", "/academics", "/admissions", "/library", "/darul-ifta", "/darul-ifta/ask",
    "/events", "/gallery", "/articles", "/qurbani", "/qurbani/book", "/qurbani/status", "/qurbani/faq",
    "/donate", "/students", "/contact", "/seasonal", "/policies/privacy", "/policies/terms", "/policies/refund",
    "/policies/accessibility", "/admin/login",
  ];

  let dynamicPaths: { path: string; date?: Date }[] = [];
  try {
    const [programmes, fatawa, pdfs, events] = await Promise.all([getProgrammes(), getFatawa(), getPdfResources(), getEvents()]);
    dynamicPaths = [
      ...programmes.map((p) => ({ path: `/academics/${p.slug}` })),
      ...fatawa.map((f) => ({ path: `/darul-ifta/${f.slug}`, date: new Date(f.publishedAt) })),
      ...pdfs.map((p) => ({ path: `/library/${p.slug}`, date: new Date(p.publishedAt) })),
      ...events.map((e) => ({ path: `/events/${e.slug}`, date: new Date(e.startAt) })),
    ];
  } catch {
    dynamicPaths = [];
  }

  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: (path.startsWith("/admin") ? "yearly" : "monthly") as "monthly" | "yearly",
      priority: path === "" ? 1 : path.includes("qurbani") ? 0.9 : 0.7,
    })),
    ...dynamicPaths.map((item) => ({
      url: `${base}${item.path}`,
      lastModified: item.date ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
