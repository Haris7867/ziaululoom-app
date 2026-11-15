import type { Metadata } from "next";
import Link from "next/link";
import { getEvents, getGallery } from "@/lib/data";
import { EventCard, GalleryGrid, StaticGallery } from "@/components/cards";
import { PageHero, SectionHeading, EmptyState } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { IMAGES } from "@/lib/site";
import { eventPhase } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events & Photo Galleries",
  description:
    "Ijtema, lectures, graduations, workshops, Ramadan programmes and Qurbani distribution — with photo galleries. Browse the programmes running now and the photo galleries.",
  alternates: { canonical: "/events" },
  openGraph: { title: "Events & Photo Galleries", images: ["/images/graduation.jpg"] },
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; type?: string; venue?: string }>;
}) {
  const filters = await searchParams;
  const [events, photos] = await Promise.all([getEvents(), getGallery()]);
  const years = Array.from(new Set(events.map((event) => new Date(event.startAt).getFullYear()))).sort((a, b) => b - a);
  const venues = Array.from(new Set(events.map((event) => event.venueEn)));

  const filtered = events.filter((event) => {
    const matchYear = !filters.year || String(new Date(event.startAt).getFullYear()) === filters.year;
    const matchType = !filters.type || event.type === filters.type;
    const matchVenue = !filters.venue || event.venueEn === filters.venue;
    return matchYear && matchType && matchVenue;
  });
  const grouped = {
    upcoming: filtered.filter((event) => eventPhase(event.startAt, event.endAt) === "upcoming"),
    ongoing: filtered.filter((event) => eventPhase(event.startAt, event.endAt) === "ongoing"),
    past: filtered.filter((event) => eventPhase(event.startAt, event.endAt) === "past").reverse(),
  };

  return (
    <>
      <PageHero
        image={IMAGES.graduation}
        eyebrowEn="Events"
        eyebrowUr="تقریبات"
        titleEn="Events & Photo Galleries"
        titleUr="تقریبات و تصویری گیلریاں"
        subtitleEn="Ijtema, lectures, graduations, workshops, Ramadan programmes and Qurbani distribution."
        subtitleUr="اجتماع، لیکچرز، کانووکیشن، ورکشاپس، رمضان پروگرام اور قربانی کی تقسیم۔"
      >
        <Link href="/gallery" className="btn btn-gold"><Icon name="star" size={15} /> <T k="gallery.title" /></Link>
        <Link href="/contact" className="btn btn-ghost-light"><T k="common.register" /></Link>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <StaticGallery count={3} />

          {(["ongoing", "upcoming", "past"] as const).map((phase) =>
            grouped[phase].length > 0 ? (
              <div key={phase} className="mt-10">
                <SectionHeading
                  eyebrow={phase === "ongoing" ? "Live now" : phase === "upcoming" ? "Upcoming" : "Archive"}
                  titleEn={phase === "ongoing" ? "Happening now" : phase === "upcoming" ? "Upcoming events" : "Past events"}
                  titleUr={phase === "ongoing" ? "ابھی جاری" : phase === "upcoming" ? "آنے والی تقریبات" : "گزشتہ تقریبات"}
                />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {grouped[phase].map((event) => <EventCard key={event.id} {...event} phase={phase} />)}
                </div>
              </div>
            ) : null,
          )}
          {grouped.upcoming.length === 0 && grouped.ongoing.length === 0 && grouped.past.length === 0 && <EmptyState><T k="common.notFound" /></EmptyState>}
        </div>
      </section>

      <section className="section bg-light/60">
        <div className="container-x">
          <SectionHeading eyebrow="Gallery" titleEn="Latest photographs" titleUr="تازہ ترین تصاویر" subtitleEn="Published with permission; faces are avoided unless approved." subtitleUr="اجازت کے ساتھ شائع؛ منظوری کے بغیر چہرے شامل نہیں۔" action={<Link href="/gallery" className="btn btn-outline"><T k="common.viewAll" /></Link>} />
          {photos.length > 0 ? <GalleryGrid photos={photos.slice(0, 6)} /> : <StaticGallery count={6} />}
        </div>
      </section>
    </>
  );
}
