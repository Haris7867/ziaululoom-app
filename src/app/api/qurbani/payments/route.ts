import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { qurbaniBookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { confirmBookingPayment, recordPendingPayment } from "@/lib/qurbani";
import { createProviderReference, isPaymentMethod, PAYMENT_META, stripeMode } from "@/lib/payments";

const schema = z.object({
  receiptId: z.string().min(6).max(40),
  method: z.string(),
  transactionId: z.string().max(120).nullable().optional(),
  proofName: z.string().max(240).nullable().optional(),
});

/**
 * Payment endpoint.
 * - Card: Stripe is the processor. With STRIPE_SECRET_KEY present this would
 *   create a PaymentIntent and confirm it via the Stripe webhook; in this demo
 *   the charge is simulated and the receipt is issued immediately.
 * - Wallets (JazzCash / Easypaisa / UPaisa): a provider request reference is
 *   created and the booking stays pending until the provider webhook confirms.
 * - Bank transfer: recorded for admin manual verification.
 * - Cash: instructions shown; a cashier records the payment in the admin panel.
 */
export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success || !isPaymentMethod(parsed.data.method)) {
      return NextResponse.json({ ok: false, message: "Invalid payment request." }, { status: 400 });
    }
    const { receiptId, method, transactionId, proofName } = parsed.data;
    const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.receiptId, receiptId.toUpperCase()));
    const booking = rows[0];
    if (!booking) return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404 });

    const meta = PAYMENT_META[method];
    const screenshotUrl = proofName ? `/uploads/private/${proofName}` : undefined;

    if (method === "card") {
      if (stripeMode() === "placeholder" && !transactionId) {
        // Simulated Stripe test-mode charge for the demo environment.
      }
      const result = await confirmBookingPayment(booking.id, {
        actor: "stripe-webhook-demo",
        method: "card",
        transactionId: transactionId ?? `pi_demo_${booking.receiptId.slice(-6)}`,
        providerRef: createProviderReference("card", booking.receiptId),
        amount: booking.amount,
      });
      return NextResponse.json({ ok: true, status: "paid", receiptId: result.receiptId ?? booking.receiptId });
    }

    if (method === "cash") {
      await recordPendingPayment(booking.id, "cash", "CASH-AT-OFFICE", screenshotUrl);
      return NextResponse.json({
        ok: true,
        status: "pending_verification",
        message: "Please pay at the finance office; the cashier will issue a manual receipt.",
      });
    }

    if (meta.kind === "wallet") {
      const providerRef = createProviderReference(method, booking.receiptId);
      await recordPendingPayment(booking.id, method, transactionId ?? providerRef, screenshotUrl);
      return NextResponse.json({
        ok: true,
        status: "pending_verification",
        providerRef,
        message: `${meta.en} payment request created. Your receipt is issued automatically when the provider webhook confirms payment.`,
      });
    }

    if (!transactionId && !screenshotUrl) {
      return NextResponse.json({ ok: false, message: "Enter the transaction ID or upload a screenshot." }, { status: 400 });
    }
    await recordPendingPayment(booking.id, "bank_transfer", transactionId ?? null, screenshotUrl);
    return NextResponse.json({
      ok: true,
      status: "pending_verification",
      message: "Bank transfer recorded. The admin verifies it, usually within one working day.",
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Payment could not be recorded." }, { status: 500 });
  }
}
