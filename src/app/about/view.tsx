"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero, SectionHeading, Callout } from "@/components/ui";
import { useI18n } from "@/i18n/provider";
import { ACCREDITATIONS, IMAGES, TEACHERS, VALUES } from "@/lib/site";

type FacultyRow = {
  id: number; nameEn: string; nameUr: string; roleEn: string; roleUr: string; department: string;
  bioEn: string | null; bioUr: string | null; qualifications: string | null; isLeadership: boolean; isBoard: boolean;
};
type ReportRow = { id: number; year: number; titleEn: string; titleUr: string; kind: string; fileUrl: string; sizeKb: number };

function Monogram({ name }: { name: string }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gradient-to-br from-deep to-fresh">
      <span className="font-display text-5xl font-bold text-white/90">{initials}</span>
    </div>
  );
}

export function AboutView({ reports }: { faculty?: FacultyRow[]; reports: ReportRow[] }) {
  const { t, pick } = useI18n();
  const leadership = [{ id: 1, nameEn: "Sheikh ul Hadith Allama Peer Syed Zia Ul Haq Shah Sahib", nameUr: "شیخ الحدیث علامہ پیر سید ضیاء الحق شاہ صاحب", roleEn: "Founder & Principal", roleUr: "بانی و پرنسپل", bioEn: "Founder and Principal of Jamia Ghousia Zia-Ul-Uloom, Rawalpindi.", bioUr: "جامعہ غوثیہ ضیاء العلوم، راولپنڈی کے بانی و پرنسپل۔", qualifications: null }];
  const board: typeof leadership = [];
  const reportsByYear = useMemo(() => {
    const map = new Map<number, ReportRow[]>();
    for (const report of reports) {
      map.set(report.year, [...(map.get(report.year) ?? []), report]);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [reports]);

  return (
    <>
      <PageHero
        image={IMAGES.campusHero}
        eyebrowEn="About us · Est. 1989"
        eyebrowUr="ہمارا تعارف · قائم 1989"
        titleEn="About the University"
        titleUr="یونیورسٹی کا تعارف"
        subtitleEn={t("about.subtitle")}
        subtitleUr={t("about.subtitle")}
      >
        <Link href="/academics" className="btn btn-green">{t("home.explore")}</Link>
        <Link href="/contact" className="btn btn-ghost-light">{t("nav.contact")}</Link>
      </PageHero>

      <section className="section">
        <div className="container-x grid gap-5 lg:grid-cols-3">
          <div className="card overflow-hidden">
            <img src="/images/campus-angle.jpg" alt="" loading="lazy" className="h-40 w-full object-cover" />
            <div className="p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name="sun" size={20} /></span>
            <h2 className="mt-3 text-2xl">{t("about.vision")}</h2>
            <p className="mt-2 text-sm text-ink/80">
              {pick(
                "To be a trusted centre of Islamic learning whose graduates unite deep scholarship with sincere service, and whose research answers the questions Muslim families actually ask.",
                "ایسا معتبر مرکزِ علم بننا جس کے فارغ التحصیل گہرے علم کو خلوصِ خدمت سے جوڑیں، اور جس کی تحقیق مسلم خاندانوں کے حقیقی سوالات کا جواب دے۔",
              )}
            </p>
            </div>
          </div>
          <div className="card overflow-hidden">
            <img src="/images/books-b.jpg" alt="" loading="lazy" className="h-40 w-full object-cover" />
            <div className="p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name="book" size={20} /></span>
            <h2 className="mt-3 text-2xl">{t("about.mission")}</h2>
            <p className="mt-2 text-sm text-ink/80">
              {pick(
                "To teach the Quran, Hadith, Fiqh and Arabic with academic rigour; to form character through mentorship and worship; and to remove financial barriers through Zakat-funded scholarships, food and hostel support.",
                "قرآن، حدیث، فقہ اور عربی کو علمی مضبوطی سے پڑھانا؛ رہنمائی اور عبادت کے ذریعے کردار بنانا؛ اور زکوٰۃ سے چلنے والے وظائف، خوراک اور ہاسٹل کے ذریعے مالی رکاوٹیں دور کرنا۔",
              )}
            </p>
            </div>
          </div>
          <div className="card overflow-hidden">
            <img src="/images/dome.jpg" alt="" loading="lazy" className="h-40 w-full object-cover" />
            <div className="p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name="star" size={20} /></span>
            <h2 className="mt-3 text-2xl">{t("about.values")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
              {VALUES.map((value) => (
                <li key={value.titleEn} className="flex gap-2">
                  <Icon name="check" size={15} className="mt-1 shrink-0 text-fresh" />
                  <span><strong className="text-deep">{pick(value.titleEn, value.titleUr)}</strong> — {pick(value.textEn, value.textUr)}</span>
                </li>
              ))}
            </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="leadership">
        <div className="container-x">
          <SectionHeading eyebrow={t("about.leadership")} titleEn="Founder & Chancellor" titleUr="بانی و چانسلر" subtitleEn="Profiles of the scholars who lead the institution." subtitleUr="ادارے کی قیادت کرنے والے علماء کے تعارف۔" />
          <div className="grid gap-5 md:grid-cols-2">
            {leadership.map((person) => (
              <article key={`${person.id}-${person.roleEn}`} className="card overflow-hidden">
                <img src={IMAGES.rector} alt={person.nameEn} loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />
                <div className="p-5">
                  <h3 className="text-2xl">{pick(person.nameEn, person.nameUr)}</h3>
                  <p className="text-sm font-semibold text-fresh">{pick(person.roleEn, person.roleUr)}</p>
                  <p className="mt-2 text-sm text-ink/80">{pick(person.bioEn, person.bioUr)}</p>
                  
                </div>
              </article>
            ))}
          </div>

          {board.length > 0 && (
          <div className="mt-10">
            <SectionHeading eyebrow={t("about.board")} titleEn="Board of Governors" titleUr="بورڈ آف گورنرز" />
            <div className="grid gap-4 sm:grid-cols-3">
              {board.map((person) => (
                <article key={`${person.id}-board`} className="card p-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-light font-display text-sm font-bold text-deep">
                    {person.nameEn.split(" ").slice(0, 2).map((p) => p[0]).join("")}
                  </span>
                  <h3 className="mt-2 text-base font-bold">{pick(person.nameEn, person.nameUr)}</h3>
                  <p className="text-xs font-semibold text-fresh">{pick(person.roleEn, person.roleUr)}</p>
                  <p className="mt-1 text-xs text-ink/70">{pick(person.bioEn, person.bioUr)}</p>
                </article>
              ))}
            </div>
          </div>
          )}
        </div>
      </section>

      <section className="relative isolate overflow-hidden section">
        <img src="/images/dome-city.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 -z-10 bg-deep/85" aria-hidden="true" />
        <div className="container-x">
          <div className="mb-6 text-white">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">{t("about.faculty")}</p>
            <h2 className="mt-1 text-3xl font-bold !text-white md:text-4xl">{pick("Our teachers", "ہمارے اساتذہ")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEACHERS.map((teacher) => (
              <article key={teacher.en} className="card flex items-center gap-4 p-4">
                {teacher.photo ? (
                  <img src={teacher.photo} alt={teacher.en} loading="lazy" className="h-16 w-16 shrink-0 rounded-full border-2 border-fresh object-cover object-top" />
                ) : (
                  <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-deep font-display text-lg font-bold text-white">
                    {teacher.en.split(" ").slice(1, 3).map((p) => p[0]).join("")}
                  </span>
                )}
                <h3 className="text-base font-bold leading-snug text-deep">{pick(teacher.en, teacher.ur)}</h3>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm text-white/85">{pick("…and many other respected teachers.", "…اور بہت سے دیگر قابلِ احترام اساتذہ۔")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t("about.accreditation")} titleEn="Accreditation & affiliation" titleUr="منظوری و الحاق" />
            <div className="grid gap-2.5 sm:grid-cols-2">
              {ACCREDITATIONS.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5 rounded-lg border border-deep/15 bg-white p-3">
                  <img src={item.logo} alt={item.name} loading="lazy" className="h-14 w-14 shrink-0 rounded object-contain" />
                  <span className="text-sm font-semibold text-ink/80">{pick(item.name, item.nameUr)}</span>
                </div>
              ))}
            </div>
            <Callout icon="shield" title={pick("Verification", "تصدیق")}>
              {pick(
                "Degree recognition and affiliation documents can be inspected at the registrar's office.",
                "ڈگری کی منظوری اور الحاق کی دستاویزات رجسٹرار دفتر میں دیکھی جا سکتی ہیں۔",
              )}
            </Callout>
          </div>
          <div>
            <SectionHeading eyebrow={t("about.reports")} titleEn="Audited & annual reports" titleUr="آڈٹ شدہ و سالانہ رپورٹس" subtitleEn={t("about.reportsSub")} subtitleUr={t("about.reportsSub")} />
            <div className="space-y-3">
              {reportsByYear.map(([year, rows]) => (
                <div key={year} className="rounded-lg border border-deep/15 bg-white p-3">
                  <p className="font-display text-lg font-bold text-deep">{year}</p>
                  <ul className="mt-1 space-y-1.5">
                    {rows.map((report) => (
                      <li key={report.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="text-ink/80">{pick(report.titleEn, report.titleUr)}</span>
                        <a href={report.fileUrl} className="btn btn-outline !py-1 !text-xs">
                          <Icon name="download" size={13} /> PDF
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
