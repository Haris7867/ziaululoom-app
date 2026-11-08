import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingByReceipt } from "@/lib/data";
import { PaymentPanel } from "@/components/forms/PaymentPanel";
import { Callout } from "@/components/ui";
import { T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { formatDateTime, formatPkr } from "@/lib/format";
import { UNIVERSITY } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Complete your Qurbani payment", robots: { index: false } };

export default async function PayPage({ params }: { params: Promise<{ receiptId: string }> }) {
  const { receiptId } = await params;
  const booking = await getBookingByReceipt(receiptId);
  if (!booking) notFound();
  const shares = Array.isArray(booking.shareNumbers) ? (booking.shareNumbers as number[]) : [];

  return (
    <section className="section">
      <div className="container-x grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Link href="/qurbani" className="link-underline text-sm">← <T k="qurbani.title" /></Link>
          <h1 className="mt-2 text-3xl font-bold"><T k="qurbani.payTitle" /></h1>
          <p className="mt-1 text-sm text-ink/70">
            <T k="qurbani.receiptId" />: <strong dir="ltr">{booking.receiptId}</strong> · {formatDateTime(booking.createdAt)}
          </p>
          <div className="card mt-4 p-5">
            <PaymentPanel receiptId={booking.receiptId} amount={booking.amount} currentMethod={booking.paymentMethod} status={booking.status} />
          </div>
        </div>
        <aside className="space-y-3">
          <div className="card p-5">
            <h2 className="text-lg"><T k="qurbani.receipt" /></h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.buyerName" /></dt><dd className="font-semibold">{booking.buyerName}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.cow" /></dt><dd className="font-semibold">#{booking.cowNumber}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.shares" /></dt><dd className="font-semibold">{shares.join(", ")}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.liveTotal" /></dt><dd className="font-semibold" dir="ltr">{formatPkr(booking.amount)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.status" /></dt><dd className="font-semibold">{booking.status}</dd></div>
              {booking.holdExpiresAt && <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.holdExpires" /></dt><dd className="font-semibold">{formatDateTime(booking.holdExpiresAt)}</dd></div>}
            </dl>
            <p className="mt-2 text-xs text-ink/55"><T k="qurbani.emailReceipt" /></p>
          </div>
          <Callout icon="shield" title="Bank details (placeholder)">
            <p>{UNIVERSITY.bank.general.bankEn}</p>
            <p className="font-mono" dir="ltr">{UNIVERSITY.bank.general.account}</p>
            <p className="mt-1">{UNIVERSITY.bank.zakat.bankEn}</p>
            <p className="font-mono" dir="ltr">{UNIVERSITY.bank.zakat.account}</p>
          </Callout>
          <div className="card p-5">
            <h2 className="text-lg"><T k="qurbani.payCash" /></h2>
            <p className="mt-1 text-sm text-ink/70">{UNIVERSITY.addressEn} · {UNIVERSITY.phone}</p>
            <a href={`tel:${UNIVERSITY.phoneHref}`} className="btn btn-outline mt-2 w-full !py-1.5 !text-xs"><Icon name="phone" size={14} /> <T k="nav.contact" /></a>
          </div>
        </aside>
      </div>
    </section>
  );
}
