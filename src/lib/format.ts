export function formatPkr(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return `PKR ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(value)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-PK").format(value);
}

export function formatDate(value: Date | string, lang: "en" | "ur" = "en"): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(lang === "ur" ? "ur-PK" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(value: Date | string): { day: string; month: string; year: string } {
  const date = typeof value === "string" ? new Date(value) : value;
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("day"), month: get("month").toUpperCase(), year: get("year") };
}

export function formatDateTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function eventPhase(startAt: Date | string, endAt: Date | string): "upcoming" | "ongoing" | "past" {
  const now = Date.now();
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "past";
}

export function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
}

export function humanFileSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}
