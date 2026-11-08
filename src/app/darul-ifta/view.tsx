"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { EmptyState, PageHero, SectionHeading } from "@/components/ui";
import { FatwaCard } from "@/components/cards";
import { useI18n } from "@/i18n/provider";
import { FATWA_CATEGORIES, IMAGES } from "@/lib/site";
import { formatDate } from "@/lib/format";

type FatwaRow = {
  id: number; slug: string; fatwaNumber: string; category: string; questionEn: string; questionUr: string;
  answerEn: string; answerUr: string; approvedBy: string; publishedAt: Date | string; muftiName: string | null;
};

export function DarulIftaView({ fatawa }: { fatawa: FatwaRow[] }) {
  const { t, pick } = useI18n();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = fatawa
    .filter((fatwa) => {
      const matchesCategory = category === "all" || fatwa.category.toLowerCase().includes(category.toLowerCase());
      const haystack = `${fatwa.questionEn} ${fatwa.questionUr} ${fatwa.answerEn} ${fatwa.category} ${fatwa.fatwaNumber}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    })
    .sort((a, b) =>
      sort === "number"
        ? b.fatwaNumber.localeCompare(a.fatwaNumber)
        : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return (
    <>
      <PageHero
        image={IMAGES.quran}
        eyebrowEn="Darul Ifta"
        eyebrowUr="دارالافتاء"
        titleEn="Darul Ifta"
        titleUr="دارالافتاء"
        subtitleEn={t("fatwa.subtitle")}
        subtitleUr={t("fatwa.subtitle")}
      >
        <Link href="/darul-ifta/ask" className="btn btn-gold"><Icon name="question" size={16} /> {t("fatwa.submit")}</Link>
        <a href="#recent" className="btn btn-ghost-light">{t("fatwa.recent")}</a>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <div className="card p-4">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink/40"><Icon name="search" size={18} /></span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input !ps-10"
                placeholder={t("fatwa.search")}
                aria-label={t("fatwa.search")}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCategory("all")}
                aria-pressed={category === "all"}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${category === "all" ? "border-deep bg-deep text-white" : "border-deep/20 text-deep hover:bg-light"}`}
              >
                {t("common.all")}
              </button>
              {FATWA_CATEGORIES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.en)}
                  aria-pressed={category === item.en}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${category === item.en ? "border-deep bg-deep text-white" : "border-deep/20 text-deep hover:bg-light"}`}
                >
                  {pick(item.en, item.ur)}
                </button>
              ))}
            </div>
          </div>

          <div id="recent" className="mt-6 flex flex-wrap items-end justify-between gap-3">
            <SectionHeading eyebrow={t("fatwa.recent")} titleEn="Recent fatawa" titleUr="حالیہ فتاویٰ" subtitleEn={`${filtered.length} ${t("library.results")}`} subtitleUr={`${filtered.length} ${t("library.results")}`} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select !w-56" aria-label={t("library.sort")}>
              <option value="newest">{t("common.newest")}</option>
              <option value="number">{pick("By fatwa number", "فتویٰ نمبر کے مطابق")}</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((fatwa) => <FatwaCard key={fatwa.id} {...fatwa} />)}
          </div>
          {filtered.length === 0 && <EmptyState>{t("common.notFound")}</EmptyState>}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name="shield" size={20} /></span>
              <h2 className="mt-2 text-lg">{pick("Approval process", "منظوری کا عمل")}</h2>
              <p className="mt-1 text-sm text-ink/75">
                {pick(
                  "Every answer is drafted by a researcher, reviewed by a qualified Mufti, and only published after the Darul Ifta board records its approval, with the Mufti's name and date attached to the fatwa.",
                  "ہر جواب محقق تیار کرتا ہے، مستند مفتی جائزہ لیتا ہے، اور دارالافتاء بورڈ کی منظوری کے بعد ہی شائع ہوتا ہے — مفتی کا نام اور تاریخ فتویٰ کے ساتھ درج ہوتی ہے۔",
                )}
              </p>
            </div>
            <div className="card p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name="lock" size={20} /></span>
              <h2 className="mt-2 text-lg">{pick("Privacy of askers", "سائلین کی رازداری")}</h2>
              <p className="mt-1 text-sm text-ink/75">
                {pick(
                  "Names, phone numbers and emails are removed before publication. Anonymous questions are welcome. Your tracking number lets you follow up without revealing your identity.",
                  "نام، فون اور ای میل اشاعت سے پہلے حذف کر دیے جاتے ہیں۔ گمنام سوالات قابلِ قبول ہیں۔ ٹریکنگ نمبر سے آپ اپنی شناخت ظاہر کیے بغیر پیروی کر سکتے ہیں۔",
                )}
              </p>
            </div>
            <div className="card p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name="calendar" size={20} /></span>
              <h2 className="mt-2 text-lg">{pick("Response time", "جواب کا وقت")}</h2>
              <p className="mt-1 text-sm text-ink/75">
                {pick(
                  "Urgent questions on Zakat deadlines, Qurbani and inheritance are prioritised. Typical response time is 3–7 working days; the latest answer was published on ",
                  "زکوٰۃ کی آخری تاریخ، قربانی اور وراثت کے فوری سوالات کو ترجیح دی جاتی ہے۔ عام جواب 3 تا 7 کاروباری دن میں۔ آخری جواب شائع ہوا: ",
                )}
                {fatawa[0] ? formatDate(fatawa[0].publishedAt) : "—"}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
