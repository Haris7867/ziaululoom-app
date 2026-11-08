import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPdfResource, getPdfResources } from "@/lib/data";
import { LibraryReader } from "./view";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getPdfResource(slug);
  if (!resource) return { title: "Resource not found" };
  return {
    title: resource.titleEn,
    description: resource.summaryEn.slice(0, 158),
    alternates: { canonical: `/library/${resource.slug}` },
    openGraph: { title: resource.titleEn, description: resource.summaryEn.slice(0, 158), images: ["/images/library.jpg"] },
  };
}

export default async function LibraryReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [resource, all] = await Promise.all([getPdfResource(slug), getPdfResources()]);
  if (!resource) notFound();
  const related = all.filter((item) => item.slug !== resource.slug && item.category === resource.category).slice(0, 3);
  return <LibraryReader resource={resource} related={related} />;
}
