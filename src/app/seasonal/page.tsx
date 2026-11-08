import type { Metadata } from "next";
import Link from "next/link";
import { getFatawa, getPdfResources, getSeasonalBanners } from "@/lib/data";
import { ZakatCalculator } from "@/components/forms/StatusLookup";
import { PageHero, SectionHeading, Callout } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { IMAGES } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seasonal content — Ramadan, Eid, Muharram",
  description:
    "Ramadan sehri and iftar timings, a Zakat calculator, Fitrah giving, Eid greetings, Muharram notices and the Rabi ul Awwal Milad programme. Seasonal content is scheduled by the admin.",
  alternates: { canonical: "/seasonal" },
};

const TIMINGS = [
  { date: "1 Ramadan", sehri: "4:22 am", iftar: "6:14 pm" },
  { date: "5 Ramadan", sehri: "4:18 am", iftar: "6:18 pm" },
  { date: "10 Ramadan", sehri: "4:12 am", iftar: "6:22 pm" },
  { date: "15 Ramadan", sehri: "4:06 am", iftar: "6:26 pm" },
  { date: "20 Ramadan", sehri: "4:00 am", iftar: "6:29 pm" },
  { date: "29 Ramadan", sehri: "3:54 am", iftar: "6:33 pm" },
];

export default async function SeasonalPage() {
  const [{ active, all }, fatawa, pdfs] = await Promise.all([getSeasonalBanners(), getFatawa(), getPdfResources()]);
  const ramadan = all.find((banner) => banner.seasonKey === "ramadan");
  const eidFitr = all.find((banner) => banner.seasonKey === "eid_fitr");
  const muharram = all.find((banner) => banner.seasonKey === "muharram");
  const rabiAwwal = all.find((banner) => banner.seasonKey === "rabi_awwal");
  const eidAdha = all.find((banner) => banner.seasonKey === "eid_adha");
  const pinned = fatawa.filter((fatwa) => ["Zakat & Sadaqah", "Fasting"].includes(fatwa.category)).slice(0, 3);
  const durus = pdfs.filter((pdf) => pdf.category === "Durus-e-Quran").slice(0, 3);

  return (
    <>
      <PageHero
        image={IMAGES.quran}
        eyebrowEn="Seasonal"
        eyebrowUr="موسمی"
        titleEn="Seasonal resources"
        titleUr="موسمی وسائل"
        subtitleEn="Ramadan, both Eids, Muharram and Rabi ul Awwal content, scheduled from the admin panel. The homepage stays neutral by default."
        subtitleUr="رمضان، دونوں عیدیں، محرم اور ربیع الاول کا مواد، ایڈمن پینل سے مقرر۔ ہوم پیج عام طور پر غیر جانبدار رہتا ہے۔"
      >
        <Link href="/donate?purpose=zakat" className="btn btn-gold"><T k="seasonal.zakatCalc" /></Link>
        <Link href="/qurbani" className="btn btn-ghost-light"><T k="qurbani.title" /></Link>
      </PageHero>

      {active.length > 0 && (
        <section className="container-x -mt-5">
          {active.map((banner) => (
            <div key={banner.id} className={`rounded-lg border p-4 ${banner.tone === "solemn" ? "border-ink/25 bg-white" : "border-gold/40 bg-[#fdf8e8]"}`}>
              <p className="eyebrow">{banner.seasonKey}</p>
              <h2 className="mt-1 text-xl"><Bi en={banner.titleEn} ur={banner.titleUr} /></h2>
              <p className="text-sm text-ink/75"><Bi en={banner.bodyEn} ur={banner.bodyUr} /></p>
            </div>
          ))}
        </section>
      )}

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card p-5">
            <SectionHeading eyebrow="Ramadan" titleEn="Sehri & Iftar timings — Lahore" titleUr="سحری و افطار کے اوقات — لاہور" subtitleEn="Sample timings for the city. Confirm with the local mosque timetable." subtitleUr="شہر کے نمونہ اوقات۔ مقامی مسجد کے ٹائم ٹیبل سے تصدیق کریں۔" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Sehri and Iftar timings</caption>
                <thead className="bg-light text-xs uppercase tracking-wide text-deep">
                  <tr>
                    <th scope="col" className="p-2 text-start"><T k="common.date" /></th>
                    <th scope="col" className="p-2 text-start"><T k="seasonal.sehri" /></th>
                    <th scope="col" className="p-2 text-start"><T k="seasonal.iftar" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-deep/10">
                  {TIMINGS.map((row) => (
                    <tr key={row.date}>
                      <td className="p-2 text-xs font-semibold text-ink/70">{row.date}</td>
                      <td className="p-2" dir="ltr">{row.sehri}</td>
                      <td className="p-2" dir="ltr">{row.iftar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-ink/55">
              <Bi
                en="During Ramadan the homepage can be switched to the Ramadan campaign: pinned fatawa, a special Durus series, nightly taraweeh and iftar sponsorship. Aqeeqah/Eid greetings appear only when the admin schedules them."
                ur="رمضان میں ہوم پیج رمضان مہم پر منتقل کیا جا سکتا ہے: نمایاں فتاویٰ، خصوصی دروس سیریز، تراویح اور افطار کفالت۔ عید کی مبارکباد صرف ایڈمن کے مقرر کرنے پر ظاہر ہوتی ہے۔"
              />
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/donate?purpose=food&amount=5000" className="btn btn-primary !py-1.5 !text-xs"><T k="donate.oneTime" /> iftar</Link>
              <Link href="/library?category=Durus-e-Quran" className="btn btn-outline !py-1.5 !text-xs"><T k="library.title" /></Link>
              {ramadan && !ramadan.active && <span className="badge badge-grey">Ramadan banner hidden</span>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5" id="zakat">
              <h2 className="text-xl"><T k="seasonal.zakatCalc" /></h2>
              <ZakatCalculator />
              <Link href="/donate?purpose=zakat" className="btn btn-gold mt-2 w-full !py-1.5 !text-xs"><T k="nav.donate" /> — Zakat</Link>
            </div>
            <div className="card p-5">
              <h2 className="text-lg"><T k="fatwa.recent" /></h2>
              <ul className="mt-1.5 space-y-1.5 text-sm">
                {pinned.map((fatwa) => (
                  <li key={fatwa.id}>
                    <Link href={`/darul-ifta/${fatwa.slug}`} className="link-underline">
                      <Bi en={fatwa.questionEn} ur={fatwa.questionUr} />
                    </Link>
                    <span className="ms-1 text-[0.65rem] text-ink/45">{fatwa.fatwaNumber}</span>
                  </li>
                ))}
              </ul>
              <Link href="/darul-ifta/ask" className="btn btn-green mt-2 w-full !py-1.5 !text-xs">
                <Icon name="question" size={14} /> <T k="fatwa.submit" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light/60">
        <div className="container-x">
          <SectionHeading eyebrow="Seasonal library" titleEn="Pinned fatawa & Durus" titleUr="نمایاں فتاویٰ و دروس" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card p-4">
              <h3 className="text-base font-bold text-deep">Ramadan fatawa</h3>
              <ul className="mt-1 space-y-1.5 text-sm">
                {pinned.map((fatwa) => (
                  <li key={fatwa.id}><Link href={`/darul-ifta/${fatwa.slug}`} className="link-underline"><Bi en={fatwa.questionEn} ur={fatwa.questionUr} /></Link></li>
                ))}
              </ul>
            </div>
            <div className="card p-4">
              <h3 className="text-base font-bold text-deep">Durus-e-Quran series</h3>
              <ul className="mt-1 space-y-1.5 text-sm">
                {durus.map((pdf) => (
                  <li key={pdf.id}><Link href={`/library/${pdf.slug}`} className="link-underline"><Bi en={pdf.titleEn} ur={pdf.titleUr} /></Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-4">
            <h2 className="text-lg"><T k="seasonal.eidFitr" /></h2>
            <p className="mt-1 text-sm text-ink/75"><T k="seasonal.greetingsFitr" /></p>
            <Link href="/donate?purpose=sadaqah&amount=1000" className="btn btn-outline mt-2 w-full !py-1.5 !text-xs"><T k="seasonal.fitrah" /></Link>
            {eidFitr && <p className="mt-1 text-[0.65rem] text-ink/50">{eidFitr.active ? "Banner scheduled" : "Banner hidden (default)"}</p>}
          </div>
          <div className="card p-4">
            <h2 className="text-lg"><T k="seasonal.eidAdha" /></h2>
            <p className="mt-1 text-sm text-ink/75"><T k="seasonal.greetingsAdha" /></p>
            <Link href="/qurbani" className="btn btn-outline mt-2 w-full !py-1.5 !text-xs"><T k="qurbani.bookHissa" /></Link>
            {eidAdha && <p className="mt-1 text-[0.65rem] text-ink/50">{eidAdha.active ? "Banner scheduled" : "Banner hidden (default)"}</p>}
          </div>
          <div className="card p-4">
            <h2 className="text-lg"><T k="seasonal.muharram" /></h2>
            <p className="mt-1 text-sm text-ink/75"><T k="seasonal.muharramNote" /></p>
            <Link href="/events" className="btn btn-outline mt-2 w-full !py-1.5 !text-xs"><T k="nav.events" /></Link>
          </div>
          <div className="card p-4">
            <h2 className="text-lg"><T k="seasonal.rabiAwwal" /></h2>
            <p className="mt-1 text-sm text-ink/75"><Bi en="Milad-un-Nabi programme with a Seerah conference, Naat gathering and gallery." ur="میلاد النبی پروگرام: سیرت کانفرنس، نعت محفل اور گیلری۔" /></p>
            <Link href="/events/seerah-conference" className="btn btn-outline mt-2 w-full !py-1.5 !text-xs"><T k="seasonal.milad" /></Link>
            {rabiAwwal && <p className="mt-1 text-[0.65rem] text-ink/50">{rabiAwwal.active ? "Banner scheduled" : "Banner hidden (default)"}</p>}
          </div>
        </div>
        <div className="container-x mt-5">
          <Callout icon="calendar" title="Scheduling">
            <Bi
              en="Seasonal content is controlled from Admin → Content → Seasonal. Banners have start and end dates, and Muharram uses a solemn tone with notices only. Ramadan mode also shows the iftar sponsorship campaign and the Eid greetings after the month."
              ur="موسمی مواد ایڈمن → مواد → موسمی سے کنٹرول ہوتا ہے۔ بینرز کی تاریخ آغاز و اختتام ہے، اور محرم میں سنجیدہ انداز میں صرف اعلانات ہوتے ہیں۔ رمضان موڈ میں افطار کفالت مہم اور مہینے کے بعد عید کی مبارکباد بھی دکھائی جاتی ہے۔"
            />
          </Callout>
        </div>
      </section>
    </>
  );
}
