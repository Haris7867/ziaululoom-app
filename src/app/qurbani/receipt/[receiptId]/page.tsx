import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getBookingByReceipt } from "@/lib/data";
import { Bi, T } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { Callout } from "@/components/ui";
import { formatDateTime, formatPkr } from "@/lib/format";
import { RECEIPT_DUA } from "@/lib/whatsapp";
import { siteUrl } from "@/lib/pdf";
import { UNIVERSITY } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Qurbani receipt", robots: { index: false } };

export default async function ReceiptPage({ params }: { params: Promise<{ receiptId: string }> }) {
  const { receiptId } = await params;
  const booking = await getBookingByReceipt(receiptId);
  if (!booking) notFound();
  const shares = Array.isArray(booking.shareNumbers) ? (booking.shareNumbers as number[]) : [];
  const paid = booking.paymentStatus === "paid" || booking.paymentStatus === "verified";
  const statusUrl = siteUrl(`/qurbani/status?receipt=${booking.receiptId}`);
  const qr = await QRCode.toDataURL(statusUrl, { margin: 1, width: 260, color: { dark: "#00633A", light: "#FFFFFF" } });

  return (
    <section className="section">
      <div className="container-x max-w-4xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 no-print">
          <Link href="/qurbani" className="link-underline text-sm">← <T k="qurbani.title" /></Link>
          <span className="badge badge-gold"><T k="qurbani.sampleNote" /></span>
        </div>

        <article className="overflow-hidden rounded-xl border border-deep/15 bg-white shadow-lg">
          <header className="bg-deep px-6 py-5 text-white">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold">Al-Noor Islamic University</p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl"><T k="qurbani.receipt" /> · Qurbani 2027</h1>
                <p className="text-xs text-white/75">{UNIVERSITY.addressEn} · {UNIVERSITY.email}</p>
              </div>
              <div className="rounded-md bg-white p-1.5">
                <img src={qr} alt={`QR code for ${booking.receiptId}`} className="h-20 w-20" />
              </div>
            </div>
          </header>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50"><T k="qurbani.receiptId" /></p>
              <p className="font-mono text-lg font-bold text-deep" dir="ltr">{booking.receiptId}</p>
              <p className="mt-2 text-xs text-ink/60">{formatDateTime(booking.createdAt)} · {booking.city}</p>
              <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-wider text-ink/50"><T k="qurbani.status" /></p>
              <span className={`badge ${paid ? "badge-dark" : "badge-gold"}`}>{booking.status}</span>
              <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-wider text-ink/50"><T k="qurbani.buyerName" /></p>
              <p className="font-semibold text-ink">{booking.buyerName}</p>
              {booking.guardianName && <p className="text-xs text-ink/60">s/o {booking.guardianName}</p>}
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50"><T k="qurbani.cow" /> &amp; <T k="qurbani.shares" /></p>
              <p className="text-lg font-bold text-deep">Cow {booking.cowNumber} · Hissa {shares.join(", ")} of {booking.cowNumber}</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.purpose" /></dt><dd className="font-semibold">{booking.purpose}{booking.onBehalfOf ? ` — ${booking.onBehalfOf}` : ""}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="donate.amount" /></dt><dd className="font-semibold" dir="ltr">{formatPkr(booking.amount)}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.step3" /></dt><dd className="font-semibold">{booking.paymentMethod}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="qurbani.txnId" /></dt><dd className="font-mono text-xs" dir="ltr">{booking.transactionId ?? "—"}</dd></div>
              </dl>
            </div>
          </div>

          <div className="mx-6 rounded-lg bg-light p-4 text-sm">
            <p className="font-bold text-deep">Slaughter &amp; distribution</p>
            <p className="text-ink/75">{booking.slaughterDate ? formatDateTime(booking.slaughterDate) : "To be confirmed"} · {booking.slaughterLocation}</p>
            <p className="text-ink/75"><T k="qurbani.dispatchDate" />: {booking.dispatchDate ? formatDateTime(booking.dispatchDate) : "After packing and distribution"}</p>
          </div>

          <div className="m-6 rounded-lg border border-gold/40 bg-[#fdf8e8] p-4 text-center">
            <p className="text-lg text-deep" dir="rtl" lang="ar">{RECEIPT_DUA.ar}</p>
            <p className="mt-1 text-sm font-semibold text-deep"><Bi en={RECEIPT_DUA.en} ur={RECEIPT_DUA.ur} /></p>
            <p className="mt-1 text-xs text-ink/60"><T k="qurbani.receiptThanks" /></p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-6">
            <div>
              <div className="h-10 w-48 border-b border-ink/50" />
              <p className="mt-1 text-[0.68rem] text-ink/60">Qurbani in-charge signature</p>
            </div>
            <div className="rounded border border-deep/30 p-2 text-center">
              <p className="text-[0.55rem] font-bold uppercase tracking-wider text-deep">Al-Noor Islamic University</p>
              <p className="text-[0.6rem] font-bold text-deep">Qurbani Office</p>
              <p className="text-[0.55rem] text-ink/55">Official stamp (sample)</p>
            </div>
          </div>
        </article>

        {!paid && (
          <div className="mt-3 no-print">
            <Callout icon="clock" title="Receipt not yet active">
              <T k="qurbani.pendingVerification" /> · <Link href={`/qurbani/pay/${booking.receiptId}`} className="link-underline"><T k="qurbani.payTitle" /></Link>
            </Callout>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 no-print">
          {paid ? (
            <a href={`/api/qurbani/receipt/${booking.receiptId}/pdf`} className="btn btn-primary"><Icon name="download" size={16} /> <T k="qurbani.downloadReceipt" /></a>
          ) : (
            <Link href={`/qurbani/pay/${booking.receiptId}`} className="btn btn-primary"><T k="qurbani.payNow" /></Link>
          )}
          <Link href="/qurbani/status" className="btn btn-outline"><T k="qurbani.checkBooking" /></Link>
          <a href={`/api/qurbani/receipt/${booking.receiptId}/pdf`} className="btn btn-outline"><Icon name="file" size={15} /> PDF</a>
          <Link href="/qurbani/faq" className="btn btn-outline"><T k="qurbani.rules" /></Link>
        </div>
        <p className="mt-2 text-xs text-ink/50">{siteUrl(`/qurbani/receipt/${booking.receiptId}`)} · QR links to the status page (receipt ID + phone required).</p>
      </div>
    </section>
  );
}
