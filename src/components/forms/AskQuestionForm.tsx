"use client";

import { useState } from "react";
import { Field, FormNotice } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";
import { FATWA_CATEGORIES } from "@/lib/site";

export function AskQuestionForm() {
  const { t, pick, lang } = useI18n();
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<{ tracking: string; whatsapp: string } | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setState("sending");
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, question, anonymous: data.anonymous === "on" }),
      });
      const json = (await response.json()) as { ok: boolean; tracking?: string };
      if (!response.ok || !json.ok || !json.tracking) throw new Error("failed");
      const message = `Assalamu alaikum. My Darul Ifta tracking number is ${json.tracking}.`;
      setResult({ tracking: json.tracking, whatsapp: `https://wa.me/92515509922?text=${encodeURIComponent(message)}` });
      setState("idle");
      setQuestion("");
    } catch {
      setState("error");
    }
  }

  if (result) {
    return (
      <div className="space-y-3">
        <FormNotice>
          <p className="font-bold">{t("fatwa.submittedTitle")}</p>
          <p className="mt-1">{t("fatwa.submittedText")}</p>
          <p className="mt-2 rounded bg-white px-2 py-1 font-mono text-base font-bold text-deep" dir="ltr">
            {t("fatwa.tracking")}: {result.tracking}
          </p>
        </FormNotice>
        <div className="flex flex-wrap gap-2">
          <a href={result.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-green">
            <Icon name="whatsapp" size={16} /> {t("fatwa.submittedWhatsapp")}
          </a>
          <button type="button" onClick={() => setResult(null)} className="btn btn-outline">{t("fatwa.submit")}</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={`${t("fatwa.name")} (${t("common.optional")})`}>
          <input name="name" className="input" autoComplete="name" />
        </Field>
        <Field label={`${t("fatwa.contact")}`} required hint={t("fatwa.privacyNote")}>
          <input name="contact" required className="input" placeholder={pick("Phone or email", "فون یا ای میل")} />
        </Field>
        <Field label={t("fatwa.city")} required>
          <input name="city" required className="input" placeholder={pick("Lahore", "لاہور")} />
        </Field>
        <Field label={t("fatwa.category")} required>
          <select name="category" required className="select">
            {FATWA_CATEGORIES.map((c) => (
              <option key={c.key} value={c.en}>{pick(c.en, c.ur)}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={t("fatwa.questionText")} required hint={`${t("fatwa.charCount")}: ${1000 - question.length}`}>
        <textarea
          name="question"
          required
          maxLength={1000}
          rows={6}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="textarea"
          placeholder={pick("Describe your question with the relevant details (money, dates, family situation).", "اپنا سوال متعلقہ تفصیلات کے ساتھ لکھیں (رقم، تاریخیں، خاندانی صورتحال)۔")}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("fatwa.questionLanguage")}>
          <select name="language" className="select" defaultValue={lang}>
            <option value="en">English</option>
            <option value="ur">اردو</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm font-medium text-ink/80">
          <input type="checkbox" name="anonymous" className="h-4 w-4 accent-[#00633A]" /> {t("fatwa.anonymous")}
        </label>
      </div>
      <label className="flex items-start gap-2 text-sm text-ink/80">
        <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#00633A]" />
        <span>{t("fatwa.ack")}</span>
      </label>
      {state === "error" && <FormNotice tone="error">{t("common.error")}</FormNotice>}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full">
        {state === "sending" ? t("common.sending") : t("fatwa.submit")} <Icon name="question" size={16} />
      </button>
    </form>
  );
}
