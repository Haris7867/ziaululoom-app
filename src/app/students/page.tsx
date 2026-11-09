import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading, Callout } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { ArticleCard } from "@/components/cards";
import { IMAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Student Life & Campus",
  description: "Hostel, transport, mess, sports, welfare, scholarships and alumni network — plus the secure student portal for results and records.",
  alternates: { canonical: "/students" },
  openGraph: { title: "Student Life & Campus", images: ["/images/campus-hero.jpg"] },
};

const FACILITIES = [
  { icon: "lock", en: "Hostel", ur: "ہاسٹل", descEn: "Separate residential blocks with 24-hour supervision, study rooms and a warden on site.", descUr: "الگ رہائشی بلاک، چوبیس گھنٹے نگرانی، مطالعہ کمرے اور وارڈن موجود۔" },
  { icon: "pin", en: "Transport", ur: "ٹرانسپورٹ", descEn: "Four Lahore routes with female attendants on the women's coach.", descUr: "لاہور کے چار روٹ، خواتین کوچ پر خاتون معاون۔" },
  { icon: "heart", en: "Mess", ur: "میس", descEn: "Three meals daily; free meals for Zakat-eligible residential students.", descUr: "روزانہ تین وقت کا کھانا؛ زکوٰۃ کے مستحق رہائشی طلبہ کے لیے مفت۔" },
  { icon: "star", en: "Sports & grounds", ur: "کھیل و میدان", descEn: "Cricket, football and archery with an annual inter-department tournament.", descUr: "کرکٹ، فٹبال اور تیراندازی، سالانہ بین الشعبی ٹورنامنٹ۔" },
  { icon: "shield", en: "Welfare", ur: "فلاح و بہبود", descEn: "Confidential counselling, hardship grants and a student hardship fund.", descUr: "رازداری میں مشاورت، مشکل گرانٹ اور طلبہ فلاح فنڈ۔" },
  { icon: "cap", en: "Scholarships", ur: "وظائف", descEn: "Zakat-funded full and partial scholarships, plus merit awards for top results.", descUr: "زکوٰۃ سے مکمل و جزوی وظائف، نمایاں نتائج پر اعزازی اسناد۔" },
];

export default function StudentsPage() {
  return (
    <>
      <PageHero
        image={IMAGES.campus}
        eyebrowEn="Campus life"
        eyebrowUr="کیمپس کی زندگی"
        titleEn="Student Life & Campus"
        titleUr="طلبہ کی زندگی و کیمپس"
        subtitleEn="Hostel, transport, mess, sports, welfare and scholarships — support that lets students focus on study."
        subtitleUr="ہاسٹل، ٹرانسپورٹ، میس، کھیل، فلاح و بہبود اور وظائف — ایسی سہولت جو طالب علم کو تعلیم پر توجہ دینے دے۔"
      >
        <a href="#portal" className="btn btn-green"><Icon name="lock" size={16} /> <T k="students.portal" /></a>
        <Link href="/admissions" className="btn btn-gold"><T k="nav.apply" /></Link>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Facilities" titleEn="Everything on campus" titleUr="کیمپس کی تمام سہولیات" subtitleEn="Photographs of the campus, hostel and grounds." subtitleUr="کیمپس، ہاسٹل اور میدانوں کی تصاویر۔" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((facility) => (
              <div key={facility.en} className="card p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name={facility.icon as "heart"} size={20} /></span>
                <h2 className="mt-2 text-lg"><Bi en={facility.en} ur={facility.ur} /></h2>
                <p className="mt-1 text-sm text-ink/75"><Bi en={facility.descEn} ur={facility.descUr} /></p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <img src={IMAGES.campusModern} alt="Academic block courtyard" loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <img src={IMAGES.library} alt="Library reading room" loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <img src={IMAGES.campusAlt} alt="Campus lawn and gardens" loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
          </div>
        </div>
      </section>

      <section className="section bg-light/60" id="portal">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-2xl"><T k="students.portal" /></h2>
            <p className="mt-1 text-sm text-ink/75"><T k="students.portalNote" /></p>
            <div className="mt-4 rounded-md border border-deep/15 bg-light/60 p-4">
              <p className="text-sm font-semibold text-deep">Secure sign-in (placeholder)</p>
              <p className="mt-1 text-xs text-ink/65">
                The student portal is hosted separately at <span className="font-mono">portal.ziaululoom.com</span> (placeholder). Results, attendance and fee ledgers require a student login and are never shown on public pages.
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input className="input" placeholder="Student ID" aria-label="Student ID" disabled />
                <input className="input" placeholder="Password" aria-label="Password" type="password" disabled />
              </div>
              <button type="button" disabled className="btn btn-primary mt-2 w-full !py-2 opacity-60">
                <Icon name="lock" size={15} /> <T k="students.portalButton" />
              </button>
              <p className="mt-1 text-[0.68rem] text-ink/50">Staff access: <Link href="/admin/login" className="link-underline">admin panel</Link></p>
            </div>
            <Callout icon="shield" title="Privacy">
              <Bi
                en="A Qurbani buyer is linked to a student record only with the student's written consent. Public pages read approved content only."
                ur="قربانی خریدار کا طالب علم ریکارڈ سے تعلق صرف طالب علم کی تحریری رضامندی سے قائم ہوتا ہے۔ عوامی صفحات صرف منظور شدہ مواد دکھاتے ہیں۔"
              />
            </Callout>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="text-xl"><T k="students.welfare" /></h2>
              <p className="mt-1 text-sm text-ink/75">
                <Bi
                  en="The welfare office manages hardship grants, free meals, hostel support and confidential counselling. In the last academic year 214 students received full scholarships and 62 graduated."
                  ur="فلاح دفتر مشکل گرانٹ، مفت کھانا، ہاسٹل معاونت اور رازداری میں مشاورت کا ذمہ دار ہے۔ گزشتہ تعلیمی سال 214 طلبہ کو مکمل وظائف ملے اور 62 فارغ التحصیل ہوئے۔"
                />
              </p>
              <Link href="/donate?purpose=scholarships" className="btn btn-gold mt-2 !py-1.5 !text-xs"><T k="home.donateNow" /></Link>
            </div>
            <div className="card p-5">
              <h2 className="text-xl"><T k="students.alumni" /></h2>
              <p className="mt-1 text-sm text-ink/75">
                <Bi
                  en="Over 6,200 graduates serve in 38 districts as teachers, imams, researchers, lawyers and entrepreneurs. Alumni can mentor current students and join the annual reunion."
                  ur="6200 سے زیادہ فارغ التحصیل 38 اضلاع میں بطور اساتذہ، ائمہ، محققین، وکلاء اور کاروباری افراد خدمات انجام دے رہے ہیں۔ فارغ التحصیل موجودہ طلبہ کی رہنمائی کر سکتے ہیں اور سالانہ اجتماع میں شامل ہو سکتے ہیں۔"
                />
              </p>
              <Link href="/events" className="btn btn-outline mt-2 !py-1.5 !text-xs"><T k="nav.events" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
