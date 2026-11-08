"use client";

import Link from "next/link";
import { useState } from "react";
import { Field, FormNotice } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";
import { formatDate, formatPkr } from "@/lib/format";

type Result = {
  receiptId: string;
  buyerName: string;
  status: string;
  paymentStatus: string;
  cowNumber: string | null;
  shareNumbers: number[];
  amount: number;
  purpose: string;
  dispatchDate: string | null;
  slaughterDate: string | null;
  courier: string | null;
  trackingNumber: string | null;
};

const statusSteps = ["Reserved", "Paid", "Slaughtered", "Packed", "Dispatched", "Completed"];

export function StatusLookup() {
  const { t, pick } = useI18n();
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const params = new URLSearchParams({
        receipt: String(data.get("receipt") ?? ""),
        phone: String(data.get("phone") ?? ""),
      });
      const response = await fetch(`/api/qurbani/status?${params.toString()}`);
      const json = (await response.json()) as { ok: boolean; booking?: Result };
      if (!response.ok || !json.ok || !json.booking) {
        setError(t("qurbani.noBooking"));
      } else {
        setResult(json.booking);
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  const activeIndex = result ? Math.max(0, statusSteps.indexOf(result.status)) : 0;

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label={t("qurbani.receiptId")} required>
          <input name="receipt" required className="input" placeholder="QRB-2027-000123" dir="ltr" />
        </Field>
        <Field label={t("qurbani.phone")} required>
          <input name="phone" required className="input" placeholder="+92 3xx xxxxxxx" dir="ltr" />
        </Field>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? t("common.sending") : t("qurbani.checkBtn")}
        </button>
      </form>
      {error && <FormNotice tone="error">{error}</FormNotice>}
      {result && (
        <div className="rounded-lg border border-deep/15 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display text-lg font-bold text-deep">{result.receiptId}</p>
              <p className="text-xs text-ink/60">{t("qurbani.buyerName")}: {result.buyerName}</p>
            </div>
            <span className="badge badge-dark">{result.status}</span>
          </div>
          <ol className="mt-4 flex flex-wrap gap-1.5" aria-label={t("qurbani.status")}>
            {statusSteps.map((step, index) => (
              <li
                key={step}
                className={`rounded px-2 py-1 text-[0.68rem] font-semibold ${index <= activeIndex ? "bg-deep text-white" : "bg-light text-deep/60"}`}
              >
                {step}
              </li>
            ))}
          </ol>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-ink/55">{t("qurbani.cow")}</dt><dd className="font-semibold">#{result.cowNumber ?? "-"}</dd></div>
            <div><dt className="text-xs text-ink/55">{t("qurbani.shares")}</dt><dd className="font-semibold">{result.shareNumbers.join(", ")}</dd></div>
            <div><dt className="text-xs text-ink/55">{t("qurbani.purpose")}</dt><dd className="font-semibold">{result.purpose}</dd></div>
            <div><dt className="text-xs text-ink/55">{t("donate.amount")}</dt><dd className="font-semibold" dir="ltr">{formatPkr(result.amount)}</dd></div>
            <div><dt className="text-xs text-ink/55">{t("qurbani.expectedSlaughter")}</dt><dd className="font-semibold">{result.slaughterDate ? formatDate(result.slaughterDate) : "—"}</dd></div>
            <div><dt className="text-xs text-ink/55">{t("qurbani.dispatchDate")}</dt><dd className="font-semibold">{result.dispatchDate ? formatDate(result.dispatchDate) : pick("Not yet dispatched", "ابھی روانہ نہیں")}</dd></div>
            {result.trackingNumber && <div><dt className="text-xs text-ink/55">Courier</dt><dd className="font-semibold">{result.courier} · {result.trackingNumber}</dd></div>}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`/api/qurbani/receipt/${result.receiptId}/pdf`} className="btn btn-primary !py-2 !text-xs">
              <Icon name="download" size={14} /> {t("qurbani.downloadReceipt")}
            </a>
            <Link href={`/qurbani/receipt/${result.receiptId}`} className="btn btn-outline !py-2 !text-xs">{t("qurbani.receipt")}</Link>
          </div>
          <p className="mt-3 text-[0.7rem] text-ink/50">{t("qurbani.checkSub")}</p>
        </div>
      )}
    </div>
  );
}

export function ZakatCalculator() {
  const { t, pick } = useI18n();
  const [values, setValues] = useState({ cash: "", gold: "", silver: "", business: "", debts: "" });
  const [result, setResult] = useState<{ nisab: number; due: number; eligible: boolean } | null>(null);

  function compute() {
    const cash = Number(values.cash) || 0;
    const gold = (Number(values.gold) || 0) * 26000;
    const silver = (Number(values.silver) || 0) * 300;
    const business = Number(values.business) || 0;
    const debts = Number(values.debts) || 0;
    const net = Math.max(0, cash + gold + silver + business - debts);
    const nisab = 612.36 * 300;
    setResult({ nisab, due: net >= nisab ? net * 0.025 : 0, eligible: net >= nisab });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {([
          ["cash", pick("Cash & bank", "نقدی و بینک")],
          ["gold", pick("Gold (grams)", "سونا (گرام)")],
          ["silver", pick("Silver (grams)", "چاندی (گرام)")],
          ["business", pick("Business stock", "تجارتی مال")],
          ["debts", pick("Debts due", "واجب الادا قرض")],
        ] as [keyof typeof values, string][]).map(([key, label]) => (
          <label key={key} className="block text-xs font-semibold text-ink/70">
            {label}
            <input
              inputMode="numeric"
              value={values[key]}
              onChange={(e) => setValues({ ...values, [key]: e.target.value.replace(/[^0-9.]/g, "") })}
              className="input mt-1"
              dir="ltr"
            />
          </label>
        ))}
      </div>
      <button type="button" onClick={compute} className="btn btn-green w-full !py-2">{t("seasonal.compute")}</button>
      {result && (
        <FormNotice>
          <p className="font-bold">{t("seasonal.zakatDue")}: <span dir="ltr">PKR {Math.round(result.due).toLocaleString("en-PK")}</span></p>
          <p className="text-xs mt-1">Nisab (silver): PKR {Math.round(result.nisab).toLocaleString("en-PK")} · {result.eligible ? pick("Zakat is due.", "زکوٰۃ واجب ہے۔") : pick("Below nisab — no Zakat due.", "نصاب سے کم — زکوٰۃ واجب نہیں۔")}</p>
        </FormNotice>
      )}
      <p className="text-xs text-ink/60">{t("seasonal.zakatNote")}</p>
    </div>
  );
}
