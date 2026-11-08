export type PaymentMethodKey = "card" | "jazzcash" | "easypaisa" | "upaisa" | "bank_transfer" | "cash";

export type PaymentMeta = {
  key: PaymentMethodKey;
  en: string;
  ur: string;
  kind: "card" | "wallet" | "manual";
  needsReference: boolean;
  noteEn: string;
  noteUr: string;
};

export const PAYMENT_META: Record<PaymentMethodKey, PaymentMeta> = {
  card: {
    key: "card", en: "Card (Stripe)", ur: "کارڈ (اسٹرپ)", kind: "card", needsReference: false,
    noteEn: "Secure card payments are processed by Stripe. Test mode is enabled in this demo — no real charge is made.",
    noteUr: "محفوظ کارڈ ادائیگی اسٹرپ کے ذریعے ہوتی ہے۔ اس ڈیمو میں ٹیسٹ موڈ فعال ہے — اصل رقم نہیں کٹتی۔",
  },
  jazzcash: {
    key: "jazzcash", en: "JazzCash", ur: "جاز کیش", kind: "wallet", needsReference: true,
    noteEn: "A payment request is created with JazzCash. Once the provider webhook confirms it, your receipt is issued automatically.",
    noteUr: "جاز کیش کے ساتھ ادائیگی کی درخواست بنائی جاتی ہے۔ ویب ہک کی تصدیق پر رسید خودکار جاری ہوتی ہے۔",
  },
  easypaisa: {
    key: "easypaisa", en: "Easypaisa", ur: "ایزی پیسہ", kind: "wallet", needsReference: true,
    noteEn: "A payment request is created with Easypaisa. Provider confirmation is recorded through the webhook placeholder.",
    noteUr: "ایزی پیسہ کے ساتھ ادائیگی کی درخواست بنائی جاتی ہے۔ پرووائیڈر کی تصدیق ویب ہک کے ذریعے درج ہوتی ہے۔",
  },
  upaisa: {
    key: "upaisa", en: "UPaisa", ur: "یو پی سا", kind: "wallet", needsReference: true,
    noteEn: "A payment request is created with UPaisa. Provider confirmation is recorded through the webhook placeholder.",
    noteUr: "یو پی سا کے ساتھ ادائیگی کی درخواست بنائی جاتی ہے۔ تصدیق ویب ہک کے ذریعے درج ہوتی ہے۔",
  },
  bank_transfer: {
    key: "bank_transfer", en: "Bank transfer", ur: "بینک ٹرانسفر", kind: "manual", needsReference: true,
    noteEn: "Transfer to the university account and enter your transaction ID. The admin verifies it, usually within one working day.",
    noteUr: "یونیورسٹی اکاؤنٹ میں رقم بھیجیں اور ٹرانزیکشن آئی ڈی درج کریں۔ ایڈمن عموماً ایک کاروباری دن میں تصدیق کرتا ہے۔",
  },
  cash: {
    key: "cash", en: "Cash at the office", ur: "دفتر میں نقد", kind: "manual", needsReference: false,
    noteEn: "Pay at the finance office. The cashier records the payment and issues a manual receipt immediately.",
    noteUr: "دفترِ مالیات میں ادائیگی کریں۔ کیشیئر ادائیگی درج کر کے فوری دستی رسید جاری کرے گا۔",
  },
};

export const PAYMENT_KEYS: PaymentMethodKey[] = ["card", "jazzcash", "easypaisa", "upaisa", "bank_transfer", "cash"];

export function isPaymentMethod(value: string): value is PaymentMethodKey {
  return (PAYMENT_KEYS as string[]).includes(value);
}

/** Stripe is wired through env vars; the demo falls back to a simulated confirmation. */
export function stripeMode(): "live" | "test" | "placeholder" {
  if (!process.env.STRIPE_SECRET_KEY) return "placeholder";
  return process.env.STRIPE_SECRET_KEY.startsWith("sk_live") ? "live" : "test";
}

/**
 * Provider integration placeholder. In production this creates a payment
 * request against the JazzCash / Easypaisa / UPaisa merchant API and returns
 * the hosted checkout URL. The demo returns a local reference so the webhook
 * placeholder can be exercised end to end.
 */
export function createProviderReference(method: PaymentMethodKey, receiptId: string): string {
  const prefix = { card: "pi", jazzcash: "JC", easypaisa: "EP", upaisa: "UP", bank_transfer: "TRX", cash: "CASH" }[method];
  return `${prefix}-DEMO-${receiptId.replace(/[^0-9]/g, "").slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
}

export const WEBHOOK_EVENTS = [
  "payment.pending",
  "payment.completed",
  "payment.failed",
  "payment.refunded",
] as const;
