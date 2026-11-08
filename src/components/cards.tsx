"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "@/i18n/provider";
import { ShareButton } from "./ui";
import { formatShortDate, formatDate, humanFileSize, whatsappLink } from "@/lib/format";
import { PROGRAMME_ICONS } from "@/lib/site";

export function DateBadge({ date }: { date: Date | string }) {
  const { day, month, year } = formatShortDate(date);
  return (
    <span className="inline-flex w-14 shrink-0 flex-col items-center rounded-md bg-deep px-1 py-1.5 text-white">
      <span className="text-lg font-bold leading-none">{day}</span>
      <span className="text-[0.62rem] font-semibold uppercase tracking-wide text-gold">{month}</span>
      <span className="text-[0.6rem] text-white/70">{year}</span>
    </span>
  );
}

export function ProgrammeCard({
  slug,
  titleEn,
  titleUr,
  level,
  durationYears,
  mode,
  summaryEn,
  summaryUr,
  feePerYear,
}: {
  slug: string;
  titleEn: string;
  titleUr: string;
  level: string;
  durationYears: string;
  mode: string;
  summaryEn: string;
  summaryUr: string;
  feePerYear: number;
}) {
  const { pick, t } = useI18n();
  const icon = (PROGRAMME_ICONS[slug] ?? "book") as IconName;
  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-light text-deep">
          <Icon name={icon} size={22} />
        </span>
        <div className="flex flex-wrap justify-end gap-1">
          <span className="badge">{level}</span>
          <span className="badge badge-gold">{durationYears} {t("academics.years")}</span>
        </div>
      </div>
      <h3 className="mt-3 text-xl font-bold leading-snug">
        <Link href={`/academics/${slug}`} className="hover:text-fresh">{pick(titleEn, titleUr)}</Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink/75">{pick(summaryEn, summaryUr)}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-deep/10 pt-3 text-xs text-ink/65">
        <span className="inline-flex items-center gap-1"><Icon name="clock" size={14} className="text-fresh" />{mode}</span>
        <span className="font-semibold text-deep">
          {feePerYear > 0 ? `PKR ${feePerYear.toLocaleString("en-PK")} ${t("academics.perYear")}` : pick("Sponsored — no tuition", "کفالت شدہ — کوئی فیس نہیں")}
        </span>
      </div>
      <Link href={`/academics/${slug}`} className="btn btn-outline mt-3 w-full !text-xs">
        {t("home.viewProgramme")} <Icon name="arrow" size={14} />
      </Link>
    </article>
  );
}

