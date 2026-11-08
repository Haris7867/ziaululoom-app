import type { Metadata } from "next";
import Link from "next/link";
import { getActiveSeason, getCowBoard, getGallery, getQurbaniFaqs, getQurbaniStats } from "@/lib/data";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { Accordion, Callout, Countdown, SectionHeading } from "@/components/ui";
import { GalleryGrid } from "@/components/cards";
import { AnimatedDivider } from "@/components/Decor";
import { formatPkr, formatDate } from "@/lib/format";
import { IMAGES } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Qurbani 2027 — book a hissa",
  description:
    "Scholar-supervised Qurbani 2027: book 1–7 hissas of a vet-checked cow, pay by card, JazzCash, Easypaisa, UPaisa or bank transfer, and receive an instant PDF receipt with QR status tracking.",
  alternates: { canonical: "/qurbani" },
  openGraph: { title: "Qurbani 2027 — book a hissa", images: [IMAGES.cow2] },
};

const SLOT_STYLES: Record<string, string> = {
  Available: "bg-light border-fresh/40 text-deep",
  Reserved: "bg-[#fdf5e1] border-gold/50 text-[#6d5108]",
  Paid: "bg-deep border-deep text-white",
  Slaughtered: "bg-[#f1f2f1] border-[#c9cfcb] text-[#4a5350]",
  Packed: "bg-[#f1f2f1] border-[#c9cfcb] text-[#4a5350]",
  Dispatched: "bg-[#f1f2f1] border-[#c9cfcb] text-[#4a5350]",
};

