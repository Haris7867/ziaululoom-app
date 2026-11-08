import type { Metadata } from "next";
import { getProgrammes } from "@/lib/data";
import { AdmissionsView } from "./view";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admissions 2027",
  description:
    "Apply online to Al-Noor Islamic University: admission steps, key dates, required documents, fee structure, CNIC/B-Form uploads and frequently asked questions.",
  alternates: { canonical: "/admissions" },
  openGraph: { title: "Admissions 2027", images: ["/images/campus-hero.jpg"] },
};

const FAQS = [
  { q: "When do admissions open and close?", a: "Applications for academic year 2027 are open now. The deadline is 30 June 2027 (placeholder); late applications are considered only for programmes with places remaining." },
  { q: "Is there an entry test?", a: "BS Fiqh & Islamic Law, BS Arabic and the Islamic Finance diploma require a short entry test and interview. Alimiyyah and Hifz candidates attend an interview and recitation assessment." },
  { q: "Can I apply for a scholarship?", a: "Yes. Tick the Zakat scholarship request in your application. Awards cover up to 100% of tuition and may include meals and hostel, subject to eligibility review by the welfare office." },
  { q: "What documents do I need?", a: "CNIC or B-Form, Matric and Intermediate/Alimiyyah certificates, and two photographs. Attested copies are required at the interview. Overseas certificates need equivalence." },
  { q: "Is hostel accommodation guaranteed?", a: "Hostel places are prioritised for residential Alimiyyah and Hifz students and for students travelling from outside Lahore; a limited number of rooms are available for day scholars." },
  { q: "Can I defer my admission?", a: "Admission may be deferred for one year with the registrar's written approval, provided the admission fee is retained and seats are available." },
];

export default async function AdmissionsPage() {
  const programmes = await getProgrammes();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
      <AdmissionsView programmes={programmes} faqs={FAQS} />
    </>
  );
}
