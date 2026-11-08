import type { Metadata } from "next";
import Link from "next/link";
import { getEvents, getGallery } from "@/lib/data";
import { EventCard, GalleryGrid } from "@/components/cards";
import { PageHero, SectionHeading, EmptyState } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { IMAGES } from "@/lib/site";
import { eventPhase } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events & Photo Galleries",
  description:
    "Ijtema, lectures, graduations, workshops, Ramadan programmes and Qurbani distribution — with photo galleries. Filter by year, type and venue, or watch the live stream.",
  alternates: { canonical: "/events" },
  openGraph: { title: "Events & Photo Galleries", images: ["/images/graduation.jpg"] },
};

const TYPES = ["Ijtema", "Lecture", "Graduation", "Workshop", "Ramadan", "Qurbani"];

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

  const link = (params: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    const merged = { ...filters, ...params };
    for (const [key, value] of Object.entries(merged)) if (value) search.set(key, value);
    const qs = search.toString();
    return `/events${qs ? `?${qs}` : ""}`;
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
          <div className="card p-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <span className="font-bold uppercase tracking-wide text-deep"><T k="events.type" /></span>
              <Link href={link({ type: undefined })} className={`rounded-full border px-2.5 py-1 font-semibold ${!filters.type ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}><T k="common.all" /></Link>
              {TYPES.map((type) => (
                <Link key={type} href={link({ type })} className={`rounded-full border px-2.5 py-1 font-semibold ${filters.type === type ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}>{type}</Link>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <span className="font-bold uppercase tracking-wide text-deep"><T k="gallery.year" /></span>
              <Link href={link({ year: undefined })} className={`rounded-full border px-2.5 py-1 font-semibold ${!filters.year ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}><T k="common.all" /></Link>
              {years.map((year) => (
                <Link key={year} href={link({ year: String(year) })} className={`rounded-full border px-2.5 py-1 font-semibold ${filters.year === String(year) ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}>{year}</Link>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <span className="font-bold uppercase tracking-wide text-deep"><T k="events.venue" /></span>
              <Link href={link({ venue: undefined })} className={`rounded-full border px-2.5 py-1 font-semibold ${!filters.venue ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}><T k="common.all" /></Link>
              {venues.map((venue) => (
                <Link key={venue} href={link({ venue })} className={`rounded-full border px-2.5 py-1 font-semibold ${filters.venue === venue ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}>{venue.split(",")[0]}</Link>
              ))}
            </div>
          </div>

          {(["ongoing", "upcoming", "past"] as const).map((phase) =>
            grouped[phase].length > 0 ? (
              <div key={phase} className="mt-8">
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
          <GalleryGrid photos={photos.slice(0, 6)} />
        </div>
      </section>
    </>
  );
}
