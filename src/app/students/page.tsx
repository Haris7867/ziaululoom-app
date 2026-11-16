import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/ui";
import { Bi } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { IMAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Student Life & Campus",
  description: "Hostel, transport, mess, sports, welfare and scholarships.",
  alternates: { canonical: "/students" },
  openGraph: { title: "Student Life & Campus", images: ["/images/campus-hero.jpg"] },
};

const FACILITIES = [
  { img: "/images/students-building.jpg", icon: "lock", en: "Hostel", ur: "ہاسٹل", descEn: "Separate residential blocks with 24-hour supervision, study rooms and a warden on site.", descUr: "الگ رہائشی بلاک، چوبیس گھنٹے نگرانی، مطالعہ کمرے اور وارڈن موجود۔" },
  { img: "/images/courtyard-cars.jpg", icon: "pin", en: "Transport", ur: "ٹرانسپورٹ", descEn: "Four Lahore routes with female attendants on the women's coach.", descUr: "لاہور کے چار روٹ، خواتین کوچ پر خاتون معاون۔" },
  { img: "/images/students-hall-aerial.jpg", icon: "heart", en: "Mess", ur: "میس", descEn: "Three meals daily; free meals for Zakat-eligible residential students.", descUr: "روزانہ تین وقت کا کھانا؛ زکوٰۃ کے مستحق رہائشی طلبہ کے لیے مفت۔" },
  { img: "/images/courtyard.jpg", icon: "star", en: "Sports & grounds", ur: "کھیل و میدان", descEn: "Cricket, football and archery with an annual inter-department tournament.", descUr: "کرکٹ، فٹبال اور تیراندازی، سالانہ بین الشعبی ٹورنامنٹ۔" },
  { img: "/images/classroom.jpg", icon: "shield", en: "Welfare", ur: "فلاح و بہبود", descEn: "Confidential counselling, hardship grants and a student hardship fund.", descUr: "رازداری میں مشاورت، مشکل گرانٹ اور طلبہ فلاح فنڈ۔" },
  { img: "/images/graduation.jpg", icon: "cap", en: "Scholarships", ur: "وظائف", descEn: "Zakat-funded full and partial scholarships, plus merit awards for top results.", descUr: "زکوٰۃ سے مکمل و جزوی وظائف، نمایاں نتائج پر اعزازی اسناد۔" },
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
      />

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Facilities" titleEn="Everything on campus" titleUr="کیمپس کی تمام سہولیات" subtitleEn="Photographs of the campus, hostel and grounds." subtitleUr="کیمپس، ہاسٹل اور میدانوں کی تصاویر۔" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((facility) => (
              <div key={facility.en} className="card overflow-hidden">
                <img src={facility.img} alt={facility.en} loading="lazy" className="h-44 w-full object-cover" />
                <div className="p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-light text-deep"><Icon name={facility.icon as "heart"} size={20} /></span>
                  <h2 className="mt-2 text-lg"><Bi en={facility.en} ur={facility.ur} /></h2>
                  <p className="mt-1 text-sm text-ink/75"><Bi en={facility.descEn} ur={facility.descUr} /></p>
                </div>
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

    </>
  );
}
