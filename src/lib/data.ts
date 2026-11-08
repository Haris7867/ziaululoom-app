import "server-only";
import { and, asc, desc, eq, inArray, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeed } from "@/db/seed";
import {
  announcements, articles, auditLogs, calendarEntries, donations, events, examSchedule,
  faculty, fatawa, fatwaQuestions, galleryPhotos, leads, pdfResources, programmes,
  qurbaniBookings, qurbaniCows, qurbaniFaqs, qurbaniLogs, qurbaniPayments, qurbaniSeasons,
  qurbaniShares, qurbaniTemplates, reports, seasonalBanners, testimonials,
} from "@/db/schema";

export async function ready(): Promise<void> {
  await ensureSeed();
}

export async function getAnnouncements() {
  await ready();
  return db.select().from(announcements).where(eq(announcements.active, true)).orderBy(desc(announcements.pinned), desc(announcements.date));
}

export async function getAllAnnouncements() {
  await ready();
  return db.select().from(announcements).orderBy(desc(announcements.date));
}

export async function getProgrammes() {
  await ready();
  return db.select().from(programmes).where(eq(programmes.published, true)).orderBy(asc(programmes.id));
}

export async function getAllProgrammes() {
  await ready();
  return db.select().from(programmes).orderBy(asc(programmes.id));
}

export async function getProgramme(slug: string) {
  await ready();
  const rows = await db.select().from(programmes).where(eq(programmes.slug, slug));
  return rows[0] ?? null;
}

export async function getEvents() {
  await ready();
  return db.select().from(events).where(eq(events.published, true)).orderBy(asc(events.startAt));
}

export async function getEvent(slug: string) {
  await ready();
  const rows = await db.select().from(events).where(eq(events.slug, slug));
  return rows[0] ?? null;
}

export async function getGallery(eventId?: number) {
  await ready();
  if (typeof eventId === "number") {
    return db.select().from(galleryPhotos).where(eq(galleryPhotos.eventId, eventId)).orderBy(desc(galleryPhotos.createdAt));
  }
  return db.select().from(galleryPhotos).orderBy(desc(galleryPhotos.createdAt));
}

export async function getPdfResources() {
  await ready();
  return db.select().from(pdfResources).where(eq(pdfResources.status, "published")).orderBy(desc(pdfResources.publishedAt));
}

export async function getAllPdfResources() {
  await ready();
  return db.select().from(pdfResources).orderBy(desc(pdfResources.publishedAt));
}

export async function getPdfResource(slug: string) {
  await ready();
  const rows = await db.select().from(pdfResources).where(eq(pdfResources.slug, slug));
  return rows[0] ?? null;
}

export async function getFatawa() {
  await ready();
  return db.select().from(fatawa).where(eq(fatawa.status, "published")).orderBy(desc(fatawa.publishedAt));
}

export async function getFatwa(slug: string) {
  await ready();
  const rows = await db.select().from(fatawa).where(eq(fatawa.slug, slug));
  return rows[0] ?? null;
}

export async function getArticles() {
  await ready();
  return db.select().from(articles).orderBy(desc(articles.publishedAt));
}

export async function getTestimonials() {
  await ready();
  return db.select().from(testimonials).orderBy(asc(testimonials.id));
}

export async function getFaculty() {
  await ready();
  return db.select().from(faculty).orderBy(asc(faculty.id));
}

export async function getSeasonalBanners() {
  await ready();
  const rows = await db.select().from(seasonalBanners).orderBy(asc(seasonalBanners.id));
  const now = new Date();
  return {
    all: rows,
    active: rows.filter(
      (b) =>
        b.active &&
        (!b.startsAt || new Date(b.startsAt) <= now) &&
        (!b.endsAt || new Date(b.endsAt) >= now),
    ),
  };
}

export async function getReports() {
  await ready();
  return db.select().from(reports).orderBy(desc(reports.year), asc(reports.kind));
}

export async function getCalendar() {
  await ready();
  return db.select().from(calendarEntries).orderBy(asc(calendarEntries.startDate));
}

export async function getExamSchedule() {
  await ready();
  return db.select().from(examSchedule).orderBy(asc(examSchedule.examDate));
}

/* ------------------------------- Qurbani ------------------------------- */

