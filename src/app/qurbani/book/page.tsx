import type { Metadata } from "next";
import Link from "next/link";
import { getActiveSeason, getCowBoard } from "@/lib/data";
import { BookingWizard } from "@/components/forms/BookingWizard";
import { Callout } from "@/components/ui";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { formatDate, formatPkr } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Qurbani hissa",
  description: "Three steps: choose your hissa, enter your details and pay by card, JazzCash, Easypaisa, UPaisa or bank transfer. Slots are held for 30 minutes.",
  alternates: { canonical: "/qurbani/book" },
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ cow?: string; type?: string }> }) {
  const params = await searchParams;
  const season = await getActiveSeason();
  if (!season) {
    return <section className="section container-x"><h1 className="text-3xl">Qurbani booking is closed</h1></section>;
  }
  const board = await getCowBoard(season.id);
  const cows = board
    .filter((cow) => cow.vetStatus === "Fit for Qurbani")
    .map((cow) => ({
      id: cow.id,
      cowNumber: cow.cowNumber,
      breed: cow.breed,
      weightKg: cow.weightKg,
      vetStatus: cow.vetStatus,
      freeShares: 7 - cow.shares.filter((s) => s.status !== "Available").length,
    }))
    .sort((a, b) => (params.cow === a.cowNumber ? -1 : params.cow === b.cowNumber ? 1 : b.freeShares - a.freeShares));

  return (
    <section className="section">
      <div className="container-x grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Link href="/qurbani" className="link-underline text-sm">← <T k="qurbani.title" /></Link>
          <h1 className="mt-2 text-3xl font-bold"><T k="qurbani.bookHissa" /></h1>
          <p className="mt-1 text-ink/75"><T k="qurbani.subtitle" /></p>
          <div className="mt-4">
            <BookingWizard cows={cows} sharePrice={season.sharePrice} deadline={new Date(season.bookingDeadline).toISOString()} />
          </div>
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg"><T k="qurbani.liveTotal" /></h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-ink/60"><T k="qurbani.share" /></dt><dd className="font-semibold" dir="ltr">{formatPkr(season.sharePrice)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60"><T k="qurbani.cow" /> (7)</dt><dd className="font-semibold" dir="ltr">{formatPkr(season.cowPrice)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">Aqeeqah</dt><dd className="font-semibold" dir="ltr">{formatPkr(season.aqeeqahPrice)}</dd></div>
              <div className="flex justify-between border-t border-deep/10 pt-1.5"><dt className="text-ink/60"><T k="qurbani.expectedSlaughter" /></dt><dd className="font-semibold">{formatDate(season.slaughterStart)}</dd></div>
            </dl>
          </div>
          <Callout icon="clock" title="30-minute hold">
            <Bi
              en="Selecting a hissa reserves it for 30 minutes while you pay. If payment is not completed, the slot returns to the board automatically. If two buyers select the same slot, the first confirmed payment wins."
              ur="حصہ منتخب کرنے پر وہ ادائیگی تک 30 منٹ کے لیے محفوظ ہو جاتا ہے۔ ادائیگی نہ ہونے پر سلاٹ خودکار طور پر واپس آ جاتا ہے۔ دو خریدار ایک ہی سلاٹ منتخب کریں تو پہلی تصدیق شدہ ادائیگی معتبر ہوگی۔"
            />
          </Callout>
          <div className="card p-5">
            <h2 className="text-lg"><T k="qurbani.rules" /></h2>
            <ul className="mt-1.5 space-y-1 text-sm text-ink/75">
              <li>• <Bi en="Cow or buffalo at least 2 years old, vet-checked." ur="گائے یا بھینس کم از کم 2 سال، ویٹرنری جانچ شدہ۔" /></li>
              <li>• <Bi en="Slaughter from after Eid prayer on 10 Dhul Hijjah to sunset on 12 Dhul Hijjah." ur="10 ذی الحجہ نمازِ عید کے بعد سے 12 ذی الحجہ غروبِ آفتاب تک۔" /></li>
              <li>• <Bi en="Full refund if cancelled within 7 days and 72 hours before slaughter." ur="7 دن کے اندر اور ذبح سے 72 گھنٹے پہلے منسوخی پر مکمل رقم واپسی۔" /></li>
            </ul>
            <Link href="/qurbani/faq" className="btn btn-outline mt-2 w-full !py-1.5 !text-xs"><Icon name="question" size={14} /> <T k="qurbani.faq" /></Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
