"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HeroSlider } from "./HeroSlider";
import { Icon, type IconName } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";
import { AnimatedDivider } from "@/components/Decor";
import { Countdown, SectionHeading, StatBlock, Tabs } from "@/components/ui";
import {
  AnnouncementTicker, ArticleCard, EventCard, FatwaCard, GalleryGrid, PdfCard,
  ProgrammeCard, TestimonialCarousel,
} from "@/components/cards";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { DonationForm } from "@/components/forms/DonationForm";
import { QUICK_TILES, SHOW_DONATIONS, STATS, UNIVERSITY, WHY_US, DONATION_PRESETS, DONATION_PURPOSES, IMAGES } from "@/lib/site";
import { eventPhase, formatDate, formatPkr, whatsappLink } from "@/lib/format";

type Announcement = { id: number; titleEn: string; titleUr: string; date: Date | string };
type EventRow = {
  id: number; slug: string; titleEn: string; titleUr: string; descriptionEn: string; descriptionUr: string;
  startAt: Date | string; endAt: Date | string; venueEn: string; venueUr: string; type: string;
  coverImage: string | null; liveStreamUrl: string | null;
};
type ProgrammeRow = {
  id: number; slug: string; titleEn: string; titleUr: string; level: string; durationYears: string;
  mode: string; summaryEn: string; summaryUr: string; feePerYear: number;
};
type PhotoRow = { id: number; url: string; captionEn: string; captionUr: string; year: number };
type PdfRow = {
  id: number; slug: string; titleEn: string; titleUr: string; category: string; speaker: string | null;
  resourceDate: Date | string; summaryEn: string; summaryUr: string; pages: number; fileSizeKb: number;
  language: string; downloads: number;
};
type FatwaRow = {
  id: number; slug: string; fatwaNumber: string; category: string; questionEn: string; questionUr: string;
  answerEn: string; answerUr: string; approvedBy: string; publishedAt: Date | string;
};
type TestimonialRow = { id: number; name: string; roleEn: string; roleUr: string; quoteEn: string; quoteUr: string };
type ArticleRow = {
  id: number; slug: string; titleEn: string; titleUr: string; excerptEn: string; excerptUr: string;
  image: string | null; category: string; publishedAt: Date | string;
};
type SeasonalRow = {
  id: number; seasonKey: string; titleEn: string; titleUr: string; bodyEn: string; bodyUr: string;
  ctaLabelEn: string | null; ctaLabelUr: string | null; ctaHref: string | null; tone: string;
};

