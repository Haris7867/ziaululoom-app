import { NextResponse } from "next/server";
import { getBookingByReceipt } from "@/lib/data";
import { buildQurbaniReceiptPdf, siteUrl } from "@/lib/pdf";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ receiptId: string }> }) {
  const { receiptId } = await context.params;
  const booking = await getBookingByReceipt(receiptId);
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Receipt not found" }, { status: 404 });
  }
  if (booking.paymentStatus !== "paid" && booking.paymentStatus !== "verified") {
    return NextResponse.json(
      { ok: false, error: "The receipt PDF is generated once payment is confirmed." },
      { status: 409 },
    );
  }

  const shareNumbers = Array.isArray(booking.shareNumbers) ? (booking.shareNumbers as number[]) : [];
  const bytes = await buildQurbaniReceiptPdf({
    receiptId: booking.receiptId,
    buyerName: booking.buyerName,
    guardianName: booking.guardianName,
    cowNumber: booking.cowNumber,
    breed: "Sahiwal / Cholistani (placeholder)",
    shareNumbers,
    purpose: booking.purpose,
    onBehalfOf: booking.onBehalfOf,
    amount: booking.amount,
    paymentMethod: booking.paymentMethod,
    transactionId: booking.transactionId,
    paidAt: booking.updatedAt,
    slaughterDate: booking.slaughterDate,
    location: booking.slaughterLocation,
    dispatchDate: booking.dispatchDate,
    status: booking.status,
    seasonName: "Qurbani 2027",
    verifyUrl: siteUrl(`/qurbani/status?receipt=${booking.receiptId}`),
  });

  return new NextResponse(Buffer.from(bytes) as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Qurbani-Receipt-${booking.receiptId}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
