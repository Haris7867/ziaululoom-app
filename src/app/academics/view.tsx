"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero, SectionHeading, Tabs, EmptyState } from "@/components/ui";
import { ProgrammeCard } from "@/components/cards";
import { useI18n } from "@/i18n/provider";
import { IMAGES } from "@/lib/site";
import { formatDate } from "@/lib/format";

type ProgrammeRow = {
  id: number; slug: string; titleEn: string; titleUr: string; level: string; durationYears: string;
  mode: string; summaryEn: string; summaryUr: string; feePerYear: number; department: string;
};
type CalendarRow = { id: number; titleEn: string; titleUr: string; startDate: Date | string; endDate: Date | string | null; kind: string };
type ExamRow = { id: number; titleEn: string; titleUr: string; examDate: Date | string; timeSlot: string; venue: string; programmeSlug: string | null };

export function AcademicsView({ programmes, calendar, exams }: { programmes: ProgrammeRow[]; calendar: CalendarRow[]; exams: ExamRow[] }) {
  const { t, pick } = useI18n();
  const [level, setLevel] = useState("all");
  const [mode, setMode] = useState("all");
  const [duration, setDuration] = useState("all");
  const [tab, setTab] = useState<"programmes" | "calendar" | "exams">("programmes");

  const levels = useMemo(() => Array.from(new Set(programmes.map((p) => p.level))), [programmes]);
  const modes = useMemo(() => Array.from(new Set(programmes.map((p) => p.mode))), [programmes]);
  const durations = useMemo(() => Array.from(new Set(programmes.map((p) => p.durationYears))).sort(), [programmes]);
  const filtered = programmes.filter(
    (p) => (level === "all" || p.level === level) && (mode === "all" || p.mode === mode) && (duration === "all" || p.durationYears === duration),
  );

  return (
    <>
      <PageHero
        image={IMAGES.classroom}
        eyebrowEn="Academics"
        eyebrowUr="تعلیمات"
        titleEn="Academics & Programmes"
        titleUr="تعلیمات و پروگرام"
        subtitleEn={t("academics.subtitle")}
        subtitleUr={t("academics.subtitle")}
      >
        <Link href="/admissions" className="btn btn-green">{t("nav.apply")}</Link>
        <a href="/api/pdf/prospectus/prospectus-2027" className="btn btn-ghost-light"><Icon name="download" size={16} /> {t("admissions.prospectus")}</a>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <Tabs
            ariaLabel={t("nav.academics")}
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "programmes", label: t("home.programmes"), count: programmes.length },
              { value: "calendar", label: t("academics.academicCalendar"), count: calendar.length },
              { value: "exams", label: t("academics.examSchedule"), count: exams.length },
            ]}
          />

          {tab === "programmes" && (
            <>
              <div className="mt-5 grid gap-2 rounded-lg border border-deep/15 bg-white p-3 sm:grid-cols-3">
                <label className="block text-xs font-semibold text-ink/70">
                  {t("academics.level")}
                  <select value={level} onChange={(e) => setLevel(e.target.value)} className="select mt-1">
                    <option value="all">{t("common.all")}</option>
                    {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-ink/70">
                  {t("academics.duration")}
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="select mt-1">
                    <option value="all">{t("common.all")}</option>
                    {durations.map((d) => <option key={d} value={d}>{d} {t("academics.years")}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-ink/70">
                  {t("academics.mode")}
                  <select value={mode} onChange={(e) => setMode(e.target.value)} className="select mt-1">
                    <option value="all">{t("common.all")}</option>
                    {modes.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((programme) => <ProgrammeCard key={programme.id} {...programme} />)}
              </div>
              {filtered.length === 0 && <EmptyState>{t("academics.filterEmpty")}</EmptyState>}
              <div className="mt-6 flex flex-wrap gap-2">
                <button type="button" onClick={() => { setLevel("all"); setMode("all"); setDuration("all"); }} className="btn btn-outline">{t("common.reset")}</button>
              </div>
            </>
          )}

          {tab === "calendar" && (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="overflow-hidden rounded-lg border border-deep/15 bg-white">
                <table className="w-full text-sm">
                  <caption className="sr-only">{t("academics.academicCalendar")}</caption>
                  <thead className="bg-light text-start text-xs uppercase tracking-wide text-deep">
                    <tr><th scope="col" className="p-3 text-start">{t("common.date")}</th><th scope="col" className="p-3 text-start">{t("home.events")}</th><th scope="col" className="p-3 text-start">{t("common.venue")}</th></tr>
                  </thead>
                  <tbody className="divide-y divide-deep/10">
                    {calendar.map((entry) => (
                      <tr key={entry.id}>
                        <td className="p-3 text-xs text-ink/70">{formatDate(entry.startDate)}{entry.endDate ? ` – ${formatDate(entry.endDate)}` : ""}</td>
                        <td className="p-3 font-medium text-ink">{pick(entry.titleEn, entry.titleUr)}</td>
                        <td className="p-3 text-xs"><span className="badge">{entry.kind}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card p-5">
                <h2 className="text-xl">{t("academics.academicCalendar")}</h2>
                <p className="mt-1 text-sm text-ink/70">{pick("The full calendar is published as a PDF at the start of each semester.", "مکمل کیلنڈر ہر سمسٹر کے آغاز پر پی ڈی ایف میں شائع ہوتا ہے۔")}</p>
                <a href="/api/pdf/prospectus/academic-calendar-2027" className="btn btn-primary mt-3 w-full">
                  <Icon name="download" size={16} /> {t("academics.calendarDownload")}
                </a>
              </div>
            </div>
          )}

          {tab === "exams" && (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <div className="overflow-x-auto rounded-lg border border-deep/15 bg-white">
                <table className="w-full text-sm">
                  <caption className="sr-only">{t("academics.examSchedule")}</caption>
                  <thead className="bg-light text-xs uppercase tracking-wide text-deep">
                    <tr><th scope="col" className="p-3 text-start">{t("common.date")}</th><th scope="col" className="p-3 text-start">{t("home.programmes")}</th><th scope="col" className="p-3 text-start">{t("common.time")}</th><th scope="col" className="p-3 text-start">{t("common.venue")}</th></tr>
                  </thead>
                  <tbody className="divide-y divide-deep/10">
                    {exams.map((exam) => (
                      <tr key={exam.id}>
                        <td className="p-3 text-xs text-ink/70">{formatDate(exam.examDate)}</td>
                        <td className="p-3 font-medium text-ink">{pick(exam.titleEn, exam.titleUr)}</td>
                        <td className="p-3 text-xs" dir="ltr">{exam.timeSlot}</td>
                        <td className="p-3 text-xs">{exam.venue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card p-5">
                <h2 className="text-xl">{t("academics.results")}</h2>
                <p className="mt-1 text-sm text-ink/70">{t("academics.resultsNote")}</p>
                <Link href="/students#portal" className="btn btn-primary mt-3 w-full"><Icon name="lock" size={16} /> {t("students.portal")}</Link>
                <p className="mt-2 text-xs text-ink/55">{t("academics.examNote")}</p>
              </div>
            </div>
          )}
        </div>
      </section>

    </>
  );
}
