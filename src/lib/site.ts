// Set to true to show donation pages, buttons and sections again.
export const SHOW_DONATIONS = false;

// Set to true to show the announcements bar and seasonal banner on the home page again.
export const SHOW_ANNOUNCEMENTS = false;

export const UNIVERSITY = {
  nameEn: "Jamia Ghousia Zia-Ul-Uloom",
  nameUr: "جامعہ غوثیہ ضیاء العلوم",
  short: "Jamia Ghousia",
  established: 1989,
  phone: "+92 51 5509922",
  phoneHref: "+92515509922",
  whatsapp: "+92 51 5509922",
  email: "jamiaziaululoom92@gmail.com",
  admissionsEmail: "jamiaziaululoom92@gmail.com",
  addressEn: "Main Branch, High Court Road, Rawalpindi",
  addressUr: "مرکزی شاخ، ہائی کورٹ روڈ، راولپنڈی",
  hoursEn: "Daily 8:00 am – 12:00 pm · Friday closed",
  hoursUr: "روزانہ صبح 8 تا دوپہر 12 · جمعہ بند",
  mapEmbed: "https://www.google.com/maps?q=Jamia+Ghousia+Zia+Ul+Uloom%2C+Line+No+07%2C+Eastridge+Housing+Society%2C+High+Court+Road%2C+Rawalpindi&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Jamia+Ghousia+Zia+Ul+Uloom%2C+Line+No+07%2C+Eastridge+Housing+Society%2C+High+Court+Road%2C+Rawalpindi",
  bank: {
    zakat: {
      titleEn: "Zakat account",
      titleUr: "زکوٰۃ اکاؤنٹ",
      bankEn: "Meezan Bank — Jamia Ghousia Zia-Ul-Uloom Zakat Account",
      bankUr: "میزان بینک — جامعہ غوثیہ ضیاء العلوم زکوٰۃ اکاؤنٹ",
      account: "PK00 MEZN 0000 0000 0000 0001 (placeholder)",
      title: "Jamia Ghousia Zia-Ul-Uloom Zakat Fund",
    },
    general: {
      titleEn: "General & Sadaqah account",
      titleUr: "عمومی و صدقہ اکاؤنٹ",
      bankEn: "Meezan Bank — Jamia Ghousia Zia-Ul-Uloom General Account",
      bankUr: "میزان بینک — جامعہ غوثیہ ضیاء العلوم عمومی اکاؤنٹ",
      account: "PK00 MEZN 0000 0000 0000 0002 (placeholder)",
      title: "Jamia Ghousia Zia-Ul-Uloom General Fund",
    },
  },
  social: {
    facebook: "https://www.facebook.com/ziaululoom.92",
    youtube: "https://youtube.com/",
    instagram: "https://instagram.com/",
    x: "https://x.com/",
    whatsapp: "https://wa.me/92515509922",
  },
};

