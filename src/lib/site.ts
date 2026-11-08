export const UNIVERSITY = {
  nameEn: "Al-Noor Islamic University",
  nameUr: "النور اسلامک یونیورسٹی",
  short: "Al-Noor",
  established: 1989,
  phone: "+92 300 1234567",
  phoneHref: "+923001234567",
  whatsapp: "+92 300 1234567",
  email: "info@alnoor.edu.pk",
  admissionsEmail: "admissions@alnoor.edu.pk",
  addressEn: "Main Campus, Canal Road, Lahore 54000, Pakistan",
  addressUr: "مین کیمپس، کینال روڈ، لاہور 54000، پاکستان",
  hoursEn: "Monday–Friday, 8:30 am – 4:30 pm",
  hoursUr: "پیر تا جمعہ، صبح 8:30 تا شام 4:30",
  mapEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=74.20%2C31.42%2C74.45%2C31.62&layer=mapnik&marker=31.5204%2C74.3587",
  mapLink: "https://www.openstreetmap.org/?mlat=31.5204&mlon=74.3587#map=13/31.5204/74.3587",
  bank: {
    zakat: {
      titleEn: "Zakat account",
      titleUr: "زکوٰۃ اکاؤنٹ",
      bankEn: "Meezan Bank — Al-Noor Islamic University Zakat Account",
      bankUr: "میزان بینک — النور اسلامک یونیورسٹی زکوٰۃ اکاؤنٹ",
      account: "PK00 MEZN 0000 0000 0000 0001 (placeholder)",
      title: "Al-Noor Islamic University Zakat Fund",
    },
    general: {
      titleEn: "General & Sadaqah account",
      titleUr: "عمومی و صدقہ اکاؤنٹ",
      bankEn: "Meezan Bank — Al-Noor Islamic University General Account",
      bankUr: "میزان بینک — النور اسلامک یونیورسٹی عمومی اکاؤنٹ",
      account: "PK00 MEZN 0000 0000 0000 0002 (placeholder)",
      title: "Al-Noor Islamic University General Fund",
    },
  },
  social: {
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    instagram: "https://instagram.com/",
    x: "https://x.com/",
    whatsapp: "https://wa.me/923001234567",
  },
};

export const PRAYER_TIMES = [
  { key: "fajr", time: "4:32 am" },
  { key: "zuhr", time: "12:18 pm" },
  { key: "asr", time: "3:44 pm" },
  { key: "maghrib", time: "6:12 pm" },
  { key: "isha", time: "7:32 pm" },
] as const;

export const STATS = [
  { key: "home.statStudents", value: 1840, suffix: "+" },
  { key: "home.statGraduates", value: 6200, suffix: "+" },
  { key: "home.statYears", value: 37, suffix: "" },
  { key: "home.statCampuses", value: 3, suffix: "" },
  { key: "home.statScholars", value: 68, suffix: "" },
] as const;

