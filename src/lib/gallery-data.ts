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
  photos: { file: string; captionEn: string; captionUr: string }[];
};

const MAIN_EN = "Main Branch";
const MAIN_UR = "مرکزی شاخ";

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "rector",
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
    titleEn: "Milad Conference",
    titleUr: "میلاد کانفرنس",
    descEn: "Mehfil-e-Milad-e-Mustafa ﷺ at the university.",
    descUr: "جامعہ میں محفلِ میلادِ مصطفیٰ ﷺ۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "milad-01", captionEn: "Mehfil-e-Milad-e-Mustafa ﷺ — dua", captionUr: "محفلِ میلادِ مصطفیٰ ﷺ — دعا" },
    ],
  },
  {
    id: "prize-distribution",
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
    titleEn: "Teachers & Guests",
    titleUr: "اساتذہ و مہمان",
    descEn: "Teachers of the university and fellow scholars at our programmes.",
    descUr: "جامعہ کے اساتذہ اور ہمارے پروگراموں میں شریک علماء۔",
    branchEn: MAIN_EN, branchUr: MAIN_UR,
    photos: [
      { file: "teachers-01", captionEn: "A speaker at the podium", captionUr: "منبر پر خطاب کرتے ہوئے" },
      { file: "teachers-02", captionEn: "Teachers at the programme", captionUr: "پروگرام میں اساتذہ" },
      { file: "teachers-03", captionEn: "Teachers at the programme", captionUr: "پروگرام میں اساتذہ" },
    ],
  },
  // ---- Sections waiting for photos (hidden until you add some) ----
  { id: "first-aid", titleEn: "First Aid Training", titleUr: "فرسٹ ایڈ ٹریننگ", descEn: "First aid training for students and staff.", descUr: "طلبہ و عملے کے لیے فرسٹ ایڈ ٹریننگ۔", branchEn: MAIN_EN, branchUr: MAIN_UR, photos: [] },
  { id: "jashn-e-azadi", titleEn: "Jashn-e-Azadi", titleUr: "جشنِ آزادی", descEn: "Independence Day celebrations.", descUr: "یومِ آزادی کی تقریبات۔", branchEn: MAIN_EN, branchUr: MAIN_UR, photos: [] },
  { id: "mujaddadan", titleEn: "Mujaddadan Conference", titleUr: "مجددین کانفرنس", descEn: "The Mujaddadan Conference.", descUr: "مجددین کانفرنس۔", branchEn: MAIN_EN, branchUr: MAIN_UR, photos: [] },
];

export const GALLERY_COVER = "/images/gallery/bukhari-01.jpg";
