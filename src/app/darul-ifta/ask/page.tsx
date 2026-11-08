import type { Metadata } from "next";
import Link from "next/link";
import { AskQuestionForm } from "@/components/forms/AskQuestionForm";
import { Callout } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { IMAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ask the Darul Ifta",
  description:
    "Submit a private question to the Darul Ifta. Anonymous options, replies in English or Urdu, a tracking number, and confirmation by email or WhatsApp.",
  alternates: { canonical: "/darul-ifta/ask" },
};

export default function AskPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-deep text-white">
        <img src={IMAGES.quran} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/95 to-deep/60" />
        <div className="container-x relative py-12">
          <p className="eyebrow !text-gold">Darul Ifta</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl"><T k="fatwa.askTitle" /></h1>
          <p className="mt-2 max-w-2xl text-white/85"><T k="fatwa.askSub" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-5">
            <AskQuestionForm />
          </div>
          <aside className="space-y-4">
            <div className="card p-5">
              <h2 className="text-lg"><Icon name="shield" size={18} className="me-1 inline text-fresh" /> <T k="fatwa.privacyNote" /></h2>
              <p className="mt-1.5 text-sm text-ink/75">
                <Bi
                  en="We collect your city, category, preferred language and the question itself, plus contact details so we can reply. Only the question and the edited answer may be published — never your name, phone or email."
                  ur="ہم آپ کا شہر، زمرہ، پسندیدہ زبان اور سوال جمع کرتے ہیں، اور جواب دینے کے لیے رابطہ تفصیلات۔ اشاعت میں صرف سوال اور ترمیم شدہ جواب آتا ہے — کبھی آپ کا نام، فون یا ای میل نہیں۔"
                />
              </p>
            </div>
            <Callout icon="clock" title="Priority">
              <Bi
                en="Zakat deadlines, Qurbani timing and inheritance questions are marked urgent and answered first. Sale and marriage deadlines should be mentioned in the question."
                ur="زکوٰۃ کی آخری تاریخ، قربانی کے وقت اور وراثت کے سوالات فوری نشان زد ہو کر پہلے جواب دیے جاتے ہیں۔ خرید و فروخت اور نکاح کی آخری تاریخ سوال میں لکھیں۔"
              />
            </Callout>
            <div className="card p-5">
              <h2 className="text-lg"><T k="fatwa.categories" /></h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Salah", "Zakat", "Fasting", "Hajj", "Qurbani", "Marriage", "Business", "Inheritance", "Halal & Haram", "Daily Life"].map((category) => (
                  <span key={category} className="badge">{category}</span>
                ))}
              </div>
              <Link href="/darul-ifta" className="btn btn-outline mt-3 w-full"><T k="fatwa.recent" /></Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
