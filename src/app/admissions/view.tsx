"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Accordion, Callout, Field, FormNotice, PageHero, SectionHeading } from "@/components/ui";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { useI18n } from "@/i18n/provider";
import { IMAGES } from "@/lib/site";
import { formatPkr } from "@/lib/format";

type ProgrammeRow = { id: number; slug: string; titleEn: string; titleUr: string; level: string; durationYears: string; feePerYear: number; admissionFee: number };

export function AdmissionsView({ programmes, faqs }: { programmes: ProgrammeRow[]; faqs: { q: string; a: string }[] }) {
  const { t, pick } = useI18n();

  return (
    <>
      <PageHero
        image={IMAGES.campusHero}
        eyebrowEn="Admissions 2027"
        eyebrowUr="داخلے 2027"
        titleEn="Admissions"
        titleUr="داخلے"
        subtitleEn={t("admissions.subtitle")}
        subtitleUr={t("admissions.subtitle")}
      >
        <a href="#apply" className="btn btn-gold">{t("nav.apply")}</a>
        <a href="/api/pdf/prospectus/prospectus-2027" className="btn btn-ghost-light"><Icon name="download" size={16} /> {t("admissions.prospectus")}</a>
      </PageHero>

      <section className="container-x -mt-6">
        <div className="flex flex-col gap-3 rounded-lg border border-fresh/40 border-t-4 border-t-fresh bg-white p-4 shadow-md md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light text-deep"><Icon name="check" size={20} /></span>
            <div>
              <p className="font-bold text-deep">{t("admissions.open")} — 2027</p>
              <p className="text-sm text-ink/70">{t("admissions.deadline")}: <strong>30 June 2027</strong> (placeholder) · {pick("Classes begin 1 September 2027", "کلاسیں 1 ستمبر 2027 سے")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-gold">{pick("Scholarships available", "وظائف دستیاب")}</span>
            <span className="badge">{pick("Online application", "آن لائن درخواست")}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="01" titleEn="How to apply" titleUr="درخواست کا طریقہ" />
            <ol className="space-y-3">
              {[
                { en: "Choose a programme and check eligibility.", ur: "پروگرام منتخب کریں اور اہلیت دیکھیں۔" },
                { en: "Complete the online form and upload your CNIC/B-Form and certificates.", ur: "آن لائن فارم مکمل کریں اور شناختی کارڈ/ب فارم و اسناد اپ لوڈ کریں۔" },
                { en: "Receive an acknowledgement with your application number.", ur: "درخواست نمبر کے ساتھ تصدیق وصول کریں۔" },
                { en: "Attend the interview (and entry test where required).", ur: "انٹرویو میں شرکت کریں (جہاں ضروری ہو داخلہ ٹیسٹ)۔" },
                { en: "Pay the admission fee and confirm your seat.", ur: "داخلہ فیس ادا کریں اور اپنی نشست کی تصدیق کریں۔" },
                { en: "Join orientation week and collect your student card.", ur: "اورینٹیشن ہفتے میں شامل ہوں اور طالب علمی کارڈ لیں۔" },
              ].map((step, index) => (
                <li key={step.en} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-deep text-xs font-bold text-white">{index + 1}</span>
                  <p className="text-sm text-ink/80">{pick(step.en, step.ur)}</p>
                </li>
              ))}
            </ol>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="card p-4">
                <h3 className="text-base font-bold">{t("admissions.documents")}</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                  {[
                    [t("admissions.fileCnic"), "شناختی کارڈ یا ب فارم"],
                    [t("admissions.fileCertificates"), "اسناد / ٹرانسکرپٹ"],
                    [pick("Two photographs", "دو تصاویر"), "دو تصاویر"],
                    [pick("Zakat scholarship request (optional)", "زکوٰۃ وظیفے کی درخواست (اختیاری)"), "زکوٰۃ وظیفے کی درخواست (اختیاری)"],
                  ].map(([en, ur]) => (
                    <li key={en} className="flex items-start gap-2"><Icon name="check" size={15} className="mt-1 shrink-0 text-fresh" /> {pick(en, ur)}</li>
                  ))}
                </ul>
              </div>
              <div className="card p-4">
                <h3 className="text-base font-bold">{t("admissions.dates")}</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                  <li>{pick("Applications open", "درخواستیں شروع")}: <strong>01 Feb 2027</strong></li>
                  <li>{pick("Deadline", "آخری تاریخ")}: <strong>30 Jun 2027</strong></li>
                  <li>{pick("Interviews", "انٹرویوز")}: <strong>07–18 Jul 2027</strong></li>
                  <li>{pick("Classes begin", "کلاسیں شروع")}: <strong>01 Sep 2027</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div id="apply" className="card p-5">
            <SectionHeading eyebrow="02" titleEn="Online application" titleUr="آن لائن درخواست" subtitleEn={t("admissions.formSub")} subtitleUr={t("admissions.formSub")} />
            <ApplicationForm programmes={programmes} />
          </div>
        </div>
      </section>

      <section id="fees" className="section bg-light/60">
        <div className="container-x">
          <SectionHeading eyebrow="03" titleEn="Fee structure (sample)" titleUr="فیس اسٹرکچر (نمونہ)" subtitleEn="All figures are placeholders in PKR and confirmed with the finance office at admission." subtitleUr="تمام اعداد و شمار نمونہ ہیں (روپے میں) اور داخلے پر مالیات دفتر سے تصدیق ہوتے ہیں۔" />
          <div className="overflow-x-auto rounded-lg border border-deep/15 bg-white">
            <table className="w-full text-sm">
              <caption className="sr-only">{t("admissions.feeStructure")}</caption>
              <thead className="bg-deep text-xs uppercase tracking-wide text-white">
                <tr>
                  <th scope="col" className="p-3 text-start">{t("home.programmes")}</th>
                  <th scope="col" className="p-3 text-start">{t("academics.level")}</th>
                  <th scope="col" className="p-3 text-end">{pick("Tuition / year", "فیس / سال")}</th>
                  <th scope="col" className="p-3 text-end">{pick("Admission fee", "داخلہ فیس")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep/10">
                {programmes.map((programme) => (
                  <tr key={programme.id}>
                    <td className="p-3 font-medium text-ink"><Link href={`/academics/${programme.slug}`} className="hover:text-fresh">{pick(programme.titleEn, programme.titleUr)}</Link></td>
                    <td className="p-3 text-xs text-ink/70">{programme.level} · {programme.durationYears} {t("academics.years")}</td>
                    <td className="p-3 text-end" dir="ltr">{programme.feePerYear > 0 ? formatPkr(programme.feePerYear) : pick("Sponsored", "کفالت شدہ")}</td>
                    <td className="p-3 text-end" dir="ltr">{formatPkr(programme.admissionFee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout title={t("donate.perStudent")}>
            {t("donate.perStudentNote")} <Link href="/donate?purpose=scholarships" className="link-underline">{t("nav.donate")}</Link>
          </Callout>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="04" titleEn="Frequently asked questions" titleUr="اکثر پوچھے جانے والے سوالات" />
          <Accordion items={faqs.map((faq, i) => ({ id: `faq-${i}`, question: faq.q, answer: faq.a }))} />
        </div>
      </section>
    </>
  );
}

function ApplicationForm({ programmes }: { programmes: ProgrammeRow[] }) {
  const { t, pick } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [files, setFiles] = useState<string[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    try {
      for (const key of ["cnicFile", "certificates"]) {
        const file = data.get(key);
        if (file instanceof File && file.size > 0) {
          const upload = new FormData();
          upload.set("file", file);
          upload.set("ownerRef", `${payload.email ?? "applicant"}`);
          const response = await fetch("/api/upload", { method: "POST", body: upload });
          const json = (await response.json()) as { ok: boolean; storedName?: string };
          if (json.ok && json.storedName) setFiles((prev) => [...prev, json.storedName as string]);
        }
      }
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          city: payload.city,
          programme: payload.programme,
          message: `Application. CNIC/B-Form and certificates uploaded: ${files.length} file(s).`,
          kind: "application",
        }),
      });
      const json = (await response.json()) as { ok: boolean };
      if (!response.ok || !json.ok) throw new Error("failed");
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <FormNotice>
        <p className="font-bold">{t("admissions.submitted")}</p>
        <p className="mt-1">{t("admissions.submittedText")}</p>
        {files.length > 0 && <p className="mt-2 text-xs">{files.length} {pick("file(s) uploaded to private storage.", "فائل(یں) نجی اسٹوریج میں اپ لوڈ ہو گئیں۔")}</p>}
      </FormNotice>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" encType="multipart/form-data">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("contact.name")} required>
          <input name="name" required className="input" autoComplete="name" />
        </Field>
        <Field label={t("contact.phone")} required>
          <input name="phone" required className="input" dir="ltr" autoComplete="tel" />
        </Field>
        <Field label={t("contact.email")} required>
          <input name="email" required type="email" className="input" dir="ltr" autoComplete="email" />
        </Field>
        <Field label={t("contact.city")} required>
          <input name="city" required className="input" />
        </Field>
      </div>
      <Field label={t("contact.programme")} required>
        <select name="programme" required className="select">
          {programmes.map((programme) => (
            <option key={programme.slug} value={programme.slug}>{pick(programme.titleEn, programme.titleUr)}</option>
          ))}
        </select>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("admissions.fileCnic")} hint={t("admissions.fileHint")}>
          <input type="file" name="cnicFile" accept="image/*,application/pdf" className="input !py-1.5 text-xs" />
        </Field>
        <Field label={t("admissions.fileCertificates")} hint={t("admissions.fileHint")}>
          <input type="file" name="certificates" accept="image/*,application/pdf" className="input !py-1.5 text-xs" />
        </Field>
      </div>
      <label className="flex items-start gap-2 text-xs text-ink/75">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#00633A]" />
        {pick("I confirm the information is accurate and accept the privacy notice and refund policy.", "میں معلومات کی درستی کی تصدیق کرتا/کرتی ہوں اور پرائیویسی نوٹس و واپسی پالیسی قبول کرتا/کرتی ہوں۔")}
      </label>
      {state === "error" && <FormNotice tone="error">{t("common.error")}</FormNotice>}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full">
        {state === "sending" ? t("common.sending") : t("common.submit")} <Icon name="arrow" size={16} />
      </button>
      <p className="text-center text-[0.68rem] text-ink/50">{pick("Your documents are stored privately and are never published.", "آپ کی دستاویزات نجی طور پر محفوظ ہیں، کبھی شائع نہیں ہوتیں۔")}</p>
    </form>
  );
}
