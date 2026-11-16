import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramme, getProgrammes } from "@/lib/data";
import { ProgrammeDetail } from "./view";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getProgramme(slug);
  if (!programme) return { title: "Programme not found" };
  return {
    title: programme.titleEn,
    description: programme.summaryEn.slice(0, 158),
    alternates: { canonical: `/academics/${programme.slug}` },
    openGraph: { title: programme.titleEn, description: programme.summaryEn.slice(0, 158), images: ["/images/classroom.jpg"] },
  };
}

export default async function ProgrammePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [programme, all] = await Promise.all([getProgramme(slug), getProgrammes()]);
  if (!programme) notFound();
  const related = all.filter((p) => p.slug !== programme.slug).slice(0, 3);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: programme.titleEn,
          description: programme.summaryEn,
          provider: { "@type": "Organization", name: "Jamia Ghousia Zia-Ul-Uloom", sameAs: "/" },
          timeRequired: `P${Number(programme.durationYears) * 12}M`,
          educationalCredentialAwarded: programme.level,
          offers: { "@type": "Offer", price: programme.feePerYear, priceCurrency: "PKR", category: "Tuition" },
        }}
      />
      <ProgrammeDetail programme={programme} related={related} />
    </>
  );
}
