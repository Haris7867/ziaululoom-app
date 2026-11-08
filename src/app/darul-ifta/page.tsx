import type { Metadata } from "next";
import Link from "next/link";
import { getFatawa } from "@/lib/data";
import { DarulIftaView } from "./view";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Darul Ifta — Fatawa",
  description:
    "Searchable Hanafi fatawa on Salah, Zakat, fasting, Hajj, Qurbani, marriage, business and inheritance. Every answer is approved by a qualified Mufti before publication.",
  alternates: { canonical: "/darul-ifta" },
  openGraph: { title: "Darul Ifta — Fatawa", images: ["/images/quran.jpg"] },
};

export default async function DarulIftaPage() {
  const fatawa = await getFatawa();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Darul Ifta — Al-Noor Islamic University",
          url: "/darul-ifta",
          description: "Hanafi fatawa researched and approved by qualified Muftis.",
        }}
      />
      <DarulIftaView fatawa={fatawa} />
      <div className="container-x pb-10">
        <Link href="/darul-ifta/ask" className="btn btn-green">Submit a question</Link>
      </div>
    </>
  );
}
