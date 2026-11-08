import type { Metadata } from "next";
import { getPdfResources } from "@/lib/data";
import { LibraryView } from "./view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Digital Library & PDF Centre",
  description:
    "Khutbat, Durus-e-Quran, Durus-e-Hadith, Fiqh Masail, books, Seerah, Naat and Bayans. Read online in the browser or download the PDF, filtered by year, speaker and language.",
  alternates: { canonical: "/library" },
  openGraph: { title: "Digital Library & PDF Centre", images: ["/images/library.jpg"] },
};

export default async function LibraryPage() {
  const resources = await getPdfResources();
  return <LibraryView resources={resources} />;
}
