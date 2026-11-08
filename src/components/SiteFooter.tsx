"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, Logo } from "./Icon";
import { useI18n } from "@/i18n/provider";
import { PRAYER_TIMES, UNIVERSITY } from "@/lib/site";
import { whatsappLink } from "@/lib/format";

const QUICK = [
  { href: "/admissions", key: "nav.admissions" },
  { href: "/academics", key: "nav.academics" },
  { href: "/library", key: "nav.library" },
  { href: "/darul-ifta/ask", key: "home.askQuestion" },
  { href: "/events", key: "nav.events" },
  { href: "/gallery", key: "gallery.title" },
  { href: "/students#portal", key: "students.portal" },
  { href: "/seasonal", key: "seasonal.ramadan" },
  { href: "/qurbani/status", key: "qurbani.checkBooking" },
];

const PROGRAMME_LINKS = [
  { href: "/academics/bs-islamic-studies", en: "BS Islamic Studies", ur: "بی ایس اسلامی علوم" },
  { href: "/academics/bs-quran-tafseer", en: "BS Quran & Tafseer", ur: "بی ایس قرآن و تفسیر" },
  { href: "/academics/bs-hadith-seerah", en: "BS Hadith & Seerah", ur: "بی ایس حدیث و سیرت" },
  { href: "/academics/bs-fiqh-shariah", en: "BS Fiqh & Islamic Law", ur: "بی ایس فقہ و اسلامی قانون" },
  { href: "/academics/alimiyyah", en: "Alimiyyah (Dars-e-Nizami)", ur: "عالمیت (درسِ نظامی)" },
  { href: "/academics/hifz-tajweed", en: "Hifz & Tajweed", ur: "حفظ و تجوید" },
];

export function SiteFooter() {
  const { t, pick } = useI18n();
  return (
    <footer className="mt-0 bg-deep text-white/85">
      <div className="container-x grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="rounded-lg bg-white p-2">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/80">{t("footer.aboutText")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={UNIVERSITY.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full border border-white/30 p-2 transition hover:bg-white/10"><Icon name="facebook" size={16} /></a>
            <a href={UNIVERSITY.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full border border-white/30 p-2 transition hover:bg-white/10"><Icon name="youtube" size={16} /></a>
            <a href={UNIVERSITY.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-white/30 p-2 transition hover:bg-white/10"><Icon name="instagram" size={16} /></a>
            <a href={UNIVERSITY.social.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="rounded-full border border-white/30 p-2 transition hover:bg-white/10"><Icon name="x" size={16} /></a>
            <a href={UNIVERSITY.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full border border-white/30 p-2 transition hover:bg-white/10"><Icon name="whatsapp" size={16} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-white">{t("footer.quickLinks")}</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {QUICK.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex items-center gap-1.5 text-white/80 transition hover:text-white">
                  <span className="text-gold">›</span> {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-white">{t("footer.programmes")}</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {PROGRAMME_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex items-center gap-1.5 text-white/80 transition hover:text-white">
                  <span className="text-gold">›</span> {pick(item.en, item.ur)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-white/20 bg-white/5 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">{t("footer.prayer")}</p>
            <dl className="mt-2 grid grid-cols-5 gap-1 text-center text-[0.65rem]">
              {PRAYER_TIMES.map((p) => (
                <div key={p.key}>
                  <dt className="text-white/60">{t(`footer.${p.key}`)}</dt>
                  <dd className="font-semibold text-white" dir="ltr">{p.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-white">{t("footer.contact")}</h3>
          <ul className="mt-3 space-y-2.5 text-sm">
            <li className="flex gap-2">
              <Icon name="pin" size={16} className="mt-1 shrink-0 text-gold" />
              <span>{t("top.address")}</span>
            </li>
            <li className="flex gap-2">
              <Icon name="phone" size={16} className="mt-1 shrink-0 text-gold" />
              <a href={`tel:${UNIVERSITY.phoneHref}`} dir="ltr" className="hover:text-white">{UNIVERSITY.phone}</a>
            </li>
            <li className="flex gap-2">
              <Icon name="mail" size={16} className="mt-1 shrink-0 text-gold" />
              <a href={`mailto:${UNIVERSITY.email}`} className="hover:text-white">{UNIVERSITY.email}</a>
            </li>
            <li className="flex gap-2">
              <Icon name="clock" size={16} className="mt-1 shrink-0 text-gold" />
              <span>{t("top.hours")}</span>
            </li>
          </ul>
          <div className="mt-3 overflow-hidden rounded-lg border border-white/20">
            <iframe
              title={t("footer.map")}
              src={UNIVERSITY.mapEmbed}
              className="h-32 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <Link href={UNIVERSITY.mapLink} target="_blank" className="mt-2 inline-flex items-center gap-1 text-xs text-gold hover:text-white">
            {t("footer.map")} <Icon name="external" size={12} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-x flex flex-col gap-2 py-4 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/policies/privacy" className="hover:text-white">{t("footer.privacy")}</Link>
            <Link href="/policies/terms" className="hover:text-white">{t("footer.terms")}</Link>
            <Link href="/policies/refund" className="hover:text-white">{t("footer.refund")}</Link>
            <Link href="/policies/accessibility" className="hover:text-white">{t("footer.accessibility")}</Link>
          </div>
        </div>
        <div className="container-x flex flex-col gap-1 pb-4 text-[0.68rem] text-white/55 md:flex-row md:justify-between">
          <p>{t("footer.developer")}</p>
          <p>{t("footer.notice")}</p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp() {
  const { t } = useI18n();
  return (
    <a
      href={whatsappLink(UNIVERSITY.whatsapp, "Assalamu alaikum, I would like to ask about the university.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-full bg-deep px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-fresh"
      aria-label={t("contact.whatsappChat")}
    >
      <Icon name="whatsapp" size={22} />
      <span className="hidden sm:inline">{t("nav.whatsapp")}</span>
    </a>
  );
}

export function CookieNotice() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      if (!window.localStorage.getItem("alnoor.cookie")) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);
  if (!visible) return null;
  const decide = (value: string) => {
    try {
      window.localStorage.setItem("alnoor.cookie", value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };
  return (
    <div className="fixed inset-x-3 bottom-20 z-40 rounded-lg border border-fresh/40 bg-white p-4 shadow-xl md:inset-x-auto md:end-6 md:bottom-24 md:max-w-md no-print">
      <p className="text-sm text-ink">{t("legal.cookie")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => decide("all")} className="btn btn-primary !py-1.5 !text-xs">{t("legal.accept")}</button>
        <button type="button" onClick={() => decide("essential")} className="btn btn-outline !py-1.5 !text-xs">{t("legal.decline")}</button>
        <Link href="/policies/privacy" className="btn btn-outline !py-1.5 !text-xs">{t("legal.readPrivacy")}</Link>
      </div>
    </div>
  );
}
