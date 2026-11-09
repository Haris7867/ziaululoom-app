import type { Metadata } from "next";
import { getCalendar, getExamSchedule, getProgrammes } from "@/lib/data";
import { AcademicsView } from "./view";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academics & Programmes",
  description:
    "Eight Islamic higher-education programmes in Lahore: BS Islamic Studies, Quran & Tafseer, Hadith & Seerah, Fiqh & Shariah, Alimiyyah, Hifz & Tajweed, Arabic and Islamic Finance.",
  alternates: { canonical: "/academics" },
  openGraph: { title: "Academics & Programmes", images: ["/images/classroom.jpg"] },
};

export default async function AcademicsPage() {
  const [programmes, calendar, exams] = await Promise.all([getProgrammes(), getCalendar(), getExamSchedule()]);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Programmes at Jamia Ghousia Zia-Ul-Uloom",
          itemListElement: programmes.map((programme, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Course",
              name: programme.titleEn,
              description: programme.summaryEn,
              provider: { "@type": "Organization", name: "Jamia Ghousia Zia-Ul-Uloom" },
            },
          })),
        }}
      />
      <AcademicsView programmes={programmes} calendar={calendar} exams={exams} />
    </>
  );
}