export const HERO_SLIDES = [
  {
    image: "/images/campus-hero.jpg",
    eyebrowEn: "Established 1989 · Lahore, Pakistan",
    eyebrowUr: "قائم شدہ 1989 · لاہور، پاکستان",
    titleEn: "Knowledge, character and service",
    titleUr: "علم، کردار اور خدمت",
    verseAr: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    verseEn: "“Read in the name of your Lord who created.” — Al-Alaq 96:1",
    verseUr: "«پڑھو اپنے رب کے نام سے جس نے پیدا کیا۔» — العلق 96:1",
  },
  {
    image: "/images/classroom.jpg",
    eyebrowEn: "Classes & Halaqahs",
    eyebrowUr: "سبق اور حلقے",
    titleEn: "Small classes, close mentorship",
    titleUr: "چھوٹی کلاسیں، قریبی رہنمائی",
    verseAr: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    verseEn: "“My Lord, increase me in knowledge.” — Ta-Ha 20:114",
    verseUr: "«اے میرے رب! میرے علم میں اضافہ فرما۔» — طٰہٰ 20:114",
  },
  {
    image: "/images/library.jpg",
    eyebrowEn: "Digital Library",
    eyebrowUr: "ڈیجیٹل کتب خانہ",
    titleEn: "A library open to every seeker",
    titleUr: "ہر طالبِ علم کے لیے کھلا کتب خانہ",
    verseAr: "هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
    verseEn: "“Are those who know equal to those who do not know?” — Az-Zumar 39:9",
    verseUr: "«کیا جاننے والے اور نہ جاننے والے برابر ہیں؟» — الزمر 39:9",
  },
  {
    image: "/images/graduation.jpg",
    eyebrowEn: "Convocation",
    eyebrowUr: "کانووکیشن",
    titleEn: "Graduates serving across Pakistan",
    titleUr: "پاکستان بھر میں خدمت کرتے فارغ التحصیل",
    verseAr: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    verseEn: "“The best of people are those most beneficial to people.” — Hadith",
    verseUr: "«لوگوں میں بہترین وہ ہے جو لوگوں کے لیے سب سے زیادہ نفع بخش ہو۔» — حدیث",
  },
  {
    image: "/images/quran.jpg",
    eyebrowEn: "Quran Recitation",
    eyebrowUr: "تلاوتِ قرآن",
    titleEn: "Trained in recitation and tajweed",
    titleUr: "تلاوت و تجوید کی تربیت",
    verseAr: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    verseEn: "“And recite the Quran with measured recitation.” — Al-Muzzammil 73:4",
    verseUr: "«اور قرآن کو ٹھہر ٹھہر کر پڑھو۔» — المزمل 73:4",
  },
];

export const QUICK_TILES = [
  { href: "/admissions", icon: "cap", titleKey: "nav.admissions", textEn: "Apply for 2027", textUr: "2027 کے لیے درخواست" },
  { href: "/donate", icon: "heart", titleKey: "nav.donate", textEn: "Zakat & Sadaqah", textUr: "زکوٰۃ و صدقہ" },
  { href: "/api/pdf/prospectus/prospectus-2027", icon: "pdf", titleKey: "admissions.prospectus", textEn: "Download PDF", textUr: "پی ڈی ایف ڈاؤن لوڈ" },
  { href: "/darul-ifta/ask", icon: "question", titleKey: "home.askQuestion", textEn: "Private & tracked", textUr: "نجی اور ٹریک شدہ" },
  { href: "/library?category=Khutbat", icon: "book", titleKey: "home.pdf", textEn: "Khutbat & Durus", textUr: "خطبات و دروس" },
  { href: "/admissions#fees", icon: "scale", titleKey: "admissions.feeStructure", textEn: "All programmes", textUr: "تمام پروگرام" },
  { href: "/students#portal", icon: "lock", titleKey: "students.portal", textEn: "Secure login", textUr: "محفوظ لاگ ان" },
  { href: "/qurbani", icon: "cow", titleKey: "qurbani.title", textEn: "Book a hissa", textUr: "حصہ بک کریں" },
];

export const WHY_US = [
  {
    icon: "quran",
    titleEn: "Traditional scholarship, verified chains",
    titleUr: "روایتی علم، مستند اسناد",
    textEn: "Alimiyyah and degree programmes taught by Muftis and PhD scholars with ijazah in Hadith and Fiqh.",
    textUr: "عالمیت اور ڈگری پروگرام مفتیان اور پی ایچ ڈی علماء کے زیرِ تعلیم، حدیث و فقہ میں اجازت کے ساتھ۔",
  },
  {
    icon: "users",
    titleEn: "Small halaqahs, personal attention",
    titleUr: "چھوٹے حلقے، ذاتی توجہ",
    textEn: "A 1:14 teacher-to-student ratio with weekly mentoring and academic counselling.",
    textUr: "استاد اور طالب علم کا تناسب 1:14، ہفتہ وار رہنمائی اور تعلیمی مشاورت کے ساتھ۔",
  },
  {
    icon: "heart",
    titleEn: "Welfare that removes barriers",
    titleUr: "فلاح و بہبود جو رکاوٹیں دور کرے",
    textEn: "Zakat-funded scholarships, free meals and hostel support for students who need it most.",
    textUr: "زکوٰۃ سے چلنے والے وظائف، مفت کھانا اور ہاسٹل معاونت ان طلبہ کے لیے جنہیں سب سے زیادہ ضرورت ہے۔",
  },
  {
    icon: "globe",
    titleEn: "Contemporary relevance",
    titleUr: "عصری مطابقت",
    textEn: "Semester system, research methods, Arabic language labs and optional computer literacy.",
    textUr: "سمسٹر نظام، تحقیقی طریقے، عربی زبان لیبز اور اختیاری کمپیوٹر خواندگی۔",
  },
];