export function HomeView({
  announcements, events, programmes, photos, pdfs, fatawa, testimonials, articles, seasonal,
}: {
  announcements: Announcement[];
  events: EventRow[];
  programmes: ProgrammeRow[];
  photos: PhotoRow[];
  pdfs: PdfRow[];
  fatawa: FatwaRow[];
  testimonials: TestimonialRow[];
  articles: ArticleRow[];
  seasonal: SeasonalRow[];
}) {
  const { t, pick } = useI18n();
  const [tab, setTab] = useState<"upcoming" | "ongoing" | "past">("upcoming");
  const [donateAmount, setDonateAmount] = useState(DONATION_PRESETS[1]);
  const [donatePurpose, setDonatePurpose] = useState("general");

  const grouped = useMemo(() => {
    const map = { upcoming: [] as EventRow[], ongoing: [] as EventRow[], past: [] as EventRow[] };
    for (const event of events) map[eventPhase(event.startAt, event.endAt)].push(event);
    map.past.reverse();
    return map;
  }, [events]);

  const nextEvent = grouped.upcoming[0] ?? grouped.ongoing[0];
  const pdfStrip = useMemo(() => {
    const wanted = ["Khutbat", "Durus-e-Quran", "Durus-e-Hadith", "Fiqh Masail"];
    return wanted
      .map((category) => pdfs.find((p) => p.category === category))
      .filter((p): p is PdfRow => Boolean(p));
  }, [pdfs]);

  return (
    <>
      <HeroSlider />

      {/* 2. Quick action tiles */}
      <section className="section !pb-6">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_TILES.map((tile) => (
              <Link key={tile.href + tile.titleKey} href={tile.href} className="card group flex flex-col items-start p-3.5 !border-t-2 hover:!border-t-fresh">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-light text-deep transition group-hover:bg-deep group-hover:text-white">
                  <Icon name={tile.icon as IconName} size={18} />
                </span>
                <span className="mt-2 text-sm font-bold leading-snug text-deep">{t(tile.titleKey)}</span>
                <span className="text-[0.7rem] text-ink/60">{pick(tile.textEn, tile.textUr)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Rector's welcome */}
      <section className="section !pt-6">
        <div className="container-x grid items-center gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative">
            <img src={IMAGES.classroom} alt={pick("A class in session at Jamia Ghousia Zia-Ul-Uloom", "جامعہ غوثیہ ضیاء العلوم میں سبق جاری")} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg" />
            <div className="absolute -bottom-5 end-3 max-w-[15rem] rounded-lg border border-deep/10 border-t-4 border-t-fresh bg-white p-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-deep font-display text-lg font-bold text-white">IS</span>
                <div>
                  <p className="text-sm font-bold text-deep">{pick("Dr. Imran Siddiqui", "ڈاکٹر عمران صدیقی")}</p>
                  <p className="text-[0.68rem] text-ink/60">{t("home.rectorRole")}</p>
                </div>
              </div>
              <p className="mt-1.5 text-[0.62rem] text-ink/50">{t("about.photoPending")}</p>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow={t("home.rector")}
              titleEn="A place where knowledge becomes character"
              titleUr="ایسی جگہ جہاں علم کردار بنتا ہے"
            />
            <p className="text-ink/80">
              {pick(
                "Since 1989 our teachers have carried a simple conviction: scholarship without character is incomplete, and worship without knowledge is uncertain. Here, students memorise the Quran, argue respectfully over fiqh, study Arabic poetry, and serve the community in the same week.",
                "1989 سے ہمارے اساتذہ ایک سادہ یقین رکھتے ہیں: کردار کے بغیر علم ادھورا ہے اور علم کے بغیر عبادت غیر یقینی۔ یہاں طلبہ قرآن حفظ کرتے ہیں، فقہ پر ادب سے بحث کرتے ہیں، عربی ادب پڑھتے ہیں اور اسی ہفتے معاشرے کی خدمت بھی کرتے ہیں۔",
              )}
            </p>
            <p className="mt-3 text-ink/80">
              {pick(
                "Whether you join as a Hifz student, an Alimiyyah candidate, or a working professional in our evening Islamic Finance diploma, you will be known by name and supported by scholarship if you need it.",
                "آپ حفظ کے طالب علم، عالمیت کے امیدوار یا شام کے اسلامی مالیات ڈپلومہ کے پیشہ ور ہوں — آپ کو نام سے پہچانا جائے گا اور ضرورت ہو تو وظیفے سے معاونت ملے گی۔",
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/about#leadership" className="btn btn-primary">{t("common.readMore")} <Icon name="arrow" size={16} /></Link>
              <Link href="/about" className="btn btn-outline">{t("nav.about")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Announcements ticker */}
      <AnnouncementTicker items={announcements} />

      {/* 5. Events */}
      <section className="section">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow={t("home.events")}
              titleEn="Gatherings, lectures and convocations"
              titleUr="اجتماعات، لیکچرز اور کانووکیشن"
              subtitleEn="Register for upcoming programmes or revisit the galleries of past events."
              subtitleUr="آنے والے پروگراموں میں رجسٹر ہوں یا گزشتہ تقریبات کی گیلریاں دیکھیں۔"
            />
            <div className="flex flex-wrap items-end gap-3">
              {nextEvent && (
                <div className="rounded-lg bg-deep px-4 py-3">
                  <Countdown target={String(nextEvent.startAt)} label={t("home.nextEvent")} />
                </div>
              )}
              <Link href="/gallery" className="btn btn-outline">{t("home.galleryLink")} <Icon name="arrow" size={14} /></Link>
            </div>
          </div>
          <Tabs
            ariaLabel={t("home.events")}
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "upcoming", label: t("home.upcoming"), count: grouped.upcoming.length },
              { value: "ongoing", label: t("home.ongoing"), count: grouped.ongoing.length },
              { value: "past", label: t("home.past"), count: grouped.past.length },
            ]}
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {grouped[tab].slice(0, 3).map((event) => (
              <EventCard key={event.id} {...event} phase={tab} />
            ))}
          </div>
          {grouped[tab].length === 0 && (
            <p className="mt-4 rounded-lg border border-dashed border-deep/20 p-6 text-center text-sm text-ink/60">{t("common.notFound")}</p>
          )}
        </div>
      </section>

      <AnimatedDivider />

      {/* 6. Programmes */}
      <section className="section bg-light/60">
        <div className="container-x">
          <SectionHeading
            eyebrow={t("home.programmes")}
            titleEn="Study with scholarship and purpose"
            titleUr="علم اور مقصد کے ساتھ تعلیم"
            subtitleEn="Eight programmes across Islamic sciences and contemporary disciplines."
            subtitleUr="اسلامی علوم اور عصری مضامین کے آٹھ پروگرام۔"
            action={<Link href="/academics" className="btn btn-primary">{t("home.explore")} <Icon name="arrow" size={16} /></Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.slice(0, 6).map((programme) => (
              <ProgrammeCard key={programme.id} {...programme} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why choose us + stats */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow={t("home.why")}
            titleEn="An education you can build a life on"
            titleUr="ایسی تعلیم جس پر زندگی بنائی جا سکے"
            align="center"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item) => (
              <div key={item.titleEn} className="card p-5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-light text-deep">
                  <Icon name={item.icon as IconName} size={22} />
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug">{pick(item.titleEn, item.titleUr)}</h3>
                <p className="mt-1.5 text-sm text-ink/75">{pick(item.textEn, item.textUr)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map((stat) => (
              <StatBlock key={stat.key} value={stat.value} suffix={stat.suffix} label={t(stat.key)} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Latest event photos */}
      <section className="section bg-light/50">
        <div className="container-x">
          <SectionHeading
            eyebrow={t("home.photos")}
            titleEn="Recent moments on campus"
            titleUr="کیمپس کے حالیہ لمحات"
            action={<Link href="/gallery" className="btn btn-outline">{t("home.galleryLink")}</Link>}
          />
          <GalleryGrid photos={photos.slice(0, 9)} />
        </div>
      </section>

      {/* 9. Seasonal banner (neutral by default) */}
      {seasonal.length > 0 && (
        <section className="section !py-8">
          <div className="container-x">
            {seasonal.slice(0, 1).map((banner) => (
              <div
                key={banner.id}
                className={`flex flex-col gap-3 rounded-lg border p-5 md:flex-row md:items-center md:justify-between ${
                  banner.tone === "solemn" ? "border-ink/20 bg-white" : "border-gold/40 bg-[#fdf8e8]"
                }`}
              >
                <div>
                  <p className="eyebrow">{t(`seasonal.${banner.seasonKey}`)}</p>
                  <h2 className="mt-1 text-2xl">{pick(banner.titleEn, banner.titleUr)}</h2>
                  <p className="mt-1 text-sm text-ink/75">{pick(banner.bodyEn, banner.bodyUr)}</p>
                </div>
                {banner.ctaHref && (
                  <Link href={banner.ctaHref} className="btn btn-gold shrink-0">
                    {pick(banner.ctaLabelEn ?? "Learn more", banner.ctaLabelUr ?? "مزید جانیں")}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. Darul Ifta highlight */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow={t("home.ifta")}
            titleEn="Recent approved answers"
            titleUr="حالیہ منظور شدہ جوابات"
            subtitleEn="Every answer is researched and approved by a qualified Mufti before publication."
            subtitleUr="ہر جواب اشاعت سے پہلے مستند مفتی کی تحقیق و منظوری سے گزرتا ہے۔"
            action={<Link href="/darul-ifta/ask" className="btn btn-primary">{t("home.askQuestion")}</Link>}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fatawa.slice(0, 3).map((fatwa) => (
              <FatwaCard key={fatwa.id} {...fatwa} />
            ))}
          </div>
        </div>
      </section>

      {/* 11. PDF strip */}
      <section className="section bg-light/60">
        <div className="container-x">
          <SectionHeading
            eyebrow={t("home.pdf")}
            titleEn="Khutbat, Durus and Fiqh resources"
            titleUr="خطبات، دروس اور فقہی مواد"
            action={<Link href="/library" className="btn btn-outline">{t("nav.library")} <Icon name="arrow" size={14} /></Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pdfStrip.map((pdf) => (
              <PdfCard key={pdf.id} {...pdf} />
            ))}
          </div>
        </div>
      </section>

      {SHOW_DONATIONS && (
      <section className="bg-deep py-10 text-white md:py-14">
        <div className="container-x grid gap-7 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow !text-gold">{t("nav.donate")}</p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t("home.donate")}</h2>
            <p className="mt-2 max-w-xl text-white/85">{t("home.donateText")}</p>
            <div className="mt-4 flex items-center gap-2 rounded-md bg-white/10 p-3 text-sm">
              <Icon name="users" size={20} className="shrink-0 text-gold" />
              <p>{t("donate.perStudentNote")}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/80">
              <span className="rounded border border-white/25 px-2 py-1">{pick("Zakat kept separate", "زکوٰۃ الگ رکھی جاتی ہے")}</span>
              <span className="rounded border border-white/25 px-2 py-1">{pick("Email receipt", "ای میل رسید")}</span>
              <span className="rounded border border-white/25 px-2 py-1">{pick("Monthly or one-time", "ماہانہ یا ایک بار")}</span>
            </div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white p-4 text-ink">
            <div className="flex flex-wrap gap-2">
              {DONATION_PRESETS.slice(0, 3).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDonateAmount(preset)}
                  aria-pressed={donateAmount === preset}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold ${donateAmount === preset ? "border-deep bg-deep text-white" : "border-deep/20 text-deep"}`}
                >
                  {formatPkr(preset)}
                </button>
              ))}
            </div>
            <label className="label mt-3" htmlFor="home-donate-purpose">{t("donate.purpose")}</label>
            <select id="home-donate-purpose" value={donatePurpose} onChange={(e) => setDonatePurpose(e.target.value)} className="select">
              {DONATION_PURPOSES.map((purpose) => (
                <option key={purpose.key} value={purpose.key}>{pick(purpose.en, purpose.ur)}</option>
              ))}
            </select>
            <Link href={`/donate?amount=${donateAmount}&purpose=${donatePurpose}`} className="btn btn-gold mt-3 w-full !py-2.5">
              {t("home.donateNow")} · {formatPkr(donateAmount)}
            </Link>
            <p className="mt-2 text-center text-[0.7rem] text-ink/55">
              <Icon name="lock" size={12} className="me-1 inline" /> Stripe · JazzCash · Easypaisa · UPaisa · Bank transfer
            </p>
          </div>
        </div>
      </section>
      )}

      {/* 13. Testimonials */}
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow={t("home.testimonials")} titleEn="Voices from our community" titleUr="ہماری برادری کی آوازیں" align="center" />
          <TestimonialCarousel items={testimonials} />
        </div>
      </section>

      {/* 14. Latest articles */}
      <section className="section bg-light/50">
        <div className="container-x">
          <SectionHeading
            eyebrow={t("home.articles")}
            titleEn="From the university desk"
            titleUr="یونیورسٹی ڈیسک سے"
            action={<Link href="/articles" className="btn btn-outline">{t("common.viewAll")}</Link>}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </section>

      {/* 15. Contact strip */}
      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t("home.contact")} titleEn="Speak with the admissions office" titleUr="داخلہ دفتر سے بات کریں" subtitleEn={t("home.contactText")} subtitleUr={t("home.contactText")} />
            <div className="overflow-hidden rounded-lg border border-deep/15 shadow-sm">
              <iframe title={t("home.mapTitle")} src={UNIVERSITY.mapEmbed} className="h-56 w-full" loading="lazy" />
            </div>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <a href={`tel:${UNIVERSITY.phoneHref}`} className="card flex items-center gap-2 p-3 !border-t-2"><Icon name="phone" size={18} className="text-deep" /> <span dir="ltr">{UNIVERSITY.phone}</span></a>
              <a href={whatsappLink(UNIVERSITY.whatsapp, "Assalamu alaikum")} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-2 p-3 !border-t-2"><Icon name="whatsapp" size={18} className="text-deep" /> {t("contact.whatsappChat")}</a>
              <div className="card flex items-center gap-2 p-3 !border-t-2"><Icon name="mail" size={18} className="text-deep" /> {UNIVERSITY.email}</div>
              <div className="card flex items-center gap-2 p-3 !border-t-2"><Icon name="clock" size={18} className="text-deep" /> {t("top.hours")}</div>
            </div>
            <p className="mt-2 text-xs text-ink/55">{pick("Campus visits: main gate, High Court Road, Rawalpindi. Photo ID required at reception.", "کیمپس وزٹ: مین گیٹ، ہائی کورٹ روڈ، راولپنڈی۔ ریسیپشن پر شناختی کارڈ ضروری ہے۔")} {formatDate(new Date())}</p>
          </div>
          <div className="card p-5">
            <h3 className="text-xl font-bold">{t("contact.enquiry")}</h3>
            <p className="mb-3 text-sm text-ink/65">{t("contact.maxFive")}</p>
            <EnquiryForm programmeOptions={programmes.map((p) => ({ slug: p.slug, titleEn: p.titleEn, titleUr: p.titleUr }))} compact />
          </div>
        </div>
      </section>
    </>
  );
}
