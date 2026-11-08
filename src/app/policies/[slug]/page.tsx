import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Bi, T } from "@/components/Bi";
import { Callout, PageHero } from "@/components/ui";
import { IMAGES, UNIVERSITY } from "@/lib/site";

export const dynamic = "force-static";

type Doc = {
  titleEn: string; titleUr: string; introEn: string; introUr: string;
  sections: { headingEn: string; headingUr: string; bodyEn: string; bodyUr: string }[];
};

const DOCS: Record<string, Doc> = {
  privacy: {
    titleEn: "Privacy Policy", titleUr: "پرائیویسی پالیسی",
    introEn: "This notice explains what data we collect, why we collect it, and the rights you have. This is placeholder policy text for a demonstration site.",
    introUr: "یہ نوٹس بتاتا ہے کہ ہم کیا ڈیٹا جمع کرتے ہیں، کیوں جمع کرتے ہیں اور آپ کے کیا حقوق ہیں۔ یہ نمونہ ویب سائٹ کی نمونہ پالیسی ہے۔",
    sections: [
      { headingEn: "What we collect", headingUr: "ہم کیا جمع کرتے ہیں", bodyEn: "Enquiry and application forms (name, phone, email, city, programme, uploaded documents), Darul Ifta questions (contact details, city, category, question), donations (name, email, phone, amount, purpose, payment reference), and Qurbani bookings (name, guardian name, optional CNIC, WhatsApp, email, city, hissa and payment details). Card numbers are never stored: payments are processed by our payment providers and we store only a transaction reference.", bodyUr: "استفسار و داخلہ فارم (نام، فون، ای میل، شہر، پروگرام، اپ لوڈ شدہ دستاویزات)، دارالافتاء سوالات (رابطہ، شہر، زمرہ، سوال)، عطیات (نام، ای میل، فون، رقم، مقصد، ادائیگی حوالہ) اور قربانی بکنگ (نام، والد/شوہر کا نام، اختیاری شناختی کارڈ، واٹس ایپ، ای میل، شہر، حصص اور ادائیگی تفصیلات)۔ کارڈ نمبر کبھی محفوظ نہیں ہوتے: ادائیگی ہمارے پرووائیڈرز کرتے ہیں اور ہم صرف ٹرانزیکشن حوالہ رکھتے ہیں۔" },
      { headingEn: "Why we collect it", headingUr: "کیوں جمع کرتے ہیں", bodyEn: "To answer your question or enquiry, process admission, issue donation and Qurbani receipts, verify payments, dispatch Qurbani shares, publish approved fatawa (with personal details removed) and meet our audit obligations.", bodyUr: "آپ کے سوال یا استفسار کا جواب، داخلہ کارروائی، عطیہ و قربانی رسید جاری کرنا، ادائیگی کی تصدیق، قربانی حصص کی روانگی، منظور شدہ فتاویٰ کی اشاعت (ذاتی تفصیلات حذف کر کے) اور آڈٹ ذمہ داریوں کی تکمیل کے لیے۔" },
      { headingEn: "Storage and security", headingUr: "ذخیرہ اور تحفظ", bodyEn: "Public content, donor data, question data and Qurbani bookings are held in protected collections separate from student records. Student records are held in the university's main database and reached only through a secure API. Card data is handled by the payment provider. Access is role-based and logged in an audit trail. HTTPS is enforced, backups are encrypted, and unpublished files live in private storage.", bodyUr: "عوامی مواد، عطیہ دہندگان کا ڈیٹا، سوالات اور قربانی بکنگ طلبہ ریکارڈ سے الگ محفوظ کلیکشنز میں رکھی جاتی ہیں۔ طلبہ ریکارڈ یونیورسٹی کے مرکزی ڈیٹا بیس میں ہیں اور صرف محفوظ API سے قابلِ رسائی۔ کارڈ ڈیٹا پرووائیڈر کے پاس رہتا ہے۔ رسائی کردار کے مطابق اور آڈٹ لاگ میں درج ہے۔ HTTPS لازمی، بیک اپ انکرپٹڈ اور غیر شائع فائلیں نجی اسٹوریج میں۔" },
      { headingEn: "Consent and your rights", headingUr: "رضامندی اور آپ کے حقوق", bodyEn: "Qurbani buyers are linked to a student record only with the student's written consent. You may request access, correction or deletion of your data by writing to info@alnoor.edu.pk. Questions asked anonymously stay anonymous; published fatawa never include your name, phone or email.", bodyUr: "قربانی خریدار کا طلبہ ریکارڈ سے تعلق صرف طالب علم کی تحریری رضامندی سے قائم ہوتا ہے۔ آپ اپنے ڈیٹا تک رسائی، اصلاح یا حذف کی درخواست info@alnoor.edu.pk پر کر سکتے ہیں۔ گمنام سوالات گمنام رہتے ہیں؛ شائع شدہ فتاویٰ میں نام، فون یا ای میل شامل نہیں ہوتے۔" },
      { headingEn: "Cookies and analytics", headingUr: "کوکیز اور اینالیٹکس", bodyEn: "Essential cookies store your language choice and staff session. Optional analytics (Google Analytics 4 placeholder) and Meta Pixel placeholders load only after consent and are disabled until configured.", bodyUr: "ضروری کوکیز زبان اور اسٹاف سیشن محفوظ رکھتی ہیں۔ اختیاری اینالیٹکس (گوگل اینالیٹکس 4 نمونہ) اور میٹا پکسل نمونہ صرف رضامندی کے بعد لوڈ ہوتے ہیں اور تشکیل تک غیر فعال ہیں۔" },
    ],
  },
  terms: {
    titleEn: "Terms of Use", titleUr: "استعمال کی شرائط",
    introEn: "By using this website you accept these terms. Please read them together with the privacy and refund policies.",
    introUr: "اس ویب سائٹ کے استعمال سے آپ یہ شرائط قبول کرتے ہیں۔ براہِ کرم انہیں پرائیویسی اور رقم واپسی پالیسی کے ساتھ پڑھیں۔",
    sections: [
      { headingEn: "Use of content", headingUr: "مواد کا استعمال", bodyEn: "Khutbat, durus and fatawa may be downloaded and shared for personal study and non-commercial teaching, with attribution. Commercial reuse, re-uploading entire files, or modifying translations requires written permission.", bodyUr: "خطبات، دروس اور فتاویٰ ذاتی مطالعے اور غیر تجارتی تدریس کے لیے حوالہ کے ساتھ ڈاؤن لوڈ و شیئر کیے جا سکتے ہیں۔ تجارتی استعمال، مکمل فائل دوبارہ اپ لوڈ کرنا یا ترجمے تبدیل کرنا تحریری اجازت کے بغیر ممنوع ہے۔" },
      { headingEn: "Fatawa are general guidance", headingUr: "فتاویٰ عمومی رہنمائی ہیں", bodyEn: "Every published answer is approved by a qualified Mufti, but it addresses the question as described and the Hanafi school. It is not a ruling on your particular circumstances, and it does not create a lawyer-client relationship. For personal matters consult the Darul Ifta or a qualified scholar directly.", bodyUr: "ہر شائع شدہ جواب مستند مفتی سے منظور شدہ ہے، مگر یہ بیان کردہ سوال اور فقہ حنفی کے مطابق ہے۔ یہ آپ کے مخصوص حالات کا فیصلہ نہیں اور نہ کوئی قانونی تعلق قائم کرتا ہے۔ ذاتی معاملات میں دارالافتاء یا مستند عالم سے براہِ راست رجوع کریں۔" },
      { headingEn: "Qurbani bookings", headingUr: "قربانی بکنگ", bodyEn: "A slot is held for 30 minutes pending payment. If two buyers select the same slot, the first confirmed payment is accepted. If an animal is rejected by the veterinarian or dies, hissas are moved to a replacement animal or refunded. Receipts are issued to the name supplied; corrections regenerate the receipt and are logged.", bodyUr: "ادائیگی تک سلاٹ 30 منٹ محفوظ رہتا ہے۔ دو خریدار ایک ہی سلاٹ منتخب کریں تو پہلی تصدیق شدہ ادائیگی قبول ہوتی ہے۔ جانور ویٹرنری طور پر مسترد ہو یا مر جائے تو حصے متبادل جانور میں منتقل یا رقم واپس۔ رسید دیے گئے نام پر جاری ہوتی ہے؛ اصلاح پر رسید دوبارہ جاری اور ریکارڈ ہوتی ہے۔" },
      { headingEn: "Acceptable use", headingUr: "قابلِ قبول استعمال", bodyEn: "Do not attempt to access private files, admin functions, other buyers' bookings or student records. Automated scraping, uploading malicious files or impersonating staff will lead to access being blocked.", bodyUr: "نجی فائلوں، ایڈمن فنکشنز، دوسرے خریداروں کی بکنگ یا طلبہ ریکارڈ تک رسائی کی کوشش نہ کریں۔ خودکار اسکریپنگ، نقصان دہ فائل اپ لوڈ یا اسٹاف کی نقالی پر رسائی بلاک ہو جائے گی۔" },
    ],
  },
  refund: {
    titleEn: "Refund Policy", titleUr: "رقم واپسی پالیسی",
    introEn: "This policy covers Qurbani hissas, donations and admission fees. All refunds are recorded and a refund receipt is issued.",
    introUr: "یہ پالیسی قربانی کے حصص، عطیات اور داخلہ فیس پر لاگو ہے۔ تمام واپسیاں ریکارڈ ہوتی ہیں اور واپسی کی رسید جاری کی جاتی ہے۔",
    sections: [
      { headingEn: "Qurbani — cancellation window", headingUr: "قربانی — منسوخی کی مدت", bodyEn: "Cancel within 7 days of payment and at least 72 hours before the scheduled slaughter date for a full refund to the original payment method. After that window the share is committed to the animal and slaughter, and a refund is not normally possible. If the animal is rejected by the vet or dies, you may choose a replacement hissa or a full refund.", bodyUr: "ادائیگی کے 7 دن کے اندر اور مقررہ ذبح سے کم از کم 72 گھنٹے پہلے منسوخی پر مکمل رقم اسی طریقے سے واپس ہوگی۔ اس مدت کے بعد حصہ جانور اور ذبح کے لیے مختص ہو جاتا ہے، عام طور پر واپسی ممکن نہیں۔ ویٹرنری مستردگی یا جانور کی موت پر متبادل حصہ یا مکمل رقم واپسی کا اختیار ہے۔" },
      { headingEn: "How to request", headingUr: "درخواست کا طریقہ", bodyEn: "Contact the Qurbani office with your receipt ID and phone number, or ask for a call-back through the contact page. Refunds are processed by the cashier or Qurbani in-charge within 7 working days and logged with the staff name and timestamp.", bodyUr: "رسید نمبر اور فون نمبر کے ساتھ قربانی دفتر سے رابطہ کریں یا رابطہ صفحے سے کال بیک طلب کریں۔ واپسی کیشیئر یا قربانی انچارج 7 کاروباری دنوں میں کرتا ہے اور اسٹاف نام و وقت کے ساتھ درج ہوتی ہے۔" },
      { headingEn: "Donations", headingUr: "عطیات", bodyEn: "One-time donations may be refunded within 14 days if funds have not been disbursed. Monthly giving can be stopped at any time; the current month is refunded only if requested before disbursement. Zakat funds are refunded to the original donor if they have not been used for eligible recipients.", bodyUr: "ایک بار کے عطیات 14 دن کے اندر واپس ہو سکتے ہیں اگر رقم خرچ نہ ہوئی ہو۔ ماہانہ عطیہ کسی بھی وقت بند ہو سکتا ہے؛ موجودہ ماہ کی رقم صرف خرچ سے پہلے درخواست پر واپس۔ زکوٰۃ فنڈز، اگر مستحقین پر خرچ نہ ہوئے ہوں، اصل دہندہ کو واپس کیے جاتے ہیں۔" },
      { headingEn: "Admission fees", headingUr: "داخلہ فیس", bodyEn: "The admission fee is refundable in full before the first day of classes, less any bank charges. Tuition fees are refunded pro rata for the semester after withdrawal, according to the academic regulations.", bodyUr: "داخلہ فیس کلاسوں کے پہلے دن سے پہلے مکمل واپس ہوتی ہے، بینک چارجز منہا کر کے۔ ٹیوشن فیس، دستبرداری کے بعد تعلیمی قواعد کے مطابق سمسٹر کے تناسب سے واپس ہوتی ہے۔" },
    ],
  },
  accessibility: {
    titleEn: "Accessibility Statement", titleUr: "رسائی کا بیان",
    introEn: "We want every visitor to be able to read, listen and use this site comfortably, in English or Urdu.",
    introUr: "ہم چاہتے ہیں کہ ہر وزٹر انگریزی یا اردو میں اس ویب سائٹ کو آرام سے پڑھ، سن اور استعمال کر سکے۔",
    sections: [
      { headingEn: "What we have done", headingUr: "ہم نے کیا کیا", bodyEn: "Semantic headings and landmarks, keyboard-operable menu, carousel, tabs and accordions, visible focus outlines, alt text on photographs, colour contrast checked against WCAG 2.1 AA, reduced-motion support (decorative animations and autoplay pause), and right-to-left layout with a Nastaliq typeface for Urdu.", bodyUr: "سمینٹک ہیڈنگز، کی بورڈ سے چلنے والا مینو، کیروسل، ٹیبز اور ایکورڈین، واضح فوکس آؤٹ لائن، تصاویر پر آلٹ ٹیکسٹ، WCAG 2.1 AA کے مطابق رنگوں کا تناسب، حرکت کم کرنے کی سہولت (آرائشی اینیمیشن اور آٹو پلے روکنا) اور اردو کے لیے نستعلیق فونٹ کے ساتھ دائیں سے بائیں ترتیب۔" },
      { headingEn: "Known limitations", headingUr: "معلوم کمی", bodyEn: "Some third-party embeds (map, video) may not be fully accessible. Urdu Nastaliq text has a larger line height, which can make long tables scroll on small screens. Older PDFs may not be tagged for screen readers; contact us and we will send an accessible copy.", bodyUr: "کچھ بیرونی ایمبیڈز (نقشہ، ویڈیو) مکمل طور پر قابلِ رسائی نہ ہوں۔ اردو نستعلیق کا لائن ہائٹ بڑا ہوتا ہے جس سے چھوٹی اسکرین پر لمبی جدولیں اسکرول ہو سکتی ہیں۔ پرانی پی ڈی ایف اسکرین ریڈر کے لیے ٹیگ شدہ نہ ہوں؛ رابطہ کریں تو ہم قابلِ رسائی نقل بھیجیں گے۔" },
      { headingEn: "Tell us", headingUr: "ہمیں بتائیں", bodyEn: "Email info@alnoor.edu.pk or call +92 300 1234567 with any barrier you find. We aim to acknowledge accessibility reports within two working days and fix critical issues within ten.", bodyUr: "کسی بھی رکاوٹ کے لیے info@alnoor.edu.pk پر ای میل کریں یا +92 300 1234567 پر کال کریں۔ ہم دو کاروباری دنوں میں تصدیق اور دس دنوں میں اہم مسائل کے حل کی کوشش کرتے ہیں۔" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) return { title: "Policy not found" };
  return { title: doc.titleEn, description: doc.introEn.slice(0, 158), alternates: { canonical: `/policies/${slug}` } };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();
  return (
    <>
      <PageHero image={IMAGES.campusAlt} eyebrowEn="Policies" eyebrowUr="پالیسیاں" titleEn={doc.titleEn} titleUr={doc.titleUr} subtitleEn={doc.introEn} subtitleUr={doc.introUr} compact />
      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {doc.sections.map((section) => (
              <article key={section.headingEn} className="card p-5">
                <h2 className="text-xl"><Bi en={section.headingEn} ur={section.headingUr} /></h2>
                <p className="mt-2 text-ink/80"><Bi en={section.bodyEn} ur={section.bodyUr} /></p>
              </article>
            ))}
            <p className="text-xs text-ink/50">Last updated: 1 January 2027 · Sample policy text (placeholder).</p>
          </div>
          <aside className="space-y-3">
            <div className="card p-5">
              <h2 className="text-lg"><T k="nav.contact" /></h2>
              <p className="mt-1 text-sm text-ink/75">{UNIVERSITY.email} · {UNIVERSITY.phone}</p>
              <p className="text-sm text-ink/75">{UNIVERSITY.addressEn}</p>
              <Link href="/contact" className="btn btn-primary mt-2 w-full !py-1.5 !text-xs"><T k="contact.enquiry" /></Link>
            </div>
            <Callout icon="shield" title="Data protection">
              <Bi
                en="Public content, donor data, fatawa questions and Qurbani bookings are stored separately from student records, which are reached only through a secure API."
                ur="عوامی مواد، عطیہ ڈیٹا، فتاویٰ سوالات اور قربانی بکنگ طلبہ ریکارڈ سے الگ محفوظ ہیں، جن تک رسائی صرف محفوظ API سے ہے۔"
              />
            </Callout>
            <div className="card p-5 text-sm">
              <Link href="/policies/privacy" className="link-underline block"><T k="footer.privacy" /></Link>
              <Link href="/policies/terms" className="link-underline mt-1.5 block"><T k="footer.terms" /></Link>
              <Link href="/policies/refund" className="link-underline mt-1.5 block"><T k="footer.refund" /></Link>
              <Link href="/policies/accessibility" className="link-underline mt-1.5 block"><T k="footer.accessibility" /></Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