export const PROGRAMME_ICONS: Record<string, string> = {
  "bs-islamic-studies": "book",
  "bs-quran-tafseer": "quran",
  "bs-hadith-seerah": "scroll",
  "bs-fiqh-shariah": "scale",
  alimiyyah: "mosque",
  "hifz-tajweed": "recite",
  "bs-arabic": "globe",
  "diploma-islamic-finance": "coins",
};

export const VALUES = [
  { titleEn: "Amanah (Trust)", titleUr: "امانت", textEn: "Every donation, record and answer is handled as a trust.", textUr: "ہر عطیہ، ریکارڈ اور جواب امانت سمجھ کر سنبھالا جاتا ہے۔" },
  { titleEn: "Ihsan (Excellence)", titleUr: "احسان", textEn: "We teach, serve and administer to the highest standard we can reach.", textUr: "ہم تدریس، خدمت اور انتظام میں بہترین معیار تک پہنچنے کی کوشش کرتے ہیں۔" },
  { titleEn: "Adl (Justice)", titleUr: "عدل", textEn: "Fair admissions, transparent fees and equitable welfare.", textUr: "منصفانہ داخلے، شفاف فیس اور غیر جانبدارانہ فلاح۔" },
  { titleEn: "Rahmah (Mercy)", titleUr: "رحمت", textEn: "Patience with learners and dignity for every person we serve.", textUr: "طلبہ کے ساتھ نرمی اور ہر فرد کی عزت۔" },
];

export const TIMELINE = [
  { year: "1989", titleEn: "Founded in a single madrasah hall", titleUr: "ایک مدرسہ ہال میں قیام", textEn: "Eleven students, two teachers and a borrowed library of 40 books.", textUr: "گیارہ طلبہ، دو اساتذہ اور 40 کتابوں کا عاریتی ذخیرہ۔" },
  { year: "1996", titleEn: "First purpose-built campus", titleUr: "پہلا مستقل کیمپس", textEn: "Opened on Canal Road, Lahore with hostel accommodation for 80 students.", textUr: "لاہور کینال روڈ پر 80 طلبہ کے ہاسٹل کے ساتھ افتتاح۔" },
  { year: "2004", titleEn: "Hifz & Tajweed department", titleUr: "شعبہ حفظ و تجوید", textEn: "Established with a Quranic recitation hall and sound archive.", textUr: "قاریانہ ہال اور صوتی آرکائیو کے ساتھ قیام۔" },
  { year: "2011", titleEn: "Darul Ifta established", titleUr: "دارالافتاء کا قیام", textEn: "A permanent fatwa board with recorded approvals and numbering.", textUr: "مستقل فتویٰ بورڈ، منظوری و نمبرنگ کے ریکارڈ کے ساتھ۔" },
  { year: "2018", titleEn: "Degree programmes recognised", titleUr: "ڈگری پروگراموں کی منظوری", textEn: "Islamic Studies, Arabic and Islamic Finance degrees launched.", textUr: "اسلامی علوم، عربی اور اسلامی مالیات کے ڈگری پروگرام شروع۔" },
  { year: "2024", titleEn: "Digital library & welfare network", titleUr: "ڈیجیٹل کتب خانہ و فلاحی نیٹ ورک", textEn: "Over 6,200 graduates serving in 38 districts; library archived online.", textUr: "38 اضلاع میں 6200 سے زیادہ فارغ التحصیل؛ کتب خانہ آن لائن محفوظ۔" },
];

export const ACCREDITATIONS = [
  { name: "Higher Education Commission (placeholder)", nameUr: "ہائیر ایجوکیشن کمیشن (نمونہ)" },
  { name: "Wifaq ul Madaris (placeholder)", nameUr: "وفاق المدارس (نمونہ)" },
  { name: "Tanzeem ul Madaaris (placeholder)", nameUr: "تنظیم المدارس (نمونہ)" },
  { name: "Punjab Charities Commission (placeholder)", nameUr: "پنجاب چیریٹیز کمیشن (نمونہ)" },
  { name: "International Islamic University affiliation (placeholder)", nameUr: "بین الاقوامی اسلامی یونیورسٹی الحاق (نمونہ)" },
];