export function EventCard({
  slug,
  titleEn,
  titleUr,
  descriptionEn,
  descriptionUr,
  startAt,
  endAt,
  venueEn,
  venueUr,
  type,
  coverImage,
  liveStreamUrl,
  phase,
}: {
  slug: string;
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  startAt: Date | string;
  endAt: Date | string;
  venueEn: string;
  venueUr: string;
  type: string;
  coverImage?: string | null;
  liveStreamUrl?: string | null;
  phase: "upcoming" | "ongoing" | "past";
}) {
  const { pick, t } = useI18n();
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {coverImage && (
        <Link href={`/events/${slug}`} className="block aspect-[16/9] overflow-hidden">
          <img src={coverImage} alt={pick(titleEn, titleUr)} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <DateBadge date={startAt} />
          <div>
            <div className="flex flex-wrap gap-1.5">
              <span className="badge">{type}</span>
              {phase === "ongoing" && <span className="badge badge-gold">{t("home.liveNow")}</span>}
              {phase === "past" && <span className="badge badge-grey">{t("home.past")}</span>}
            </div>
            <h3 className="mt-1.5 text-lg font-bold leading-snug">
              <Link href={`/events/${slug}`} className="hover:text-fresh">{pick(titleEn, titleUr)}</Link>
            </h3>
          </div>
        </div>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink/75">{pick(descriptionEn, descriptionUr)}</p>
        <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-ink/65">
          <Icon name="pin" size={14} className="text-fresh" /> {pick(venueEn, venueUr)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {phase !== "past" ? (
            <Link href={`/events/${slug}#register`} className="btn btn-green flex-1 !py-2 !text-xs">
              <Icon name="check" size={14} /> {t("common.register")}
            </Link>
          ) : (
            <Link href={`/events/${slug}`} className="btn btn-outline flex-1 !py-2 !text-xs">
              {t("events.gallery")}
            </Link>
          )}
          {liveStreamUrl && phase === "ongoing" && (
            <a href={liveStreamUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold !py-2 !text-xs">
              <Icon name="play" size={14} /> {t("events.stream")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function PdfCard({
  slug,
  titleEn,
  titleUr,
  category,
  speaker,
  resourceDate,
  summaryEn,
  summaryUr,
  pages,
  fileSizeKb,
  language,
  downloads,
}: {
  slug: string;
  titleEn: string;
  titleUr: string;
  category: string;
  speaker?: string | null;
  resourceDate: Date | string;
  summaryEn: string;
  summaryUr: string;
  pages: number;
  fileSizeKb: number;
  language: string;
  downloads: number;
}) {
  const { pick, t } = useI18n();
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/library/${slug}` : `/library/${slug}`;
  return (
    <article className="card flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="badge">{category}</span>
        <span className="text-[0.7rem] text-ink/55">{language}</span>
      </div>
      <h3 className="mt-2 text-lg font-bold leading-snug">
        <Link href={`/library/${slug}`} className="hover:text-fresh">{pick(titleEn, titleUr)}</Link>
      </h3>
      <p className="text-xs text-ink/60">
        {speaker} · {formatDate(resourceDate)}
      </p>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink/75">{pick(summaryEn, summaryUr)}</p>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] text-ink/60">
        <span>{pages} {t("common.pages")}</span>
        <span>{humanFileSize(fileSizeKb)}</span>
        <span>{downloads} {t("library.downloads")}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`/library/${slug}`} className="btn btn-primary !py-1.5 !text-xs">
          <Icon name="book" size={14} /> {t("common.readOnline")}
        </Link>
        <a href={`/api/pdf/library/${slug}?download=1`} className="btn btn-outline !py-1.5 !text-xs">
          <Icon name="download" size={14} /> {t("common.download")}
        </a>
        <ShareButton message={`${pick(titleEn, titleUr)} — ${shareUrl}`} />
      </div>
    </article>
  );
}

export function FatwaCard({
  slug,
  fatwaNumber,
  category,
  questionEn,
  questionUr,
  answerEn,
  answerUr,
  approvedBy,
  publishedAt,
}: {
  slug: string;
  fatwaNumber: string;
  category: string;
  questionEn: string;
  questionUr: string;
  answerEn: string;
  answerUr: string;
  approvedBy: string;
  publishedAt: Date | string;
}) {
  const { pick, t } = useI18n();
  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="badge">{category}</span>
        <span className="text-[0.7rem] font-semibold text-ink/50">{fatwaNumber}</span>
      </div>
      <h3 className="mt-2.5 text-lg font-bold leading-snug">
        <Link href={`/darul-ifta/${slug}`} className="hover:text-fresh">{pick(questionEn, questionUr)}</Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink/75">{pick(answerEn, answerUr)}</p>
      <div className="mt-3 flex items-center justify-between border-t border-deep/10 pt-2.5 text-[0.7rem] text-ink/60">
        <span className="inline-flex items-center gap-1"><Icon name="shield" size={13} className="text-fresh" /> {t("fatwa.approvedBy")}: {approvedBy.split("(")[0]}</span>
        <span>{formatDate(publishedAt)}</span>
      </div>
    </article>
  );
}

export function AnnouncementTicker({ items }: { items: { id: number; titleEn: string; titleUr: string; date: Date | string }[] }) {
  const { pick, t } = useI18n();
  if (items.length === 0) return null;
  const render = (duplicate: boolean) => (
    <span className="inline-flex items-center" aria-hidden={duplicate || undefined}>
      {items.map((item) => (
        <span key={`${duplicate ? "d" : "s"}-${item.id}`} className="inline-flex items-center gap-2 px-6 text-sm">
          <span className="badge badge-gold !py-0.5 !text-[0.65rem]">{formatDate(item.date)}</span>
          <span className="font-medium text-deep">{pick(item.titleEn, item.titleUr)}</span>
          <span className="text-fresh">•</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="ticker-wrap overflow-hidden border-y border-deep/10 bg-white">
      <div className="container-x flex items-center gap-3 py-2">
        <span className="badge badge-dark shrink-0 !rounded-md">
          <Icon name="star" size={12} /> {t("home.announcements")}
        </span>
        <div className="min-w-0 flex-1 overflow-hidden" dir="ltr">
          <div className="ticker-track whitespace-nowrap">
            {render(false)}
            {render(true)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryGrid({ photos, columns = 3 }: { photos: { id: number; url: string; captionEn: string; captionUr: string; year: number }[]; columns?: number }) {
  const { pick, t } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    if (active === null) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((i) => (i === null ? 0 : (i + 1) % photos.length));
      if (event.key === "ArrowLeft") setActive((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, photos.length]);
  if (photos.length === 0) return null;
  return (
    <>
      <div className={`masonry ${columns === 2 ? "lg:columns-2" : ""}`}>
        {photos.map((photo, index) => (
          <figure key={photo.id} className="overflow-hidden rounded-lg border border-deep/10 bg-white shadow-sm">
            <button type="button" onClick={() => setActive(index)} className="block w-full focus-visible:outline-offset-4" aria-label={`${t("gallery.title")}: ${pick(photo.captionEn, photo.captionUr)}`}>
              <img src={photo.url} alt={pick(photo.captionEn, photo.captionUr)} loading="lazy" className="w-full object-cover transition duration-500 hover:scale-[1.03]" />
            </button>
            <figcaption className="px-3 py-2 text-xs text-ink/70">{pick(photo.captionEn, photo.captionUr)}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink/50">{t("gallery.lightboxHint")}</p>
      {active !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/90 p-4" role="dialog" aria-modal="true" aria-label={t("gallery.title")}>
          <button type="button" onClick={() => setActive(null)} className="absolute end-4 top-4 rounded-full bg-white/15 p-2 text-white" aria-label={t("nav.close")}>
            <Icon name="close" size={22} />
          </button>
          <img src={photos[active].url} alt={pick(photos[active].captionEn, photos[active].captionUr)} className="max-h-[78vh] w-auto max-w-full rounded-md object-contain" />
          <p className="mt-3 max-w-xl text-center text-sm text-white">{pick(photos[active].captionEn, photos[active].captionUr)}</p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => setActive((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length))} className="btn btn-ghost-light !py-2" aria-label="Previous">
              <Icon name="arrowLeft" size={16} />
            </button>
            <button type="button" onClick={() => setActive((i) => (i === null ? 0 : (i + 1) % photos.length))} className="btn btn-ghost-light !py-2" aria-label="Next">
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function TestimonialCarousel({ items }: { items: { id: number; name: string; roleEn: string; roleUr: string; quoteEn: string; quoteUr: string }[] }) {
  const { pick, t } = useI18n();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => window.clearInterval(id);
  }, [items.length]);
  if (items.length === 0) return null;
  const active = items[index];
  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <span className="font-display text-5xl text-fresh/40" aria-hidden="true">&ldquo;</span>
      <blockquote className="min-h-[7rem] text-lg font-medium leading-relaxed text-ink/85">
        {pick(active.quoteEn, active.quoteUr)}
      </blockquote>
      <p className="mt-3 font-display text-lg font-bold text-deep">{active.name}</p>
      <p className="text-xs text-ink/60">{pick(active.roleEn, active.roleUr)}</p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button type="button" onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)} className="rounded-full border border-deep/20 p-1.5 text-deep hover:bg-light" aria-label="Previous testimonial">
          <Icon name="arrowLeft" size={16} />
        </button>
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`${t("home.testimonials")} ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${i === index ? "bg-deep" : "bg-deep/25"}`}
          />
        ))}
        <button type="button" onClick={() => setIndex((i) => (i + 1) % items.length)} className="rounded-full border border-deep/20 p-1.5 text-deep hover:bg-light" aria-label="Next testimonial">
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </div>
  );
}

export function ArticleCard({ slug, titleEn, titleUr, excerptEn, excerptUr, image, category, publishedAt }: { slug: string; titleEn: string; titleUr: string; excerptEn: string; excerptUr: string; image?: string | null; category: string; publishedAt: Date | string }) {
  const { pick } = useI18n();
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {image && <img src={image} alt={pick(titleEn, titleUr)} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-[0.7rem] text-ink/55">
          <span className="badge">{category}</span>
          <time dateTime={new Date(publishedAt).toISOString()}>{formatDate(publishedAt)}</time>
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug">
          <Link href={`/articles#${slug}`} className="hover:text-fresh">{pick(titleEn, titleUr)}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-ink/75">{pick(excerptEn, excerptUr)}</p>
        <Link href={`/articles#${slug}`} className="link-underline mt-3 inline-flex items-center gap-1 text-sm">
          {pick("Read article", "مضمون پڑھیں")} <Icon name="arrow" size={14} />
        </Link>
      </div>
    </article>
  );
}

export function WhatsAppHelp({ message }: { message: string }) {
  const { t } = useI18n();
  return (
    <a href={whatsappLink("+923001234567", message)} target="_blank" rel="noopener noreferrer" className="btn btn-outline !py-1.5 !text-xs">
      <Icon name="whatsapp" size={14} /> {t("nav.whatsapp")}
    </a>
  );
}
