"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormNotice } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";
import { QURBANI_PURPOSES } from "@/lib/site";
import { PAYMENT_KEYS, PAYMENT_META, type PaymentMethodKey } from "@/lib/payments";
import { formatPkr } from "@/lib/format";

type CowOption = {
  id: number;
  cowNumber: string;
  breed: string;
  weightKg: number;
  freeShares: number;
  vetStatus: string;
};

export function BookingWizard({
  cows,
  sharePrice,
  deadline,
}: {
  cows: CowOption[];
  sharePrice: number;
  deadline: string;
}) {
  const { t, pick } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cowId, setCowId] = useState<number | "any">(cows.find((c) => c.freeShares >= 1)?.id ?? "any");
  const [shares, setShares] = useState(1);
  const [purpose, setPurpose] = useState("self");
  const [details, setDetails] = useState({ buyerName: "", guardianName: "", cnic: "", whatsapp: "", email: "", city: "", onBehalfOf: "", notes: "" });
  const [method, setMethod] = useState<PaymentMethodKey>("card");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const selectedCow = cows.find((c) => c.id === cowId);
  const maxShares = cowId === "any" ? 7 : Math.min(7, selectedCow?.freeShares ?? 0);
  const effectiveShares = Math.min(shares, Math.max(1, maxShares));
  const total = effectiveShares * sharePrice;
  const closed = new Date(deadline).getTime() < Date.now();

  const steps = useMemo(
    () => [
      { n: 1, label: t("qurbani.step1") },
      { n: 2, label: t("qurbani.step2") },
      { n: 3, label: t("qurbani.step3") },
    ],
    [t],
  );

  async function submit() {
    if (!terms) {
      setError(t("qurbani.terms"));
      return;
    }
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/qurbani/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          purpose,
          shareCount: effectiveShares,
          cowId: cowId === "any" ? null : cowId,
          paymentMethod: method,
          terms,
        }),
      });
      const json = (await response.json()) as { ok: boolean; receiptId?: string; error?: string };
      if (!response.ok || !json.ok || !json.receiptId) {
        setError(json.error === "slot_taken" ? t("qurbani.slotUnavailable") : json.error || t("common.error"));
        setSending(false);
        return;
      }
      router.push(`/qurbani/pay/${json.receiptId}`);
    } catch {
      setError(t("common.error"));
      setSending(false);
    }
  }

  return (
    <div className="card p-5">
      <ol className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
        {steps.map((s, i) => (
          <li key={s.n} className="flex items-center gap-2">
            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${step >= s.n ? "bg-deep text-white" : "bg-light text-deep/60"}`}>{s.n}</span>
            <span className={step >= s.n ? "text-deep" : "text-ink/50"}>{s.label}</span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-deep/20" />}
          </li>
        ))}
      </ol>

      {closed && <FormNotice tone="error">{t("admissions.closed")} — {t("qurbani.deadlineCountdown")}</FormNotice>}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="cow-select">{t("qurbani.selectCow")}</label>
            <select
              id="cow-select"
              className="select"
              value={String(cowId)}
              onChange={(e) => { setCowId(e.target.value === "any" ? "any" : Number(e.target.value)); setShares(1); }}
            >
              <option value="any">{t("qurbani.anyCow")}</option>
              {cows.filter((c) => c.freeShares > 0 && c.vetStatus === "Fit for Qurbani").map((cow) => (
                <option key={cow.id} value={cow.id}>
                  {t("qurbani.cow")} {cow.cowNumber} — {cow.breed} · {cow.weightKg} kg · {cow.freeShares}/7 {t("qurbani.available")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="label">{t("qurbani.hissaCount")}</span>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={n > maxShares}
                  aria-pressed={effectiveShares === n}
                  onClick={() => setShares(n)}
                  className={`h-10 w-10 rounded-md border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-35 ${
                    effectiveShares === n ? "border-deep bg-deep text-white" : "border-deep/20 text-deep hover:bg-light"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="label">{t("qurbani.purpose")}</span>
            <div className="flex flex-wrap gap-2">
              {QURBANI_PURPOSES.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={purpose === p.key}
                  onClick={() => setPurpose(p.key)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${purpose === p.key ? "border-deep bg-light text-deep" : "border-deep/20 text-ink/70"}`}
                >
                  {pick(p.en, p.ur)}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-md bg-light p-3 text-sm text-deep">
            <p className="font-bold">{t("qurbani.liveTotal")}: <span dir="ltr">{formatPkr(total)}</span></p>
            <p className="text-xs">{effectiveShares} × {formatPkr(sharePrice)} · {t("qurbani.holdExpires")} 30 {t("common.minutes")}</p>
          </div>
          <button type="button" onClick={() => setStep(2)} className="btn btn-primary w-full" disabled={maxShares < 1}>
            {t("common.next")} <Icon name="arrow" size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("qurbani.buyerName")} required>
              <input className="input" value={details.buyerName} onChange={(e) => setDetails({ ...details, buyerName: e.target.value })} required />
            </Field>
            <Field label={t("qurbani.guardian")}>
              <input className="input" value={details.guardianName} onChange={(e) => setDetails({ ...details, guardianName: e.target.value })} />
            </Field>
            <Field label={t("qurbani.cnic")}>
              <input className="input" dir="ltr" placeholder="35202-0000000-0" value={details.cnic} onChange={(e) => setDetails({ ...details, cnic: e.target.value })} />
            </Field>
            <Field label={t("qurbani.whatsapp")} required>
              <input className="input" dir="ltr" required value={details.whatsapp} onChange={(e) => setDetails({ ...details, whatsapp: e.target.value })} placeholder="+92 3xx xxxxxxx" />
            </Field>
            <Field label={t("qurbani.email")} required>
              <input className="input" dir="ltr" type="email" required value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
            </Field>
            <Field label={t("contact.city")} required>
              <input className="input" required value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} />
            </Field>
            <Field label={t("qurbani.onBehalf")}>
              <input className="input" value={details.onBehalfOf} onChange={(e) => setDetails({ ...details, onBehalfOf: e.target.value })} placeholder={pick("Name of the deceased or beneficiary", "مرحوم یا مستفید ہونے والے کا نام")} />
            </Field>
            <Field label={t("qurbani.notes")}>
              <input className="input" value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value })} />
            </Field>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="btn btn-outline flex-1">{t("common.back")}</button>
            <button
              type="button"
              onClick={() => {
                if (!details.buyerName || !details.whatsapp || !details.email || !details.city) {
                  setError(t("common.required"));
                  return;
                }
                setError("");
                setStep(3);
              }}
              className="btn btn-primary flex-1"
            >
              {t("common.next")} <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <dl className="grid gap-2 rounded-md bg-light p-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-ink/60">{t("qurbani.buyerName")}</dt><dd className="font-semibold">{details.buyerName}</dd></div>
            <div><dt className="text-xs text-ink/60">{t("qurbani.cow")}</dt><dd className="font-semibold">{selectedCow ? `#${selectedCow.cowNumber} ${selectedCow.breed}` : t("qurbani.anyCow")}</dd></div>
            <div><dt className="text-xs text-ink/60">{t("qurbani.shares")}</dt><dd className="font-semibold">{effectiveShares}</dd></div>
            <div><dt className="text-xs text-ink/60">{t("qurbani.liveTotal")}</dt><dd className="font-semibold" dir="ltr">{formatPkr(total)}</dd></div>
          </dl>
          <div>
            <span className="label">{t("qurbani.step3")}</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PAYMENT_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={method === key}
                  onClick={() => setMethod(key)}
                  className={`rounded-md border px-2 py-2 text-xs font-semibold ${method === key ? "border-deep bg-light text-deep" : "border-deep/20 text-ink/70 hover:bg-light"}`}
                >
                  {pick(PAYMENT_META[key].en, PAYMENT_META[key].ur)}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-ink/60">{pick(PAYMENT_META[method].noteEn, PAYMENT_META[method].noteUr)}</p>
          </div>
          <label className="flex items-start gap-2 text-sm text-ink/80">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 h-4 w-4 accent-[#00633A]" />
            <span>
              {t("qurbani.terms")}{" "}
              <a href="/qurbani/faq" className="link-underline">{t("qurbani.rules")}</a> ·{" "}
              <a href="/policies/refund" className="link-underline">{t("footer.refund")}</a>
            </span>
          </label>
          {error && <FormNotice tone="error">{error}</FormNotice>}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="btn btn-outline flex-1">{t("common.back")}</button>
            <button type="button" onClick={submit} disabled={sending || closed} className="btn btn-primary flex-1">
              {sending ? t("qurbani.processing") : t("qurbani.reviewBooking")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
