import type { Metadata } from "next";
import { getFaculty, getReports } from "@/lib/data";
import { AboutView } from "./view";
import { JsonLd } from "@/components/JsonLd";
import { UNIVERSITY } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About the University",
  description:
    "Founded in 1989 in Lahore: our vision, mission, values, history, founder, chancellor, board of governors, faculty directory, accreditations and audited reports.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Jamia Ghousia Zia-Ul-Uloom", images: ["/images/campus-hero.jpg"] },
};

export default async function AboutPage() {
  const [faculty, reports] = await Promise.all([getFaculty(), getReports()]);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: UNIVERSITY.nameEn,
          foundingDate: "1989",
          url: "/about",
          address: { "@type": "PostalAddress", streetAddress: "Canal Road", addressLocality: "Lahore", addressCountry: "PK" },
          contactPoint: { "@type": "ContactPoint", telephone: UNIVERSITY.phone, contactType: "admissions" },
        }}
      />
      <AboutView faculty={faculty} reports={reports} />
    </>
  );
}