export async function releaseExpiredHolds(): Promise<void> {
  const now = new Date();
  const expired = await db
    .select()
    .from(qurbaniShares)
    .where(and(eq(qurbaniShares.status, "Reserved"), lt(qurbaniShares.holdExpiresAt, now)));
  if (expired.length > 0) {
    await db
      .update(qurbaniShares)
      .set({ status: "Available", bookingId: null, holdExpiresAt: null })
      .where(and(eq(qurbaniShares.status, "Reserved"), lt(qurbaniShares.holdExpiresAt, now)));
    const bookingIds = [...new Set(expired.map((s) => s.bookingId).filter((id): id is number => typeof id === "number"))];
    for (const id of bookingIds) {
      await db
        .update(qurbaniBookings)
        .set({ status: "Cancelled", paymentStatus: "expired", updatedAt: new Date() })
        .where(and(eq(qurbaniBookings.id, id), eq(qurbaniBookings.status, "Reserved")));
    }
  }
}

export async function getActiveSeason() {
  await ready();
  await releaseExpiredHolds();
  const rows = await db
    .select()
    .from(qurbaniSeasons)
    .where(and(eq(qurbaniSeasons.active, true), eq(qurbaniSeasons.archived, false)));
  return rows[0] ?? null;
}

export async function getSeasons() {
  await ready();
  return db.select().from(qurbaniSeasons).orderBy(desc(qurbaniSeasons.year));
}

export type BoardCow = {
  id: number;
  cowNumber: string;
  breed: string;
  ageMonths: number;
  weightKg: number;
  vetStatus: string;
  healthCheck: string;
  status: string;
  photos: string[];
  shares: { id: number; shareNumber: number; status: string; bookingId: number | null; holdExpiresAt: Date | null }[];
};

export async function getCowBoard(seasonId: number): Promise<BoardCow[]> {
  const cows = await db.select().from(qurbaniCows).where(eq(qurbaniCows.seasonId, seasonId)).orderBy(asc(qurbaniCows.cowNumber));
  const shares = await db.select().from(qurbaniShares).where(eq(qurbaniShares.seasonId, seasonId)).orderBy(asc(qurbaniShares.shareNumber));
  return cows.map((cow) => ({
    id: cow.id,
    cowNumber: cow.cowNumber,
    breed: cow.breed,
    ageMonths: cow.ageMonths,
    weightKg: cow.weightKg,
    vetStatus: cow.vetStatus,
    healthCheck: cow.healthCheck,
    status: cow.status,
    photos: Array.isArray(cow.photos) ? (cow.photos as string[]) : [],
    shares: shares
      .filter((s) => s.cowId === cow.id)
      .map((s) => ({ id: s.id, shareNumber: s.shareNumber, status: s.status, bookingId: s.bookingId, holdExpiresAt: s.holdExpiresAt })),
  }));
}

export async function getQurbaniFaqs() {
  await ready();
  return db.select().from(qurbaniFaqs).orderBy(asc(qurbaniFaqs.sortOrder));
}

export async function getQurbaniTemplates() {
  await ready();
  return db.select().from(qurbaniTemplates).orderBy(asc(qurbaniTemplates.id));
}

export async function getBookingByReceipt(receiptId: string) {
  await ready();
  const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.receiptId, receiptId.trim().toUpperCase()));
  return rows[0] ?? null;
}

export async function findBooking(receiptId: string, phone: string) {
  await ready();
  const normalise = (v: string) => v.replace(/[^0-9]/g, "");
  const rows = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.receiptId, receiptId.trim().toUpperCase()));
  const booking = rows[0];
  if (!booking) return null;
  if (!normalise(phone) || !normalise(booking.whatsapp).endsWith(normalise(phone).slice(-10))) return null;
  return booking;
}

export async function getRecentBookings(limit = 50) {
  await ready();
  return db.select().from(qurbaniBookings).orderBy(desc(qurbaniBookings.createdAt)).limit(limit);
}

export async function getQurbaniPayments() {
  await ready();
  return db.select().from(qurbaniPayments).orderBy(desc(qurbaniPayments.createdAt));
}

export async function getQurbaniLogs(limit = 40) {
  await ready();
  return db.select().from(qurbaniLogs).orderBy(desc(qurbaniLogs.createdAt)).limit(limit);
}

