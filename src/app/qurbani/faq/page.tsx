import type { Metadata } from "next";
import Link from "next/link";
import { getQurbaniFaqs } from "@/lib/data";
import { Accordion, Callout, PageHero } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { IMAGES } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Qurbani rules & scholar-approved FAQ",
  description: "Eligibility, timing from 10th to 12th Dhul Hijjah, animal conditions, sharing, refunds and receipt reissue — approved by the Darul Ifta.",
  alternates: { canonical: "/qurbani/faq" },
};

export default async function QurbaniFaqPage() {
  const faqs = await getQurbaniFaqs();
  return (
    <>
      <PageHero image={IMAGES.quran} eyebrowEn="Qurbani 2027" eyebrowUr="قربانی 2027" titleEn="Qurbani rules" titleUr="قربانی کے مسائل" subtitleEn="Scholar-approved answers on eligibility, timing, animal conditions, sharing, refunds and receipts." subtitleUr="اہلیت، وقت، جانور کی شرائط، شرکت، رقم واپسی اور رسید پر علماء سے منظور شدہ جوابات۔" />
      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Accordion items={faqs.map((faq) => ({ id: String(faq.id), question: faq.questionEn, answer: faq.answerEn }))} />
            <div className="mt-4 space-y-3">
              {faqs.map((faq) => (
                <details key={faq.id} className="rounded-lg border border-deep/15 bg-white p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-deep">{faq.questionUr}</summary>
                  <p className="mt-2 text-sm leading-loose text-ink/80" dir="rtl">{faq.answerUr}</p>
                </details>
              ))}
            </div>
          </div>
          <aside className="space-y-3">
            <Callout icon="shield" title="Darul Ifta">
              <Bi
                en="These answers reflect the Darul Ifta's understanding according to the Hanafi school. For personal circumstances, consult the Darul Ifta directly."
                ur="یہ جوابات دارالافتاء کی فقہ حنفی کے مطابق سمجھ ہیں۔ ذاتی حالات کے لیے براہِ راست دارالافتاء سے رجوع کریں۔"
              />
            </Callout>
            <div className="card p-5">
              <h2 className="text-lg"><T k="qurbani.checkBooking" /></h2>
              <p className="mt-1 text-sm text-ink/70"><T k="qurbani.checkSub" /></p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/qurbani/status" className="btn btn-primary !py-1.5 !text-xs"><T k="qurbani.checkBooking" /></Link>
                <Link href="/qurbani/book" className="btn btn-outline !py-1.5 !text-xs"><T k="qurbani.bookHissa" /></Link>
                <Link href="/policies/refund" className="btn btn-outline !py-1.5 !text-xs"><T k="footer.refund" /></Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="text-lg"><T k="fatwa.submit" /></h2>
              <p className="mt-1 text-sm text-ink/70">Ask a specific question about your own Qurbani.</p>
              <Link href="/darul-ifta/ask?category=Qurbani" className="btn btn-green mt-2 w-full !py-1.5 !text-xs"><T k="fatwa.submit" /></Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
