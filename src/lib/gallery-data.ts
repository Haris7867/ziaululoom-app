// Photo gallery sections. To add photos: copy the picture into public/images/gallery/
// and add a line under the right section. Sections with no photos stay hidden.
// "date" is optional (for example "12 May 2026"); leave it out if unknown.

export type GallerySection = {
  id: string;
  titleEn: string;
  titleUr: string;
  descEn: string;
  descUr: string;
  branchEn: string;
  branchUr: string;
  date?: string;
  /** Featured picture shown large at the top of the section (file name without .jpg). */
  cover?: string;
  photos: { file: string; captionEn: string; captionUr: string }[];
};

const MAIN_EN = "Main Branch";
const MAIN_UR = "مرکزی شاخ";

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "rector",
    cover: "rector-04",
    titleEn: "Our Rector",
    titleUr: "ہمارے مہتمم",
    descEn: "Sheikh ul Hadith Allama Peer Syed Zia Ul Haq Shah Sahib, Rector of Jamia Ghousia Zia-Ul-Uloom.",
    descUr: "شیخ الحدیث علامہ پیر سید ضیاء الحق شاہ صاحب، مہتمم جامعہ غوثیہ ضیاء العلوم۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "rector-03", captionEn: "Sheikh ul Hadith Allama Peer Syed Zia Ul Haq Shah Sahib addressing a gathering", captionUr: "شیخ الحدیث علامہ پیر سید ضیاء الحق شاہ صاحب خطاب کرتے ہوئے" },
      { file: "rector-04", captionEn: "The Rector leading the dua with guests and scholars", captionUr: "مہتمم صاحب علماء و مہمانوں کے ساتھ دعا کراتے ہوئے" },
      { file: "rector-01", captionEn: "The Rector during a blessed visit", captionUr: "مہتمم صاحب ایک بابرکت حاضری کے دوران" },
      { file: "rector-02", captionEn: "The Rector during a blessed visit", captionUr: "مہتمم صاحب ایک بابرکت حاضری کے دوران" },
    ],
  },
  {
    id: "rector-sons",
    cover: "sons-02",
    titleEn: "The Rector with his sons",
    titleUr: "مہتمم صاحب اپنے صاحبزادگان کے ہمراہ",
    descEn: "The Rector with his beloved sons.",
    descUr: "مہتمم صاحب اپنے لختِ جگر صاحبزادگان کے ہمراہ۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "sons-01", captionEn: "The Rector with his sons", captionUr: "مہتمم صاحب اپنے صاحبزادگان کے ہمراہ" },
      { file: "sons-02", captionEn: "The Rector with his son", captionUr: "مہتمم صاحب اپنے صاحبزادے کے ہمراہ" },
    ],
  },
  {
    id: "khatm-e-bukhari",
    cover: "bukhari-01",
    titleEn: "Khatm-e-Bukhari Sharif",
    titleUr: "ختمِ بخاری شریف",
    descEn: "The annual completion of Sahih al-Bukhari at Jamia Ghousia Zia-Ul-Uloom.",
    descUr: "جامعہ غوثیہ ضیاء العلوم میں صحیح بخاری کے سالانہ ختم کی تقریب۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "bukhari-01", captionEn: "Khatm-e-Bukhari Sharif — scholars and guests on stage", captionUr: "ختمِ بخاری شریف — اسٹیج پر علماء و مہمان" },
      { file: "bukhari-02", captionEn: "Khatm-e-Bukhari Sharif — concluding dua", captionUr: "ختمِ بخاری شریف — اختتامی دعا" },
    ],
  },
  {
    id: "milad",
    cover: "milad-conf-05",
    titleEn: "Milad-e-Mustafa Conference",
    titleUr: "میلادِ مصطفیٰ ﷺ کانفرنس",
    descEn: "The Milad-e-Mustafa ﷺ Conference at Jamia Ghousia Zia-Ul-Uloom.",
    descUr: "جامعہ غوثیہ ضیاء العلوم میں میلادِ مصطفیٰ ﷺ کانفرنس۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "milad-conf-01", captionEn: "The university building lit up for the conference night", captionUr: "کانفرنس کی رات روشنیوں سے سجی جامعہ کی عمارت" },
      { file: "milad-conf-02", captionEn: "Milad-e-Mustafa Conference — programme on stage", captionUr: "میلادِ مصطفیٰ کانفرنس — اسٹیج پر پروگرام" },
      { file: "milad-conf-03", captionEn: "Guests gathering at the campus", captionUr: "کیمپس میں مہمانوں کی آمد" },
      { file: "milad-conf-04", captionEn: "The campus and green dome lit up", captionUr: "روشنیوں سے منور کیمپس اور سبز گنبد" },
      { file: "milad-conf-06", captionEn: "Address from the stage", captionUr: "اسٹیج سے خطاب" },
      { file: "milad-01", captionEn: "Mehfil-e-Milad-e-Mustafa ﷺ — dua", captionUr: "محفلِ میلادِ مصطفیٰ ﷺ — دعا" },
    ],
  },
  {
    id: "mujaddadan",
    cover: "mujaddadan-03",
    titleEn: "Mujaddadan Conference",
    titleUr: "مجددین کانفرنس",
    descEn: "The Mujaddadan Conference at the main branch.",
    descUr: "مرکزی شاخ میں مجددین کانفرنس۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "mujaddadan-01", captionEn: "A speaker at the Mujaddadan Conference", captionUr: "مجددین کانفرنس میں خطاب" },
      { file: "mujaddadan-02", captionEn: "Scholars, teachers and students at the conference", captionUr: "کانفرنس میں علماء، اساتذہ اور طلبہ" },
      { file: "mujaddadan-04", captionEn: "Students listening to the conference", captionUr: "کانفرنس سنتے ہوئے طلبہ" },
      { file: "mujaddadan-05", captionEn: "An address at the podium", captionUr: "منبر سے خطاب" },
    ],
  },
  {
    id: "iftetah-e-asbaq",
    cover: "iftetah-01",
    titleEn: "Iftetah-e-Asbaq",
    titleUr: "افتتاحِ اسباق",
    descEn: "The opening of the new lessons at the start of the academic session.",
    descUr: "تعلیمی سال کے آغاز پر نئے اسباق کا افتتاح۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "iftetah-02", captionEn: "Students and guests gathered for the opening of lessons", captionUr: "افتتاحِ اسباق کے لیے طلبہ و مہمانوں کا اجتماع" },
      { file: "iftetah-03", captionEn: "Scholars and teachers seated on the stage", captionUr: "اسٹیج پر علماء و اساتذہ" },
      { file: "teachers-01", captionEn: "A speaker at the Iftetah-e-Asbaq programme", captionUr: "افتتاحِ اسباق کے پروگرام میں خطاب" },
      { file: "iftetah-04", captionEn: "Address at the podium", captionUr: "منبر سے خطاب" },
      { file: "iftetah-05", captionEn: "The opening lesson", captionUr: "پہلا سبق" },
      { file: "iftetah-06", captionEn: "Students holding their copies of Sahih al-Bukhari", captionUr: "طلبہ صحیح بخاری کے نسخوں کے ساتھ" },
    ],
  },
  {
    id: "prize-distribution",
    cover: "prizes-01",
    titleEn: "Prize Distribution Ceremony",
    titleUr: "تقریبِ تقسیمِ انعامات و اعزازات",
    descEn: "Honouring position-holding students of Tanzeem ul Madaris Ahle Sunnat Pakistan.",
    descUr: "تنظیم المدارس اہلسنت پاکستان کے پوزیشن حاصل کرنے والے طلبہ کی حوصلہ افزائی۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "prizes-01", captionEn: "Prize distribution ceremony — teachers, guests and students", captionUr: "تقریبِ تقسیمِ انعامات — اساتذہ، مہمان اور طلبہ" },
    ],
  },
  {
    id: "teachers",
    cover: "teachers-02",
    titleEn: "Teachers & Guests",
    titleUr: "اساتذہ و مہمان",
    descEn: "Teachers of the university and fellow scholars at our programmes.",
    descUr: "جامعہ کے اساتذہ اور ہمارے پروگراموں میں شریک علماء۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "teachers-02", captionEn: "Teachers at the programme", captionUr: "پروگرام میں اساتذہ" },
      { file: "teachers-03", captionEn: "Teachers at the programme", captionUr: "پروگرام میں اساتذہ" },
    ],
  },
  // ---- Sections waiting for photos (hidden until you add some) ----
  { id: "first-aid", titleEn: "First Aid Training", titleUr: "فرسٹ ایڈ ٹریننگ", descEn: "First aid training for students and staff.", descUr: "طلبہ و عملے کے لیے فرسٹ ایڈ ٹریننگ۔", branchEn: MAIN_EN, branchUr: MAIN_UR, photos: [] },
  { id: "jashn-e-azadi", titleEn: "Jashn-e-Azadi", titleUr: "جشنِ آزادی", descEn: "Independence Day celebrations.", descUr: "یومِ آزادی کی تقریبات۔", branchEn: MAIN_EN, branchUr: MAIN_UR, photos: [] },
];

export const GALLERY_COVER = "/images/gallery/bukhari-01.jpg";
