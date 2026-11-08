import type { Metadata } from "next";
import Link from "next/link";
import { DonationForm } from "@/components/forms/DonationForm";
import { CopyButton } from "@/components/CopyButton";
import { Callout, PageHero, SectionHeading } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { DONATION_PURPOSES, IMAGES, UNIVERSITY } from "@/lib/site";
import { formatPkr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Donate — Zakat, Sadaqah and scholarships",
  description:
    "Give once or monthly to scholarships, construction, Zakat, Sadaqah Jariyah, orphans, food and Qurbani. Card, JazzCash, Easypaisa, UPaisa and bank transfer with an email receipt.",
  alternates: { canonical: "/donate" },
  openGraph: { title: "Donate", images: ["/images/quran.jpg"] },
};

export default async function DonatePage({ searchParams }: { searchParams: Promise<{ amount?: string; purpose?: string }> }) {
  const params = await searchParams;
  const amount = Number(params.amount) || 0;
  const purpose = DONATION_PURPOSES.find((p) => p.key === params.purpose)?.key ?? "general";

  return (
    <>
      <PageHero
        image={IMAGES.quran}
        eyebrowEn="Give with confidence"
        eyebrowUr="اعتماد کے ساتھ دیں"
        titleEn="Donate"
        titleUr="عطیہ دیں"
        subtitleEn="One-time or monthly. Every donation is receipted by email and reported in our anonymised annual summary."
        subtitleUr="ایک بار یا ماہانہ۔ ہر عطیہ کی ای میل رسید ملتی ہے اور سالانہ بے نام رپورٹ میں درج ہوتی ہے۔"
      >
        <a href="#give" className="btn btn-gold"><Icon name="heart" size={16} /> <T k="home.donateNow" /></a>
        <Link href="/policies/refund" className="btn btn-ghost-light"><T k="footer.refund" /></Link>
      </PageHero>

      <section className="section" id="give">
        <div className="container-x grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="card p-5">
            <SectionHeading eyebrow="Secure giving" titleEn="Make a donation" titleUr="عطیہ کریں" subtitleEn="Card payments are processed by Stripe. Zakat and Sadaqah accounts are kept strictly separate." subtitleUr="کارڈ ادائیگی اسٹرپ کے ذریعے۔ زکوٰۃ اور صدقہ اکاؤنٹس مکمل طور پر الگ رکھے جاتے ہیں۔" />
            <DonationForm defaultPurpose={purpose} />
            {amount > 0 && (
              <p className="mt-2 text-xs text-ink/55">Pre-filled from the homepage: {formatPkr(amount)} · {purpose}</p>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card p-5">
              <h2 className="text-lg"><T k="donate.perStudent" /></h2>
              <p className="font-display text-2xl font-bold text-deep" dir="ltr">{formatPkr(8500)} <span className="text-sm font-sans font-normal text-ink/60">/ {new Date().getFullYear()}</span></p>
              <p className="mt-1 text-sm text-ink/70"><T k="donate.perStudentNote" /></p>
              <Link href="/donate?purpose=scholarships&amount=8500" className="btn btn-green mt-2 w-full !py-1.5 !text-xs"><T k="donate.monthly" /> · {formatPkr(8500)}</Link>
            </div>

            <div className="card p-5">
              <h2 className="text-lg"><T k="donate.bank" /></h2>
              <div className="mt-2 space-y-3 text-sm">
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-wide text-fresh"><T k="donate.zakatAccount" /></p>
                  <p className="font-semibold text-ink"><Bi en={UNIVERSITY.bank.zakat.bankEn} ur={UNIVERSITY.bank.zakat.bankUr} /></p>
                  <p className="font-mono text-xs" dir="ltr">{UNIVERSITY.bank.zakat.account}</p>
                  <CopyButton value={UNIVERSITY.bank.zakat.account} />
                </div>
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-wide text-fresh"><T k="donate.generalAccount" /></p>
                  <p className="font-semibold text-ink"><Bi en={UNIVERSITY.bank.general.bankEn} ur={UNIVERSITY.bank.general.bankUr} /></p>
                  <p className="font-mono text-xs" dir="ltr">{UNIVERSITY.bank.general.account}</p>
                  <CopyButton value={UNIVERSITY.bank.general.account} />
                </div>
              </div>
              <p className="mt-2 text-xs text-ink/55"><T k="donate.zakatNote" /></p>
            </div>

            <Callout icon="money" title="Payment methods">
              Stripe card · JazzCash · Easypaisa · UPaisa · Bank transfer (manual verification) · United Bank counter. Full card numbers are never stored on our servers.
            </Callout>
            <div className="card p-5">
              <h2 className="text-lg"><T k="donate.annual" /></h2>
              <p className="mt-1 text-sm text-ink/70">We publish totals by purpose each year without donor names. <Link href="/about#reports" className="link-underline"><T k="about.reports" /></Link></p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
