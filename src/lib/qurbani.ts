import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  auditLogs, qurbaniBookings, qurbaniCows, qurbaniLogs, qurbaniPayments, qurbaniShares,
} from "@/db/schema";
import type { PaymentMethodKey } from "./payments";

export type BookingInput = {
  buyerName: string;
  guardianName?: string;
  cnic?: string;
  whatsapp: string;
  email: string;
  city: string;
  purpose: string;
  onBehalfOf?: string;
  shareCount: number;
  cowId?: number | null;
  paymentMethod: PaymentMethodKey;
  notes?: string;
  terms: boolean;
};

export type BookingResult =
  | { ok: true; receiptId: string; bookingId: number }
  | { ok: false; error: string; conflicts?: number[] };

function generateReceiptId(): string {
  const n = Math.floor(100000 + Math.random() * 899999);
  return `QRB-2027-${String(n).padStart(6, "0")}`;
}

/**
 * Reserves up to `shareCount` shares on a preferred cow (or the first cow with
 * enough free shares). Held for 30 minutes while payment completes.
 */
export async function createBooking(
  input: BookingInput,
  season: { id: number; sharePrice: number; holdMinutes: number; bookingDeadline: Date; slaughterStart: Date; slaughterLocation: string },
): Promise<BookingResult> {
  if (!input.terms) return { ok: false, error: "Please accept the Qurbani rules and refund policy." };
  if (input.shareCount < 1 || input.shareCount > 7) return { ok: false, error: "Choose between 1 and 7 hissas." };
  if (new Date(season.bookingDeadline).getTime() < Date.now()) return { ok: false, error: "Booking for this season has closed." };

  const now = new Date();
  const holdExpiresAt = new Date(now.getTime() + (season.holdMinutes || 30) * 60 * 1000);

  // Release expired holds first so we never double-book.
  await db
    .update(qurbaniShares)
    .set({ status: "Available", bookingId: null, holdExpiresAt: null })
    .where(and(eq(qurbaniShares.seasonId, season.id), eq(qurbaniShares.status, "Reserved"), sql`${qurbaniShares.holdExpiresAt} < now()`));

  const cows = await db.select().from(qurbaniCows).where(eq(qurbaniCows.seasonId, season.id));
  const vetOk = cows.filter((c) => c.vetStatus === "Fit for Qurbani");
  const candidateCows = input.cowId ? vetOk.filter((c) => c.id === input.cowId) : vetOk;

  for (const cow of candidateCows) {
    const free = await db
      .select()
      .from(qurbaniShares)
      .where(and(eq(qurbaniShares.cowId, cow.id), eq(qurbaniShares.status, "Available")))
      .orderBy(qurbaniShares.shareNumber);
    if (free.length < input.shareCount) continue;
    const chosen = free.slice(0, input.shareCount);
    const receiptId = generateReceiptId();
    const amount = season.sharePrice * input.shareCount;

    const [booking] = await db
      .insert(qurbaniBookings)
      .values({
        receiptId,
        seasonId: season.id,
        buyerName: input.buyerName,
        guardianName: input.guardianName || null,
        cnic: input.cnic || null,
        whatsapp: input.whatsapp,
        email: input.email,
        city: input.city,
        purpose: input.purpose,
        onBehalfOf: input.onBehalfOf || null,
        shareCount: input.shareCount,
        cowId: cow.id,
        cowNumber: cow.cowNumber,
        shareNumbers: chosen.map((s) => s.shareNumber),
        amount,
        paymentMethod: input.paymentMethod,
        paymentStatus: "pending",
        status: "Reserved",
        holdExpiresAt,
        slaughterDate: season.slaughterStart,
        slaughterLocation: season.slaughterLocation,
        notes: input.notes || null,
      })
      .returning({ id: qurbaniBookings.id });

    // Atomic guard: only claim if still Available.
    const claimed = await db
      .update(qurbaniShares)
      .set({ status: "Reserved", bookingId: booking.id, holdExpiresAt })
      .where(and(inArray(qurbaniShares.id, chosen.map((s) => s.id)), eq(qurbaniShares.status, "Available")))
      .returning({ id: qurbaniShares.id });

    if (claimed.length !== chosen.length) {
      await db.delete(qurbaniBookings).where(eq(qurbaniBookings.id, booking.id));
      if (input.cowId) return { ok: false, error: "Those hissas were just taken. Please try again.", conflicts: chosen.map((s) => s.shareNumber) };
      continue;
    }

    await db.insert(qurbaniPayments).values({
      bookingId: booking.id,
      method: input.paymentMethod,
      amount,
      status: "pending",
      transactionId: null,
    });

    await db.insert(qurbaniLogs).values({
      bookingId: booking.id,
      cowId: cow.id,
      fromStatus: "Available",
      toStatus: "Reserved",
      staff: "public-booking",
      note: `Slot held for ${season.holdMinutes} minutes pending ${input.paymentMethod} payment.`,
    });

    await db.insert(auditLogs).values({
      actor: input.email,
      role: "public",
      action: "qurbani.book",
      entity: "qurbani_booking",
      entityId: receiptId,
      detail: `Cow ${cow.cowNumber}, hissas ${chosen.map((s) => s.shareNumber).join(", ")}`,
    });

    return { ok: true, receiptId, bookingId: booking.id };
  }

  return { ok: false, error: "No cow currently has that many free hissas. Try fewer hissas or choose 'any cow'." };
}

