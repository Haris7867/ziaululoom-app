import type { Metadata } from "next";
import { GalleryGrid } from "@/components/cards";
import { PageHero } from "@/components/ui";
import { Bi } from "@/components/Bi";
import { GALLERY_SECTIONS } from "@/lib/gallery-data";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Photographs from Jamia Ghousia Zia-Ul-Uloom: the Rector, Khatm-e-Bukhari, Milad conference, prize distribution and more.",
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Photo Gallery", images: ["/images/gallery/bukhari-01.jpg"] },
};

export default function GalleryPage() {
  const sections = GALLERY_SECTIONS.filter((section) => section.photos.length > 0);
  let nextId = 1;

  return (
    <>
      <PageHero
        image="/images/gallery/bukhari-01.jpg"
        eyebrowEn="Gallery"
        eyebrowUr="گیلری"
        titleEn="Photo Gallery"
        titleUr="تصویری گیلری"
        subtitleEn="Moments from our programmes and events, section by section."
        subtitleUr="ہمارے پروگراموں اور تقریبات کے لمحات، حصہ وار۔"
      />

      <nav aria-label="Gallery sections" className="sticky top-16 z-30 border-b border-deep/10 bg-white/95 backdrop-blur">
        <div className="container-x flex gap-2 overflow-x-auto py-2.5 text-xs">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="shrink-0 rounded-full border border-deep/20 px-3 py-1.5 font-semibold text-deep hover:bg-light">
              <Bi en={section.titleEn} ur={section.titleUr} />
            </a>
          ))}
        </div>
      </nav>

      {sections.map((section, index) => (
        <section key={section.id} id={section.id} className={`section scroll-mt-28 ${index % 2 === 1 ? "bg-light/60" : ""}`}>
          <div className="container-x">
            <div className="mb-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-fresh">
                <Bi en={section.branchEn} ur={section.branchUr} />{section.date ? ` · ${section.date}` : ""}
              </p>
              <h2 className="mt-1 text-3xl md:text-4xl"><Bi en={section.titleEn} ur={section.titleUr} /></h2>
              <p className="mt-1 max-w-2xl text-ink/75"><Bi en={section.descEn} ur={section.descUr} /></p>
            </div>
            <GalleryGrid
              photos={section.photos.map((photo) => ({
                id: nextId++,
                url: `/images/gallery/${photo.file}.jpg`,
                captionEn: photo.captionEn,
                captionUr: photo.captionUr,
                year: 0,
              }))}
            />
          </div>
        </section>
      ))}
    </>
  );
}
