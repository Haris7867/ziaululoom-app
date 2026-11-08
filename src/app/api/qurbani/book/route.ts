import { NextResponse } from "next/server";
import { z } from "zod";
import { getActiveSeason } from "@/lib/data";
import { createBooking } from "@/lib/qurbani";

const schema = z.object({
  buyerName: z.string().min(2).max(160),
  guardianName: z.string().max(160).optional(),
  cnic: z.string().max(30).optional(),
  whatsapp: z.string().min(6).max(30),
  email: z.string().email(),
  city: z.string().min(2).max(80),
  purpose: z.enum(["self", "family", "deceased", "sadaqah"]),
  onBehalfOf: z.string().max(160).optional(),
  shareCount: z.coerce.number().int().min(1).max(7),
  cowId: z.coerce.number().int().nullable().optional(),
  paymentMethod: z.enum(["card", "jazzcash", "easypaisa", "upaisa", "bank_transfer", "cash"]),
  notes: z.string().max(500).optional(),
  terms: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Please check the booking details." }, { status: 400 });
    }
    const season = await getActiveSeason();
    if (!season) {
      return NextResponse.json({ ok: false, error: "No active Qurbani season." }, { status: 409 });
    }
    const result = await createBooking(
      { ...parsed.data, cowId: parsed.data.cowId ?? null },
      {
        id: season.id,
        sharePrice: season.sharePrice,
        holdMinutes: season.holdMinutes,
        bookingDeadline: season.bookingDeadline,
        slaughterStart: season.slaughterStart,
        slaughterLocation: season.slaughterLocation,
      },
    );
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error, conflicts: result.conflicts ?? [] }, { status: 409 });
    }
    return NextResponse.json({ ok: true, receiptId: result.receiptId, bookingId: result.bookingId });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to create the booking." }, { status: 500 });
  }
}
