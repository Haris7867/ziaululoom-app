import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { auditLogs, donations } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { isPaymentMethod, PAYMENT_META } from "@/lib/payments";

const schema = z.object({
  donorName: z.string().min(2).max(160),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  amount: z.coerce.number().int().min(100).max(50_000_000),
  purpose: z.string().max(40),
  recurring: z.enum(["one-time", "monthly"]).default("one-time"),
  method: z.string(),
  anonymous: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    await ensureSeed();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Please check the donation details." }, { status: 400 });
    }
    const data = parsed.data;
    if (!isPaymentMethod(data.method)) {
      return NextResponse.json({ ok: false, error: "Unsupported payment method." }, { status: 400 });
    }
    const receiptNo = `DON-2027-${String(Math.floor(100000 + Math.random() * 899999))}`;
    const meta = PAYMENT_META[data.method];
    const status = meta.kind === "card" ? "paid" : meta.kind === "wallet" ? "pending" : "pending_verification";
    const [donation] = await db
      .insert(donations)
      .values({
        receiptNo,
        donorName: data.anonymous ? "Anonymous donor" : data.donorName,
        email: data.email,
        phone: data.phone || null,
        amount: data.amount,
        purpose: data.purpose,
        recurring: data.recurring,
        method: data.method,
        status,
        transactionId: meta.needsReference ? `PENDING-${receiptNo.slice(-6)}` : meta.kind === "card" ? `pi_demo_${receiptNo.slice(-6)}` : null,
        anonymous: Boolean(data.anonymous),
      })
      .returning({ id: donations.id });
    await db.insert(auditLogs).values({
      actor: data.email,
      role: "public",
      action: "donation.create",
      entity: "donations",
      entityId: receiptNo,
      detail: `${data.amount} PKR via ${data.method} (${status}); receipt email queued.`,
    });
    return NextResponse.json({ ok: true, receiptNo, status, id: donation.id });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to record the donation." }, { status: 500 });
  }
}
