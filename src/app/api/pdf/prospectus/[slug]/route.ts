import { NextResponse } from "next/server";
import { getProgrammes } from "@/lib/data";
import { buildContentPdf } from "@/lib/pdf";
import { UNIVERSITY } from "@/lib/site";
import { formatPkr } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const programmes = await getProgrammes();
  const isForm = slug.includes("form");
  const bytes = await buildContentPdf({
    title: isForm ? "Admission Application Form 2027" : "Prospectus 2027",
    subtitle: isForm
      ? "Printable application form — please complete in block letters."
      : `${UNIVERSITY.nameEn} — ${UNIVERSITY.addressEn}`,
    meta: `${UNIVERSITY.phone} · ${UNIVERSITY.admissionsEmail} · ${UNIVERSITY.hoursEn}`,
    sections: isForm
      ? [
          { heading: "1. Personal details", lines: ["Full name: ______________________________________", "Father / husband name: ___________________________", "CNIC / B-Form: __________________  Date of birth: ____________", "Phone / WhatsApp: __________________  Email: ____________________"] },
          { heading: "2. Programme applied for", lines: programmes.map((p) => `[ ] ${p.titleEn} (${p.level}, ${p.durationYears} years)`) },
          { heading: "3. Documents attached", lines: ["[ ] CNIC or B-Form copy", "[ ] Matric certificate", "[ ] Intermediate / Alimiyyah certificate", "[ ] Two passport-size photographs", "[ ] Zakat scholarship application (if applicable)"] },
          { heading: "Declaration", lines: ["I confirm the information provided is accurate and I accept the university's academic regulations, code of conduct and refund policy.", "Signature: ____________________________   Date: ________________"] },
        ]
      : [
          { heading: "About the university", lines: ["Founded in 1989 on Canal Road, Lahore, Al-Noor Islamic University teaches the classical Islamic sciences alongside recognised degree programmes. All content on this page is sample placeholder content."] },
          { heading: "Programmes and indicative fees", lines: programmes.map((p) => `${p.titleEn} — ${p.level}, ${p.durationYears} years, ${p.mode}. Indicative fee: ${p.feePerYear > 0 ? formatPkr(p.feePerYear) + " per year" : "sponsored, no tuition fee"}.`) },
          { heading: "Admissions", lines: ["Applications are submitted online with a CNIC or B-Form and academic certificates. Shortlisted candidates attend an interview and, where required, an entry test. Zakat-funded scholarships cover up to 100% of fees for eligible students."] },
          { heading: "Campus life", lines: ["Residential hostel with mess, library and reading rooms, transport on four Lahore routes, sports ground, and a student welfare office offering counselling and financial support."] },
          { heading: "Contact", lines: [`Admissions office: ${UNIVERSITY.admissionsEmail}`, `Phone: ${UNIVERSITY.phone}`, `Address: ${UNIVERSITY.addressEn}`, "Office hours: Monday to Friday, 8:30 am to 4:30 pm."] },
        ],
    footerNote: isForm
      ? "Admission form 2027 — sample placeholder"
      : "Prospectus 2027 — sample placeholder content, Al-Noor Islamic University",
  });

  return new NextResponse(Buffer.from(bytes) as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
      "Cache-Control": "public, max-age=600",
    },
  });
}