export const DONATION_PRESETS = [1000, 5000, 25000, 85000];

export const DONATION_PURPOSES = [
  { key: "general", en: "General fund", ur: "عمومی فنڈ" },
  { key: "scholarships", en: "Scholarships", ur: "وظائف" },
  { key: "construction", en: "Construction", ur: "تعمیرات" },
  { key: "zakat", en: "Zakat", ur: "زکوٰۃ" },
  { key: "sadaqah", en: "Sadaqah Jariyah", ur: "صدقہ جاریہ" },
  { key: "orphans", en: "Orphans", ur: "یتیم" },
  { key: "food", en: "Food & meals", ur: "خوراک" },
  { key: "qurbani", en: "Qurbani", ur: "قربانی" },
];

export const FATWA_CATEGORIES = [
  { key: "salah", en: "Salah", ur: "نماز" },
  { key: "zakat", en: "Zakat & Sadaqah", ur: "زکوٰۃ و صدقہ" },
  { key: "fasting", en: "Fasting", ur: "روزہ" },
  { key: "hajj", en: "Hajj & Umrah", ur: "حج و عمرہ" },
  { key: "qurbani", en: "Qurbani", ur: "قربانی" },
  { key: "marriage", en: "Marriage & Family", ur: "نکاح و خاندان" },
  { key: "business", en: "Business", ur: "کاروبار" },
  { key: "inheritance", en: "Inheritance", ur: "وراثت" },
  { key: "halal", en: "Halal & Haram", ur: "حلال و حرام" },
  { key: "daily", en: "Daily Life", ur: "روزمرہ زندگی" },
  { key: "other", en: "Other", ur: "دیگر" },
];

export const QURBANI_PURPOSES = [
  { key: "self", en: "Self", ur: "اپنے لیے" },
  { key: "family", en: "Family", ur: "خاندان" },
  { key: "deceased", en: "Deceased relative", ur: "مرحوم رشتہ دار" },
  { key: "sadaqah", en: "Sadaqah", ur: "صدقہ" },
];

export const PAYMENT_METHODS = [
  { key: "card", en: "Card (Stripe)", ur: "کارڈ (اسٹرپ)" },
  { key: "jazzcash", en: "JazzCash", ur: "جاز کیش" },
  { key: "easypaisa", en: "Easypaisa", ur: "ایزی پیسہ" },
  { key: "upaisa", en: "UPaisa", ur: "یو پی سا" },
  { key: "bank_transfer", en: "Bank transfer", ur: "بینک ٹرانسفر" },
  { key: "cash", en: "Cash at office", ur: "دفتر میں نقد" },
];

export const IMAGES = {
  campusHero: "/images/campus-hero.jpg",
  campus: "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusAlt: "https://images.pexels.com/photos/234281/pexels-photo-234281.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusModern: "https://images.pexels.com/photos/11932106/pexels-photo-11932106.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusTower: "https://images.pexels.com/photos/396304/pexels-photo-396304.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  library: "/images/library.jpg",
  books: "https://images.pexels.com/photos/8164399/pexels-photo-8164399.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  quran: "/images/quran.jpg",
  oldBooks: "https://images.pexels.com/photos/10589099/pexels-photo-10589099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  calligraphy: "https://images.pexels.com/photos/37697014/pexels-photo-37697014.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  graduation: "/images/graduation.jpg",
  classroom: "/images/classroom.jpg",
  cow1: "https://images.pexels.com/photos/16846562/pexels-photo-16846562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow2: "https://images.pexels.com/photos/7164014/pexels-photo-7164014.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow3: "https://images.pexels.com/photos/11684963/pexels-photo-11684963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow4: "https://images.pexels.com/photos/5798535/pexels-photo-5798535.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow5: "https://images.pexels.com/photos/5216152/pexels-photo-5216152.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow6: "https://images.pexels.com/photos/8633329/pexels-photo-8633329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

export const SEASONAL_KEYS = ["ramadan", "eid_fitr", "muharram", "rabi_awwal", "eid_adha", "academic"];
