import { NextResponse } from "next/server";
import { buildContentPdf } from "@/lib/pdf";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const [kind, yearRaw] = [slug.startsWith("audited") ? "Audited financial statements" : "Annual report", slug.split("-").pop() ?? "2026"];
  const year = Number(yearRaw);
  const safeYear = Number.isFinite(year) && year > 2000 ? year : 2026;

  const bytes = await buildContentPdf({
    title: `${kind} ${safeYear}`,
    subtitle: "Sample placeholder report — Jamia Ghousia Zia-Ul-Uloom",
    meta: "Prepared for the Board of Governors · Figures are illustrative placeholders",
    sections: [
      {
        heading: "Statement of activities (summary)",
        lines: [
          "Income: donations and Zakat funds (restricted), programme fees, and welfare grants.",
          "Expenditure: teaching salaries, scholarships, hostel and mess, maintenance, and Qurbani distribution.",
          "Zakat funds are held in a separate bank account and used only for eligible recipients, as certified by the audit committee.",
        ],
      },
      {
        heading: "Programme highlights",
        lines: [
          "1,840 students enrolled across eight programmes; 62 graduates employed or in further study within six months.",
          "214 full scholarships funded by Zakat; free meals for 380 residential students.",
          "Digital library: over 6,000 downloads of khutbat, durus and fiqh resources.",
        ],
      },
      {
        heading: "Governance",
        lines: [
          "The Board of Governors met four times during the year. The audit committee reviewed the financial statements and internal controls.",
          "Public complaints and feedback are logged with the registrar; safeguarding and data-protection policies are reviewed annually.",
        ],
      },
      {
        heading: "Notes",
        lines: [
          "This document is generated on the server as a demonstration. The production institution would publish its signed, audited statements here as a PDF from private storage.",
        ],
      },
    ],
    footerNote: `${kind} ${safeYear} — sample placeholder`,
  });

  return new NextResponse(Buffer.from(bytes) as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
      "Cache-Control": "public, max-age=600",
    },
  });
}
