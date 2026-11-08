"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormNotice } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";
import { PAYMENT_KEYS, PAYMENT_META, type PaymentMethodKey } from "@/lib/payments";
import { formatPkr } from "@/lib/format";

export function PaymentPanel({
  receiptId,
  amount,
  currentMethod,
  status,
}: {
  receiptId: string;
  amount: number;
  currentMethod: string;
  status: string;
}) {
  const { t, pick } = useI18n();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethodKey>(
    (PAYMENT_KEYS as string[]).includes(currentMethod) ? (currentMethod as PaymentMethodKey) : "card",
  );
  const [txn, setTxn] = useState("");
  const [proofName, setProofName] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "info" | "error"; text: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(status === "Paid");

  async function pay() {
    setSending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/qurbani/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptId, method, transactionId: txn || null, proofName: proofName || null }),
      });
      const json = (await response.json()) as { ok: boolean; status?: string; message?: string; providerRef?: string };
      if (!response.ok || !json.ok) throw new Error(json.message ?? "failed");
      if (json.status === "paid") {
        setDone(true);
        setMessage({ tone: "success", text: `${t("qurbani.paymentRecorded")} — ${receiptId}` });
        router.refresh();
      } else {
        setMessage({ tone: "info", text: `${json.message ?? t("qurbani.pendingVerification")}${json.providerRef ? ` (${json.providerRef})` : ""}` });
      }
    } catch {
      setMessage({ tone: "error", text: t("common.error") });
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-3">
        <FormNotice>
          <p className="font-bold">{t("qurbani.receipt")} · {receiptId}</p>
          <p className="mt-1">{t("qurbani.emailReceipt")}</p>
        </FormNotice>
        <div className="flex flex-wrap gap-2">
          <a href={`/api/qurbani/receipt/${receiptId}/pdf`} className="btn btn-primary">
            <Icon name="download" size={16} /> {t("qurbani.downloadReceipt")}
          </a>
          <a href={`/qurbani/receipt/${receiptId}`} className="btn btn-outline">{t("qurbani.receipt")}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PAYMENT_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={method === key}
            onClick={() => { setMethod(key); setMessage(null); }}
            className={`rounded-md border px-2 py-2.5 text-xs font-semibold transition ${method === key ? "border-deep bg-light text-deep" : "border-deep/20 text-ink/70 hover:bg-light"}`}
          >
            {pick(PAYMENT_META[key].en, PAYMENT_META[key].ur)}
          </button>
        ))}
      </div>
      <p className="rounded-md bg-light/70 p-3 text-sm text-ink/80">{pick(PAYMENT_META[method].noteEn, PAYMENT_META[method].noteUr)}</p>

      {PAYMENT_META[method].needsReference && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("qurbani.txnId")} required>
            <input value={txn} onChange={(e) => setTxn(e.target.value)} className="input" dir="ltr" placeholder="TRX-123456" />
          </Field>
          <Field label={t("qurbani.uploadProof")} hint={t("admissions.fileHint")}>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setProofName(e.target.files?.[0]?.name ?? "")}
              className="input !py-1.5 text-xs"
            />
          </Field>
        </div>
      )}

      {message && <FormNotice tone={message.tone}>{message.text}</FormNotice>}

      <button type="button" onClick={pay} disabled={sending} className="btn btn-primary w-full !py-2.5">
        {sending ? t("qurbani.processing") : `${t("common.submit")} · ${formatPkr(amount)}`}
      </button>
      <p className="text-center text-[0.7rem] text-ink/55">
        {method === "card" ? t("qurbani.payCardNote") : t("qurbani.holdExpires")} · PCI: full card numbers are never stored.
      </p>
    </div>
  );
}
