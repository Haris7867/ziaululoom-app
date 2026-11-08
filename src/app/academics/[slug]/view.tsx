"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { PageHero, SectionHeading, Prose } from "@/components/ui";
import { useI18n } from "@/i18n/provider";
import { IMAGES } from "@/lib/site";
import { formatPkr } from "@/lib/format";

type CurriculumYear = { labelEn: string; labelUr: string; courses: string[] };
type ProgrammeRow = {
  id: number; slug: string; titleEn: string; titleUr: string; level: string; durationYears: string; mode: string;
  department: string; summaryEn: string; summaryUr: string; overviewEn: string; overviewUr: string;
  eligibilityEn: string; eligibilityUr: string; careersEn: string; careersUr: string;
  feePerYear: number; admissionFee: number; curriculum: unknown;
};

export function ProgrammeDetail({ programme, related }: { programme: ProgrammeRow; related: { id: number; slug: string; titleEn: string; titleUr: string }[] }) {
  const { t, pick } = useI18n();
  const [year, setYear] = useState(0);
  const curriculum = (Array.isArray(programme.curriculum) ? programme.curriculum : []) as CurriculumYear[];
  const activeYear = curriculum[year] ?? curriculum[0];

  return (
    <>
      <PageHero
        image={IMAGES.classroom}
        eyebrowEn={`${programme.level} · ${programme.department}`}
        eyebrowUr={`${programme.level} · ${programme.department}`}
        titleEn={programme.titleEn}
        titleUr={programme.titleUr}
        subtitleEn={programme.summaryEn}
        subtitleUr={programme.summaryUr}
      >
        <Link href={`/admissions?programme=${programme.slug}`} className="btn btn-green">{t("nav.apply")} <Icon name="arrow" size={16} /></Link>
        <a href={`/api/pdf/prospectus/syllabus-${programme.slug}`} className="btn btn-ghost-light"><Icon name="download" size={16} /> {t("academics.syllabus")}</a>
      </PageHero>

      <section className="section">
        <div className="container-x grid gap-7 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-7">
            <div>
              <SectionHeading titleEn="Overview" titleUr="تعارف" />
              <Prose paragraphs={[pick(programme.overviewEn, programme.overviewUr)]} />
            </div>
            <div className="rounded-lg border border-deep/15 bg-white p-5">
              <h2 className="text-xl">{t("academics.eligibility")}</h2>
              <p className="mt-1.5 text-sm text-ink/80">{pick(programme.eligibilityEn, programme.eligibilityUr)}</p>
            </div>
            <div>
              <SectionHeading titleEn="Curriculum" titleUr="نصاب" />
              <div className="flex flex-wrap gap-1.5">
                {curriculum.map((entry, index) => (
                  <button
                    key={entry.labelEn}
                    type="button"
                    aria-pressed={year === index}
                    onClick={() => setYear(index)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${year === index ? "border-deep bg-deep text-white" : "border-deep/20 text-deep hover:bg-light"}`}
                  >
                    {pick(entry.labelEn, entry.labelUr)}
                  </button>
                ))}
              </div>
              {activeYear && (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {activeYear.courses.map((course) => (
                    <li key={course} className="flex items-start gap-2 rounded-md border border-deep/10 bg-white p-3 text-sm">
                      <Icon name="check" size={15} className="mt-1 shrink-0 text-fresh" /> {course}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-ink/55">{pick("Each course carries 3–4 credit hours; Arabic and Quran courses include weekly recitation labs.", "ہر کورس 3–4 کریڈٹ آورز؛ عربی اور قرآن کے کورسز میں ہفتہ وار تلاوت لیب شامل ہے۔")}</p>
            </div>
            <div>
              <SectionHeading titleEn="Career paths" titleUr="روزگار کے مواقع" />
              <p className="text-sm text-ink/80">{pick(programme.careersEn, programme.careersUr)}</p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card p-5">
              <h2 className="text-lg">{t("academics.fees")}</h2>
              <dl className="mt-2 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2"><dt className="text-ink/65">{t("academics.level")}</dt><dd className="font-semibold">{programme.level}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/65">{t("academics.duration")}</dt><dd className="font-semibold">{programme.durationYears} {t("academics.years")}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/65">{t("academics.mode")}</dt><dd className="font-semibold">{programme.mode}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/65">{t("academics.department")}</dt><dd className="font-semibold">{programme.department}</dd></div>
                <div className="flex justify-between gap-2 border-t border-deep/10 pt-1.5"><dt className="text-ink/65">{t("academics.fees")}</dt><dd className="font-semibold text-deep" dir="ltr">{programme.feePerYear > 0 ? formatPkr(programme.feePerYear) : pick("Sponsored", "کفالت شدہ")}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/65">{pick("Admission fee", "داخلہ فیس")}</dt><dd dir="ltr">{formatPkr(programme.admissionFee)}</dd></div>
              </dl>
              <p className="mt-2 rounded bg-light p-2 text-xs text-deep">
                {pick("Zakat-funded scholarships can cover up to 100% of fees. Sample fee figures — confirm with the finance office.", "زکوٰۃ سے چلنے والے وظائف 100% فیس تک پورا کر سکتے ہیں۔ یہ نمونہ فیس ہے — مالیات دفتر سے تصدیق کریں۔")}
              </p>
              <Link href={`/admissions?programme=${programme.slug}`} className="btn btn-primary mt-3 w-full">{t("nav.apply")}</Link>
              <a href={`/api/pdf/prospectus/syllabus-${programme.slug}`} className="btn btn-outline mt-2 w-full"><Icon name="download" size={15} /> {t("academics.syllabus")}</a>
            </div>
            <div className="card p-5">
              <h2 className="text-lg">{pick("Other programmes", "دیگر پروگرام")}</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/academics/${item.slug}`} className="link-underline">{pick(item.titleEn, item.titleUr)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
