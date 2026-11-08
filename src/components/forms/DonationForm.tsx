"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Field, FormNotice } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";
import { DONATION_PRESETS, DONATION_PURPOSES, UNIVERSITY } from "@/lib/site";
import { PAYMENT_KEYS, PAYMENT_META, type PaymentMethodKey } from "@/lib/payments";
import { formatPkr } from "@/lib/format";

export function DonationForm({ compact = false, defaultPurpose = "general" }: { compact?: boolean; defaultPurpose?: string }) {
  const { t, pick } = useI18n();
  const [amount, setAmount] = useState(5000);
  const [custom, setCustom] = useState("");
  const [recurring, setRecurring] = useState("one-time");
  const [purpose, setPurpose] = useState(defaultPurpose);
  const [method, setMethod] = useState<PaymentMethodKey>("card");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [result, setResult] = useState<{ receiptNo: string; status: string } | null>(null);

  const total = useMemo(() => (custom ? Number(custom) || 0 : amount), [amount, custom]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (total < 100) {
      setState("error");
      return;
    }
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setState("sending");
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amount: total, recurring, purpose, method }),
      });
      const json = (await response.json()) as { ok: boolean; receiptNo?: string; status?: string };
      if (!response.ok || !json.ok || !json.receiptNo) throw new Error("failed");
      setResult({ receiptNo: json.receiptNo, status: json.status ?? "pending" });
      setState("idle");
    } catch {
      setState("error");
    }
  }

  if (result) {
    return (
      <div className="space-y-3">
        <FormNotice>
          <p className="font-bold">{t("donate.thankTitle")}</p>
          <p className="mt-1">{t("donate.thankText")}</p>
          <p className="mt-2 font-mono text-sm font-bold" dir="ltr">{result.receiptNo} · {result.status}</p>
        </FormNotice>
        <div className="flex flex-wrap gap-2">
          <Link href={`/donate/thank-you?receipt=${result.receiptNo}`} className="btn btn-primary">{t("donate.thankTitle")}</Link>
          <button type="button" onClick={() => setResult(null)} className="btn btn-outline">{t("nav.donate")}</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div className="inline-flex rounded-lg border border-deep/15 bg-white p-1" role="group" aria-label={t("donate.amount")}>
        {[
          { key: "one-time", label: t("donate.oneTime") },
          { key: "monthly", label: t("donate.monthly") },
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={recurring === option.key}
            onClick={() => setRecurring(option.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold ${recurring === option.key ? "bg-deep text-white" : "text-ink/70 hover:bg-light"}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <fieldset>
        <legend className="label">{t("donate.amount")}</legend>
        <div className="flex flex-wrap gap-2">
          {DONATION_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={!custom && amount === preset}
              onClick={() => { setAmount(preset); setCustom(""); }}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                !custom && amount === preset ? "border-deep bg-deep text-white" : "border-deep/20 bg-white text-deep hover:bg-light"
              }`}
            >
              {formatPkr(preset)}
            </button>
          ))}
          <input
            aria-label={t("donate.custom")}
            inputMode="numeric"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder={t("donate.custom")}
            className="input !w-36"
          />
        </div>
        <p className="mt-2 text-sm font-bold text-deep">{t("qurbani.liveTotal")}: <span dir="ltr">{formatPkr(total)}</span> {recurring === "monthly" ? `/ ${pick("month", "ماہ")}` : ""}</p>
      </fieldset>

      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <Field label={t("donate.purpose")} required>
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="select">
            {DONATION_PURPOSES.map((p) => (
              <option key={p.key} value={p.key}>{pick(p.en, p.ur)}</option>
            ))}
          </select>
        </Field>
        <Field label={t("donor.name")} required>
          <input name="donorName" required className="input" autoComplete="name" />
        </Field>
        <Field label={t("donor.email")} required>
          <input name="email" required type="email" className="input" dir="ltr" autoComplete="email" />
        </Field>
        <Field label={`${t("contact.phone")} (${t("common.optional")})`}>
          <input name="phone" type="tel" className="input" dir="ltr" autoComplete="tel" />
        </Field>
      </div>

      <div>
        <label className="label">{t("qurbani.step3")}</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PAYMENT_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={method === key}
              onClick={() => setMethod(key)}
              className={`rounded-md border px-2 py-2 text-xs font-semibold ${
                method === key ? "border-deep bg-light text-deep" : "border-deep/20 bg-white text-ink/70 hover:bg-light"
              }`}
            >
              {pick(PAYMENT_META[key].en, PAYMENT_META[key].ur)}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-ink/60">{pick(PAYMENT_META[method].noteEn, PAYMENT_META[method].noteUr)}</p>
        {method === "bank_transfer" && (
          <div className="mt-2 rounded-md bg-light p-2 text-xs text-deep">
            <p>{t("donate.zakatAccount")}: <span dir="ltr">{UNIVERSITY.bank.zakat.account}</span></p>
            <p>{t("donate.generalAccount")}: <span dir="ltr">{UNIVERSITY.bank.general.account}</span></p>
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/75">
        <input type="checkbox" name="anonymous" className="h-4 w-4 accent-[#00633A]" /> {t("fatwa.anonymous")}
      </label>

      {state === "error" && <FormNotice tone="error">{t("common.error")}</FormNotice>}
      <button type="submit" disabled={state === "sending"} className="btn btn-gold w-full !py-2.5">
        {state === "sending" ? t("common.sending") : `${t("home.donateNow")} · ${formatPkr(total)}`}
        <Icon name="heart" size={16} />
      </button>
      <p className="text-center text-[0.7rem] text-ink/55">{t("donate.zakatNote")}</p>
    </form>
  );
}