export const BRANCHES = [
  {
    nameEn: "Jamia Ghousia Zia Ul Uloom (Main Branch)",
    nameUr: "جامعہ غوثیہ ضیاء العلوم (مرکزی شاخ)",
    addressEn: "Line No. 07, Eastridge Housing Society, High Court Road, Rawalpindi",
    addressUr: "لائن نمبر 07، ایسٹ رج ہاؤسنگ سوسائٹی، ہائی کورٹ روڈ، راولپنڈی",
    phones: ["051-5509922", "051-6164886", "0331-5323632"],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Jamia+Ghousia+Zia+Ul+Uloom%2C+Line+No+07%2C+Eastridge+Housing+Society%2C+High+Court+Road%2C+Rawalpindi",
  },
  {
    nameEn: "Jamia Muhammadia Ghousia Zia Ul Uloom (Saddar Branch)",
    nameUr: "جامعہ محمدیہ غوثیہ ضیاء العلوم (صدر برانچ)",
    addressEn: "Molvi Mohallah, Saddar, Rawalpindi",
    addressUr: "مولوی محلہ، صدر، راولپنڈی",
    phones: ["051-5564913"],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Jamia+Muhammadia+Ghousia+Zia+Ul+Uloom%2C+Molvi+Mohallah%2C+Saddar%2C+Rawalpindi",
  },
  {
    nameEn: "Jamia Zia Ul Uloom Atta Ul Habib Lil-Banat (Girls Campus)",
    nameUr: "جامعہ ضیاء العلوم عطاء الحبیب للبنات (طالبات کیمپس)",
    addressEn: "Opposite Al-Shifa Eye Hospital, Rawalpindi",
    addressUr: "الشفاء آئی ہسپتال کے سامنے، راولپنڈی",
    phones: ["051-8918811"],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Jamia+Zia+Ul+Uloom+Atta+Ul+Habib+Lil-Banat%2C+Opposite+Al-Shifa+Eye+Hospital%2C+Rawalpindi",
  },
] as const;

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
    image: "/images/courtyard.jpg",
    eyebrowEn: "Established 1989 · Rawalpindi, Pakistan",
    eyebrowUr: "قائم شدہ 1989 · راولپنڈی، پاکستان",
    titleEn: "Knowledge, character and service",
    titleUr: "علم، کردار اور خدمت",
    verseAr: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    verseEn: "“Read in the name of your Lord who created.” — Al-Alaq 96:1",
    verseUr: "«پڑھو اپنے رب کے نام سے جس نے پیدا کیا۔» — العلق 96:1",
  },
  {
    image: "/images/students-hall.jpg",
    eyebrowEn: "Classes & Halaqahs",
    eyebrowUr: "سبق اور حلقے",
    titleEn: "Small classes, close mentorship",
    titleUr: "چھوٹی کلاسیں، قریبی رہنمائی",
    verseAr: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    verseEn: "“My Lord, increase me in knowledge.” — Ta-Ha 20:114",
    verseUr: "«اے میرے رب! میرے علم میں اضافہ فرما۔» — طٰہٰ 20:114",
  },
  {
    image: "/images/books-b.jpg",
    eyebrowEn: "Digital Library",
    eyebrowUr: "ڈیجیٹل کتب خانہ",
    titleEn: "A library open to every seeker",
    titleUr: "ہر طالبِ علم کے لیے کھلا کتب خانہ",
    verseAr: "هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
    verseEn: "“Are those who know equal to those who do not know?” — Az-Zumar 39:9",
    verseUr: "«کیا جاننے والے اور نہ جاننے والے برابر ہیں؟» — الزمر 39:9",
  },
  {
    image: "/images/students-building.jpg",
    eyebrowEn: "Convocation",
    eyebrowUr: "کانووکیشن",
    titleEn: "Graduates serving across Pakistan",
    titleUr: "پاکستان بھر میں خدمت کرتے فارغ التحصیل",
    verseAr: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    verseEn: "“The best of people are those most beneficial to people.” — Hadith",
    verseUr: "«لوگوں میں بہترین وہ ہے جو لوگوں کے لیے سب سے زیادہ نفع بخش ہو۔» — حدیث",
  },
  {
    image: "/images/dome.jpg",
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
  { href: "/api/pdf/prospectus/prospectus-2027", image: "/images/campus-angle.jpg", titleKey: "admissions.prospectus", textEn: "Download PDF", textUr: "پی ڈی ایف ڈاؤن لوڈ" },
  { href: "/darul-ifta/ask", image: "/images/scholar-reading.jpg", titleKey: "home.askQuestion", textEn: "Private & tracked", textUr: "نجی اور ٹریک شدہ" },
  { href: "/library?category=Khutbat", image: "/images/books-c.jpg", titleKey: "home.pdf", textEn: "Khutbat & Durus", textUr: "خطبات و دروس" },
  { href: "/students", image: "/images/students-hall.jpg", titleKey: "home.studentLife", textEn: "Hostel & campus", textUr: "ہاسٹل و کیمپس" },
  { href: "/qurbani", image: "/images/dome-city.jpg", titleKey: "qurbani.title", textEn: "Book a hissa", textUr: "حصہ بک کریں" },
];

