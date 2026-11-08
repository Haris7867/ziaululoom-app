import type { Metadata } from "next";
import Link from "next/link";
import { StatusLookup } from "@/components/forms/StatusLookup";
import { PageHero } from "@/components/ui";
import { T } from "@/components/Bi";
import { IMAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Check my Qurbani booking",
  description: "Look up your Qurbani booking with your receipt ID and phone number. Shows your status, cow and hissa numbers, and dispatch date only.",
  alternates: { canonical: "/qurbani/status" },
};

export default function StatusPage() {
  return (
    <>
      <PageHero image={IMAGES.cow3} eyebrowEn="Qurbani 2027" eyebrowUr="قربانی 2027" titleEn="Check my booking" titleUr="میری بکنگ چیک کریں" subtitleEn="Receipt ID plus phone number. No other buyer's data is ever shown." subtitleUr="رسید نمبر اور فون نمبر۔ کسی دوسرے خریدار کا ڈیٹا نہیں دکھایا جاتا۔" />
      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-5">
            <h1 className="text-xl font-bold"><T k="qurbani.checkTitle" /></h1>
            <p className="mb-4 text-sm text-ink/70"><T k="qurbani.checkSub" /></p>
            <StatusLookup />
            <div className="mt-4 rounded-md bg-light p-3 text-xs text-deep">
              <p className="font-bold">Demo lookup</p>
              <p>QRB-2027-000123 · +92 300 1234567</p>
            </div>
          </div>
          <aside className="space-y-3">
            <div className="card p-5">
              <h2 className="text-lg"><T k="qurbani.lookupHelp" /></h2>
              <p className="mt-1 text-sm text-ink/70"><T k="qurbani.emailReceipt" /></p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/qurbani/book" className="btn btn-primary !py-1.5 !text-xs"><T k="qurbani.bookHissa" /></Link>
                <Link href="/qurbani/receipt/QRB-2027-000123" className="btn btn-outline !py-1.5 !text-xs"><T k="qurbani.receipt" /></Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
