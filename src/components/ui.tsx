"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "@/i18n/provider";
import { AnimatedDivider } from "./Decor";

export function SectionHeading({
  eyebrow,
  titleEn,
  titleUr,
  subtitleEn,
  subtitleUr,
  align = "start",
  action,
}: {
  eyebrow?: string;
  titleEn: string;
  titleUr: string;
  subtitleEn?: string;
  subtitleUr?: string;
  align?: "start" | "center";
  action?: ReactNode;
}) {
  const { pick } = useI18n();
  return (
    <div className={`mb-7 flex flex-col gap-3 ${align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={align === "center" ? "max-w-3xl" : "max-w-2xl"}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="mt-1.5 text-3xl font-bold sm:text-4xl">{pick(titleEn, titleUr)}</h2>
        {(subtitleEn || subtitleUr) && (
          <p className="mt-2 text-ink/75">{pick(subtitleEn, subtitleUr)}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PageHero({
  image,
  eyebrowEn,
  eyebrowUr,
  titleEn,
  titleUr,
  subtitleEn,
  subtitleUr,
  children,
  compact = false,
}: {
  image: string;
  eyebrowEn?: string;
  eyebrowUr?: string;
  titleEn: string;
  titleUr: string;
  subtitleEn?: string;
  subtitleUr?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  const { pick } = useI18n();
  return (
    <section className="relative isolate overflow-hidden bg-deep text-white">
      <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-45" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/80 to-deep/45" aria-hidden="true" />
      <div className={`container-x relative ${compact ? "py-10" : "py-14 md:py-20"}`}>
        {(eyebrowEn || eyebrowUr) && (
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">
            {pick(eyebrowEn, eyebrowUr)}
          </p>
        )}
        <h1 className="max-w-3xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">{pick(titleEn, titleUr)}</h1>
        {(subtitleEn || subtitleUr) && (
          <p className="mt-3 max-w-2xl text-white/85">{pick(subtitleEn, subtitleUr)}</p>
        )}
        {children && <div className="mt-5 flex flex-wrap items-center gap-2.5">{children}</div>}
      </div>
    </section>
  );
}

export function Countdown({ target, label }: { target: string; label: string }) {
  const { t } = useI18n();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = now === null ? 0 : Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const units = [
    { value: days, label: t("common.days") },
    { value: hours, label: t("common.hours") },
    { value: minutes, label: "min" },
    { value: seconds, label: "sec" },
  ];
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</p>
      <div className="mt-1.5 flex gap-2" dir="ltr">
        {units.map((u) => (
          <div key={u.label} className="min-w-[3.2rem] rounded-md bg-white/10 px-2 py-1.5 text-center">
            <span className="block text-lg font-bold text-white">{String(u.value).padStart(2, "0")}</span>
            <span className="block text-[0.6rem] uppercase tracking-wide text-white/70">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CountdownBlock({ target, label, dark = false }: { target: string; label: string; dark?: boolean }) {
  return (
    <div className={dark ? "rounded-lg bg-deep p-4" : ""}>
      <Countdown target={target} label={label} />
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
}: {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="inline-flex flex-wrap gap-1 rounded-lg border border-deep/15 bg-white p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          type="button"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            value === tab.value ? "bg-deep text-white" : "text-ink/70 hover:bg-light hover:text-deep"
          }`}
        >
          {tab.label}
          {typeof tab.count === "number" && <span className="ms-1.5 text-[0.7rem] opacity-80">({tab.count})</span>}
        </button>
      ))}
    </div>
  );
}

export function Accordion({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="divide-y divide-deep/10 overflow-hidden rounded-lg border border-deep/15 bg-white">
      {items.map((item) => {
        const expanded = open === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`panel-${item.id}`}
                onClick={() => setOpen(expanded ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start text-[0.95rem] font-semibold text-deep hover:bg-light/60"
              >
                {item.question}
                <Icon name="chevron" size={18} className={`shrink-0 text-fresh transition ${expanded ? "rotate-180" : ""}`} />
              </button>
            </h3>
            {expanded && (
              <div id={`panel-${item.id}`} className="px-4 pb-4 text-sm text-ink/80">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FormNotice({ tone = "success", children }: { tone?: "success" | "error" | "info"; children: ReactNode }) {
  const styles = {
    success: "border-fresh/40 bg-light text-deep",
    error: "border-red-300 bg-red-50 text-red-800",
    info: "border-gold/40 bg-[#fdf7e6] text-[#6d5108]",
  };
  return (
    <div role="status" className={`rounded-md border px-3.5 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-deep/25 bg-light/50 px-4 py-8 text-center text-sm text-ink/70">{children}</p>;
}

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="label">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/55">{hint}</span>}
    </label>
  );
}

export function ShareButton({ message, label }: { message: string; label?: string }) {
  const { t } = useI18n();
  return (
    <a
      href={`https://wa.me/?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline !py-1.5 !text-xs"
    >
      <Icon name="whatsapp" size={14} /> {label ?? t("common.share")}
    </a>
  );
}

export function Prose({ paragraphs, className = "" }: { paragraphs: string[]; className?: string }) {
  const id = useId();
  return (
    <div className={`prose-site text-ink/85 ${className}`} key={id}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function IconTile({ name, title, text, href }: { name: IconName; title: string; text?: string; href?: string }) {
  const content = (
    <>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep">
        <Icon name={name} size={20} />
      </span>
      <span className="mt-2 block text-sm font-bold text-deep">{title}</span>
      {text && <span className="mt-1 block text-xs text-ink/65">{text}</span>}
    </>
  );
  return href ? (
    <Link href={href} className="card block p-4">{content}</Link>
  ) : (
    <div className="card p-4">{content}</div>
  );
}

export function useAnimatedCount(target: number, active: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return value;
}

export function StatBlock({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(true)),
      { threshold: 0.35 },
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);
  const count = useAnimatedCount(value, active);
  return (
    <div ref={setRef} className="rounded-lg border border-deep/10 bg-white p-4 text-center shadow-sm">
      <span className="block font-display text-3xl font-bold text-deep" dir="ltr">
        {count.toLocaleString("en-US")}{suffix}
      </span>
      <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-ink/60">{label}</span>
    </div>
  );
}

export function useEventPhase(startAt: string, endAt: string) {
  return useMemo(() => {
    const now = Date.now();
    if (now < new Date(startAt).getTime()) return "upcoming" as const;
    if (now <= new Date(endAt).getTime()) return "ongoing" as const;
    return "past" as const;
  }, [startAt, endAt]);
}

export function Divider() {
  return <AnimatedDivider className="my-6" />;
}

export function Callout({
  icon = "shield",
  title,
  children,
}: {
  icon?: IconName;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-deep/15 border-s-4 border-s-fresh bg-light/70 p-4">
      <div className="flex items-start gap-2.5">
        <Icon name={icon} size={20} className="mt-0.5 shrink-0 text-deep" />
        <div>
          {title && <p className="text-sm font-bold text-deep">{title}</p>}
          <div className="text-sm text-ink/80">{children}</div>
        </div>
      </div>
    </div>
  );
}
