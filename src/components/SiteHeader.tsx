"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, Logo } from "./Icon";
import { useI18n } from "@/i18n/provider";
import { UNIVERSITY } from "@/lib/site";
import { whatsappLink } from "@/lib/format";

const NAV = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/academics", key: "nav.academics" },
  { href: "/admissions", key: "nav.admissions" },
  { href: "/library", key: "nav.library" },
  { href: "/darul-ifta", key: "nav.fatwa" },
  { href: "/events", key: "nav.events" },
  { href: "/qurbani", key: "nav.qurbani" },
  { href: "/students", key: "nav.students" },
  { href: "/contact", key: "nav.contact" },
];

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { toggle, lang, t } = useI18n();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("nav.langLabel")}
      className={`inline-flex items-center gap-1.5 rounded-full border border-deep/20 bg-white px-2.5 py-1.5 text-xs font-bold text-deep transition hover:border-fresh hover:bg-light ${compact ? "" : "shadow-sm"}`}
    >
      <Icon name="globe" size={15} />
      <span>{t("nav.langToggle")}</span>
    </button>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Top bar */}
      <div className="border-b border-deep/10 bg-light text-[0.76rem] text-ink">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-5 gap-y-1 py-1.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href={`tel:${UNIVERSITY.phoneHref}`} className="inline-flex items-center gap-1.5 hover:text-deep">
              <Icon name="phone" size={14} className="text-deep" />
              <span dir="ltr">{UNIVERSITY.phone}</span>
            </a>
            <a href={`mailto:${UNIVERSITY.email}`} className="hidden items-center gap-1.5 hover:text-deep sm:inline-flex">
              <Icon name="mail" size={14} className="text-deep" />
              {UNIVERSITY.email}
            </a>
            <span className="hidden items-center gap-1.5 lg:inline-flex">
              <Icon name="pin" size={14} className="text-deep" />
              {t("top.address")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="clock" size={14} className="text-deep" />
            {t("top.hours")}
          </div>
        </div>
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-deep/10 bg-white/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-3 py-2.5">
          <Link href="/" aria-label={t("brand.name")} className="shrink-0">
            <span className="hidden sm:inline-flex"><Logo /></span>
            <span className="inline-flex sm:hidden">
              <Logo className="[&_span.font-display]:text-[1rem] [&_img]:h-11 [&_img]:w-auto" />
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-0 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-md px-1.5 py-2 text-[0.8rem] font-semibold transition ${
                  isActive(item.href) ? "bg-light text-deep" : "text-ink/80 hover:bg-light hover:text-deep"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
            <LanguageToggle compact />
            <Link href="/donate" className="btn btn-gold !px-3 !py-1.5 !text-[0.8rem]">
              <Icon name="heart" size={14} /> {t("nav.donate")}
            </Link>
            <Link href="/admissions" className="btn btn-green !px-3 !py-1.5 !text-[0.8rem]">
              {t("nav.apply")}
            </Link>
            <a
              href={whatsappLink(UNIVERSITY.whatsapp, "Assalamu alaikum, I would like to ask about the university.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("nav.whatsapp")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-fresh text-white transition hover:bg-deep"
            >
              <Icon name="whatsapp" size={18} />
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle compact />
            <Link href="/donate" className="btn btn-gold !px-2.5 !py-1.5 !text-[0.75rem]">
              {t("nav.donate")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-deep/20 text-deep"
              aria-label={t("nav.menu")}
              aria-expanded={open}
            >
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={t("nav.close")}
            className="absolute inset-0 bg-ink/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-deep/10 px-4 py-3">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-deep"
                aria-label={t("nav.close")}
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <nav className="flex-1 px-2 py-3" aria-label="Mobile navigation">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-md px-3 py-3 text-sm font-semibold ${
                    isActive(item.href) ? "bg-light text-deep" : "text-ink"
                  }`}
                >
                  {t(item.key)}
                  <Icon name="chevron" size={16} className="text-fresh" />
                </Link>
              ))}
              <Link href="/donate" className="mx-1 mt-3 flex items-center justify-between rounded-md bg-light px-3 py-3 text-sm font-semibold text-deep">
                {t("nav.donate")} <Icon name="heart" size={16} />
              </Link>
            </nav>
            <div className="space-y-2 border-t border-deep/10 p-4">
              <Link href="/admissions" className="btn btn-green w-full">{t("nav.apply")}</Link>
              <a
                href={whatsappLink(UNIVERSITY.whatsapp, "Assalamu alaikum, I would like to ask about the university.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
              >
                <Icon name="whatsapp" size={16} /> {t("nav.whatsapp")}
              </a>
              <p className="pt-1 text-center text-xs text-ink/60">{UNIVERSITY.phone} · {UNIVERSITY.email}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