export async function getQurbaniStats(seasonId: number) {
  await ready();
  const bookings = await db.select().from(qurbaniBookings).where(eq(qurbaniBookings.seasonId, seasonId));
  const cows = await db.select().from(qurbaniCows).where(eq(qurbaniCows.seasonId, seasonId));
  const shares = await db.select().from(qurbaniShares).where(eq(qurbaniShares.seasonId, seasonId));
  const paid = bookings.filter((b) => b.status !== "Cancelled" && b.paymentStatus === "paid");
  const byMethod = paid.reduce<Record<string, { count: number; amount: number }>>((acc, b) => {
    acc[b.paymentMethod] = acc[b.paymentMethod] ?? { count: 0, amount: 0 };
    acc[b.paymentMethod].count += 1;
    acc[b.paymentMethod].amount += b.amount;
    return acc;
  }, {});
  return {
    bookings,
    cows,
    shares,
    sold: bookings.filter((b) => b.status !== "Cancelled").length,
    paidCount: paid.length,
    pending: bookings.filter((b) => b.status === "Reserved").length,
    refunded: bookings.filter((b) => b.paymentStatus === "refunded" || b.status === "Refunded").length,
    revenue: paid.reduce((sum, b) => sum + b.amount, 0),
    byMethod,
    cowsSlaughtered: cows.filter((c) => ["Slaughtered", "Packed", "Dispatched", "Completed"].includes(c.status)).length,
    sharesDistributed: shares.filter((s) => ["Paid", "Slaughtered", "Dispatched"].includes(s.status)).length,
    fullySold: cows.filter((c) => shares.filter((s) => s.cowId === c.id && s.status === "Paid").length === 7).length,
    heldShares: shares.filter((s) => s.status === "Reserved").length,
    availableShares: shares.filter((s) => s.status === "Available").length,
  };
}

/* --------------------------- Donations / leads --------------------------- */

export async function getDonations() {
  await ready();
  return db.select().from(donations).orderBy(desc(donations.createdAt));
}

export async function getLeads() {
  await ready();
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getQuestions() {
  await ready();
  return db.select().from(fatwaQuestions).orderBy(desc(fatwaQuestions.createdAt));
}

export async function getAuditLogs(limit = 30) {
  await ready();
  return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
}

export async function getAdminCounts() {
  await ready();
  const [leadRows, donationRows, questionRows, bookingRows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(leads),
    db.select({ count: sql<number>`count(*)::int` }).from(donations),
    db.select({ count: sql<number>`count(*)::int` }).from(fatwaQuestions),
    db.select({ count: sql<number>`count(*)::int` }).from(qurbaniBookings),
  ]);
  return {
    leads: leadRows[0]?.count ?? 0,
    donations: donationRows[0]?.count ?? 0,
    questions: questionRows[0]?.count ?? 0,
    bookings: bookingRows[0]?.count ?? 0,
  };
}

export async function searchEverything(term: string) {
  await ready();
  const like = `%${term.toLowerCase()}%`;
  const [programmeRows, fatwaRows, pdfRows, eventRows] = await Promise.all([
    db.select({ slug: programmes.slug, titleEn: programmes.titleEn, titleUr: programmes.titleUr }).from(programmes).where(or(sql`lower(${programmes.titleEn}) like ${like}`, sql`lower(${programmes.department}) like ${like}`)).limit(5),
    db.select({ slug: fatawa.slug, titleEn: fatawa.questionEn, titleUr: fatawa.questionUr }).from(fatawa).where(and(eq(fatawa.status, "published"), or(sql`lower(${fatawa.questionEn}) like ${like}`, sql`lower(${fatawa.category}) like ${like}`))).limit(5),
    db.select({ slug: pdfResources.slug, titleEn: pdfResources.titleEn, titleUr: pdfResources.titleUr }).from(pdfResources).where(or(sql`lower(${pdfResources.titleEn}) like ${like}`, sql`lower(${pdfResources.category}) like ${like}`)).limit(5),
    db.select({ slug: events.slug, titleEn: events.titleEn, titleUr: events.titleUr }).from(events).where(or(sql`lower(${events.titleEn}) like ${like}`, sql`lower(${events.type}) like ${like}`)).limit(5),
  ]);
  return { programmes: programmeRows, fatawa: fatwaRows, pdfs: pdfRows, events: eventRows };
}

export async function getBookingsForCow(cowId: number) {
  await ready();
  const shares = await db.select().from(qurbaniShares).where(eq(qurbaniShares.cowId, cowId));
  const ids = shares.map((s) => s.bookingId).filter((id): id is number => typeof id === "number");
  if (ids.length === 0) return [];
  return db.select().from(qurbaniBookings).where(inArray(qurbaniBookings.id, ids));
}