export const WHY_US = [
  {
    icon: "quran",
    image: "/images/books-c.jpg",
    titleEn: "Traditional scholarship, verified chains",
    titleUr: "روایتی علم، مستند اسناد",
    textEn: "Alimiyyah and degree programmes taught by Muftis and PhD scholars with ijazah in Hadith and Fiqh.",
    textUr: "عالمیت اور ڈگری پروگرام مفتیان اور پی ایچ ڈی علماء کے زیرِ تعلیم، حدیث و فقہ میں اجازت کے ساتھ۔",
  },
  {
    icon: "users",
    image: "/images/students-hall.jpg",
    titleEn: "Small halaqahs, personal attention",
    titleUr: "چھوٹے حلقے، ذاتی توجہ",
    textEn: "A 1:14 teacher-to-student ratio with weekly mentoring and academic counselling.",
    textUr: "استاد اور طالب علم کا تناسب 1:14، ہفتہ وار رہنمائی اور تعلیمی مشاورت کے ساتھ۔",
  },
  {
    icon: "heart",
    image: "/images/students-building.jpg",
    titleEn: "Welfare that removes barriers",
    titleUr: "فلاح و بہبود جو رکاوٹیں دور کرے",
    textEn: "Zakat-funded scholarships, free meals and hostel support for students who need it most.",
    textUr: "زکوٰۃ سے چلنے والے وظائف، مفت کھانا اور ہاسٹل معاونت ان طلبہ کے لیے جنہیں سب سے زیادہ ضرورت ہے۔",
  },
  {
    icon: "globe",
    image: "/images/campus-angle.jpg",
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

export const PROGRAMME_IMAGES: Record<string, string> = {
  "bs-islamic-studies": "/images/books-b.jpg",
  "bs-quran-tafseer": "/images/scholar-reading.jpg",
  "bs-hadith-seerah": "/images/books-c.jpg",
  alimiyyah: "/images/students-hall.jpg",
  "hifz-tajweed": "/images/students-hall-aerial.jpg",
  "bs-arabic": "/images/books-a.jpg",
  "diploma-islamic-finance": "/images/campus-angle.jpg",
};
export const DEFAULT_PROGRAMME_IMAGE = "/images/campus-angle.jpg";

export const PDF_IMAGES: Record<string, string> = {
  Khutbat: "/images/dome.jpg",
  "Durus-e-Quran": "/images/scholar-reading.jpg",
  "Durus-e-Hadith": "/images/books-c.jpg",
  "Fiqh Masail": "/images/books-b.jpg",
};
export const DEFAULT_PDF_IMAGE = "/images/books-a.jpg";
export const FATWA_IMAGES = ["/images/books-b.jpg", "/images/books-a.jpg", "/images/books-c.jpg"];

export const VALUES = [
  { titleEn: "Amanah (Trust)", titleUr: "امانت", textEn: "Every donation, record and answer is handled as a trust.", textUr: "ہر عطیہ، ریکارڈ اور جواب امانت سمجھ کر سنبھالا جاتا ہے۔" },
  { titleEn: "Ihsan (Excellence)", titleUr: "احسان", textEn: "We teach, serve and administer to the highest standard we can reach.", textUr: "ہم تدریس، خدمت اور انتظام میں بہترین معیار تک پہنچنے کی کوشش کرتے ہیں۔" },
  { titleEn: "Adl (Justice)", titleUr: "عدل", textEn: "Fair dealing, transparent fees and equitable welfare.", textUr: "منصفانہ معاملات، شفاف فیس اور غیر جانبدارانہ فلاح۔" },
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
  { name: "Higher Education Commission", nameUr: "ہائیر ایجوکیشن کمیشن", logo: "/images/logo-hec.png" },
  { name: "Tanzeem ul Madaris", nameUr: "تنظیم المدارس", logo: "/images/logo-tanzeem.png" },
];

// Teachers shown on the About page (names only).
export const TEACHERS = [
  { en: "Sheikh ul Hadith Allama Peer Syed Zia Ul Haq Shah Sahib", ur: "شیخ الحدیث علامہ پیر سید ضیاء الحق شاہ صاحب", photo: "/images/rector-sheikh.jpg" },
  { en: "Sayyid Ihsanul Haq Shah Sahib", ur: "سید احسان الحق شاہ صاحب" },
  { en: "Sayyid Inayatul Haq Shah Sahib", ur: "سید عنایت الحق شاہ صاحب" },
  { en: "Sayyid Faridul Haq Shah Sahib", ur: "سید فرید الحق شاہ صاحب" },
  { en: "Sayyid Shamsul Haq Shah Sahib", ur: "سید شمس الحق شاہ صاحب" },
  { en: "Maulana Hidayatullah Sahib", ur: "مولانا ہدایت اللہ صاحب" },
  { en: "Maulana Amir Afzal Sahib", ur: "مولانا امیر افضل صاحب" },
  { en: "Maulana Tanveer Sahib", ur: "مولانا تنویر صاحب" },
  { en: "Maulana Ikramul Haq Qureshi Sahib", ur: "مولانا اکرام الحق قریشی صاحب" },
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
  campusHero: "/images/courtyard.jpg",
  campus: "/images/campus-angle.jpg",
  campusAlt: "/images/courtyard-cars.jpg",
  campusModern: "/images/students-building.jpg",
  campusTower: "/images/dome-city.jpg",
  library: "/images/books-b.jpg",
  books: "/images/books-a.jpg",
  quran: "/images/scholar-reading.jpg",
  oldBooks: "/images/books-c.jpg",
  calligraphy: "/images/books-a.jpg",
  graduation: "/images/students-hall-aerial.jpg",
  classroom: "/images/students-hall.jpg",
  rector: "/images/rector-portrait.jpg",
  rectorWide: "/images/rector-podium.jpg",
  cow1: "https://images.pexels.com/photos/16846562/pexels-photo-16846562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow2: "https://images.pexels.com/photos/7164014/pexels-photo-7164014.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow3: "https://images.pexels.com/photos/11684963/pexels-photo-11684963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow4: "https://images.pexels.com/photos/5798535/pexels-photo-5798535.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow5: "https://images.pexels.com/photos/5216152/pexels-photo-5216152.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cow6: "https://images.pexels.com/photos/8633329/pexels-photo-8633329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

export const SEASONAL_KEYS = ["ramadan", "eid_fitr", "muharram", "rabi_awwal", "eid_adha", "academic"];

// Existing site pictures used wherever the photo gallery is still empty.
export const STATIC_GALLERY = [
  { url: "/images/courtyard.jpg", en: "Campus courtyard", ur: "کیمپس صحن" },
  { url: "/images/students-hall.jpg", en: "Class in session", ur: "سبق کا منظر" },
  { url: "/images/dome.jpg", en: "The Green Dome", ur: "گنبدِ خضریٰ" },
  { url: "/images/quran.jpg", en: "Quran study", ur: "قرآن کی تعلیم" },
  { url: "/images/library.jpg", en: "Library", ur: "کتب خانہ" },
  { url: "/images/graduation.jpg", en: "Graduation", ur: "تقریبِ تقسیمِ اسناد" },
  { url: "/images/students-building.jpg", en: "Main building", ur: "مرکزی عمارت" },
  { url: "/images/campus-angle.jpg", en: "Campus view", ur: "کیمپس کا منظر" },
  { url: "/images/classroom.jpg", en: "Classroom", ur: "کلاس روم" },
];
