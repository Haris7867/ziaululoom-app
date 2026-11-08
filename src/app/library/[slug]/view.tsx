"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Callout, ShareButton } from "@/components/ui";
import { useI18n } from "@/i18n/provider";
import { formatDate, humanFileSize } from "@/lib/format";

type Resource = {
  id: number; slug: string; titleEn: string; titleUr: string; category: string; speaker: string | null;
  resourceDate: Date | string; tags: unknown; pages: number; fileSizeKb: number; language: string;
  summaryEn: string; summaryUr: string; downloads: number; surah: string | null; book: string | null; topic: string | null;
};

export function LibraryReader({ resource, related }: { resource: Resource; related: { slug: string; titleEn: string; titleUr: string }[] }) {
  const { t, pick } = useI18n();
  const tags = Array.isArray(resource.tags) ? (resource.tags as string[]) : [];
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/library/${resource.slug}` : `/library/${resource.slug}`;

  return (
    <section className="section">
      <div className="container-x grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Link href="/library" className="link-underline text-sm">← {t("library.title")}</Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="badge">{resource.category}</span>
            <span className="badge badge-gold">{resource.language}</span>
            {resource.topic && <span className="badge">{resource.topic}</span>}
            {resource.surah && <span className="badge">{t("library.surah")}: {resource.surah}</span>}
            {resource.book && <span className="badge">{t("library.book")}: {resource.book}</span>}
          </div>
          <h1 className="mt-2 text-3xl font-bold">{pick(resource.titleEn, resource.titleUr)}</h1>
          <p className="mt-1 text-sm text-ink/65">
            {resource.speaker} · {formatDate(resource.resourceDate)} · {resource.pages} {t("common.pages")} · {humanFileSize(resource.fileSizeKb)} · {resource.downloads} {t("library.downloads")}
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-deep/15 bg-light/50">
            <div className="flex items-center justify-between border-b border-deep/10 bg-white px-3 py-2 text-xs font-semibold text-deep">
              <span className="inline-flex items-center gap-1.5"><Icon name="book" size={14} /> {t("library.reader")}</span>
              <a href={`/api/pdf/library/${resource.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fresh hover:text-deep">
                <Icon name="external" size={13} /> {pick("Open in new tab", "نئی ٹیب میں کھولیں")}
              </a>
            </div>
            <iframe
              title={pick(resource.titleEn, resource.titleUr)}
              src={`/api/pdf/library/${resource.slug}#view=FitH`}
              className="h-[70vh] min-h-[420px] w-full"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-xs text-ink/55">{t("library.readerNote")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`/api/pdf/library/${resource.slug}?download=1`} className="btn btn-primary"><Icon name="download" size={16} /> {t("common.download")}</a>
            <ShareButton message={`${pick(resource.titleEn, resource.titleUr)} — ${shareUrl}`} />
            <button type="button" onClick={() => window.print()} className="btn btn-outline"><Icon name="print" size={15} /> {t("common.print")}</button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg">{pick("Summary", "خلاصہ")}</h2>
            <p className="mt-1.5 text-sm text-ink/80">{pick(resource.summaryEn, resource.summaryUr)}</p>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => <span key={tag} className="badge !text-[0.65rem]">{tag}</span>)}
              </div>
            )}
          </div>
          <Callout icon="download" title={pick("Downloads & reprints", "ڈاؤن لوڈ و دوبارہ اشاعت")}>
            {pick(
              "Downloading increments the public counter. Admin can replace the underlying file without changing this link, and schedule publication ahead of time.",
              "ڈاؤن لوڈ سے عوامی کاؤنٹر بڑھتا ہے۔ ایڈمن اصل فائل تبدیل کر سکتا ہے بغیر لنک بدلے، اور اشاعت کا وقت پہلے سے مقرر کر سکتا ہے۔",
            )}
          </Callout>
          {related.length > 0 && (
            <div className="card p-5">
              <h2 className="text-lg">{pick("More in this category", "اسی زمرے میں مزید")}</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {related.map((item) => (
                  <li key={item.slug}><Link href={`/library/${item.slug}`} className="link-underline">{pick(item.titleEn, item.titleUr)}</Link></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
