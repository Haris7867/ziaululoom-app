"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { EmptyState, PageHero } from "@/components/ui";
import { PdfCard } from "@/components/cards";
import { useI18n } from "@/i18n/provider";
import { IMAGES } from "@/lib/site";

type Resource = {
  id: number; slug: string; titleEn: string; titleUr: string; category: string; speaker: string | null;
  resourceDate: Date | string; tags: unknown; pages: number; fileSizeKb: number; language: string;
  summaryEn: string; summaryUr: string; downloads: number; surah: string | null; book: string | null; topic: string | null;
};

const CATEGORIES = ["Khutbat", "Durus-e-Quran", "Durus-e-Hadith", "Fiqh Masail", "Books", "Seerah", "Naat", "Bayans", "Prospectus"];

export function LibraryView({ resources }: { resources: Resource[] }) {
  const { t, pick } = useI18n();
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [language, setLanguage] = useState("all");
  const [speaker, setSpeaker] = useState("all");
  const [topic, setTopic] = useState("all");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");

  const years = useMemo(() => Array.from(new Set(resources.map((r) => new Date(r.resourceDate).getFullYear()))).sort((a, b) => b - a), [resources]);
  const speakers = useMemo(() => Array.from(new Set(resources.map((r) => r.speaker).filter(Boolean) as string[])), [resources]);
  const topics = useMemo(
    () => Array.from(new Set(resources.flatMap((r) => [r.topic, r.surah, r.book]).filter(Boolean) as string[])),
    [resources],
  );

  const filtered = resources
    .filter((resource) => {
      const matchesCategory = category === "all" || resource.category === category;
      const matchesYear = year === "all" || String(new Date(resource.resourceDate).getFullYear()) === year;
      const matchesLanguage = language === "all" || resource.language === language;
      const matchesSpeaker = speaker === "all" || resource.speaker === speaker;
      const matchesTopic = topic === "all" || [resource.topic, resource.surah, resource.book].includes(topic);
      const haystack = `${resource.titleEn} ${resource.titleUr} ${resource.summaryEn} ${resource.summaryUr} ${resource.speaker} ${resource.category}`.toLowerCase();
      return matchesCategory && matchesYear && matchesLanguage && matchesSpeaker && matchesTopic && haystack.includes(query.toLowerCase());
    })
    .sort((a, b) => (sort === "popular" ? b.downloads - a.downloads : new Date(b.resourceDate).getTime() - new Date(a.resourceDate).getTime()));

  return (
    <>
      <PageHero
        image={IMAGES.library}
        eyebrowEn="Library"
        eyebrowUr="کتب خانہ"
        titleEn="Digital Library & PDF Centre"
        titleUr="ڈیجیٹل کتب خانہ و پی ڈی ایف مرکز"
        subtitleEn={t("library.subtitle")}
        subtitleUr={t("library.subtitle")}
      >
        <a href="/api/pdf/prospectus/prospectus-2027" className="btn btn-gold"><Icon name="download" size={16} /> {t("admissions.prospectus")}</a>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <div className="card p-4">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative lg:col-span-2">
                <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink/40"><Icon name="search" size={18} /></span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} className="input !ps-10" placeholder={t("search.placeholder")} aria-label={t("common.search")} />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="select" aria-label={t("library.category")}>
                <option value="all">{t("common.all")} — {t("library.category")}</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={speaker} onChange={(e) => setSpeaker(e.target.value)} className="select" aria-label={t("library.speaker")}>
                <option value="all">{t("common.all")} — {t("library.speaker")}</option>
                {speakers.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="select" aria-label={t("library.year")}>
                <option value="all">{t("common.all")} — {t("library.year")}</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="select" aria-label={t("common.language")}>
                <option value="all">{t("common.all")} — {t("common.language")}</option>
                <option value="Urdu">اردو / Urdu</option>
                <option value="English">English</option>
              </select>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="select" aria-label={t("library.topic")}>
                <option value="all">{t("common.all")} — {t("library.topic")}</option>
                {topics.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="select" aria-label={t("library.sort")}>
                <option value="newest">{t("common.newest")}</option>
                <option value="popular">{t("common.popular")}</option>
              </select>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ink/60">
              <span>{filtered.length} {t("library.results")}</span>
              <button
                type="button"
                onClick={() => { setCategory("all"); setYear("all"); setLanguage("all"); setSpeaker("all"); setTopic("all"); setQuery(""); setSort("newest"); }}
                className="link-underline"
              >
                {t("common.reset")}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => <PdfCard key={resource.id} {...resource} />)}
          </div>
          {filtered.length === 0 && <EmptyState>{t("common.notFound")}</EmptyState>}

          <div className="mt-8 rounded-lg border border-deep/15 bg-light/70 p-5">
            <h2 className="text-xl">{pick("Reading rooms & borrowing", "مطالعہ کمرے اور کتابیں مستعار لینا")}</h2>
            <p className="mt-1.5 text-sm text-ink/75">
              {pick(
                "The physical library holds 18,000 volumes including manuscripts and a reference collection of fiqh and hadith. Members may borrow up to three books for 14 days. The digital editions above are readable in the browser or downloadable for offline study.",
                "کتب خانے میں 18,000 جلدوں کے ساتھ مخطوطات اور فقہ و حدیث کا حوالہ جاتی ذخیرہ موجود ہے۔ ممبران 14 دن کے لیے تین کتابیں مستعار لے سکتے ہیں۔ اوپر دیے ڈیجیٹل نسخے براؤزر میں پڑھیں یا آف لائن مطالعے کے لیے ڈاؤن لوڈ کریں۔",
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
