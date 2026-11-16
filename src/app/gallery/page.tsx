import type { Metadata } from "next";
import Link from "next/link";
import { getGallery } from "@/lib/data";
import { GalleryGrid } from "@/components/cards";
import { PageHero, SectionHeading, EmptyState } from "@/components/ui";
import { T } from "@/components/Bi";
import { IMAGES } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Photos from university events, ijtema, graduations, workshops and Qurbani distribution, filterable by year and event type.",
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Photo Gallery", images: ["/images/graduation.jpg"] },
};

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ year?: string; type?: string }> }) {
  const filters = await searchParams;
  const photos = await getGallery();
  const years = Array.from(new Set(photos.map((photo) => photo.year))).sort((a, b) => b - a);
  const types = Array.from(new Set(photos.map((photo) => photo.eventType)));
  const filtered = photos.filter((photo) => (!filters.year || String(photo.year) === filters.year) && (!filters.type || photo.eventType === filters.type));
  const link = (params: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, ...params })) if (value) search.set(key, value);
    const qs = search.toString();
    return `/gallery${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHero image={IMAGES.campus} eyebrowEn="Gallery" eyebrowUr="گیلری" titleEn="Photo Gallery" titleUr="تصویری گیلری" subtitleEn="Photographs from university events, published with permission." subtitleUr="یونیورسٹی تقریبات کی تصاویر، اجازت کے ساتھ شائع شدہ۔" />
      <section className="section">
        <div className="container-x">
          <div className="card mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 p-3 text-xs">
            <Link href={link({ year: undefined })} className={`rounded-full border px-2.5 py-1 font-semibold ${!filters.year ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}><T k="common.all" /></Link>
            {years.map((year) => (
              <Link key={year} href={link({ year: String(year) })} className={`rounded-full border px-2.5 py-1 font-semibold ${filters.year === String(year) ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}>{year}</Link>
            ))}
            <span className="h-4 w-px bg-deep/15" />
            {types.map((type) => (
              <Link key={type} href={link({ type })} className={`rounded-full border px-2.5 py-1 font-semibold ${filters.type === type ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}>{type}</Link>
            ))}
          </div>
          <SectionHeading eyebrow="Album" titleEn="Recent uploads" titleUr="حالیہ اپلوڈز" subtitleEn="Admin bulk uploads compress images to WebP and support English and Urdu captions." subtitleUr="ایڈمن بلک اپ لوڈ تصاویر کو ویب پی میں کمپریس کرتا ہے، انگریزی و اردو کیپشن کے ساتھ۔" />
          {filtered.length > 0 ? <GalleryGrid photos={filtered} /> : <EmptyState><T k="common.notFound" /></EmptyState>}
        </div>
      </section>
    </>
  );
}