export default async function QurbaniPage() {
  const season = await getActiveSeason();
  if (!season) {
    return (
      <section className="section container-x">
        <h1 className="text-3xl">Qurbani</h1>
        <p className="mt-2 text-ink/70">The Qurbani season is currently closed. Please check back soon.</p>
        <Link href="/contact" className="btn btn-primary mt-4"><T k="nav.contact" /></Link>
      </section>
    );
  }
  const [board, faqs, photos, stats] = await Promise.all([
    getCowBoard(season.id),
    getQurbaniFaqs(),
    getGallery(),
    getQurbaniStats(season.id),
  ]);
  const totalShares = board.length * 7 || 1;
  const bookedShares = board.reduce((sum, cow) => sum + cow.shares.filter((s) => s.status !== "Available").length, 0);
  const paidShares = board.reduce((sum, cow) => sum + cow.shares.filter((s) => s.status === "Paid").length, 0);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-deep text-white">
        <img src={IMAGES.cow2} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/85 to-deep/50" />
        <div className="container-x relative py-12 md:py-16">
          <p className="eyebrow !text-gold">Qurbani 2027 · {formatPkr(season.sharePrice)} / hissa</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold text-white sm:text-5xl"><T k="qurbani.title" /></h1>
          <p className="mt-3 max-w-2xl text-white/85"><T k="qurbani.subtitle" /></p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href="/qurbani/book" className="btn btn-gold"><Icon name="cow" size={16} /> <T k="qurbani.bookHissa" /></Link>
            <Link href="/qurbani/status" className="btn btn-green"><T k="qurbani.checkBooking" /></Link>
            <Link href="/qurbani/faq" className="btn btn-ghost-light"><T k="qurbani.rules" /></Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-lg bg-white/10 p-3">
              <Countdown target={new Date(season.bookingDeadline).toISOString()} label="qurbani.deadlineCountdown" />
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <Countdown target={new Date(season.eidDate).toISOString()} label="qurbani.eidCountdown" />
            </div>
          </div>
          <p className="mt-3 text-xs text-white/65">
            Booking deadline {formatDate(season.bookingDeadline)} · Slaughter {formatDate(season.slaughterStart)}–{formatDate(season.slaughterEnd)} · {season.slaughterLocation}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Options" titleEn="Choose your Qurbani" titleUr="اپنی قربانی منتخب کریں" subtitleEn="Every option is supervised by the Darul Ifta and includes a printable receipt." subtitleUr="ہر آپشن دارالافتاء کی نگرانی میں ہے اور قابلِ پرنٹ رسید شامل ہے۔" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { en: "Single hissa", ur: "ایک حصہ", price: season.sharePrice, descEn: "One share in a seven-share cow. Names of other buyers are never shown.", descUr: "سات حصوں والی گائے میں ایک حصہ۔ دیگر خریداروں کے نام نہیں دکھائے جاتے۔", icon: "cow" },
              { en: "Whole cow (7 hissas)", ur: "پوری گائے (7 حصے)", price: season.cowPrice, descEn: "One receipt listing all seven hissas, or separate receipts on request.", descUr: "ایک رسید میں سات حصے، یا درخواست پر الگ رسیدیں۔", icon: "cow" },
              { en: "Aqeeqah", ur: "عقیقہ", price: season.aqeeqahPrice, descEn: "Shared with the naming ceremony intention; meat distributed per your instruction.", descUr: "نام رکھنے کی نیت کے ساتھ؛ گوشت آپ کی ہدایت کے مطابق تقسیم۔", icon: "star" },
              { en: "Sadaqah Qurbani", ur: "صدقہ قربانی", price: season.sharePrice, descEn: "The full share goes to families screened by our welfare office.", descUr: "پورا حصہ ہمارے فلاح دفتر سے جانچے گئے خاندانوں کو جاتا ہے۔", icon: "heart" },
            ].map((option) => (
              <div key={option.en} className="card flex h-full flex-col p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name={option.icon as "cow"} size={20} /></span>
                <h3 className="mt-2 text-lg"><Bi en={option.en} ur={option.ur} /></h3>
                <p className="mt-1 flex-1 text-sm text-ink/75"><Bi en={option.descEn} ur={option.descUr} /></p>
                <p className="mt-2 font-display text-xl font-bold text-deep" dir="ltr">{formatPkr(option.price)}</p>
                <Link href={`/qurbani/book?type=${encodeURIComponent(option.en)}`} className="btn btn-outline mt-2 !py-1.5 !text-xs"><T k="qurbani.bookHissa" /></Link>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { en: "Cattle (cow / buffalo)", ur: "گائے / بھینس", ages: "Min. 2 years", weight: "430–530 kg", price: season.cowPrice },
              { en: "Goat", ur: "بکری", ages: "Min. 1 year", weight: "35–50 kg", price: Math.round(season.sharePrice * 0.75) },
              { en: "Sheep", ur: "بھیڑ", ages: "Min. 1 year", weight: "40–55 kg", price: Math.round(season.sharePrice * 0.8) },
            ].map((animal) => (
              <div key={animal.en} className="rounded-lg border border-deep/15 bg-white p-4">
                <h3 className="text-base font-bold text-deep"><Bi en={animal.en} ur={animal.ur} /></h3>
                <dl className="mt-1.5 text-xs text-ink/70">
                  <div className="flex justify-between"><dt><T k="qurbani.minAge" /></dt><dd className="font-semibold">{animal.ages}</dd></div>
                  <div className="flex justify-between"><dt><T k="qurbani.weight" /></dt><dd className="font-semibold">{animal.weight}</dd></div>
                  <div className="flex justify-between"><dt><T k="qurbani.price" /></dt><dd className="font-semibold" dir="ltr">{formatPkr(animal.price)}</dd></div>
                </dl>
                <p className="mt-1 text-[0.68rem] text-ink/50">Vet status: Fit for Qurbani (sample)</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider />

      <section className="section bg-light/50" id="board">
        <div className="container-x">
          <SectionHeading eyebrow="Live board" titleEn="Live cow board" titleUr="لائیو گائے بورڈ" subtitleEn="Booked and paid hissas only — no buyer names are ever shown publicly." subtitleUr="صرف بک اور ادا شدہ حصص — خریداروں کے نام عوامی طور پر نہیں دکھائے جاتے۔" />
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
            {[
              ["Available", "qurbani.available"],
              ["Reserved", "qurbani.reserved"],
              ["Paid", "qurbani.paid"],
              ["Slaughtered", "qurbani.slaughtered"],
            ].map(([status, label]) => (
              <span key={status} className="inline-flex items-center gap-1.5">
                <span className={`inline-block h-3 w-3 rounded-sm border ${SLOT_STYLES[status]}`} /> <T k={label} />
              </span>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((cow) => {
              const paid = cow.shares.filter((s) => s.status === "Paid").length;
              const booked = cow.shares.filter((s) => s.status !== "Available").length;
              return (
                <article key={cow.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-deep">Cow {cow.cowNumber}</h3>
                      <p className="text-xs text-ink/60">{cow.breed} · {cow.weightKg} kg · {Math.floor(cow.ageMonths / 12)} yr {cow.ageMonths % 12} mo</p>
                    </div>
                    <span className={`badge !text-[0.62rem] ${cow.vetStatus === "Fit for Qurbani" ? "" : "badge-grey"}`}>{cow.vetStatus}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((slot) => {
                      const share = cow.shares.find((s) => s.shareNumber === slot);
                      const status = share?.status ?? "Available";
                      const label = status === "Paid" ? "paid" : status === "Reserved" ? "booked" : status === "Available" ? "available" : "slaughtered";
                      return (
                        <span
                          key={slot}
                          title={`Hissa ${slot}: ${status}`}
                          className={`flex h-8 items-center justify-center rounded border text-[0.62rem] font-bold ${SLOT_STYLES[status] ?? SLOT_STYLES.Available}`}
                        >
                          {label === "available" ? slot : label === "paid" ? "✓" : label === "booked" ? "•" : "–"}
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-light">
                    <div className="h-full rounded-full bg-fresh" style={{ width: `${(booked / 7) * 100}%` }} />
                  </div>
                  <p className="mt-1 flex justify-between text-[0.68rem] text-ink/60">
                    <span>{paid}/7 <T k="qurbani.paid" /></span>
                    <span>{7 - booked}/7 <T k="qurbani.available" /></span>
                  </p>
                  <Link href={`/qurbani/book?cow=${cow.cowNumber}`} className="btn btn-outline mt-2 w-full !py-1.5 !text-xs">{7 - booked > 0 ? <><T k="qurbani.bookHissa" /></> : <><T k="common.notFound" /></>}</Link>
                </article>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink/55"><T k="qurbani.boardNote" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Progress" titleEn="Season progress" titleUr="سیزن کی پیش رفت" subtitleEn="Aggregate figures only — no personal data." subtitleUr="صرف مجموعی اعداد — کوئی ذاتی ڈیٹا نہیں۔" />
            <div className="space-y-3">
              {[
                { label: "cowsSlaughtered", value: stats.cowsSlaughtered, total: board.length },
                { label: "sharesDistributed", value: stats.sharesDistributed, total: totalShares },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-semibold text-ink/70">
                    <span><T k={`qurbani.${item.label}`} /></span>
                    <span dir="ltr">{item.value} / {item.total}</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-light">
                    <div className="h-full rounded-full bg-deep" style={{ width: `${Math.min(100, (item.value / Math.max(1, item.total)) * 100)}%` }} />
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-deep/15 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/60"><T k="qurbani.meatToNeedy" /></p>
                <p className="font-display text-2xl font-bold text-deep" dir="ltr">{season.meatToNeedyKg.toLocaleString("en-PK")} kg</p>
                <p className="text-xs text-ink/60">{paidShares} paid hissas this season · {bookedShares} booked</p>
              </div>
            </div>
            <Callout icon="shield" title="Sample receipt">
              <p>Every payment generates a PDF receipt with a QR code to the private status page.</p>
              <Link href={`/qurbani/receipt/QRB-2027-000123`} className="link-underline mt-1 inline-block">View sample Qurbani receipt →</Link>
            </Callout>
          </div>
          <div>
            <SectionHeading eyebrow="FAQ" titleEn="Scholar-approved FAQ" titleUr="علماء سے منظور شدہ سوالات" action={<Link href="/qurbani/faq" className="btn btn-outline"><T k="common.viewAll" /></Link>} />
            <Accordion items={faqs.slice(0, 5).map((faq) => ({ id: String(faq.id), question: faq.questionEn, answer: faq.answerEn }))} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/qurbani/status" className="btn btn-primary !py-1.5 !text-xs"><T k="qurbani.checkBooking" /></Link>
              <Link href="/policies/refund" className="btn btn-outline !py-1.5 !text-xs"><T k="footer.refund" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light/50">
        <div className="container-x">
          <SectionHeading eyebrow="Gallery" titleEn="Farm & distribution gallery" titleUr="فارم و تقسیم گیلری" subtitleEn="Updated during the season." subtitleUr="سیزن کے دوران اپڈیٹ ہوتی ہے۔" />
          <GalleryGrid photos={photos.filter((p) => p.eventType === "Qurbani").slice(0, 6)} />
          <div className="mt-6 rounded-lg border border-deep/15 bg-white p-5">
            <h2 className="text-xl"><T k="qurbani.distribution" /></h2>
            <p className="mt-1.5 text-sm text-ink/80"><Bi en={season.distributionPolicyEn} ur={season.distributionPolicyUr} /></p>
          </div>
        </div>
      </section>
    </>
  );
}
