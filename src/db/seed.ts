import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  announcements, adminUsers, articles, auditLogs, calendarEntries, donations, events,
  examSchedule, faculty, fatawa, fatwaQuestions, galleryPhotos, leads, pdfResources,
  programmes, qurbaniBookings, qurbaniCows, qurbaniFaqs, qurbaniLogs, qurbaniPayments,
  qurbaniSeasons, qurbaniShares, qurbaniTemplates, reports, seasonalBanners, settings,
  testimonials,
} from "@/db/schema";
import { hashPassword } from "@/lib/passwords";
import { IMAGES } from "@/lib/site";

const SEED_VERSION = "2027.1";
const day = 86_400_000;
const now = Date.now();
const at = (offsetDays: number, hour = 10) => {
  const d = new Date(now + offsetDays * day);
  d.setHours(hour, 0, 0, 0);
  return d;
};

let seedPromise: Promise<void> | null = null;

export function ensureSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

async function runSeed(): Promise<void> {
  const existing = await db.select().from(settings).where(eq(settings.key, "seed_version"));
  if (existing.length > 0) return;

  /* ---------------- Admin users ---------------- */
  await db.insert(adminUsers).values([
    { name: "Dr. Imran Siddiqui", email: "admin@alnoor.edu.pk", passwordHash: hashPassword("Shju6ROK2nYu"), role: "super_admin" },
    { name: "Mufti Abdul Rahman", email: "mufti@alnoor.edu.pk", passwordHash: hashPassword("7MpGq4f51I0V"), role: "mufti" },
    { name: "Hafiz Bilal Ahmed", email: "qurbani@alnoor.edu.pk", passwordHash: hashPassword("V4amFbTi0kYk"), role: "qurbani_incharge" },
    { name: "Ms. Sana Fatima", email: "cashier@alnoor.edu.pk", passwordHash: hashPassword("UueMu9RvfNhU"), role: "cashier" },
    { name: "Mr. Usman Tariq", email: "dispatch@alnoor.edu.pk", passwordHash: hashPassword("bsSXiSb2ofwN"), role: "dispatch" },
    { name: "Board Viewer", email: "viewer@alnoor.edu.pk", passwordHash: hashPassword("3PbfbLcPA0g2"), role: "viewer" },
  ]);

  /* ---------------- Settings ---------------- */
  await db.insert(settings).values([
    { key: "seed_version", value: { version: SEED_VERSION, seededAt: new Date().toISOString() } },
    { key: "monthly_cost_per_student", value: { amount: 8500, currency: "PKR" } },
    { key: "analytics_placeholders", value: { ga4: "G-XXXXXXXXXX", metaPixel: "000000000000000" } },
    { key: "campus_phone", value: { phone: "+92 300 1234567" } },
  ]);

  /* ---------------- Announcements ---------------- */
  await db.insert(announcements).values([
    { titleEn: "Admissions open for academic year 2027", titleUr: "تعلیمی سال 2027 کے لیے داخلے جاری", date: at(-1), pinned: true },
    { titleEn: "Qurbani 2027 hissa booking is now open", titleUr: "قربانی 2027 کے حصص کی بکنگ شروع", date: at(-3), pinned: true },
    { titleEn: "Khatm-e-Bukhari ceremony on 14 March", titleUr: "ختم بخاری کی تقریب 14 مارچ کو", date: at(-6) },
    { titleEn: "Library extended hours during exams", titleUr: "امتحانات میں کتب خانے کے اوقات میں اضافہ", date: at(-9) },
    { titleEn: "New Darul Ifta answers on business partnerships", titleUr: "کاروباری شراکت پر دارالافتاء کے نئے جوابات", date: at(-12) },
  ]);

  /* ---------------- Programmes ---------------- */
  const curriculum = (years: string[][]) =>
    years.map((courses, index) => ({
      labelEn: `Year ${index + 1}`,
      labelUr: `سال ${index + 1}`,
      courses,
    }));

  await db.insert(programmes).values([
    {
      slug: "bs-islamic-studies", titleEn: "BS Islamic Studies", titleUr: "بی ایس اسلامی علوم",
      level: "Undergraduate", durationYears: "4", mode: "On campus", department: "Islamic Studies",
      summaryEn: "A broad grounding in Quran, Hadith, Fiqh, Aqeedah and Islamic history with research training.",
      summaryUr: "قرآن، حدیث، فقہ، عقیدہ اور اسلامی تاریخ میں وسیع بنیاد، تحقیقی تربیت کے ساتھ۔",
      overviewEn: "The four-year BS Islamic Studies programme combines classical texts with modern research methods. Students study Arabic grammar, Quranic sciences, Hadith sciences, Islamic jurisprudence, Seerah and contemporary Muslim thought, and complete a final-year research dissertation.",
      overviewUr: "چار سالہ بی ایس اسلامی علوم پروگرام کلاسیکی متون کو جدید تحقیقی طریقوں سے ملاتا ہے۔ طلبہ عربی گرامر، علومِ قرآن، علومِ حدیث، اسلامی فقہ، سیرت اور عصری مسلم فکر پڑھتے ہیں اور آخری سال تحقیقی مقالہ مکمل کرتے ہیں۔",
      eligibilityEn: "Intermediate (FA/FSc) or Alimiyyah with 50% marks. Equivalent certificates accepted after verification.",
      eligibilityUr: "انٹرمیڈیٹ (ایف اے/ایف ایس سی) یا عالمیت 50 فیصد نمبروں کے ساتھ۔ مساوی اسناد تصدیق کے بعد قابلِ قبول۔",
      careersEn: "Teaching, Islamic banking, research, community leadership, civil services, content and translation.",
      careersUr: "تدریس، اسلامی بینکاری، تحقیق، سماجی قیادت، سول سروسز، تحریر و ترجمہ۔",
      feePerYear: 96000, icon: "book",
      curriculum: curriculum([
        ["Arabic Grammar I", "Quranic Sciences", "Seerah & Islamic History", "Aqeedah"],
        ["Arabic Grammar II", "Hadith Sciences", "Fiqh: Worship", "Islamic Ethics"],
        ["Islamic Jurisprudence", "Comparative Religion", "Research Methods", "Contemporary Muslim Thought"],
        ["Electives", "Dissertation", "Teaching Practicum"],
      ]),
    },
    {
      slug: "bs-quran-tafseer", titleEn: "BS Quran & Tafseer", titleUr: "بی ایس قرآن و تفسیر",
      level: "Undergraduate", durationYears: "4", mode: "On campus", department: "Quran",
      summaryEn: "Systematic study of tafseer, Quranic Arabic, abrogation, rhetoric and the major exegetical schools.",
      summaryUr: "تفسیر، عربیِ قرآن، ناسخ و منسوخ، بلاغت اور مشہور تفسیری مکاتبِ فکر کا منظم مطالعہ۔",
      overviewEn: "A specialist programme for students who wish to teach or research the Quran. You will memorise selected portions, study the classical tafseer works, and learn how to apply Quranic guidance to modern questions.",
      overviewUr: "یہ پروگرام ان طلبہ کے لیے ہے جو قرآن پڑھانے یا اس پر تحقیق کرنا چاہتے ہیں۔ منتخب حصے حفظ، کلاسیکی تفاسیر کا مطالعہ اور قرآنی رہنمائی کو عصری مسائل پر لاگو کرنے کی مہارت شامل ہے۔",
      eligibilityEn: "Intermediate or Hifz certificate with 50% marks; basic Arabic reading required.",
      eligibilityUr: "انٹرمیڈیٹ یا حفظ سرٹیفکیٹ 50 فیصد نمبروں کے ساتھ؛ عربی پڑھنے کی بنیادی صلاحیت ضروری۔",
      careersEn: "Tafseer teaching, Quran translation, Islamic publishing, education management.",
      careersUr: "تدریسِ تفسیر، ترجمۂ قرآن، اسلامی اشاعت، تعلیمی انتظام۔",
      feePerYear: 92000, icon: "quran",
      curriculum: curriculum([
        ["Quranic Arabic I", "Tafseer: Juz 1–5", "Recitation & Tajweed", "Uloom ul Quran"],
        ["Quranic Arabic II", "Tafseer: Juz 6–12", "Sciences of Recitation", "Hadith Sciences"],
        ["Tafseer al-Kabeer", "Themes of the Quran", "Research Methods", "Elective"],
        ["Comparative Tafseer", "Dissertation", "Teaching Practicum"],
      ]),
    },
    {
      slug: "bs-hadith-seerah", titleEn: "BS Hadith & Seerah", titleUr: "بی ایس حدیث و سیرت",
      level: "Undergraduate", durationYears: "4", mode: "On campus", department: "Hadith",
      summaryEn: "Hadith sciences, textual criticism, the Seerah and the application of prophetic guidance today.",
      summaryUr: "علومِ حدیث، متن کی تنقید، سیرت اور نبوی رہنمائی کا عصری اطلاق۔",
      overviewEn: "Students study the six canonical collections, narrator criticism (jarh wa ta'deel), and the life of the Prophet ﷺ in depth, with attention to how Hadith informs law and ethics.",
      overviewUr: "طلبہ صحاح ستہ، جرح و تعدیل اور نبی کریم ﷺ کی سیرت کا گہرائی سے مطالعہ کرتے ہیں، اس بات پر توجہ کے ساتھ کہ حدیث فقہ اور اخلاق کو کیسے متعین کرتی ہے۔",
      eligibilityEn: "Intermediate / Alimiyyah with 50% marks and Arabic reading ability.",
      eligibilityUr: "انٹرمیڈیٹ / عالمیت 50 فیصد نمبروں اور عربی پڑھنے کی صلاحیت کے ساتھ۔",
      careersEn: "Lecturing, Seerah research, chaplaincy, publishing, community education.",
      careersUr: "لیکچرنگ، سیرت پر تحقیق، چپلینسی، اشاعت، سماجی تعلیم۔",
      feePerYear: 92000, icon: "scroll",
      curriculum: curriculum([
        ["Hadith Terminology", "Seerah: Makkah Period", "Arabic", "Fiqh: Worship"],
        ["Sahih Bukhari I", "Seerah: Madinah Period", "Narrator Criticism", "Aqeedah"],
        ["Sahih Muslim", "Sunan & Legal Hadith", "Research Methods", "Elective"],
        ["Applied Hadith", "Dissertation", "Teaching Practicum"],
      ]),
    },
    {
      slug: "bs-fiqh-shariah", titleEn: "BS Fiqh & Islamic Law", titleUr: "بی ایس فقہ و اسلامی قانون",
      level: "Undergraduate", durationYears: "4", mode: "On campus", department: "Fiqh & Shariah",
      summaryEn: "Hanafi fiqh, usul al-fiqh, family law and a comparative introduction to the other schools.",
      summaryUr: "فقہ حنفی، اصولِ فقہ، عائلی قانون اور دیگر فقہی مکاتب کا تقابلی تعارف۔",
      overviewEn: "Designed for future muftis and legal professionals, this programme covers worship, transactions, family law, and the methodology of deriving rulings, with moot-court style practice.",
      overviewUr: "یہ پروگرام مستقبل کے مفتیان اور قانونی ماہرین کے لیے ہے: عبادات، معاملات، عائلی قانون اور استنباطِ حکم کا طریقہ، عملی مشق کے ساتھ۔",
      eligibilityEn: "Intermediate or Alimiyyah with 55% marks; entry test and interview.",
      eligibilityUr: "انٹرمیڈیٹ یا عالمیت 55 فیصد نمبروں کے ساتھ؛ داخلہ ٹیسٹ اور انٹرویو۔",
      careersEn: "Darul Ifta research, legal advisory, Islamic finance compliance, teaching.",
      careersUr: "تحقیقِ دارالافتاء، قانونی مشاورت، اسلامی مالیات کی تعمیل، تدریس۔",
      feePerYear: 104000, icon: "scale",
      curriculum: curriculum([
        ["Fiqh ul Ibadat", "Arabic Grammar", "Usul al-Fiqh I", "Quranic Sciences"],
        ["Fiqh ul Muamalat", "Usul al-Fiqh II", "Family Law", "Hadith Sciences"],
        ["Islamic Criminal Law", "Contemporary Fiqh Issues", "Legal Research", "Elective"],
        ["Fatwa Workshop", "Dissertation", "Court Practice"],
      ]),
    },
    {
      slug: "alimiyyah", titleEn: "Alimiyyah (Dars-e-Nizami)", titleUr: "عالمیت (درسِ نظامی)",
      level: "Alimiyyah", durationYears: "7", mode: "On campus", department: "Alimiyyah",
      summaryEn: "The classical eight-year sequence condensed over seven years with Arabic, Fiqh, Hadith and Tafseer.",
      summaryUr: "کلاسیکی آٹھ سالہ نصاب سات سالوں میں، عربی، فقہ، حدیث اور تفسیر کے ساتھ۔",
      overviewEn: "The flagship residential programme of the university. Students progress from Arabic grammar to the full Dars-e-Nizami curriculum, graduating as Alims prepared for teaching, fatwa and community service.",
      overviewUr: "یونیورسٹی کا مرکزی رہائشی پروگرام۔ طلبہ عربی گرامر سے شروع کر کے مکمل درسِ نظامی تک پہنچتے ہیں اور عالم بن کر تدریس، فتویٰ اور سماجی خدمت کے لیے تیار ہوتے ہیں۔",
      eligibilityEn: "Matriculation and Quran reading fluency; interview and aptitude assessment.",
      eligibilityUr: "میٹرک اور قرآن کی روانی سے تلاوت؛ انٹرویو اور صلاحیت کا جائزہ۔",
      careersEn: "Imamah, teaching, Darul Ifta, madrasah leadership, welfare work.",
      careersUr: "امامت، تدریس، دارالافتاء، مدرسہ قیادت، فلاحی کام۔",
      feePerYear: 0, icon: "mosque",
      curriculum: curriculum([
        ["Arabic Morphology", "Grammar", "Fiqh", "Tajweed"],
        ["Arabic Literature", "Logic", "Fiqh", "Hadith Primer"],
        ["Rhetoric", "Philosophy", "Usul al-Fiqh", "Tafseer"],
        ["Hadith Year I", "Fiqh", "Seerah", "Elective"],
        ["Hadith Year II", "Tafseer", "Aqeedah", "Elective"],
        ["Hadith Year III", "Fatwa Training", "Research", "Practicum"],
        ["Takhasus", "Teaching Residency", "Community Placement"],
      ]),
    },
    {
      slug: "hifz-tajweed", titleEn: "Hifz & Tajweed Certificate", titleUr: "حفظ و تجوید سرٹیفکیٹ",
      level: "Certificate", durationYears: "2", mode: "On campus (residential)", department: "Quran",
      summaryEn: "Structured memorisation and tajweed with daily recitation circles and individual correction.",
      summaryUr: "منظم حفظ و تجوید، روزانہ تلاوت حلقوں اور انفرادی اصلاح کے ساتھ۔",
      overviewEn: "A residential certificate for students seeking complete memorisation or refinement of recitation. Each student follows a personal memorisation plan with weekly assessment.",
      overviewUr: "رہائشی سرٹیفکیٹ ان طلبہ کے لیے جو مکمل حفظ یا تلاوت کی اصلاح چاہتے ہیں۔ ہر طالب علم کا ذاتی منصوبہ اور ہفتہ وار جائزہ۔",
      eligibilityEn: "Age 12+; fluent Quran reading; parent/guardian consent for residential students.",
      eligibilityUr: "عمر 12 سال سے زائد؛ قرآن روانی سے پڑھنا؛ رہائشی طلبہ کے لیے سرپرست کی رضامندی۔",
      careersEn: "Quran teaching, imamah, hifz supervision, Naat and recitation performance.",
      careersUr: "قرآن تدریس، امامت، نگرانیِ حفظ، نعت و تلاوت۔",
      feePerYear: 54000, icon: "recite",
      curriculum: curriculum([
        ["Tajweed Rules", "Hifz Plan I", "Daily Recitation", "Islamic Manners"],
        ["Advanced Tajweed", "Hifz Plan II", "Revision Circles", "Quranic Vocabulary"],
      ]),
    },
    {
      slug: "bs-arabic", titleEn: "BS Arabic Language & Literature", titleUr: "بی ایس عربی زبان و ادب",
      level: "Undergraduate", durationYears: "4", mode: "On campus", department: "Arabic",
      summaryEn: "Classical and modern Arabic, grammar, rhetoric, literature and translation practice.",
      summaryUr: "کلاسیکی و جدید عربی، گرامر، بلاغت، ادب اور ترجمے کی مشق۔",
      overviewEn: "For students who want professional Arabic fluency. The programme combines grammar (nahw/sarf), literature, rhetoric and translation workshops, with a modern standard Arabic component.",
      overviewUr: "ان طلبہ کے لیے جو پیشہ ورانہ عربی روانی چاہتے ہیں۔ گرامر (نحو/صرف)، ادب، بلاغت اور ترجمہ ورکشاپ کے ساتھ جدید معیاری عربی بھی شامل ہے۔",
      eligibilityEn: "Intermediate with 50% marks; Arabic aptitude test.",
      eligibilityUr: "انٹرمیڈیٹ 50 فیصد نمبروں کے ساتھ؛ عربی صلاحیت کا ٹیسٹ۔",
      careersEn: "Translation, interpretation, diplomacy, international NGOs, publishing.",
      careersUr: "ترجمہ، تفسیرِ زبان، سفارت کاری، بین الاقوامی این جی اوز، اشاعت۔",
      feePerYear: 88000, icon: "globe",
      curriculum: curriculum([
        ["Arabic Morphology", "Grammar I", "Reading & Comprehension", "Islamic Culture"],
        ["Grammar II", "Classical Literature", "Composition", "Phonetics"],
        ["Rhetoric", "Modern Arabic Prose", "Translation Workshop", "Elective"],
        ["Modern Poetry", "Advanced Translation", "Research", "Dissertation"],
      ]),
    },
    {
      slug: "diploma-islamic-finance", titleEn: "Diploma in Islamic Finance", titleUr: "ڈپلومہ ان اسلامی مالیات",
      level: "Diploma", durationYears: "1", mode: "Evening / hybrid", department: "Fiqh & Shariah",
      summaryEn: "One-year evening diploma covering Murabaha, Musharakah, Sukuk, Takaful and Shariah audit.",
      summaryUr: "ایک سالہ شام کا ڈپلومہ: مرابحہ، مشارکہ، صکوک، تکافل اور شریعت آڈٹ۔",
      overviewEn: "A professional evening diploma for bankers, accountants and entrepreneurs. Taught by Muftis and practitioners, it covers contracts, risk sharing, Shariah governance and live case studies.",
      overviewUr: "بینکاروں، اکاؤنٹنٹس اور کاروباری افراد کے لیے پیشہ ورانہ شام کا ڈپلومہ۔ مفتیان اور ماہرین پڑھاتے ہیں: عقود، تقسیمِ خطرہ، شریعت گورننس اور عملی کیس اسٹڈیز۔",
      eligibilityEn: "Bachelor's degree or relevant professional experience; interview.",
      eligibilityUr: "بیچلر ڈگری یا متعلقہ پیشہ ورانہ تجربہ؛ انٹرویو۔",
      careersEn: "Islamic banking, Shariah compliance, Takful, halal business advisory.",
      careersUr: "اسلامی بینکاری، شریعت تعمیل، تکافل، حلال کاروباری مشاورت۔",
      feePerYear: 78000, icon: "coins",
      curriculum: curriculum([
        ["Fiqh ul Muamalat", "Islamic Banking Operations", "Shariah Governance", "Capstone Case Study"],
      ]),
    },
  ]);

  /* ---------------- Events ---------------- */
  await db.insert(events).values([
    {
      slug: "annual-ijtema-2027", titleEn: "Annual Ijtema 2027", titleUr: "سالانہ اجتماع 2027",
      descriptionEn: "Three days of Quran, Hadith and Seerah sessions with scholars from across Pakistan, plus a youth programme and communal meals.",
      descriptionUr: "پاکستان بھر کے علماء کے ساتھ تین روزہ قرآن، حدیث اور سیرت کی مجالس، نوجوانوں کے پروگرام اور اجتماعی کھانے۔",
      type: "Ijtema", venueEn: "Main Campus, Canal Road, Lahore", venueUr: "مین کیمپس، کینال روڈ، لاہور",
      startAt: at(24, 9), endAt: at(26, 18), coverImage: IMAGES.campusHero,
      liveStreamUrl: null,
      speakers: [
        { nameEn: "Mufti Abdul Rahman", nameUr: "مفتی عبدالرحمٰن" },
        { nameEn: "Dr. Aisha Karim", nameUr: "ڈاکٹر عائشہ کریم" },
        { nameEn: "Qari Muhammad Yasir", nameUr: "قاری محمد یاسر" },
      ],
      schedule: [
        { time: "09:00", en: "Quran recitation & opening", ur: "تلاوتِ قرآن و افتتاح" },
        { time: "11:00", en: "Hadith and community life", ur: "حدیث اور اجتماعی زندگی" },
        { time: "16:30", en: "Youth programme", ur: "نوجوانوں کا پروگرام" },
      ],
    },
    {
      slug: "seerah-conference", titleEn: "Seerah Conference", titleUr: "سیرت کانفرنس",
      descriptionEn: "A one-day conference on the Prophet's ﷺ model of community building, with parallel Urdu and English sessions.",
      descriptionUr: "نبی کریم ﷺ کے معاشرتی نمونے پر ایک روزہ کانفرنس، اردو و انگریزی متوازی سیشنوں کے ساتھ۔",
      type: "Lecture", venueEn: "Aisha Hall, Main Campus", venueUr: "عائشہ ہال، مین کیمپس",
      startAt: at(-1, 9), endAt: at(1, 17), coverImage: IMAGES.calligraphy,
      liveStreamUrl: "https://www.youtube.com/embed/videoseries?list=PLplaceholder",
      speakers: [{ nameEn: "Dr. Aisha Karim", nameUr: "ڈاکٹر عائشہ کریم" }],
      schedule: [{ time: "10:00", en: "Keynote address", ur: "کلیدی خطاب" }],
    },
    {
      slug: "khatm-e-bukhari", titleEn: "Khatm-e-Bukhari Ceremony", titleUr: "ختمِ بخاری تقریب",
      descriptionEn: "Completion of Sahih Bukhari by the final-year Hadith cohort, followed by du'a and a community meal.",
      descriptionUr: "حدیث کے آخری سال کے طلبہ کی صحیح بخاری مکمل ہونے پر تقریب، دعا اور اجتماعی کھانے کے ساتھ۔",
      type: "Lecture", venueEn: "Jamia Masjid, Main Campus", venueUr: "جامع مسجد، مین کیمپس",
      startAt: at(12, 10), endAt: at(12, 13), coverImage: IMAGES.books,
      speakers: [{ nameEn: "Mufti Abdul Rahman", nameUr: "مفتی عبدالرحمٰن" }],
    },
    {
      slug: "convocation-2026", titleEn: "Convocation 2026", titleUr: "کانووکیشن 2026",
      descriptionEn: "Over 380 graduates from Islamic Studies, Hadith and Fiqh programmes received their degrees.",
      descriptionUr: "اسلامی علوم، حدیث اور فقہ کے 380 سے زیادہ فارغ التحصیل طلبہ کو اسناد عطا ہوئیں۔",
      type: "Graduation", venueEn: "Al-Noor Convocation Ground", venueUr: "النور کانووکیشن گراؤنڈ",
      startAt: at(-120, 9), endAt: at(-120, 15), coverImage: IMAGES.graduation,
      speakers: [{ nameEn: "Chancellor Dr. Muhammad Iqbal", nameUr: "چانسلر ڈاکٹر محمد اقبال" }],
    },
    {
      slug: "ramadan-tafseer-series", titleEn: "Ramadan Tafseer Series", titleUr: "رمضان تفسیر سیریز",
      descriptionEn: "Thirty nightly tafseer sessions streamed live and archived in the digital library.",
      descriptionUr: "تیس روزہ تفسیر کے سیشن، لائیو اور ڈیجیٹل لائبریری میں محفوظ۔",
      type: "Ramadan", venueEn: "Jamia Masjid & live stream", venueUr: "جامع مسجد اور لائیو اسٹریم",
      startAt: at(-210, 20), endAt: at(-181, 22), coverImage: IMAGES.quran,
      speakers: [{ nameEn: "Dr. Aisha Karim", nameUr: "ڈاکٹر عائشہ کریم" }],
    },
    {
      slug: "qurbani-distribution-2026", titleEn: "Qurbani Distribution 2026", titleUr: "قربانی تقسیم 2026",
      descriptionEn: "Meat from 14 cows distributed to 1,900 families across four districts with the welfare team.",
      descriptionUr: "14 گایوں کا گوشت فلاحی ٹیم کے ساتھ چار اضلاع کے 1,900 خاندانوں میں تقسیم کیا گیا۔",
      type: "Qurbani", venueEn: "University Farm & Lahore districts", venueUr: "یونیورسٹی فارم اور لاہور کے اضلاع",
      startAt: at(-300, 8), endAt: at(-299, 18), coverImage: IMAGES.cow2,
      speakers: [{ nameEn: "Hafiz Bilal Ahmed", nameUr: "حافظ بلال احمد" }],
    },
    {
      slug: "arabic-calligraphy-workshop", titleEn: "Arabic Calligraphy Workshop", titleUr: "عربی خطاطی ورکشاپ",
      descriptionEn: "A hands-on introduction to Thuluth script for students and staff. Materials provided.",
      descriptionUr: "طلبہ و اسٹاف کے لیے ثلث خط کی عملی ورکشاپ۔ سامان فراہم کیا جائے گا۔",
      type: "Workshop", venueEn: "Arts Studio, Block C", venueUr: "آرٹس اسٹوڈیو، بلاک سی",
      startAt: at(40, 14), endAt: at(40, 17), coverImage: IMAGES.calligraphy,
    },
  ]);

  /* ---------------- Gallery ---------------- */
  const galleryBase: Array<[string, string, string, number, string]> = [
    [IMAGES.graduation, "Convocation 2026: graduates with their families", "کانووکیشن 2026: فارغ التحصیل طلبہ اپنے خاندانوں کے ساتھ", 2026, "Graduation"],
    [IMAGES.campus, "Autumn on the main campus lawn", "مین کیمپس کے لان پر خزاں", 2026, "Ijtema"],
    [IMAGES.library, "The newly extended reading room", "نئے بڑھائے گئے ریڈنگ روم", 2026, "Workshop"],
    [IMAGES.quran, "Tajweed sitting in the Quran hall", "قرآن ہال میں تجوید کی نشست", 2026, "Ramadan"],
    [IMAGES.books, "Library shelf: Hadith collection", "کتب خانے کی الماری: کتبِ حدیث", 2026, "Workshop"],
    [IMAGES.campusModern, "New academic block, north courtyard", "نیا تعلیمی بلاک، شمالی صحن", 2025, "Ijtema"],
    [IMAGES.cow2, "Qurbani 2026: cattle inspection at the farm", "قربانی 2026: فارم پر جانوروں کا معائنہ", 2026, "Qurbani"],
    [IMAGES.calligraphy, "Calligraphy exhibition, Block C", "خطاطی نمائش، بلاک سی", 2025, "Workshop"],
    [IMAGES.campusAlt, "Graduation marquee on the east lawn", "مشرقی لان پر کانووکیشن کا شامیانہ", 2026, "Graduation"],
    [IMAGES.cow4, "Distribution team loading dispatch boxes", "تقسیم ٹیم ڈسپیچ بکس لوڈ کرتے ہوئے", 2026, "Qurbani"],
    [IMAGES.campusTower, "Campus at Fajr", "فجر کے وقت کیمپس", 2025, "Ramadan"],
    [IMAGES.classroom, "Dars-e-Nizami class in session", "درسِ نظامی کا سبق جاری", 2026, "Lecture"],
    [IMAGES.oldBooks, "Manuscript collection in the archive", "آرکائیو میں مخطوطات کا ذخیرہ", 2025, "Workshop"],
    [IMAGES.cow6, "Vet team checking a cow before sale", "فروخت سے قبل ویٹ ٹیم گائے کی جانچ کرتے ہوئے", 2026, "Qurbani"],
  ];
  await db.insert(galleryPhotos).values(
    galleryBase.map(([url, captionEn, captionUr, year, eventType], i) => ({
      url, captionEn, captionUr, year, eventType,
      venue: i % 2 === 0 ? "Main Campus" : "Al-Noor Farm",
      isCover: i === 0,
      createdAt: new Date(now - i * day),
    })),
  );

  /* ---------------- PDF library ---------------- */
  const pdfs = [
    ["khutbah-eid-adha-2026", "Eid ul Adha Khutbah 2026", "عید الاضحیٰ خطبہ 2026", "Khutbat", "Mufti Abdul Rahman", "Urdu", "Qurbani", "The responsibilities of Qurbani and the rights of the poor.", "قربانی کے فرائض اور مستحقین کے حقوق۔", -40, 14, 940, null, null, "Qurbani"],
    ["khutbah-jumuah-taqwa", "Khutbah: The reality of Taqwa", "خطبہ: حقیقتِ تقویٰ", "Khutbat", "Mufti Abdul Rahman", "Urdu", "Daily Life", "A Friday sermon on taqwa as a way of seeing and living.", "تقویٰ کو زندگی اور نگاہ کا طریقہ سمجھنے پر جمعہ کا خطبہ۔", -62, 10, 720, null, null, "Salah"],
    ["khutbah-jumuah-amanah", "Khutbah: Amanah in public life", "خطبہ: اجتماعی زندگی میں امانت", "Khutbat", "Dr. Aisha Karim", "English", "Society", "Public trust, office and accountability in the light of Hadith.", "حدیث کی روشنی میں عوامی امانت، منصب اور جوابدہی۔", -75, 9, 610, null, null, "Business"],
    ["durus-quran-al-fatiha", "Durus-e-Quran: Al-Fatiha", "دروسِ قرآن: الفاتحہ", "Durus-e-Quran", "Dr. Aisha Karim", "Urdu", "Tafseer", "Verse-by-verse study of the opening surah and its place in prayer.", "سورۂ فاتحہ کا آیت بہ آیت مطالعہ اور نماز میں اس کا مقام۔", -20, 24, 1420, "Al-Fatiha", null, null],
    ["durus-quran-al-baqarah-1", "Durus-e-Quran: Al-Baqarah 1–20", "دروسِ قرآن: البقرہ 1–20", "Durus-e-Quran", "Mufti Abdul Rahman", "Urdu", "Tafseer", "Guidance, hypocrisy and sincerity in the opening passages of Al-Baqarah.", "البقرہ کے ابتدائی حصے میں ہدایت، نفاق اور اخلاص۔", -34, 32, 1980, "Al-Baqarah", null, null],
    ["durus-quran-al-kahf", "Durus-e-Quran: Al-Kahf", "دروسِ قرآن: الکہف", "Durus-e-Quran", "Dr. Aisha Karim", "English", "Tafseer", "Four parables on faith, power, wealth and the end of time.", "ایمان، اقتدار، مال اور آخرت کے بارے میں چار مثالیں۔", -90, 28, 1720, "Al-Kahf", null, null],
    ["durus-hadith-bukhari-intentions", "Durus-e-Hadith: Actions and intentions", "دروسِ حدیث: اعمال کا دارومدار نیت پر", "Durus-e-Hadith", "Mufti Abdul Rahman", "Urdu", "Hadith", "The first hadith of Sahih Bukhari and the meaning of sincerity.", "صحیح بخاری کی پہلی حدیث اور اخلاص کا مفہوم۔", -15, 16, 980, null, "Sahih Bukhari", null],
    ["durus-hadith-riyad-us-salihin", "Durus-e-Hadith: Riyad us-Salihin selections", "دروسِ حدیث: ریاض الصالحین سے انتخاب", "Durus-e-Hadith", "Dr. Aisha Karim", "Urdu", "Hadith", "Selected chapters on patience, truthfulness and good character.", "صبر، سچائی اور حسنِ اخلاق پر منتخب ابواب۔", -45, 40, 2360, null, "Riyad us-Salihin", null],
    ["fiqh-masail-salah", "Fiqh Masail: Salah essentials", "فقہ مسائل: نماز کے ضروری مسائل", "Fiqh Masail", "Mufti Abdul Rahman", "Urdu", "Fiqh", "Common questions on timings, jama'ah, travel and missed prayers.", "اوقات، جماعت، سفر اور قضا نماز کے عام سوالات۔", -10, 22, 1180, null, null, "Salah"],
    ["fiqh-masail-zakat", "Fiqh Masail: Zakat on wealth", "فقہ مسائل: مال پر زکوٰۃ", "Fiqh Masail", "Mufti Abdul Rahman", "Urdu", "Fiqh", "Nisab, valuation, deductible debts and distributing Zakat correctly.", "نصاب، قیمت، قابلِ کٹوتی قرض اور زکوٰۃ کی درست تقسیم۔", -8, 26, 1320, null, null, "Zakat"],
    ["fiqh-masail-hajj", "Fiqh Masail: Hajj & Umrah", "فقہ مسائل: حج و عمرہ", "Fiqh Masail", "Mufti Abdul Rahman", "English", "Fiqh", "Rites, common mistakes and what to do when a rite is missed.", "مناسک، عام غلطیاں اور کسی رکن کے چھوٹ جانے کی صورت۔", -55, 30, 1560, null, null, "Hajj"],
    ["fiqh-masail-qurbani", "Fiqh Masail: Qurbani rules", "فقہ مسائل: قربانی کے مسائل", "Fiqh Masail", "Darul Ifta Board", "Urdu", "Fiqh", "Eligibility, animal conditions, sharing, timing and distribution.", "اہلیت، جانور کے شرایط، شرکت، وقت اور تقسیم۔", -5, 18, 1030, null, null, "Qurbani"],
    ["seerah-life-of-the-prophet", "The Seerah: A reader's companion", "سیرت النبی: قاری کی رہنما", "Seerah", "Dr. Aisha Karim", "English", "Seerah", "A readable narrative of the Prophet's ﷺ life with source references.", "نبی کریم ﷺ کی حیاتِ مبارکہ کا آسان بیانیہ، حوالہ جات کے ساتھ۔", -150, 96, 4820, null, null, null],
    ["naat-collection-2026", "Naat collection 2026", "نعت مجموعہ 2026", "Naat", "Students of Al-Noor", "Urdu", "Naat", "Selected naats recited at university gatherings this year.", "اس سال یونیورسٹی کی محافل میں پڑھی گئی منتخب نعتیں۔", -28, 44, 2640, null, null, null],
    ["prospectus-2027", "Prospectus 2027", "پراسپیکٹس 2027", "Prospectus", "Admissions Office", "English", "Admissions", "Programmes, fees, campus facilities and admission requirements.", "پروگرام، فیس، کیمپس سہولیات اور داخلہ شرائط۔", -2, 48, 3240, null, null, null],
    ["admission-form-2027", "Admission form 2027 (printable)", "داخلہ فارم 2027 (قابلِ پرنٹ)", "Prospectus", "Admissions Office", "English", "Admissions", "Printable application form with document checklist.", "قابلِ پرنٹ درخواست فارم، دستاویزات کی فہرست کے ساتھ۔", -2, 4, 240, null, null, null],
    ["bayan-parenting", "Bayan: Raising children with faith", "بیان: ایمان کے ساتھ بچوں کی تربیت", "Bayans", "Mufti Abdul Rahman", "Urdu", "Family", "Practical guidance for parents from Quran and Sunnah.", "قرآن و سنت سے والدین کے لیے عملی رہنمائی۔", -70, 34, 1680, null, null, null],
  ] as const;

  await db.insert(pdfResources).values(
    pdfs.map(([slug, titleEn, titleUr, category, speaker, language, tags, summaryEn, summaryUr, offset, pages, size, surah, book, topic], index) => ({
      slug, titleEn, titleUr, category, speaker, language,
      tags: [tags],
      summaryEn, summaryUr,
      pages, fileSizeKb: size,
      resourceDate: new Date(now + offset * day),
      publishedAt: new Date(now + offset * day),
      downloads: 140 + ((index * 37) % 480),
      status: index === 15 ? "draft" : "published",
      fileUrl: `/api/pdf/library/${slug}`,
      surah, book, topic,
    })),
  );

  /* ---------------- Fatawa ---------------- */
  await db.insert(fatawa).values([
    {
      slug: "zakat-on-savings",
      fatwaNumber: "DI-2027-0142", category: "Zakat & Sadaqah",
      questionEn: "I have savings in a bank account and gold jewellery. How do I calculate Zakat, and when is it due?",
      questionUr: "میرے بینک اکاؤنٹ میں بچت اور سونے کے زیورات ہیں۔ میں زکوٰۃ کیسے حساب کروں اور اس کی ادائیگی کا وقت کیا ہے؟",
      answerEn: "Zakat becomes due on wealth that reaches the nisab (the value of 87.48 grams of gold or 612.36 grams of silver) and completes one lunar year in your ownership. Add cash, bank balances, gold and silver, business stock and receivables; subtract immediate debts. Pay 2.5% of the total. Zakat on gold is calculated by market value, not the purchase price. It is recommended to fix a lunar date each year for calculation. If a year passes without paying, the obligation remains and should be fulfilled without delay.\n\nFor wealth used in trade, value at the current market price. Personal jewellery within normal use is a debated matter; the Hanafi position held by this Darul Ifta is that gold and silver in any form are zakatable.",
      answerUr: "زکوٰۃ اس مال پر واجب ہوتی ہے جو نصاب (ساڑھے سات تولہ سونا یا ساڑھے باون تولہ چاندی کی قیمت) کو پہنچ جائے اور ملکیت میں ایک قمری سال گزر جائے۔ نقدی، بینک بیلنس، سونا، چاندی، تجارتی مال اور وصولیوں کو جمع کریں اور فوری قرض منہا کریں۔ کل کا ڈھائی فیصد ادا کریں۔ سونے کی زکوٰۃ بازار قیمت سے ہے، خرید قیمت سے نہیں۔ ہر سال ایک قمری تاریخ مقرر کرنا مستحسن ہے۔ اگر سال گزر جائے تو زکوٰۃ ساقط نہیں ہوتی، بغیر تاخیر ادا کی جائے۔\n\nتجارتی مال موجودہ بازار قیمت پر شمار ہوگا۔ عام استعمال کے زیورات میں اختلاف ہے؛ اس دارالافتاء کا فقہ حنفی کے مطابق موقف یہ ہے کہ ہر صورت میں سونا اور چاندی قابلِ زکوٰۃ ہیں۔",
      references: [
        "Quran: Al-Baqarah 2:110",
        "Hadith: Sahih Bukhari 1454 (nisab of silver)",
        "Al-Hidayah, Kitab al-Zakat",
      ],
      muftiName: "Mufti Abdul Rahman", approvedBy: "Mufti Abdul Rahman (Darul Ifta Board)",
      approvedAt: at(-4), publishedAt: at(-4), askDate: at(-12),
    },
    {
      slug: "qurbani-shares-and-timing",
      fatwaNumber: "DI-2027-0143", category: "Qurbani",
      questionEn: "Can seven people share one cow, and what is the time for slaughtering? Is a share valid if the payment is made late?",
      questionUr: "کیا سات افراد ایک گائے میں شریک ہو سکتے ہیں اور ذبح کا وقت کیا ہے؟ دیر سے ادائیگی کی صورت میں حصہ درست ہوگا؟",
      answerEn: "Yes. A cow, buffalo or camel may be shared by up to seven people, and each share carries the ruling of a full sacrifice. A goat or sheep is sufficient for one person only. The time for Qurbani begins after the Eid prayer in the locality of the person offering it and ends at sunset on the 12th of Dhul Hijjah. Slaughter before the Eid prayer is not valid as Qurbani. Payment timing does not affect the validity of the sacrifice itself, provided the sacrifice is offered on behalf of the person with his permission; however, the institution's own terms must be followed for booking and refunds.",
      answerUr: "جی ہاں۔ گائے، بھینس یا اونٹ میں زیادہ سے زیادہ سات افراد شریک ہو سکتے ہیں اور ہر حصہ ایک مستقل قربانی کا حکم رکھتا ہے۔ بکری یا بھیڑ ایک شخص کی طرف سے کافی ہے۔ قربانی کا وقت قربانی کرنے والے کے علاقے میں نمازِ عید کے بعد شروع ہوتا ہے اور 12 ذی الحجہ کے غروبِ آفتاب تک رہتا ہے۔ نمازِ عید سے پہلے ذبح قربانی شمار نہیں ہوگا۔ ادائیگی کے وقت کا قربانی کی درستگی سے تعلق نہیں، بشرطیکہ مالک کی اجازت سے ہو؛ تاہم ادارے کی بکنگ و واپسی کی شرائط لازم ہوں گی۔",
      references: ["Quran: Al-Hajj 22:28", "Hadith: Sahih Muslim 1961", "Badai' us-Sanai'"],
      muftiName: "Mufti Abdul Rahman", approvedBy: "Mufti Abdul Rahman (Darul Ifta Board)",
      approvedAt: at(-7), publishedAt: at(-7), askDate: at(-15),
    },
    {
      slug: "missed-prayers-during-travel",
      fatwaNumber: "DI-2027-0139", category: "Salah",
      questionEn: "I travel for work regularly. Can I shorten my prayers, and what do I do about prayers I missed years ago?",
      questionUr: "میں کام کے سفر پر رہتا ہوں۔ کیا نماز قصر کر سکتا ہوں اور برسوں پہلے چھوڑی ہوئی نمازوں کا کیا حکم ہے؟",
      answerEn: "A traveller who intends to stay less than fifteen days at a destination and covers the distance of travel (approximately 77 km) may shorten the four-rak'ah prayers to two. Zuhr, Asr and Isha are shortened; Fajr, Maghrib and Sunnah mu'akkadah are not. If you intend to stay fifteen days or more, you are a resident and pray in full.\n\nMissed prayers remain a debt. Make them up (qada) as soon as possible and seek forgiveness. It is recommended to make a practical schedule, for example making up one day's prayers each week. This is a general answer; complicated travel patterns should be put to the Darul Ifta with your specific schedule.",
      answerUr: "مسافر جو کسی مقام پر پندرہ دن سے کم قیام کا ارادہ رکھے اور سفر کی مسافت (تقریباً 77 کلومیٹر) طے کرے، وہ چار رکعت والی نمازیں دو رکعت قصر کر سکتا ہے۔ ظہر، عصر اور عشاء قصر ہوں گی؛ فجر، مغرب اور سنت مؤکدہ نہیں۔ اگر پندرہ دن یا زیادہ قیام کا ارادہ ہو تو مقیم کی طرح پوری نماز پڑھیں۔\n\nچھوٹی ہوئی نمازیں قرض رہتی ہیں۔ جلد قضا ادا کریں اور استغفار کریں۔ عملی شیڈول بنانا مستحسن ہے، مثلاً ہر ہفتے ایک دن کی نمازیں قضا۔ یہ عمومی جواب ہے؛ پیچیدہ سفری معمولات کے لیے اپنا شیڈول دے کر دارالافتاء سے رجوع کریں۔",
      references: ["Quran: An-Nisa 4:101", "Hadith: Sahih Bukhari 1103", "Radd al-Muhtar, Kitab as-Salah"],
      muftiName: "Mufti Abdul Rahman", approvedBy: "Mufti Abdul Rahman (Darul Ifta Board)",
      approvedAt: at(-14), publishedAt: at(-14), askDate: at(-25),
    },
    {
      slug: "zakat-on-business-stock",
      fatwaNumber: "DI-2027-0131", category: "Business",
      questionEn: "Our shop holds stock purchased on credit. How is Zakat calculated and are supplier debts deducted?",
      questionUr: "ہماری دکان میں ادھار پر خریدا گیا مال موجود ہے۔ زکوٰۃ کیسے حساب ہوگی اور سپلائر کے قرض کٹیں گے؟",
      answerEn: "Business stock is valued at its current market selling price, including stock purchased on credit. Debts owed to suppliers that are due immediately may be deducted, along with other immediate liabilities; long-term liabilities are generally not deducted in full. Add receivables that you expect to recover. If the resulting net value reaches the nisab and a lunar year has passed, pay 2.5%. Because the details vary by trade, we recommend presenting your balance sheet to the Darul Ifta for a written ruling.",
      answerUr: "تجارتی مال موجودہ بازار فروخت قیمت پر شمار ہوگا، بشمول ادھار پر خریدا گیا مال۔ سپلائر کے فوری واجب الادا قرض منہا ہو سکتے ہیں، دیگر فوری واجبات کے ساتھ؛ طویل مدتی واجبات عام طور پر پوری طرح منہا نہیں ہوتے۔ وصول ہونے والی رقوم شامل کریں۔ اگر خالص قیمت نصاب کو پہنچے اور قمری سال گزرے تو ڈھائی فیصد ادا کریں۔ تفصیلات کاروبار کے مطابق مختلف ہیں، اس لیے بیلنس شیٹ کے ساتھ تحریری فتویٰ کے لیے دارالافتاء سے رجوع کریں۔",
      references: ["Quran: Al-Baqarah 2:267", "Al-Mabsut, Kitab al-Zakat"],
      muftiName: null, approvedBy: "Mufti Abdul Rahman (Darul Ifta Board)",
      approvedAt: at(-30), publishedAt: at(-30), askDate: at(-45),
    },
    {
      slug: "marriage-without-guardian",
      fatwaNumber: "DI-2027-0128", category: "Marriage & Family",
      questionEn: "Is a marriage valid without the presence of a wali (guardian), and what are the conditions for witnesses?",
      questionUr: "کیا ولی کی موجودگی کے بغیر نکاح درست ہے اور گواہوں کی کیا شرائط ہیں؟",
      answerEn: "In the Hanafi school, the marriage of an adult woman of sound mind is valid without a wali, though involving the guardian is strongly recommended and protects the family relationship. For a valid marriage you need offer and acceptance in the presence of two adult Muslim witnesses (male, or one man and two women in some narrations regarding testimony), with no fixed waiting period. The dower (mahr) must be specified. We advise families to complete the nikah through a registered nikah registrar so that the union is legally documented in Pakistan. Serious disputes and coercion should be referred to the Darul Ifta or the courts.",
      answerUr: "فقہ حنفی میں بالغہ عاقلہ عورت کا نکاح ولی کی موجودگی کے بغیر بھی درست ہے، تاہم ولی کو شامل کرنا بہت مستحسن اور خاندانی تعلق کی حفاظت کا ذریعہ ہے۔ درست نکاح کے لیے ایجاب و قبول، دو بالغ مسلم گواہوں کی موجودگی میں، اور مہر کی تعیین ضروری ہے۔ خاندانوں کو مشورہ ہے کہ نکاح رجسٹرڈ نکاح رجسٹرار کے ذریعے کروائیں تاکہ قانونی دستاویز موجود ہو۔ سنگین جھگڑے یا جبر کی صورت میں دارالافتاء یا عدالت سے رجوع کریں۔",
      references: ["Quran: An-Nisa 4:4", "Al-Hidayah, Kitab an-Nikah"],
      muftiName: "Mufti Abdul Rahman", approvedBy: "Mufti Abdul Rahman (Darul Ifta Board)",
      approvedAt: at(-52), publishedAt: at(-52), askDate: at(-60),
    },
    {
      slug: "inheritance-share-of-daughters",
      fatwaNumber: "DI-2027-0119", category: "Inheritance",
      questionEn: "How is the estate distributed among a widow, two sons and one daughter?",
      questionUr: "ایک بیوہ، دو بیٹوں اور ایک بیٹی کے درمیان ترکہ کیسے تقسیم ہوگا؟",
      answerEn: "After paying funeral expenses, debts and one-third of one's wealth by will (if any), the widow receives one-eighth (1/8) of the remaining estate. The residue is then divided among the children with each son receiving twice the share of a daughter: with two sons and one daughter the residuary is five parts, each son gets two parts and the daughter one part. Registered property and bank accounts should be transferred through the prescribed legal procedure. This is a general answer; for a specific estate, provide exact assets and liabilities to the Darul Ifta for a written calculation.",
      answerUr: "جنازہ کے اخراجات، قرض اور (اگر ہو) ایک تہائی وصیت ادا کرنے کے بعد بیوہ کو باقی ترکہ کا آٹھواں حصہ (1/8) ملے گا۔ پھر بقیہ اولاد میں تقسیم ہوگا، بیٹے کو بیٹی سے دوگنا: دو بیٹوں اور ایک بیٹی کی صورت میں یہ حصے پانچ ہیں، ہر بیٹے کو دو اور بیٹی کو ایک۔ رجسٹرڈ جائیداد اور بینک اکاؤنٹس قانونی طریقہ کار سے منتقل کریں۔ یہ عمومی جواب ہے؛ مخصوص ترکہ کے لیے درست اثاثے و واجبات کے ساتھ دارالافتاء سے تحریری حساب لیں۔",
      references: ["Quran: An-Nisa 4:11–12", "Al-Mughni, Kitab al-Faraid"],
      muftiName: null, approvedBy: "Mufti Abdul Rahman (Darul Ifta Board)",
      approvedAt: at(-80), publishedAt: at(-80), askDate: at(-90),
    },
    {
      slug: "halal-investment-screening",
      fatwaNumber: "DI-2027-0111", category: "Halal & Haram",
      questionEn: "Are shares in companies with a small portion of interest-based income permissible to buy?",
      questionUr: "کیا ایسی کمپنیوں کے حصص خریدنا جائز ہے جن کی معمولی آمدنی سود پر مبنی ہو؟",
      answerEn: "The Darul Ifta follows the position that investment in companies whose core business is lawful is permitted, provided the interest-based income is incidental and below the accepted threshold (commonly one-third, though our recommended screen is 5% of total income). The shareholder should purify the dividend attributable to that income by giving it in charity without intending reward. Companies whose core business is haram (interest, gambling, alcohol, immorality) are not permissible regardless of screens. For screening a specific Shariah-compliant index, consult our Islamic Finance desk or your bank's Shariah advisor.",
      answerUr: "دارالافتاء کی رائے یہ ہے کہ جن کمپنیوں کا بنیادی کاروبار حلال ہے ان میں سرمایہ کاری جائز ہے، بشرطیکہ سودی آمدنی حاشیہ درجہ کی ہو اور مقرر حد سے کم ہو (عام طور پر ایک تہائی، ہماری تجویز کردہ حد کل آمدنی کا 5 فیصد ہے)۔ حصہ دار کو اس آمدنی کے حصے کو ثواب کی نیت کے بغیر صدقہ کر دینا چاہیے۔ جن کمپنیوں کا بنیادی کاروبار حرام ہے (سود، جوا، شراب، بے حیائی) وہ کسی صورت جائز نہیں۔ مخصوص شریعت انڈیکس کے لیے ہمارے اسلامی مالیات ڈیسک سے رجوع کریں۔",
      references: ["Fiqh al-Buyu'", "AAOIFI Shariah Standard 21"],
      muftiName: "Mufti Abdul Rahman", approvedBy: "Mufti Abdul Rahman (Darul Ifta Board)",
      approvedAt: at(-100), publishedAt: at(-100), askDate: at(-110),
    },
    {
      slug: "fasting-and-illness",
      fatwaNumber: "DI-2027-0104", category: "Fasting",
      questionEn: "I have a chronic illness and cannot fast. What is the expiation (fidyah) and who should be fed?",
      questionUr: "مجھے دائمی بیماری ہے اور روزے نہیں رکھ سکتا۔ فدیہ کیا ہے اور کس کو کھلایا جائے؟",
      answerEn: "A person who is permanently unable to fast, and whose condition is confirmed by a trustworthy Muslim doctor, gives fidyah: one meal's worth (approximately 2 kg of wheat, or its value) for each missed fast, given to a poor person. Fidyah may be paid in advance for the whole month or at the end. If the illness is temporary, fasts are made up later instead. Missed fasts from years when you were healthy remain a debt and should be made up with fidyah for the delay in some views; present your medical situation to the Darul Ifta for a precise ruling.",
      answerUr: "جو شخص مستقل طور پر روزہ نہ رکھ سکتا ہو اور معتبر مسلم طبیب اس کی تصدیق کریں، وہ فدیہ دے: ہر چھوٹے روزے کے بدلے ایک کھانے کے برابر (تقریباً 2 کلو گندم یا اس کی قیمت)، کسی مستحق کو۔ فدیہ پورے مہینے کے لیے پیشگی یا آخر میں دیا جا سکتا ہے۔ اگر بیماری عارضی ہو تو بعد میں قضا رکھیں۔ جن سالوں میں آپ صحیح تھے ان کی قضا دین رہتی ہے؛ درست حکم کے لیے اپنی طبی حالت کے ساتھ دارالافتاء سے رجوع کریں۔",
      references: ["Quran: Al-Baqarah 2:184", "Sahih Bukhari 1950"],
      muftiName: "Mufti Abdul Rahman", approvedBy: "Mufti Abdul Rahman (Darul Ifta Board)",
      approvedAt: at(-120), publishedAt: at(-120), askDate: at(-130),
    },
  ]);

  /* ---------------- Fatwa question queue ---------------- */
  await db.insert(fatwaQuestions).values([
    { trackingNumber: "Q-2027-00871", name: "Private asker", contact: "+92 300 0000000", city: "Multan", category: "Zakat", question: "I received a bonus this month. Is Zakat due immediately on the whole amount or only at my annual date?", language: "en", priority: "urgent", status: "under_review", assignedTo: "Mufti Abdul Rahman", createdAt: at(-2) },
    { trackingNumber: "Q-2027-00872", contact: "asker@example.com", city: "Lahore", category: "Qurbani", question: "Can a whole cow be booked in one name for a deceased family members' combined intention?", language: "ur", priority: "urgent", status: "draft", createdAt: at(-1) },
    { trackingNumber: "Q-2027-00873", contact: "+92 301 1111111", city: "Karachi", category: "Business", question: "Is a late payment penalty from a supplier permissible if donated to charity?", language: "en", status: "approved", assignedTo: "Mufti Abdul Rahman", answerEn: "If the penalty is stipulated in the contract it is interest and must not be counted as income; if a supplier charges it without stipulation, it is a gift, and the recipient may keep it. Because the wording matters, please send the contract wording to the Darul Ifta.", createdAt: at(-4) },
    { trackingNumber: "Q-2027-00874", contact: "+92 333 2222222", city: "Rawalpindi", category: "Marriage", question: "Is a video call nikah valid when the parties are in different countries?", language: "en", status: "received", createdAt: at(-1) },
  ]);

  /* ---------------- Articles ---------------- */
  await db.insert(articles).values([
    { slug: "learning-arabic-for-quran", titleEn: "Learning Arabic to live with the Quran", titleUr: "قرآن کے ساتھ جینے کے لیے عربی سیکھنا", excerptEn: "Our Arabic department explains why grammar is a doorway, not a hurdle.", excerptUr: "ہمارا شعبہ عربی بتاتا ہے کہ گرامر رکاوٹ نہیں، دروازہ ہے۔", bodyEn: "Arabic opens the Quran to the reader in a way translation cannot. In this piece our faculty share a practical route: master the most frequent 300 words, learn the ten verb forms, then read a short surah with a teacher every week. Students in our BS Arabic programme follow the same sequence alongside literature.\n\nThe article includes a six-month study plan and a reading list available in the digital library.", bodyUr: "عربی قرآن کو اس طرح کھولتی ہے جیسے ترجمہ نہیں کر سکتا۔ اس مضمون میں ہمارے اساتذہ عملی راستہ بتاتے ہیں: سب سے زیادہ آنے والے 300 الفاظ یاد کریں، دس ابوابِ صرف سیکھیں، پھر ہر ہفتے استاد کے ساتھ ایک مختصر سورہ پڑھیں۔ بی ایس عربی کے طلبہ اسی ترتیب پر ادب کے ساتھ چلتے ہیں۔\n\nمضمون میں چھ ماہ کا مطالعاتی منصوبہ اور کتب خانے میں دستیاب کتابوں کی فہرست شامل ہے۔", image: IMAGES.library, category: "Academics", publishedAt: at(-6) },
    { slug: "zakat-that-changes-lives", titleEn: "Zakat that changes lives: a look at our scholarship fund", titleUr: "زکوٰۃ جو زندگیاں بدلتی ہے: ہمارے وظائف فنڈ پر ایک نظر", excerptEn: "How 214 students studied free last year, funded entirely by Zakat.", excerptUr: "گزشتہ سال 214 طلبہ نے مفت تعلیم پائی، مکمل طور پر زکوٰۃ سے۔", bodyEn: "Zakat is not charity; it is a right of the poor in the wealth of the wealthy. Our scholarship fund uses Zakat only for eligible students, covering tuition, meals and hostel. In the last academic year 214 students received support, and 62 graduated.\n\nThe fund is audited annually and reported in our audited reports section.", bodyUr: "زکوٰۃ احسان نہیں، مالداروں کے مال میں غریبوں کا حق ہے۔ ہمارا وظائف فنڈ زکوٰۃ صرف مستحق طلبہ پرخرچ کرتا ہے: فیس، کھانا اور ہاسٹل۔ گزشتہ تعلیمی سال 214 طلبہ کو معاونت ملی اور 62 فارغ التحصیل ہوئے۔\n\nفنڈ کا سالانہ آڈٹ ہوتا ہے اور رپورٹس میں شائع ہوتا ہے۔", image: IMAGES.quran, category: "Welfare", publishedAt: at(-18) },
    { slug: "qurbani-2027-whats-new", titleEn: "Qurbani 2027: what is new this year", titleUr: "قربانی 2027: اس سال نیا کیا ہے", excerptEn: "Live hissa tracking, instant receipts and vet-checked animals.", excerptUr: "لائیو حصص ٹریکنگ، فوری رسید اور ویٹرنری جانچ شدہ جانور۔", bodyEn: "This season the university farm has 14 cows, each divided into seven hissas. Every animal is examined by a veterinarian before sale and the vet status is visible on the board. Buyers receive an instant PDF receipt with a QR code to a private status page.\n\nBookings close before Eid ul Adha; unpaid holds release automatically after 30 minutes.", bodyUr: "اس سیزن یونیورسٹی فارم میں 14 گائیں ہیں، ہر ایک سات حصوں میں۔ ہر جانور فروخت سے پہلے ویٹرنری معائنے سے گزرتا ہے اور حالت بورڈ پر دکھائی جاتی ہے۔ خریدار کو فوری پی ڈی ایف رسید ملتی ہے جس میں نجی اسٹیٹس صفحے کا کیو آر کوڈ ہوتا ہے۔\n\nبکنگ عید الاضحیٰ سے پہلے بند ہوتی ہے؛ غیر ادا شدہ ہولڈز 30 منٹ بعد خودکار ختم ہو جاتے ہیں۔", image: IMAGES.cow2, category: "Qurbani", publishedAt: at(-2) },
  ]);

  /* ---------------- Testimonials ---------------- */
  await db.insert(testimonials).values([
    { name: "Muhammad Owais", roleEn: "Alumnus, BS Islamic Studies (2019)", roleUr: "فارغ التحصیل، بی ایس اسلامی علوم (2019)", quoteEn: "The halaqah style classes taught me how to think with evidence. I now teach in a school in Faisalabad and use the same method.", quoteUr: "حلقہ طرز کی کلاسوں نے مجھے دلیل کے ساتھ سوچنا سکھایا۔ اب فیصل آباد کے اسکول میں وہی طریقہ پڑھاتا ہوں۔" },
    { name: "Mrs. Farah Nadeem", roleEn: "Parent, Lahore", roleUr: "والدہ، لاہور", quoteEn: "The welfare office kept us informed every month about my daughter's scholarship and hostel. As a mother I felt respected.", quoteUr: "فلاح دفتر ہر ماہ میری بیٹی کے وظیفے اور ہاسٹل کی معلومات دیتا رہا۔ بحیثیت ماں مجھے عزت محسوس ہوئی۔" },
    { name: "Dr. Ayesha Sadiq", roleEn: "Alumna, Diploma in Islamic Finance", roleUr: "فارغ التحصیل، ڈپلومہ اسلامی مالیات", quoteEn: "The evening diploma fitted around my hospital shifts. The Shariah audit case studies were immediately useful at work.", quoteUr: "شام کا ڈپلومہ میری ہسپتال ڈیوٹی کے ساتھ موافق تھا۔ شریعت آڈٹ کے کیس اسٹڈیز کام میں فوراً کارآمد ثابت ہوئے۔" },
    { name: "Hafiz Zubair Ahmed", roleEn: "Alumnus, Hifz & Tajweed", roleUr: "فارغ التحصیل، حفظ و تجوید", quoteEn: "My teacher corrected every letter. That patience changed my recitation and now I lead taraweeh.", quoteUr: "میرے استاد نے ہر حرف کی اصلاح کی۔ اسی صبر نے میری تلاوت بدلی اور اب میں تراویح پڑھاتا ہوں۔" },
  ]);

  /* ---------------- Faculty ---------------- */
  await db.insert(faculty).values([
    { nameEn: "Dr. Muhammad Iqbal", nameUr: "ڈاکٹر محمد اقبال", roleEn: "Founder & Chancellor", roleUr: "بانی و چانسلر", department: "Leadership", isLeadership: true, bioEn: "Founder of the university in 1989. He studied at Wifaq ul Madaris and completed a PhD in Islamic Studies, and has served on national education boards. (Placeholder biography.)", bioUr: "1989 میں یونیورسٹی کے بانی۔ وفاق المدارس سے تعلیم اور اسلامی علوم میں پی ایچ ڈی، قومی تعلیمی بورڈز کے رکن رہے۔ (نمونہ سوانح۔)", qualifications: "PhD Islamic Studies, Alimiyyah" },
    { nameEn: "Dr. Imran Siddiqui", nameUr: "ڈاکٹر عمران صدیقی", roleEn: "Rector", roleUr: "ریکٹر", department: "Leadership", isLeadership: true, bioEn: "Rector since 2016. A graduate of Al-Azhar and former head of our Hadith department, he leads academic strategy and welfare. (Placeholder biography.)", bioUr: "2016 سے ریکٹر۔ الازہر سے فارغ التحصیل اور ہمارے شعبہ حدیث کے سابق سربراہ، تعلیمی حکمتِ عملی اور فلاح کے ذمہ دار۔ (نمونہ سوانح۔)", qualifications: "PhD Hadith, Al-Azhar" },
    { nameEn: "Justice (R) Nasreen Akhtar", nameUr: "جسٹس (ر) نسرین اختر", roleEn: "Chair, Board of Governors", roleUr: "چیئر، بورڈ آف گورنرز", department: "Board of Governors", isBoard: true, bioEn: "Retired judge with 24 years of service; advises on governance and legal compliance.", bioUr: "ریٹائرڈ جج، 24 سال خدمات؛ گورننس اور قانونی تعمیل پر مشاورت۔" },
    { nameEn: "Mr. Tariq Mehmood", nameUr: "مسٹر طارق محمود", roleEn: "Board member — Finance", roleUr: "بورڈ ممبر — مالیات", department: "Board of Governors", isBoard: true, bioEn: "Chartered accountant and chair of the audit committee.", bioUr: "چارٹرڈ اکاؤنٹنٹ اور آڈٹ کمیٹی کے چیئر۔" },
    { nameEn: "Dr. Aisha Karim", nameUr: "ڈاکٹر عائشہ کریم", roleEn: "Board member — Academics", roleUr: "بورڈ ممبر — تعلیمات", department: "Board of Governors", isBoard: true, bioEn: "Professor of Quranic studies and former dean of the Quran faculty.", bioUr: "پروفیسر علومِ قرآن اور سابق ڈین شعبہ قرآن۔" },
    { nameEn: "Mufti Abdul Rahman", nameUr: "مفتی عبدالرحمٰن", roleEn: "Head of Darul Ifta", roleUr: "سربراہ دارالافتاء", department: "Fiqh & Shariah", bioEn: "Specialises in Hanafi fiqh, fatwa methodology and Islamic finance. Approves published fatawa for the board.", bioUr: "فقہ حنفی، اصولِ فتویٰ اور اسلامی مالیات کے ماہر۔ شائع شدہ فتاویٰ کی بورڈ منظوری کے ذمہ دار۔" },
    { nameEn: "Dr. Aisha Karim", nameUr: "ڈاکٹر عائشہ کریم", roleEn: "Professor, Quran & Tafseer", roleUr: "پروفیسر، قرآن و تفسیر", department: "Quran", bioEn: "Teaches tafseer and Quranic Arabic; research on classical exegetical method.", bioUr: "تفسیر اور عربیِ قرآن پڑھاتی ہیں؛ کلاسیکی تفسیری طریقوں پر تحقیق۔" },
    { nameEn: "Qari Muhammad Yasir", nameUr: "قاری محمد یاسر", roleEn: "Head of Hifz & Tajweed", roleUr: "سربراہ حفظ و تجوید", department: "Quran", bioEn: "Hafiz with ijazah in Qira'at Hafs; supervises 120 residential huffaz.", bioUr: "حافظ، قراتِ حفص میں اجازت یافتہ؛ 120 رہائشی حفاظ کی نگرانی۔" },
    { nameEn: "Dr. Hamza Farooq", nameUr: "ڈاکٹر حمزہ فاروق", roleEn: "Head of Hadith", roleUr: "سربراہ حدیث", department: "Hadith", bioEn: "Specialist in narrator criticism and the Muwatta traditions.", bioUr: "جرح و تعدیل اور روایاتِ موطا کے ماہر۔" },
    { nameEn: "Ms. Amna Shafiq", nameUr: "محترمہ آمنہ شفیق", roleEn: "Lecturer, Arabic", roleUr: "لیکچرر، عربی", department: "Arabic", bioEn: "Teaches Arabic morphology and modern literature; leads the translation workshop.", bioUr: "عربی صرف اور جدید ادب کی مدرس؛ ترجمہ ورکشاپ کی سربراہ۔" },
    { nameEn: "Mr. Saad Rafiq", nameUr: "مسٹر سعد رفیق", roleEn: "Islamic Finance practitioner in residence", roleUr: "اسلامی مالیات پریکٹیشنر", department: "Fiqh & Shariah", bioEn: "Former Shariah compliance officer; teaches the evening Islamic Finance diploma.", bioUr: "سابق شریعت کمپلائنس آفیسر؛ شام کے اسلامی مالیات ڈپلومہ کے مدرس۔" },
  ]);

  /* ---------------- Seasonal banners (neutral by default) ---------------- */
  await db.insert(seasonalBanners).values([
    { seasonKey: "ramadan", titleEn: "Ramadan 2027 at Al-Noor", titleUr: "النور میں رمضان 2027", bodyEn: "Sehri and Iftar timings, nightly taraweeh, iftar meals and a Zakat calculator.", bodyUr: "سحری و افطار کے اوقات، تراویح، افطاری اور زکوٰۃ کیلکولیٹر۔", ctaLabelEn: "Ramadan resources", ctaLabelUr: "رمضان وسائل", ctaHref: "/seasonal/ramadan", tone: "celebration", active: false },
    { seasonKey: "eid_fitr", titleEn: "Eid ul Fitr Mubarak", titleUr: "عید الفطر مبارک", bodyEn: "May your fasting and worship be accepted. Give Fitrah through the university welfare office.", bodyUr: "اللہ آپ کے روزے اور عبادات قبول فرمائے۔ فطرہ فلاح دفتر کے ذریعے دیں۔", ctaLabelEn: "Give Fitrah", ctaLabelUr: "فطرہ دیں", ctaHref: "/donate", tone: "celebration", active: false },
    { seasonKey: "muharram", titleEn: "Muharram notices", titleUr: "محرم کے اعلانات", bodyEn: "A solemn month. Majalis timings and notices only.", bodyUr: "غم کا مہینہ۔ صرف مجالس کے اوقات و اعلانات۔", ctaLabelEn: "View notices", ctaLabelUr: "اعلانات دیکھیں", ctaHref: "/events", tone: "solemn", active: false },
    { seasonKey: "rabi_awwal", titleEn: "Milad-un-Nabi programme", titleUr: "میلاد النبی پروگرام", bodyEn: "Seerah conference, Naat gathering and a new gallery of photographs.", bodyUr: "سیرت کانفرنس، نعت محفل اور نئی تصاویر کی گیلری۔", ctaLabelEn: "Event details", ctaLabelUr: "تقریب کی تفصیل", ctaHref: "/events/seerah-conference", tone: "celebration", active: false },
    { seasonKey: "eid_adha", titleEn: "Qurbani 2027 booking is open", titleUr: "قربانی 2027 کی بکنگ شروع", bodyEn: "Book a hissa, a whole cow or Sadaqah Qurbani with an instant receipt.", bodyUr: "حصہ، پوری گائے یا صدقہ قربانی بک کریں، فوری رسید کے ساتھ۔", ctaLabelEn: "Book Qurbani", ctaLabelUr: "قربانی بک کریں", ctaHref: "/qurbani", tone: "celebration", active: false },
    { seasonKey: "academic", titleEn: "Admissions 2027 are open", titleUr: "داخلے 2027 جاری ہیں", bodyEn: "Eight programmes, scholarships available, apply online today.", bodyUr: "آٹھ پروگرام، وظائف دستیاب، آج آن لائن درخواست دیں۔", ctaLabelEn: "Apply now", ctaLabelUr: "ابھی درخواست دیں", ctaHref: "/admissions", tone: "academic", active: false },
  ]);

  /* ---------------- Reports, calendar, exams ---------------- */
  await db.insert(reports).values([
    { year: 2026, titleEn: "Audited financial statements 2026", titleUr: "آڈٹ شدہ مالی گوشوارے 2026", kind: "Audited financials", fileUrl: "/api/pdf/report/audited-2026", sizeKb: 1420 },
    { year: 2026, titleEn: "Annual report 2026", titleUr: "سالانہ رپورٹ 2026", kind: "Annual report", fileUrl: "/api/pdf/report/annual-2026", sizeKb: 2860 },
    { year: 2025, titleEn: "Audited financial statements 2025", titleUr: "آڈٹ شدہ مالی گوشوارے 2025", kind: "Audited financials", fileUrl: "/api/pdf/report/audited-2025", sizeKb: 1380 },
    { year: 2025, titleEn: "Annual report 2025", titleUr: "سالانہ رپورٹ 2025", kind: "Annual report", fileUrl: "/api/pdf/report/annual-2025", sizeKb: 2640 },
  ]);

  await db.insert(calendarEntries).values([
    { titleEn: "Admissions open", titleUr: "داخلے شروع", startDate: at(-10), kind: "admissions" },
    { titleEn: "Semester 1 begins", titleUr: "پہلا سمسٹر شروع", startDate: at(35), kind: "term" },
    { titleEn: "Mid-term examinations", titleUr: "درمیانی امتحانات", startDate: at(95), endDate: at(105), kind: "exam" },
    { titleEn: "Ramadan break", titleUr: "رمضان کی تعطیلات", startDate: at(190), endDate: at(219), kind: "holiday" },
    { titleEn: "Final examinations", titleUr: "سالانہ امتحانات", startDate: at(240), endDate: at(255), kind: "exam" },
    { titleEn: "Convocation", titleUr: "کانووکیشن", startDate: at(280), kind: "ceremony" },
  ]);

  await db.insert(examSchedule).values([
    { titleEn: "Quranic Sciences — BS Islamic Studies", titleUr: "علومِ قرآن — بی ایس اسلامی علوم", programmeSlug: "bs-islamic-studies", examDate: at(96, 9), timeSlot: "09:00 – 12:00", venue: "Exam Hall A", kind: "midterm" },
    { titleEn: "Hadith Sciences — BS Hadith & Seerah", titleUr: "علومِ حدیث — بی ایس حدیث و سیرت", programmeSlug: "bs-hadith-seerah", examDate: at(97, 9), timeSlot: "09:00 – 12:00", venue: "Exam Hall B", kind: "midterm" },
    { titleEn: "Usul al-Fiqh — BS Fiqh & Islamic Law", titleUr: "اصولِ فقہ — بی ایس فقہ", programmeSlug: "bs-fiqh-shariah", examDate: at(98, 9), timeSlot: "09:00 – 12:00", venue: "Exam Hall A", kind: "midterm" },
    { titleEn: "Arabic Grammar — BS Arabic", titleUr: "عربی گرامر — بی ایس عربی", programmeSlug: "bs-arabic", examDate: at(99, 14), timeSlot: "14:00 – 17:00", venue: "Exam Hall C", kind: "midterm" },
    { titleEn: "Tajweed practical — Hifz & Tajweed", titleUr: "تجوید عملی — حفظ و تجوید", programmeSlug: "hifz-tajweed", examDate: at(100, 9), timeSlot: "09:00 – 13:00", venue: "Quran Hall", kind: "practical" },
    { titleEn: "Islamic Banking Operations — Diploma", titleUr: "اسلامی بینکاری — ڈپلومہ", programmeSlug: "diploma-islamic-finance", examDate: at(102, 18), timeSlot: "18:00 – 21:00", venue: "Evening Hall", kind: "final" },
  ]);

  /* ---------------- Donations & leads ---------------- */
  await db.insert(donations).values([
    { receiptNo: "DON-2027-000451", donorName: "Anonymous donor", email: "donor1@example.com", phone: "+92 300 1111111", amount: 85000, purpose: "scholarships", recurring: "monthly", method: "card", status: "paid", transactionId: "pi_demo_451", createdAt: at(-3) },
    { receiptNo: "DON-2027-000452", donorName: "Khadija Trust", email: "trust@example.com", amount: 250000, purpose: "zakat", recurring: "one-time", method: "bank_transfer", status: "verified", transactionId: "TRX-88231", createdAt: at(-5) },
    { receiptNo: "DON-2027-000453", donorName: "Sample donor", email: "donor2@example.com", phone: "+92 321 3333333", amount: 25000, purpose: "food", recurring: "one-time", method: "jazzcash", status: "paid", transactionId: "JC-99120", createdAt: at(-1) },
    { receiptNo: "DON-2027-000454", donorName: "Anonymous donor", email: "donor3@example.com", amount: 5000, purpose: "general", recurring: "one-time", method: "easypaisa", status: "pending", createdAt: at(0) },
  ]);

  await db.insert(leads).values([
    { name: "Sample enquirer", phone: "+92 300 5555555", email: "enquirer@example.com", city: "Lahore", programme: "bs-islamic-studies", message: "Please share hostel fees for the BS Islamic Studies programme.", kind: "enquiry", createdAt: at(-1) },
    { name: "Callback request", phone: "+92 311 7777777", city: "Sialkot", programme: "alimiyyah", message: "Please call after 3 pm.", kind: "callback", createdAt: at(-2) },
    { name: "Newsletter subscriber", phone: "n/a", email: "subscriber@example.com", kind: "newsletter", createdAt: at(-4) },
  ]);

  /* ---------------- Qurbani season ---------------- */
  const seasonRows = await db
    .insert(qurbaniSeasons)
    .values([
      {
        name: "Qurbani 2027", year: 2027, active: true, archived: false,
        bookingOpenAt: at(-10), bookingDeadline: new Date("2027-05-14T23:59:00Z"),
        eidDate: new Date("2027-05-17T00:00:00Z"),
        slaughterStart: new Date("2027-05-17T06:00:00Z"),
        slaughterEnd: new Date("2027-05-19T18:00:00Z"),
        sharePrice: 45000, cowPrice: 315000, aqeeqahPrice: 47000, cowCount: 14,
        slaughterLocation: "Al-Noor University Farm, Bedian Road, Lahore (placeholder location)",
        refundWindowDays: 7, holdMinutes: 30, dispatchDate: new Date("2027-05-20T08:00:00Z"),
        meatToNeedyKg: 1840,
        distributionPolicyEn: "One-third for the family of the person offering Qurbani, one-third for relatives and neighbours, and one-third for the poor. The university distributes the welfare portion to pre-screened families, orphan households, and its food programme, with no personal data published.",
        distributionPolicyUr: "ایک تہائی قربانی کرنے والے کے خاندان، ایک تہائی رشتہ داروں و پڑوسیوں اور ایک تہائی مستحقین کے لیے۔ یونیورسٹی فلاحی حصہ پہلے سے جانچے گئے خاندانوں، یتیم گھرانوں اور فوڈ پروگرام میں تقسیم کرتی ہے، کوئی ذاتی معلومات شائع نہیں ہوتیں۔",
      },
      {
        name: "Qurbani 2026", year: 2026, active: false, archived: true,
        bookingOpenAt: at(-400), bookingDeadline: at(-340), eidDate: at(-330), slaughterStart: at(-330), slaughterEnd: at(-328),
        sharePrice: 40000, cowPrice: 280000, cowCount: 14, meatToNeedyKg: 1620,
        slaughterLocation: "Al-Noor University Farm, Lahore",
        distributionPolicyEn: "Archived season data, read-only.", distributionPolicyUr: "محفوظ شدہ سیزن ڈیٹا، صرف مطالعہ۔",
      },
    ])
    .returning({ id: qurbaniSeasons.id });

  const seasonId = seasonRows[0].id;

  const cows = [
    { cowNumber: "01", breed: "Sahiwal", ageMonths: 46, weightKg: 480, purchasePrice: 285000, photo: IMAGES.cow2 },
    { cowNumber: "02", breed: "Cholistani", ageMonths: 44, weightKg: 455, purchasePrice: 272000, photo: IMAGES.cow1 },
    { cowNumber: "03", breed: "Sahiwal × Friesian", ageMonths: 40, weightKg: 510, purchasePrice: 310000, photo: IMAGES.cow4 },
    { cowNumber: "04", breed: "Bhagnari", ageMonths: 52, weightKg: 520, purchasePrice: 320000, photo: IMAGES.cow5 },
    { cowNumber: "05", breed: "Sahiwal", ageMonths: 38, weightKg: 430, purchasePrice: 268000, photo: IMAGES.cow3 },
    { cowNumber: "06", breed: "Cholistani", ageMonths: 48, weightKg: 470, purchasePrice: 290000, photo: IMAGES.cow6 },
    { cowNumber: "07", breed: "Sahiwal", ageMonths: 42, weightKg: 445, purchasePrice: 276000, photo: IMAGES.cow1 },
    { cowNumber: "08", breed: "Red Sindhi", ageMonths: 50, weightKg: 500, purchasePrice: 305000, photo: IMAGES.cow2 },
    { cowNumber: "09", breed: "Sahiwal", ageMonths: 45, weightKg: 460, purchasePrice: 282000, photo: IMAGES.cow3 },
    { cowNumber: "10", breed: "Cholistani", ageMonths: 43, weightKg: 450, purchasePrice: 279000, photo: IMAGES.cow4 },
    { cowNumber: "11", breed: "Sahiwal", ageMonths: 47, weightKg: 490, purchasePrice: 296000, photo: IMAGES.cow5 },
    { cowNumber: "12", breed: "Sahiwal", ageMonths: 45, weightKg: 475, purchasePrice: 288000, photo: IMAGES.cow6 },
    { cowNumber: "13", breed: "Bhagnari", ageMonths: 54, weightKg: 530, purchasePrice: 322000, photo: IMAGES.cow2 },
    { cowNumber: "14", breed: "Cholistani", ageMonths: 41, weightKg: 440, purchasePrice: 274000, photo: IMAGES.cow1 },
  ];

  const cowRows = await db
    .insert(qurbaniCows)
    .values(
      cows.map((cow) => ({
        seasonId,
        cowNumber: cow.cowNumber,
        breed: cow.breed,
        ageMonths: cow.ageMonths,
        weightKg: cow.weightKg,
        healthCheck: "Veterinary inspection completed; no contagious disease; teeth and hooves checked.",
        vetStatus: "Fit for Qurbani",
        purchasePrice: cow.purchasePrice,
        source: "Al-Noor University Farm (placeholder)",
        photos: [cow.photo],
        status: "Available",
      })),
    )
    .returning({ id: qurbaniCows.id, cowNumber: qurbaniCows.cowNumber });

  await db.insert(qurbaniShares).values(
    cowRows.flatMap((cow) =>
      [1, 2, 3, 4, 5, 6, 7].map((shareNumber) => ({
        cowId: cow.id,
        seasonId,
        shareNumber,
        status: "Available",
      })),
    ),
  );

  const bookingSeed = [
    { receiptId: "QRB-2027-000100", cow: "01", shares: [1, 2, 3, 4, 5, 6, 7], sharesCount: 7, buyerName: "Sample Family Trust", whatsapp: "+92 300 1000001", email: "family@example.com", purpose: "family", status: "Paid", pay: "card", amount: 315000, txn: "pi_demo_100", offset: -6 },
    { receiptId: "QRB-2027-000101", cow: "02", shares: [1, 2, 3], sharesCount: 3, buyerName: "Sample Buyer A", whatsapp: "+92 300 1000002", email: "buyer.a@example.com", purpose: "self", status: "Paid", pay: "jazzcash", amount: 135000, txn: "JC-556677", offset: -5 },
    { receiptId: "QRB-2027-000102", cow: "02", shares: [4, 5], sharesCount: 2, buyerName: "Sample Buyer B", whatsapp: "+92 300 1000003", email: "buyer.b@example.com", purpose: "deceased", status: "Paid", pay: "easypaisa", amount: 90000, txn: "EP-112233", offset: -4 },
    { receiptId: "QRB-2027-000103", cow: "03", shares: [1, 2, 3, 4], sharesCount: 4, buyerName: "Sample Buyer C", whatsapp: "+92 300 1000004", email: "buyer.c@example.com", purpose: "family", status: "Paid", pay: "card", amount: 180000, txn: "pi_demo_103", offset: -4 },
    { receiptId: "QRB-2027-000104", cow: "06", shares: [1, 2, 3, 4, 5, 6, 7], sharesCount: 7, buyerName: "Sample Welfare Trust", whatsapp: "+92 300 1000005", email: "welfare@example.com", purpose: "sadaqah", status: "Paid", pay: "bank_transfer", amount: 315000, txn: "TRX-77001", offset: -9 },
    { receiptId: "QRB-2027-000106", cow: "05", shares: [1, 2], sharesCount: 2, buyerName: "Sample Buyer D", whatsapp: "+92 300 1000006", email: "buyer.d@example.com", purpose: "self", status: "Reserved", pay: "bank_transfer", amount: 90000, txn: "TRX-88112", offset: -1 },
    { receiptId: "QRB-2027-000107", cow: "04", shares: [1, 2, 3], sharesCount: 3, buyerName: "Sample Buyer E", whatsapp: "+92 300 1000007", email: "buyer.e@example.com", purpose: "family", status: "Paid", pay: "card", amount: 135000, txn: "pi_demo_107", offset: -3 },
    { receiptId: "QRB-2027-000123", cow: "12", shares: [1, 2, 3], sharesCount: 3, buyerName: "Ahmed Khan (sample)", whatsapp: "+92 300 1234567", email: "ahmed.sample@example.com", purpose: "deceased", onBehalfOf: "Hajji Muhammad Khan (sample)", status: "Paid", pay: "card", amount: 135000, txn: "pi_3Ndemo123sample", offset: -2 },
    { receiptId: "QRB-2027-000124", cow: "12", shares: [4], sharesCount: 1, buyerName: "Fatima Bibi (sample)", whatsapp: "+92 301 7654321", email: "fatima.sample@example.com", purpose: "self", status: "Paid", pay: "upaisa", amount: 45000, txn: "UP-445566", offset: -2 },
  ];

  for (const booking of bookingSeed) {
    const cow = cowRows.find((c) => c.cowNumber === booking.cow);
    const createdAt = new Date(now + booking.offset * day);
    const [row] = await db
      .insert(qurbaniBookings)
      .values({
        receiptId: booking.receiptId,
        seasonId,
        buyerName: booking.buyerName,
        guardianName: booking.receiptId === "QRB-2027-000123" ? "Muhammad Yousuf Khan (sample)" : null,
        cnic: booking.receiptId === "QRB-2027-000123" ? "35202-0000000-0" : null,
        whatsapp: booking.whatsapp,
        email: booking.email,
        city: booking.receiptId === "QRB-2027-000123" ? "Lahore" : "Lahore",
        purpose: booking.purpose,
        onBehalfOf: booking.onBehalfOf ?? null,
        shareCount: booking.sharesCount,
        cowId: cow?.id ?? null,
        cowNumber: booking.cow,
        shareNumbers: booking.shares,
        amount: booking.amount,
        paymentMethod: booking.pay,
        paymentStatus: booking.status === "Paid" ? "paid" : "pending_verification",
        transactionId: booking.txn,
        status: booking.status,
        holdExpiresAt: booking.status === "Reserved" ? new Date(now + 26 * 60 * 1000) : null,
        slaughterDate: new Date("2027-05-17T08:00:00Z"),
        slaughterLocation: "Al-Noor University Farm, Bedian Road, Lahore (placeholder location)",
        dispatchDate: booking.status === "Paid" ? new Date("2027-05-20T08:00:00Z") : null,
        createdAt,
        updatedAt: createdAt,
      })
      .returning({ id: qurbaniBookings.id });

    await db.insert(qurbaniPayments).values({
      bookingId: row.id,
      method: booking.pay,
      amount: booking.amount,
      transactionId: booking.txn,
      status: booking.status === "Paid" ? "paid" : "pending_verification",
      providerRef: `DEMO-${booking.receiptId}`,
      verifiedBy: booking.status === "Paid" ? "cashier@alnoor.edu.pk" : null,
      verifiedAt: booking.status === "Paid" ? createdAt : null,
      createdAt,
    });

    await db.insert(qurbaniLogs).values({
      bookingId: row.id,
      fromStatus: "Available",
      toStatus: booking.status,
      staff: booking.status === "Paid" ? "cashier@alnoor.edu.pk" : "qurbani@alnoor.edu.pk",
      note: booking.status === "Paid" ? "Payment confirmed, receipt issued." : "Slot held pending bank verification.",
      createdAt,
    });

    if (cow) {
      const paidAll = booking.shares.length === 7 && booking.status === "Paid";
      if (paidAll) {
        await db
          .update(qurbaniCows)
          .set({ status: booking.cow === "06" ? "Slaughtered" : "Paid" })
          .where(eq(qurbaniCows.id, cow.id));
      }
      const note = `Booking ${booking.receiptId} created (${booking.status})`;
      await db.insert(qurbaniLogs).values({
        bookingId: row.id,
        cowId: cow.id,
        fromStatus: "Available",
        toStatus: booking.status,
        staff: "qurbani@alnoor.edu.pk",
        note,
        createdAt,
      });
    }
  }

  // Assign shares correctly (row-by-row) so each booking owns exactly its hissas.
  for (const booking of bookingSeed) {
    const cow = cowRows.find((c) => c.cowNumber === booking.cow);
    if (!cow) continue;
    const bookingRow = await db.select({ id: qurbaniBookings.id }).from(qurbaniBookings).where(eq(qurbaniBookings.receiptId, booking.receiptId));
    const shares = await db.select().from(qurbaniShares).where(eq(qurbaniShares.cowId, cow.id));
    for (const share of shares) {
      if (booking.shares.includes(share.shareNumber)) {
        await db
          .update(qurbaniShares)
          .set({
            status: booking.status === "Paid" ? "Paid" : "Reserved",
            bookingId: bookingRow[0]?.id ?? null,
            holdExpiresAt: booking.status === "Paid" ? null : new Date(now + 26 * 60 * 1000),
          })
          .where(eq(qurbaniShares.id, share.id));
      }
    }
  }

  await db.insert(qurbaniTemplates).values([
    { templateKey: "booking", language: "en", body: "Assalamu alaikum {{name}}. Your Qurbani 2027 booking {{receipt}} is reserved: Hissa {{hissas}} of Cow {{cow}}. Total {{amount}}. Please complete payment within 30 minutes to confirm. — Al-Noor Islamic University" },
    { templateKey: "booking", language: "ur", body: "السلام علیکم {{name}}۔ آپ کی قربانی 2027 بکنگ {{receipt}} محفوظ ہو گئی: گائے {{cow}} کا حصہ {{hissas}}۔ کل رقم {{amount}}۔ تصدیق کے لیے 30 منٹ میں ادائیگی مکمل کریں۔ — النور اسلامک یونیورسٹی" },
    { templateKey: "payment", language: "en", body: "Payment received for {{receipt}}: {{amount}} via {{method}}. Your PDF receipt is ready: {{link}}. Jazak Allah khair." },
    { templateKey: "payment", language: "ur", body: "{{receipt}} کی ادائیگی موصول ہوئی: {{amount}} بذریعہ {{method}}۔ آپ کی پی ڈی ایف رسید تیار ہے: {{link}}۔ جزاک اللہ خیر۔" },
    { templateKey: "slaughter", language: "en", body: "Your Qurbani {{receipt}} (Cow {{cow}}, Hissa {{hissas}}) is scheduled for slaughter on {{date}} at {{location}}. Distribution follows the same day." },
    { templateKey: "slaughter", language: "ur", body: "آپ کی قربانی {{receipt}} (گائے {{cow}}، حصہ {{hissas}}) کی ذبح {{date}} کو {{location}} پر مقرر ہے۔ تقسیم اسی دن ہوگی۔" },
    { templateKey: "dispatch", language: "en", body: "Your Qurbani {{receipt}} has been dispatched on {{date}}. Courier: {{courier}}, tracking: {{tracking}}. Collection point: distribution desk." },
    { templateKey: "dispatch", language: "ur", body: "آپ کی قربانی {{receipt}} نے {{date}} کو روانگی اختیار کی۔ کوریئر: {{courier}}، ٹریکنگ: {{tracking}}۔ وصولی مقام: ڈسٹری بیوشن ڈیسک۔" },
  ]);

  await db.insert(qurbaniFaqs).values([
    { questionEn: "Who is required to offer Qurbani?", questionUr: "قربانی کس پر لازم ہے؟", answerEn: "It is wajib in the Hanafi school for a Muslim who owns the nisab amount (excluding basic needs) at the time of Qurbani. A share in a cow fulfils it for one person.", answerUr: "فقہ حنفی میں قربانی کے وقت نصاب کا مالک مسلمان پر واجب ہے۔ گائے میں ایک حصہ ایک شخص کی طرف سے کافی ہے۔", sortOrder: 1 },
    { questionEn: "What are the approved animal ages?", questionUr: "جانوروں کی منظور شدہ عمریں کیا ہیں؟", answerEn: "Cow or buffalo at least 2 years, goat or sheep at least 1 year (a six-month sheep may be accepted if strong), camel at least 5 years. Our vet records the age of every animal.", answerUr: "گائے یا بھینس کم از کم 2 سال، بکری یا بھیڑ کم از کم 1 سال (مضبوط چھ ماہ کی بھیڑ بھی)، اونٹ کم از کم 5 سال۔ ہماری ویٹ ٹیم ہر جانور کی عمر درج کرتی ہے۔", sortOrder: 2 },
    { questionEn: "What are the times for Qurbani?", questionUr: "قربانی کا وقت کیا ہے؟", answerEn: "From after the Eid prayer on 10th Dhul Hijjah until sunset on 12th Dhul Hijjah. The university slaughters on 10th and 11th, and notifies each buyer by WhatsApp.", answerUr: "10 ذی الحجہ کو نمازِ عید کے بعد سے 12 ذی الحجہ کے غروبِ آفتاب تک۔ یونیورسٹی 10 اور 11 ذی الحجہ کو ذبح کرتی ہے اور ہر خریدار کو واٹس ایپ پر اطلاع دیتی ہے۔", sortOrder: 3 },
    { questionEn: "Can I see the animal before booking?", questionUr: "کیا بکنگ سے پہلے جانور دیکھ سکتا ہوں؟", answerEn: "Yes. The live board shows breed, weight, age and vet status. Farm visits are welcome on weekdays after booking an appointment with the Qurbani in-charge.", answerUr: "جی ہاں۔ لائیو بورڈ پر نسل، وزن، عمر اور ویٹرنری حالت دکھائی جاتی ہے۔ قربانی انچارج سے وقت لے کر ہفتے کے دنوں میں فارم تشریف لائیں۔", sortOrder: 4 },
    { questionEn: "What if a cow is rejected by the vet or dies?", questionUr: "اگر گائے ویٹرنری معائنے میں مسترد ہو یا مر جائے؟", answerEn: "Its hissas are transferred to a replacement cow of equal or better quality, or fully refunded if you prefer. Affected buyers are notified by phone and WhatsApp, and the change is recorded in the audit log.", answerUr: "اس کے حصے مساوی یا بہتر گائے میں منتقل کیے جاتے ہیں، یا آپ کی پسند پر مکمل رقم واپس۔ متاثرہ خریدار کو فون اور واٹس ایپ پر اطلاع دی جاتی ہے اور تبدیلی آڈٹ لاگ میں درج ہوتی ہے۔", sortOrder: 5 },
    { questionEn: "What is your refund policy?", questionUr: "رقم واپسی کی پالیسی کیا ہے؟", answerEn: "Cancel within 7 days of payment, and at least 72 hours before the slaughter date, for a full refund using the original payment method. Refund receipts are issued and logged.", answerUr: "ادائیگی کے 7 دن کے اندر اور ذبح سے کم از کم 72 گھنٹے پہلے منسوخی پر مکمل رقم اسی طریقے سے واپس ہوتی ہے۔ واپسی کی رسید جاری اور ریکارڈ کی جاتی ہے۔", sortOrder: 6 },
    { questionEn: "How do I reissue a lost receipt?", questionUr: "رسید گم ہو جائے تو دوبارہ کیسے ملے گی؟", answerEn: "Use Check My Booking with your receipt ID and phone number, or contact the office. A reissued receipt is stamped as a duplicate and the reissue is logged.", answerUr: "رسید نمبر اور فون نمبر کے ساتھ میری بکنگ دیکھیں یا دفتر سے رابطہ کریں۔ دوبارہ جاری رسید پر ڈپلیکیٹ کی مہر ہوتی ہے اور یہ عمل ریکارڈ ہوتا ہے۔", sortOrder: 7 },
    { questionEn: "How is the meat distributed?", questionUr: "گوشت کی تقسیم کیسے ہوتی ہے؟", answerEn: "A third for the family, a third for relatives and neighbours, and a third for the poor. Our welfare team distributes to pre-screened families and publishes only aggregate numbers, never personal data.", answerUr: "ایک تہائی خاندان، ایک تہائی رشتہ دار و پڑوسی اور ایک تہائی مستحقین۔ ہماری فلاحی ٹیم پہلے سے جانچے گئے خاندانوں میں تقسیم کرتی ہے اور صرف مجموعی اعداد شائع کرتی ہے، ذاتی معلومات نہیں۔", sortOrder: 8 },
  ]);

  await db.insert(auditLogs).values([
    { actor: "system", role: "super_admin", action: "seed", entity: "settings", entityId: SEED_VERSION, detail: "Initial demo content seeded." },
    { actor: "cashier@alnoor.edu.pk", role: "cashier", action: "payment.verify", entity: "qurbani_booking", entityId: "QRB-2027-000123", detail: "Stripe card payment verified, receipt QRB-2027-000123 issued." },
    { actor: "mufti@alnoor.edu.pk", role: "mufti", action: "fatwa.publish", entity: "fatawa", entityId: "DI-2027-0142", detail: "Approved zakat on savings fatwa." },
  ]);
}
