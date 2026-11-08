import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";

const GREEN = rgb(0, 0.388, 0.227);
const FRESH = rgb(0.247, 0.651, 0.42);
const LIGHT = rgb(0.914, 0.965, 0.933);
const INK = rgb(0.067, 0.067, 0.067);
const GOLD = rgb(0.831, 0.627, 0.09);
const GREY = rgb(0.45, 0.45, 0.45);

function safe(text: string): string {
  return text
    .replace(/\uFDFA|\uFDFB/g, "(PBUH)")
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u20A8/g, "Rs")
    .replace(/[^\x00-\xFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = safe(text).split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function siteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://alnoor.edu.pk";
  return `${base.replace(/\/$/, "")}${path}`;
}

type ReceiptInput = {
  receiptId: string;
  buyerName: string;
  guardianName?: string | null;
  cowNumber?: string | null;
  breed?: string | null;
  shareNumbers: number[];
  purpose: string;
  onBehalfOf?: string | null;
  amount: number;
  paymentMethod: string;
  transactionId?: string | null;
  paidAt?: Date | null;
  slaughterDate?: Date | null;
  location?: string | null;
  dispatchDate?: Date | null;
  status: string;
  seasonName: string;
  verifyUrl: string;
};

export async function buildQurbaniReceiptPdf(input: ReceiptInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const body = await pdf.embedFont(StandardFonts.Helvetica);
  const small = await pdf.embedFont(StandardFonts.Helvetica);
  const width = page.getWidth();
  const margin = 44;

  // Header band
  page.drawRectangle({ x: 0, y: 742, width, height: 100, color: GREEN });
  page.drawRectangle({ x: 0, y: 736, width, height: 6, color: GOLD });
  page.drawText("AL-NOOR ISLAMIC UNIVERSITY", { x: margin, y: 808, size: 17, font: bold, color: rgb(1, 1, 1) });
  page.drawText(safe("Canal Road, Lahore, Pakistan  |  info@alnoor.edu.pk  |  +92 300 1234567"), {
    x: margin, y: 790, size: 8.5, font: small, color: rgb(0.9, 0.98, 0.93),
  });
  page.drawText(`${safe(input.seasonName)} - QURBANI RECEIPT`, { x: margin, y: 763, size: 13, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Sample document generated on the server", { x: margin, y: 750, size: 7.5, font: italic, color: rgb(0.88, 0.96, 0.91) });

  const qrDataUrl = await QRCode.toDataURL(input.verifyUrl, { margin: 1, width: 240, color: { dark: "#00633A", light: "#FFFFFF" } });
  const qrPng = await pdf.embedPng(qrDataUrl);
  page.drawImage(qrPng, { x: width - margin - 88, y: 640, width: 88, height: 88 });

  let y = 706;
  page.drawText(safe(`Receipt ID: ${input.receiptId}`), { x: margin, y, size: 12, font: bold, color: INK });
  y -= 16;
  page.drawText(safe(`Status: ${input.status}`), { x: margin, y, size: 9.5, font: body, color: GREEN });
  y -= 14;
  page.drawText(safe(`Issued: ${new Date(input.paidAt ?? new Date()).toLocaleString("en-GB")}`), { x: margin, y, size: 9, font: body, color: GREY });
  y -= 14;
  page.drawText("Scan the QR code to check your booking status.", { x: margin, y, size: 8, font: italic, color: GREY });

  // Buyer block
  y = 616;
  page.drawRectangle({ x: margin, y: y - 96, width: width - margin * 2, height: 110, color: LIGHT });
  page.drawText("BUYER & BOOKING DETAILS", { x: margin + 14, y: y + 2, size: 9, font: bold, color: GREEN });
  y -= 16;
  const rows: [string, string][] = [
    ["Name on receipt", input.buyerName],
    ["Father / husband", input.guardianName || "Not provided"],
    ["Animal", `Cow ${input.cowNumber ?? "-"} (${input.breed ?? "Sahiwal"})`],
    ["Hissa numbers", `Hissa ${input.shareNumbers.join(", ")} of Cow ${input.cowNumber ?? "-"}`],
    ["Purpose", `${input.purpose}${input.onBehalfOf ? ` - on behalf of ${input.onBehalfOf}` : ""}`],
    ["Amount", `PKR ${input.amount.toLocaleString("en-PK")}`],
    ["Payment method", `${input.paymentMethod}  |  Txn: ${input.transactionId ?? "cash at office"}`],
  ];
  for (const [label, value] of rows) {
    page.drawText(label, { x: margin + 14, y, size: 8.6, font: body, color: GREY });
    page.drawText(safe(value).slice(0, 82), { x: margin + 150, y, size: 9.4, font: bold, color: INK });
    y -= 15;
  }

  // Schedule
  y -= 12;
  page.drawText("SLAUGHTER & DISTRIBUTION", { x: margin, y, size: 9, font: bold, color: GREEN });
  y -= 16;
  const schedule: [string, string][] = [
    ["Expected slaughter", input.slaughterDate ? new Date(input.slaughterDate).toDateString() : "To be confirmed"],
    ["Slaughter location", input.location ?? "Al-Noor University Farm, Lahore"],
    ["Dispatch / distribution", input.dispatchDate ? new Date(input.dispatchDate).toDateString() : "Same day after packing"],
  ];
  for (const [label, value] of schedule) {
    page.drawText(label, { x: margin, y, size: 8.6, font: body, color: GREY });
    page.drawText(safe(value).slice(0, 78), { x: margin + 150, y, size: 9.4, font: body, color: INK });
    y -= 15;
  }

  // Dua
  y -= 8;
  page.drawRectangle({ x: margin, y: y - 52, width: width - margin * 2, height: 60, color: rgb(0.98, 0.98, 0.96), borderColor: GOLD, borderWidth: 0.8 });
  const duaLines = wrap(
    "Dua: Inna lillahi wa inna ilayhi raji'un - O Allah, accept this Qurbani from us, as You accepted from Your beloved Prophet Ibrahim (peace be upon him).",
    italic, 9.5, width - margin * 2 - 28,
  );
  let dy = y - 10;
  for (const line of duaLines) {
    page.drawText(line, { x: margin + 14, y: dy, size: 9.5, font: italic, color: INK });
    dy -= 13;
  }

  // Signatures
  const signY = 132;
  page.drawLine({ start: { x: margin, y: signY }, end: { x: margin + 170, y: signY }, thickness: 0.8, color: INK });
  page.drawText("Qurbani in-charge signature", { x: margin, y: signY - 13, size: 8, font: body, color: GREY });
  page.drawRectangle({ x: width - margin - 140, y: signY - 10, width: 140, height: 62, borderColor: GREEN, borderWidth: 1, color: rgb(1, 1, 1) });
  page.drawText("AL-NOOR ISLAMIC UNIVERSITY", { x: width - margin - 130, y: signY + 32, size: 6.6, font: bold, color: GREEN });
  page.drawText("QURBANI OFFICE", { x: width - margin - 130, y: signY + 22, size: 7.4, font: bold, color: GREEN });
  page.drawText("OFFICIAL STAMP (sample)", { x: width - margin - 130, y: signY + 10, size: 6.4, font: body, color: GREY });

  page.drawRectangle({ x: 0, y: 0, width, height: 74, color: LIGHT });
  page.drawText("Al-Noor Islamic University - Qurbani Office, Canal Road, Lahore", { x: margin, y: 50, size: 8.4, font: body, color: GREEN });
  page.drawText("This is a computer-generated receipt. Verify at /qurbani/status with your receipt ID and phone number.", { x: margin, y: 36, size: 7.6, font: body, color: GREY });
  page.drawText("Bilingual Urdu copy: your online receipt and email confirmation include Urdu text. Refunds follow the published refund policy.", { x: margin, y: 22, size: 7.6, font: body, color: GREY });

  return pdf.save();
}

type DocSection = { heading?: string; lines?: string[] };

export async function buildContentPdf(options: {
  title: string;
  subtitle?: string;
  meta?: string;
  sections: DocSection[];
  footerNote?: string;
  qrUrl?: string;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const body = await pdf.embedFont(StandardFonts.Helvetica);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 52;
  let page: PDFPage = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 140;

  page.drawRectangle({ x: 0, y: pageHeight - 118, width: pageWidth, height: 118, color: GREEN });
  page.drawRectangle({ x: 0, y: pageHeight - 124, width: pageWidth, height: 6, color: GOLD });
  page.drawText("AL-NOOR ISLAMIC UNIVERSITY", { x: margin, y: pageHeight - 52, size: 15, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Digital Library & PDF Centre - sample server-generated document", {
    x: margin, y: pageHeight - 72, size: 8.4, font: body, color: rgb(0.9, 0.97, 0.92),
  });
  page.drawText("Canal Road, Lahore, Pakistan  |  info@alnoor.edu.pk", {
    x: margin, y: pageHeight - 86, size: 8.4, font: body, color: rgb(0.9, 0.97, 0.92),
  });

  y = pageHeight - 160;
  const titleLines = wrap(options.title, bold, 20, pageWidth - margin * 2);
  for (const line of titleLines) {
    page.drawText(line, { x: margin, y, size: 20, font: bold, color: GREEN });
    y -= 25;
  }
  if (options.subtitle) {
    for (const line of wrap(options.subtitle, italic, 10.5, pageWidth - margin * 2)) {
      page.drawText(line, { x: margin, y, size: 10.5, font: italic, color: GREY });
      y -= 15;
    }
  }
  if (options.meta) {
    page.drawText(safe(options.meta), { x: margin, y, size: 8.5, font: body, color: FRESH });
    y -= 20;
  }
  page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: LIGHT });
  y -= 24;

  const ensureSpace = (needed: number) => {
    if (y - needed < 90) {
      page = pdf.addPage([pageWidth, pageHeight]);
      page.drawRectangle({ x: 0, y: pageHeight - 60, width: pageWidth, height: 60, color: LIGHT });
      page.drawText(safe(options.title), { x: margin, y: pageHeight - 38, size: 10, font: bold, color: GREEN });
      y = pageHeight - 100;
    }
  };

  for (const section of options.sections) {
    if (section.heading) {
      ensureSpace(40);
      page.drawText(safe(section.heading), { x: margin, y, size: 12.5, font: bold, color: GREEN });
      y -= 18;
    }
    for (const line of section.lines ?? []) {
      const lines = wrap(line, body, 10, pageWidth - margin * 2);
      for (const text of lines) {
        ensureSpace(20);
        page.drawText(text, { x: margin, y, size: 10, font: body, color: INK, lineHeight: 14 });
        y -= 14;
      }
      y -= 4;
    }
    y -= 6;
  }

  if (options.qrUrl) {
    const dataUrl = await QRCode.toDataURL(options.qrUrl, { margin: 1, width: 200, color: { dark: "#00633A", light: "#FFFFFF" } });
    const png = await pdf.embedPng(dataUrl);
    ensureSpace(100);
    page.drawImage(png, { x: margin, y: y - 78, width: 70, height: 70 });
    page.drawText("Read this item online", { x: margin + 84, y: y - 26, size: 9, font: bold, color: GREEN });
    page.drawText(safe(options.qrUrl), { x: margin + 84, y: y - 40, size: 7.5, font: body, color: GREY });
    page.drawText("Scan the code for the live, bilingual version.", { x: margin + 84, y: y - 52, size: 7.5, font: body, color: GREY });
    y -= 92;
  }

  const pages = pdf.getPages();
  pages.forEach((p, index) => {
    p.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 46, color: LIGHT });
    p.drawText(options.footerNote ?? "Sample placeholder document - Al-Noor Islamic University Digital Library", {
      x: margin, y: 28, size: 7.4, font: body, color: GREEN,
    });
    p.drawText(`Page ${index + 1} of ${pages.length}`, { x: pageWidth - margin - 60, y: 28, size: 7.4, font: body, color: GREY });
  });

  return pdf.save();
}
