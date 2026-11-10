import { TESTIMONIALS } from "@/lib/testimonials";
import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import {
  getAnnouncements, getArticles, getEvents, getFatawa, getGallery, getPdfResources,
  getProgrammes, getSeasonalBanners, getTestimonials,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jamia Ghousia Zia-Ul-Uloom — Islamic higher education in Pakistan",
  description:
    "Bilingual Islamic university in Rawalpindi: Alimiyyah, Quran, Hadith, Fiqh and Arabic programmes, Darul Ifta fatawa, a digital library, Qurbani 2027 and student welfare.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [announcements, events, programmes, photos, pdfs, fatawa, _dbTestimonials, articles, seasonal] = await Promise.all([
    getAnnouncements(),
    getEvents(),
    getProgrammes(),
    getGallery(),
    getPdfResources(),
    getFatawa(),
    getTestimonials(),
    getArticles(),
    getSeasonalBanners(),
  ]);
  const testimonials = TESTIMONIALS.map((item, i) => ({ id: i + 1, ...item }));

  return (
    <HomeView
      announcements={announcements}
      events={events}
      programmes={programmes}
      photos={photos}
      pdfs={pdfs}
      fatawa={fatawa}
      testimonials={testimonials}
      articles={articles}
      seasonal={seasonal.active}
    />
  );
}