/** Confirms payment and issues the receipt (idempotent). */
export async function confirmBookingPayment(
  bookingId: number,
  options: {
    actor: string;
    method?: string;
    transactionId?: string;
    providerRef?: string;
    screenshotUrl?: string;
    amount?: number;
  },
): Promise<{ ok: boolean; receiptId?: string; error?: string }> {
  const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.id, bookingId));
  const booking = rows[0];
  if (!booking) return { ok: false, error: "Booking not found" };
  if (booking.paymentStatus === "paid") return { ok: true, receiptId: booking.receiptId };

  await db
    .update(qurbaniBookings)
    .set({
      paymentStatus: "paid",
      status: "Paid",
      transactionId: options.transactionId ?? booking.transactionId,
      proofUrl: options.screenshotUrl ?? booking.proofUrl,
      holdExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(eq(qurbaniBookings.id, bookingId));

  await db
    .update(qurbaniShares)
    .set({ status: "Paid", holdExpiresAt: null })
    .where(eq(qurbaniShares.bookingId, bookingId));

  if (booking.cowId) {
    const allShares = await db.select().from(qurbaniShares).where(eq(qurbaniShares.cowId, booking.cowId));
    if (allShares.length > 0 && allShares.every((s) => s.status === "Paid")) {
      await db.update(qurbaniCows).set({ status: "Paid" }).where(eq(qurbaniCows.id, booking.cowId));
    }
  }

  await db.insert(qurbaniPayments).values({
    bookingId,
    method: options.method ?? booking.paymentMethod,
    amount: options.amount ?? booking.amount,
    transactionId: options.transactionId ?? null,
    status: "paid",
    providerRef: options.providerRef ?? null,
    screenshotUrl: options.screenshotUrl ?? null,
    verifiedBy: options.actor,
    verifiedAt: new Date(),
  });

  await db.insert(qurbaniLogs).values({
    bookingId,
    cowId: booking.cowId,
    fromStatus: booking.status,
    toStatus: "Paid",
    staff: options.actor,
    note: `Payment confirmed via ${options.method ?? booking.paymentMethod}. Receipt issued.`,
  });

  await db.insert(auditLogs).values({
    actor: options.actor,
    action: "qurbani.payment.confirm",
    entity: "qurbani_booking",
    entityId: booking.receiptId,
    detail: `Amount ${booking.amount}`,
  });

  return { ok: true, receiptId: booking.receiptId };
}

/** Bank transfer / wallet confirmation awaiting staff verification. */
export async function recordPendingPayment(
  bookingId: number,
  method: string,
  transactionId: string | null,
  screenshotUrl?: string,
): Promise<{ ok: boolean; receiptId?: string }> {
  const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.id, bookingId));
  const booking = rows[0];
  if (!booking) return { ok: false };
  await db
    .update(qurbaniBookings)
    .set({
      paymentStatus: "pending_verification",
      paymentMethod: method,
      transactionId,
      proofUrl: screenshotUrl ?? booking.proofUrl,
      updatedAt: new Date(),
    })
    .where(eq(qurbaniBookings.id, bookingId));

  await db.insert(qurbaniPayments).values({
    bookingId,
    method,
    amount: booking.amount,
    transactionId,
    status: "pending_verification",
    screenshotUrl: screenshotUrl ?? null,
  });

  await db.insert(qurbaniLogs).values({
    bookingId,
    fromStatus: booking.status,
    toStatus: booking.status,
    staff: "public-booking",
    note: `${method} payment recorded (${transactionId ?? "no reference"}); awaiting admin verification.`,
  });

  return { ok: true, receiptId: booking.receiptId };
}

