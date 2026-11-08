import type { Metadata } from "next";
import { EnquiryForm, NewsletterForm } from "@/components/forms/EnquiryForm";
import { PageHero, SectionHeading, Callout } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { IMAGES, UNIVERSITY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Enquiries",
  description: "Visit the campus on Canal Road, Lahore, call +92 300 1234567, request a callback, download the prospectus or subscribe to the newsletter.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact & Enquiries", images: ["/images/campus-hero.jpg"] },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image={IMAGES.campusAlt}
        eyebrowEn="Contact"
        eyebrowUr="رابطہ"
        titleEn="Contact & Enquiries"
        titleUr="رابطہ و استفسارات"
        subtitleEn="Visit the campus, call the office or send a message — we reply within one working day."
        subtitleUr="کیمپس تشریف لائیں، دفتر کو فون کریں یا پیغام بھیجیں — ہم ایک کاروباری دن میں جواب دیتے ہیں۔"
      >
        <a href={`tel:${UNIVERSITY.phoneHref}`} className="btn btn-gold"><Icon name="phone" size={16} /> {UNIVERSITY.phone}</a>
        <a href={UNIVERSITY.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-green"><Icon name="whatsapp" size={16} /> <T k="contact.whatsappChat" /></a>
      </PageHero>

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="card p-5">
            <SectionHeading eyebrow="Enquiry" titleEn="Quick enquiry" titleUr="مختصر استفسار" subtitleEn="Five fields maximum — we only ask what we need." subtitleUr="زیادہ سے زیادہ پانچ فیلڈز — ہم صرف ضروری معلومات پوچھتے ہیں۔" />
            <EnquiryForm compact />
            <div className="mt-5 border-t border-deep/10 pt-4">
              <h3 className="text-base font-bold text-deep"><T k="contact.callback" /></h3>
              <p className="mb-2 text-xs text-ink/60">Leave your number and a preferred time; the office calls between 9 am and 4 pm.</p>
              <EnquiryForm variant="callback" compact />
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-deep/15">
              <iframe title={UNIVERSITY.addressEn} src={UNIVERSITY.mapEmbed} className="h-64 w-full" loading="lazy" />
            </div>
            <div className="card p-5">
              <h2 className="text-lg"><T k="footer.contact" /></h2>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex gap-2"><Icon name="pin" size={16} className="mt-1 shrink-0 text-fresh" /> <Bi en={UNIVERSITY.addressEn} ur={UNIVERSITY.addressUr} /></li>
                <li className="flex gap-2"><Icon name="phone" size={16} className="mt-1 shrink-0 text-fresh" /> <a href={`tel:${UNIVERSITY.phoneHref}`} dir="ltr">{UNIVERSITY.phone}</a></li>
                <li className="flex gap-2"><Icon name="mail" size={16} className="mt-1 shrink-0 text-fresh" /> {UNIVERSITY.email} · {UNIVERSITY.admissionsEmail}</li>
                <li className="flex gap-2"><Icon name="clock" size={16} className="mt-1 shrink-0 text-fresh" /> <Bi en={UNIVERSITY.hoursEn} ur={UNIVERSITY.hoursUr} /></li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={UNIVERSITY.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline !py-1.5 !text-xs"><Icon name="external" size={13} /> <T k="home.mapTitle" /></a>
                <a href="/api/pdf/prospectus/prospectus-2027" className="btn btn-outline !py-1.5 !text-xs"><Icon name="download" size={13} /> <T k="admissions.prospectus" /></a>
              </div>
            </div>
            <div className="card p-5">
              <NewsletterForm />
            </div>
            <Callout icon="shield" title="What we do with your data">
              <Bi
                en="Enquiries are stored in the Leads list and used only to respond to you. We never sell data. See the privacy policy for details and your rights."
                ur="استفسارات لیڈز فہرست میں محفوظ ہوتے ہیں اور صرف جواب دینے کے لیے استعمال ہوتے ہیں۔ ہم ڈیٹا فروخت نہیں کرتے۔ تفصیل کے لیے پرائیویسی پالیسی دیکھیں۔"
              />
            </Callout>
          </div>
        </div>
      </section>
    </>
  );
}
