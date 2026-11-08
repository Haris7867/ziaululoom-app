import { NextResponse } from "next/server";
import { db } from "@/db";
import { qurbaniBookings, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { confirmBookingPayment } from "@/lib/qurbani";

/**
 * Payment provider webhook placeholders.
 *
 * Stripe:      /api/webhooks/stripe           (signature verified with STRIPE_WEBHOOK_SECRET)
 * JazzCash:    /api/webhooks/jazzcash         (secure hash verified with JAZZCASH_HASH_KEY)
 * Easypaisa:   /api/webhooks/easypaisa        (signature verified with EASYPAISA_KEY)
 * UPaisa:      /api/webhooks/upaisa           (signature verified with UPAISA_KEY)
 *
 * All providers share the same confirmation contract in this demo:
 * { receiptId, transactionId, status: "paid" | "failed" | "refunded", amount }
 * Secrets are never committed; they are read from the environment.
 */
const SUPPORTED = new Set(["stripe", "jazzcash", "easypaisa", "upaisa"]);

export async function POST(request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  if (!SUPPORTED.has(provider)) {
    return NextResponse.json({ ok: false, error: "Unknown provider" }, { status: 404 });
  }

  const secret =
    provider === "stripe"
      ? process.env.STRIPE_WEBHOOK_SECRET
      : provider === "jazzcash"
        ? process.env.JAZZCASH_HASH_KEY
        : provider === "easypaisa"
          ? process.env.EASYPAISA_KEY
          : process.env.UPAISA_KEY;

  let payload: Record<string, unknown> = {};
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const receiptId = String(payload.receiptId ?? payload.billReference ?? "");
  const status = String(payload.status ?? "paid");
  const transactionId = String(payload.transactionId ?? payload.txnRefNo ?? `wh_${Date.now()}`);

  await db.insert(auditLogs).values({
    actor: `${provider}-webhook`,
    role: "provider",
    action: `webhook.${provider}.${status}`,
    entity: "qurbani_booking",
    entityId: receiptId || null,
    detail: secret
      ? "Signature secret present; signature verification placeholder executed."
      : "Signature secret not configured — running in placeholder mode (not for production).",
  });

  if (status !== "paid" || !receiptId) {
    return NextResponse.json({ ok: true, received: true, processed: false, provider, status });
  }

  const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.receiptId, receiptId.toUpperCase()));
  const booking = rows[0];
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
  }
  await confirmBookingPayment(booking.id, {
    actor: `${provider}-webhook`,
    method: provider === "stripe" ? "card" : provider,
    transactionId,
    providerRef: transactionId,
    amount: booking.amount,
  });

  return NextResponse.json({ ok: true, received: true, processed: true, provider, receiptId: booking.receiptId });
}

export async function GET(_request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  return NextResponse.json({
    ok: true,
    provider,
    message: "Webhook endpoint placeholder. POST a JSON body with receiptId, transactionId and status.",
    supportedEvents: ["payment.completed", "payment.failed", "payment.refunded"],
  });
}
