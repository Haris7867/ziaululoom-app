import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getEvents, getGallery } from "@/lib/data";
import { Bi, DateText, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { GalleryGrid } from "@/components/cards";
import { Callout, SectionHeading } from "@/components/ui";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { formatDateTime, eventPhase } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.titleEn,
    description: event.descriptionEn.slice(0, 158),
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: { title: event.titleEn, description: event.descriptionEn.slice(0, 158), images: [event.coverImage ?? "/images/campus-hero.jpg"] },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, photos, all] = await Promise.all([getEvent(slug), getGallery(), getEvents()]);
  if (!event) notFound();
  const eventPhotos = photos.filter((photo) => photo.eventId === event.id || photo.eventType === event.type).slice(0, 9);
  const phase = eventPhase(event.startAt, event.endAt);
  const speakers = Array.isArray(event.speakers) ? (event.speakers as { nameEn: string; nameUr: string }[]) : [];
  const schedule = Array.isArray(event.schedule) ? (event.schedule as { time: string; en: string; ur: string }[]) : [];
  const others = all.filter((item) => item.slug !== event.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.titleEn,
          description: event.descriptionEn,
          startDate: new Date(event.startAt).toISOString(),
          endDate: new Date(event.endAt).toISOString(),
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: event.venueEn, address: "Canal Road, Lahore, Pakistan" },
          image: event.coverImage,
          organizer: { "@type": "Organization", name: "Al-Noor Islamic University", url: "/" },
        }}
      />
      <section className="relative isolate overflow-hidden bg-deep text-white">
        <img src={event.coverImage ?? "/images/campus-hero.jpg"} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/95 to-deep/50" />
        <div className="container-x relative py-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-gold">{event.type}</span>
            {phase === "ongoing" && <span className="badge badge-dark"><T k="home.liveNow" /></span>}
            <span className="badge">{phase}</span>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold text-white sm:text-4xl md:text-5xl"><Bi en={event.titleEn} ur={event.titleUr} /></h1>
          <p className="mt-3 max-w-2xl text-white/85"><Bi en={event.descriptionEn} ur={event.descriptionUr} /></p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5"><Icon name="calendar" size={16} className="text-gold" /> {formatDateTime(event.startAt)}</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="pin" size={16} className="text-gold" /> <Bi en={event.venueEn} ur={event.venueUr} /></span>
            <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={16} className="text-gold" /> {formatDateTime(event.endAt)}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {phase !== "past" && <a href="#register" className="btn btn-green"><Icon name="check" size={16} /> <T k="common.register" /></a>}
            {event.liveStreamUrl && <a href={event.liveStreamUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><Icon name="play" size={16} /> <T k="events.stream" /></a>}
            <Link href="/gallery" className="btn btn-ghost-light"><T k="events.gallery" /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="card p-5">
              <SectionHeading titleEn="About this event" titleUr="اس تقریب کے بارے میں" />
              <p className="text-ink/80"><Bi en={event.descriptionEn} ur={event.descriptionUr} /></p>
              {schedule.length > 0 && (
                <>
                  <h3 className="mt-4 text-lg"><T k="common.schedule" /></h3>
                  <ul className="mt-2 divide-y divide-deep/10 text-sm">
                    {schedule.map((item) => (
                      <li key={item.time} className="flex gap-3 py-2">
                        <span className="font-mono text-xs font-bold text-deep" dir="ltr">{item.time}</span>
                        <span className="text-ink/80"><Bi en={item.en} ur={item.ur} /></span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {speakers.length > 0 && (
                <>
                  <h3 className="mt-4 text-lg"><T k="common.speakers" /></h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {speakers.map((speaker) => (
                      <span key={speaker.nameEn} className="rounded-md border border-deep/15 bg-light px-2.5 py-1 text-xs font-semibold text-deep">
                        <Bi en={speaker.nameEn} ur={speaker.nameUr} />
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {event.videoUrl && (
              <div className="overflow-hidden rounded-lg border border-deep/15">
                <iframe title={event.titleEn} src={event.videoUrl} className="aspect-video w-full" loading="lazy" allowFullScreen />
              </div>
            )}

            <div>
              <SectionHeading eyebrow="Gallery" titleEn="Photo gallery" titleUr="تصویری گیلری" action={<Link href="/gallery" className="btn btn-outline"><T k="common.viewAll" /></Link>} />
              {eventPhotos.length > 0 ? <GalleryGrid photos={eventPhotos} /> : <p className="text-sm text-ink/60"><T k="common.notFound" /></p>}
            </div>
          </div>

          <aside className="space-y-4">
            <div id="register" className="card p-5">
              <h2 className="text-xl"><T k="common.register" /></h2>
              <p className="mb-3 text-xs text-ink/60"><T k="events.registerNote" /></p>
              <EnquiryForm variant="event" compact />
            </div>
            <Callout icon="pin" title="Venue">
              <Bi en={event.venueEn} ur={event.venueUr} /> — <T k="academics.academicCalendar" />
            </Callout>
            <div className="card p-5">
              <h2 className="text-lg">Other events</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {others.map((item) => (
                  <li key={item.slug}><Link href={`/events/${item.slug}`} className="link-underline"><Bi en={item.titleEn} ur={item.titleUr} /></Link> — <DateText value={item.startAt} /></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
