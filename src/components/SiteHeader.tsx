"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, Logo } from "./Icon";
import { useI18n } from "@/i18n/provider";
import { SHOW_DONATIONS, UNIVERSITY } from "@/lib/site";
import { whatsappLink } from "@/lib/format";

type NavLeaf = { href: string; key?: string; en?: string; ur?: string };
type NavItem =
  | ({ type: "link" } & NavLeaf)
  | { type: "group"; en: string; ur: string; children: NavLeaf[] };

// Header menu: 6 items. Academics and Students are merged into one dropdown.
const NAV: NavItem[] = [
  { type: "link", href: "/", key: "nav.home" },
  { type: "link", href: "/about", key: "nav.about" },
  {
    type: "group", en: "Academics", ur: "تعلیمات",
    children: [
      { href: "/academics", en: "Programmes", ur: "پروگرام" },
      { href: "/students", en: "Student Life", ur: "طلبہ کی زندگی" },
    ],
  },
  {
    type: "group", en: "Resources", ur: "وسائل",
    children: [
      { href: "/library", key: "nav.library" },
      { href: "/darul-ifta", key: "nav.fatwa" },
      { href: "/darul-ifta/ask", key: "home.askQuestion" },
    ],
  },
  {
    type: "group", en: "Events", ur: "تقریبات",
    children: [
      { href: "/events", key: "nav.events" },
      { href: "/gallery", key: "gallery.title" },
      { href: "/qurbani", key: "nav.qurbani" },
    ],
  },
  { type: "link", href: "/contact", key: "nav.contact" },
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
  const { t, pick } = useI18n();
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

  const isActive = (href: string) => {
    const path = href.split("#")[0];
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };
  const label = (leaf: NavLeaf) => (leaf.key ? t(leaf.key) : pick(leaf.en ?? "", leaf.ur ?? ""));

  const brand = (
    <Link href="/" aria-label={t("brand.name")} className="shrink-0">
      <span className="inline-flex items-center rounded-xl bg-white px-4 py-2 shadow-md">
        <span className="hidden sm:inline-flex"><Logo className="[&_span.font-display]:text-[1.6rem] [&_span.font-display]:font-extrabold [&_img]:h-16 [&_img]:w-auto" /></span>
        <span className="inline-flex sm:hidden">
          <Logo className="[&_span.font-display]:text-[0.95rem] [&_span.font-display]:font-extrabold [&_img]:h-9 [&_img]:w-auto" />
        </span>
      </span>
    </Link>
  );

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
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="clock" size={14} className="text-deep" />
            {t("top.hours")}
          </div>
        </div>
      </div>

      {/* Sticky header — green, same colour as the footer */}
      <header className="site-header sticky top-0 z-40 border-b border-white/10 bg-deep shadow-md">
        <div className="container-x flex items-center justify-between gap-3 py-2.5">
          {brand}

          <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-1 xl:flex">
            {NAV.map((item) => {
              if (item.type === "link") {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-3 py-2 text-[0.9rem] font-semibold text-white transition ${active ? "bg-white/20" : "hover:bg-white/10"}`}
                  >
                    {t(item.key!)}
                  </Link>
                );
              }
              const active = item.children.some((c) => isActive(c.href));
              return (
                <div key={item.en} className="group relative">
                  <button
                    type="button"
                    aria-haspopup="true"
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.9rem] font-semibold text-white transition ${active ? "bg-white/20" : "hover:bg-white/10"}`}
                  >
                    {pick(item.en, item.ur)}
                    <Icon name="chevron" size={14} className="transition group-hover:rotate-180 group-focus-within:rotate-180" />
                  </button>
                  <div className="invisible absolute start-0 top-full z-50 min-w-[13.5rem] pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="overflow-hidden rounded-lg border border-deep/10 border-t-4 border-t-fresh bg-white py-1.5 shadow-xl">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-light hover:text-deep"
                          >
                            {label(child)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <LanguageToggle compact />
            {SHOW_DONATIONS && <Link href="/donate" className="btn btn-gold !px-3 !py-1.5 !text-[0.8rem]">
              <Icon name="heart" size={14} /> {t("nav.donate")}
            </Link>}
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <LanguageToggle compact />
            {SHOW_DONATIONS && <Link href="/donate" className="btn btn-gold !px-2.5 !py-1.5 !text-[0.75rem]">
              {t("nav.donate")}
            </Link>}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/40 text-white"
              aria-label={t("nav.menu")}
              aria-expanded={open}
            >
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Floating yellow social diamonds on the right edge (desktop) */}
      <div className="fixed end-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
        {[
          { href: UNIVERSITY.social.facebook, label: "Facebook", icon: "facebook" as const },
          { href: UNIVERSITY.social.x, label: "X", icon: "x" as const },
          { href: whatsappLink(UNIVERSITY.whatsapp, ""), label: "WhatsApp", icon: "whatsapp" as const },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="flex h-11 w-11 rotate-45 items-center justify-center rounded-md bg-gold text-deep shadow-lg transition hover:bg-white"
          >
            <span className="-rotate-45"><Icon name={item.icon} size={20} /></span>
          </a>
        ))}
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label={t("nav.close")}
            className="absolute inset-0 bg-ink/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-deep px-4 py-3">
              <span className="inline-flex rounded-lg bg-white px-2.5 py-1.5"><Logo className="[&_span.font-display]:text-[0.95rem] [&_span.font-display]:font-extrabold [&_img]:h-9 [&_img]:w-auto" /></span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-white"
                aria-label={t("nav.close")}
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <nav className="flex-1 px-2 py-3" aria-label="Mobile navigation">
              {NAV.map((item) => {
                if (item.type === "link") {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-md px-3 py-3 text-sm font-bold ${isActive(item.href) ? "bg-light text-deep" : "text-ink"}`}
                    >
                      {t(item.key!)}
                    </Link>
                  );
                }
                return (
                  <div key={item.en} className="mt-1">
                    <p className="px-3 pb-1 pt-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-fresh">{pick(item.en, item.ur)}</p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold ${isActive(child.href) ? "bg-light text-deep" : "text-ink"}`}
                      >
                        {label(child)}
                        <Icon name="chevron" size={16} className="-rotate-90 text-fresh rtl:rotate-90" />
                      </Link>
                    ))}
                  </div>
                );
              })}
              {SHOW_DONATIONS && <Link href="/donate" className="mx-1 mt-3 flex items-center justify-between rounded-md bg-light px-3 py-3 text-sm font-semibold text-deep">
                {t("nav.donate")} <Icon name="heart" size={16} />
              </Link>}
            </nav>
            <div className="space-y-2 border-t border-deep/10 p-4">
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
