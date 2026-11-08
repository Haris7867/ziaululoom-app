"use client";

import type { ElementType, ReactNode } from "react";
import { useI18n } from "@/i18n/provider";

/** Renders the correct language value for bilingual content stored in the database. */
export function Bi({
  en,
  ur,
  as: Tag = "span",
  className,
  fallback,
}: {
  en?: string | null;
  ur?: string | null;
  as?: ElementType;
  className?: string;
  fallback?: ReactNode;
}) {
  const { pick } = useI18n();
  const value = pick(en, ur);
  return <Tag className={className}>{value || fallback || ""}</Tag>;
}

export function T({ k, className }: { k: string; className?: string }) {
  const { t } = useI18n();
  return <span className={className}>{t(k)}</span>;
}

export function DateText({ value }: { value: Date | string }) {
  const { lang } = useI18n();
  const date = typeof value === "string" ? new Date(value) : value;
  return (
    <time dateTime={date.toISOString()} dir={lang === "ur" ? "rtl" : "ltr"}>
      {new Intl.DateTimeFormat(lang === "ur" ? "ur-PK" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)}
    </time>
  );
}

export function Pkr({ amount }: { amount: number | string }) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return <span dir="ltr">PKR {new Intl.NumberFormat("en-PK").format(value)}</span>;
}