export async function updateBookingStatus(
  bookingId: number,
  status: string,
  staff: string,
  note?: string,
  extras?: { courier?: string; trackingNumber?: string; dispatchNotes?: string },
): Promise<void> {
  const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.id, bookingId));
  const booking = rows[0];
  if (!booking) return;
  await db
    .update(qurbaniBookings)
    .set({
      status,
      updatedAt: new Date(),
      ...(extras?.courier ? { courier: extras.courier } : {}),
      ...(extras?.trackingNumber ? { trackingNumber: extras.trackingNumber } : {}),
      ...(extras?.dispatchNotes ? { dispatchNotes: extras.dispatchNotes } : {}),
      ...(status === "Dispatched" ? { dispatchDate: new Date() } : {}),
    })
    .where(eq(qurbaniBookings.id, bookingId));

  const shareStatus = ["Slaughtered", "Packed", "Dispatched", "Completed"].includes(status)
    ? status === "Completed"
      ? "Dispatched"
      : status
    : undefined;
  if (shareStatus) {
    await db.update(qurbaniShares).set({ status: shareStatus }).where(eq(qurbaniShares.bookingId, bookingId));
    if (booking.status && shareStatus !== "Dispatched") {
      await db.update(qurbaniCows).set({ status: shareStatus }).where(eq(qurbaniCows.id, booking.cowId ?? 0));
    }
  }

  await db.insert(qurbaniLogs).values({
    bookingId,
    cowId: booking.cowId,
    fromStatus: booking.status,
    toStatus: status,
    staff,
    note: note ?? `Status changed to ${status}.`,
  });

  await db.insert(auditLogs).values({
    actor: staff,
    action: "qurbani.status",
    entity: "qurbani_booking",
    entityId: booking.receiptId,
    detail: `${booking.status} → ${status}`,
  });
}

export async function refundBooking(bookingId: number, staff: string, reason: string): Promise<void> {
  const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.id, bookingId));
  const booking = rows[0];
  if (!booking) return;
  await db
    .update(qurbaniBookings)
    .set({ status: "Refunded", paymentStatus: "refunded", updatedAt: new Date() })
    .where(eq(qurbaniBookings.id, bookingId));
  await db
    .update(qurbaniShares)
    .set({ status: "Available", bookingId: null, holdExpiresAt: null })
    .where(eq(qurbaniShares.bookingId, bookingId));
  await db.insert(qurbaniPayments).values({
    bookingId,
    method: booking.paymentMethod,
    amount: -booking.amount,
    status: "refunded",
    verifiedBy: staff,
    verifiedAt: new Date(),
    transactionId: booking.transactionId,
  });
  await db.insert(qurbaniLogs).values({
    bookingId,
    cowId: booking.cowId,
    fromStatus: booking.status,
    toStatus: "Refunded",
    staff,
    note: reason,
  });
  await db.insert(auditLogs).values({
    actor: staff,
    action: "qurbani.refund",
    entity: "qurbani_booking",
    entityId: booking.receiptId,
    detail: reason,
  });
}

export async function correctBuyerName(bookingId: number, newName: string, staff: string): Promise<void> {
  const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.id, bookingId));
  const booking = rows[0];
  if (!booking) return;
  const history = Array.isArray(booking.nameChangeLog) ? (booking.nameChangeLog as unknown[]) : [];
  await db
    .update(qurbaniBookings)
    .set({
      buyerName: newName,
      nameChangeLog: [...history, { from: booking.buyerName, to: newName, staff, at: new Date().toISOString() }],
      updatedAt: new Date(),
    })
    .where(eq(qurbaniBookings.id, bookingId));
  await db.insert(qurbaniLogs).values({
    bookingId,
    fromStatus: booking.status,
    toStatus: booking.status,
    staff,
    note: `Name corrected from "${booking.buyerName}" to "${newName}". Receipt regenerated.`,
  });
}
