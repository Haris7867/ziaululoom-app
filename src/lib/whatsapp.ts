export type TemplateVars = Record<string, string>;

export function renderTemplate(template: string, vars: TemplateVars): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

type Template = { templateKey: string; language: string; body: string };

export function pickTemplate(
  templates: Template[],
  templateKey: string,
  language: "en" | "ur",
): string {
  const match =
    templates.find((t) => t.templateKey === templateKey && t.language === language) ??
    templates.find((t) => t.templateKey === templateKey && t.language === "en");
  return match?.body ?? "";
}

const DEFAULT_TEMPLATES: Template[] = [
  { templateKey: "booking", language: "en", body: "Assalamu alaikum {{name}}. Your Qurbani 2027 booking {{receipt}} is reserved: Hissa {{hissas}} of Cow {{cow}}. Total {{amount}}. Please complete payment within 30 minutes to confirm." },
  { templateKey: "payment", language: "en", body: "Payment received for {{receipt}}: {{amount}} via {{method}}. Your PDF receipt: {{link}}" },
  { templateKey: "slaughter", language: "en", body: "Your Qurbani {{receipt}} (Cow {{cow}}, Hissa {{hissas}}) is scheduled for slaughter on {{date}} at {{location}}." },
  { templateKey: "dispatch", language: "en", body: "Your Qurbani {{receipt}} has been dispatched on {{date}}. Courier {{courier}}, tracking {{tracking}}." },
];

export function buildWhatsappMessage(
  templates: Template[],
  templateKey: string,
  language: "en" | "ur",
  vars: TemplateVars,
): string {
  const source = templates.length > 0 ? templates : DEFAULT_TEMPLATES;
  return renderTemplate(pickTemplate(source, templateKey, language) || pickTemplate(DEFAULT_TEMPLATES, templateKey, "en"), vars);
}

export const RECEIPT_DUA = {
  ar: "بِسْمِ اللهِ وَاللهُ أَكْبَرُ، اللَّهُمَّ تَقَبَّلْ مِنَّا",
  en: "In the name of Allah, Allah is the Greatest. O Allah, accept this from us.",
  ur: "اللہ کے نام سے، اللہ سب سے بڑا ہے۔ اے اللہ! ہم سے قبول فرما۔",
};

export const FATWA_DISCLAIMER = {
  en: "This answer reflects the Darul Ifta's understanding according to the Hanafi school. For personal circumstances, consult the Darul Ifta directly.",
  ur: "یہ جواب دارالافتاء کی فقہ حنفی کے مطابق سمجھ ہے۔ ذاتی حالات کے لیے براہِ راست دارالافتاء سے رجوع کریں۔",
};
