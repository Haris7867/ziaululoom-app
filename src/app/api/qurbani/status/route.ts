import { NextResponse } from "next/server";
import { findBooking } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const receipt = url.searchParams.get("receipt") ?? "";
  const phone = url.searchParams.get("phone") ?? "";
  if (!receipt || !phone) {
    return NextResponse.json({ ok: false, error: "Receipt ID and phone number are required." }, { status: 400 });
  }
  const booking = await findBooking(receipt, phone);
  if (!booking) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  // Only the buyer's own fields are returned — never other buyers' data.
  return NextResponse.json({
    ok: true,
    booking: {
      receiptId: booking.receiptId,
      buyerName: booking.buyerName,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      cowNumber: booking.cowNumber,
      shareNumbers: booking.shareNumbers ?? [],
      amount: booking.amount,
      purpose: booking.purpose,
      dispatchDate: booking.dispatchDate,
      slaughterDate: booking.slaughterDate,
      courier: booking.courier,
      trackingNumber: booking.trackingNumber,
    },
  });
}
