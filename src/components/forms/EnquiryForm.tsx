"use client";

import { useState } from "react";
import { Field, FormNotice } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";

type Variant = "enquiry" | "callback" | "event" | "application";

export function EnquiryForm({
  variant = "enquiry",
  programmeOptions = [],
  compact = false,
}: {
  variant?: Variant;
  programmeOptions?: { slug: string; titleEn: string; titleUr: string }[];
  compact?: boolean;
}) {
  const { t, pick } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: variant }),
      });
      const json = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !json.ok) throw new Error(json.error ?? "failed");
      setState("done");
      form.reset();
    } catch {
      setState("error");
      setError(t("common.error"));
    }
  }

  if (state === "done") {
    return (
      <FormNotice>
        <Icon name="check" size={16} className="me-1 inline text-deep" />
        {variant === "callback" ? t("contact.thanksCallback") : variant === "event" ? t("events.registerNote") : t("contact.thanksEnquiry")}
      </FormNotice>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate={false}>
      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <Field label={t("contact.name")} required>
          <input name="name" required autoComplete="name" className="input" placeholder={pick("Full name", "پورا نام")} />
        </Field>
        <Field label={t("contact.phone")} required>
          <input name="phone" required type="tel" autoComplete="tel" className="input" placeholder="+92 3xx xxxxxxx" dir="ltr" />
        </Field>
        <Field label={t("contact.email")}>
          <input name="email" type="email" autoComplete="email" className="input" placeholder="you@example.com" dir="ltr" />
        </Field>
        <Field label={t("contact.city")}>
          <input name="city" className="input" placeholder={pick("Lahore", "لاہور")} />
        </Field>
        <Field label={t("contact.programme")}>
          <select name="programme" className="select">
            <option value="">{pick("Not sure / general enquiry", "غیر واضح / عمومی استفسار")}</option>
            {programmeOptions.map((p) => (
              <option key={p.slug} value={p.slug}>{pick(p.titleEn, p.titleUr)}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={variant === "callback" ? pick("Preferred call time", "کال کا پسندیدہ وقت") : t("contact.message")} required={variant === "callback"}>
        <textarea
          name="message"
          rows={compact ? 3 : 4}
          required={variant === "callback"}
          maxLength={600}
          className="textarea"
          placeholder={variant === "callback" ? pick("e.g. Weekdays after 3 pm", "مثلاً ہفتے کے دن 3 بجے کے بعد") : pick("How can we help?", "ہم کس طرح مدد کریں؟")}
        />
      </Field>
      <p className="text-xs text-ink/55">{t("contact.maxFive")} · {t("legal.readPrivacy")} <a href="/policies/privacy" className="link-underline">{t("footer.privacy")}</a></p>
      {state === "error" && <FormNotice tone="error">{error}</FormNotice>}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full">
        {state === "sending" ? t("common.sending") : t("common.submit")} <Icon name="arrow" size={16} />
      </button>
    </form>
  );
}

export function NewsletterForm() {
  const { t, pick } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setState("sending");
    await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, name: "Newsletter subscriber", phone: "n/a", kind: "newsletter" }),
    }).catch(() => null);
    setState("done");
    event.currentTarget.reset();
  }
  if (state === "done") return <FormNotice>{t("contact.thanksNewsletter")}</FormNotice>;
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <label htmlFor="newsletter-email" className="label">{t("contact.newsletter")}</label>
      <div className="flex gap-2">
        <input id="newsletter-email" name="email" type="email" required className="input" placeholder={pick("Email address", "ای میل پتہ")} dir="ltr" />
        <button type="submit" disabled={state === "sending"} className="btn btn-green shrink-0 !px-3">
          <Icon name="mail" size={16} />
        </button>
      </div>
      <p className="text-xs text-ink/55">{t("contact.newsletterNote")}</p>
    </form>
  );
}
