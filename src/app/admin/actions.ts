"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  announcements, auditLogs, donations, events, fatawa, fatwaQuestions, galleryPhotos, leads,
  pdfResources, qurbaniBookings, qurbaniCows, qurbaniShares, qurbaniSeasons, qurbaniTemplates,
  seasonalBanners,
} from "@/db/schema";
import { logAudit, requirePermission, signIn, signOut } from "@/lib/auth";
import { confirmBookingPayment, correctBuyerName, refundBooking, updateBookingStatus } from "@/lib/qurbani";

function text(data: FormData, key: string): string {
  return String(data.get(key) ?? "").trim();
}

function num(data: FormData, key: string, fallback = 0): number {
  const value = Number(data.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = text(formData, "email");
  const password = text(formData, "password");
  const user = await signIn(email, password);
  if (!user) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/admin/login");
}

/* ----------------------------- Content ----------------------------- */

export async function createAnnouncementAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  await db.insert(announcements).values({
    titleEn: text(formData, "titleEn"),
    titleUr: text(formData, "titleUr") || text(formData, "titleEn"),
    bodyEn: text(formData, "bodyEn") || null,
    bodyUr: text(formData, "bodyUr") || null,
    pinned: formData.get("pinned") === "on",
    active: true,
  });
  await logAudit(user.email, "announcement.create", "announcements", null, text(formData, "titleEn"), user.role);
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function toggleAnnouncementAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  const id = num(formData, "id");
  const active = formData.get("active") === "true";
  await db.update(announcements).set({ active }).where(eq(announcements.id, id));
  await logAudit(user.email, "announcement.toggle", "announcements", String(id), active ? "activated" : "hidden", user.role);
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function createEventAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  const slug = text(formData, "slug") || text(formData, "titleEn").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await db.insert(events).values({
    slug,
    titleEn: text(formData, "titleEn"),
    titleUr: text(formData, "titleUr") || text(formData, "titleEn"),
    descriptionEn: text(formData, "descriptionEn"),
    descriptionUr: text(formData, "descriptionUr") || text(formData, "descriptionEn"),
    type: text(formData, "type") || "Lecture",
    venueEn: text(formData, "venueEn") || "Main Campus, Lahore",
    venueUr: text(formData, "venueUr") || "مین کیمپس، لاہور",
    startAt: new Date(text(formData, "startAt") || Date.now()),
    endAt: new Date(text(formData, "endAt") || Date.now() + 7200000),
    coverImage: text(formData, "coverImage") || null,
    liveStreamUrl: text(formData, "liveStreamUrl") || null,
  });
  await logAudit(user.email, "event.create", "events", slug, text(formData, "titleEn"), user.role);
  revalidatePath("/admin/content");
  revalidatePath("/events");
}

export async function bulkPhotosAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  const eventId = num(formData, "eventId") || null;
  const urls = text(formData, "urls").split(/\s+/).filter(Boolean);
  const captionEn = text(formData, "captionEn") || "Event photograph";
  const captionUr = text(formData, "captionUr") || "تقریب کی تصویر";
  const year = num(formData, "year", new Date().getFullYear());
  const eventType = text(formData, "eventType") || "Ijtema";
  if (urls.length === 0) return;
  await db.insert(galleryPhotos).values(
    urls.slice(0, 20).map((url, index) => ({
      eventId,
      url,
      captionEn: `${captionEn} (${index + 1})`,
      captionUr: `${captionUr} (${index + 1})`,
      year,
      eventType,
      venue: "Main Campus",
    })),
  );
  await logAudit(user.email, "photos.bulk", "gallery_photos", String(eventId), `${urls.length} photos queued; WebP compression runs on upload.`, user.role);
  revalidatePath("/admin/content");
  revalidatePath("/gallery");
}

export async function createPdfAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  const slug = text(formData, "slug") || `resource-${Date.now()}`;
  await db.insert(pdfResources).values({
    slug,
    titleEn: text(formData, "titleEn"),
    titleUr: text(formData, "titleUr") || text(formData, "titleEn"),
    category: text(formData, "category") || "Khutbat",
    speaker: text(formData, "speaker") || null,
    summaryEn: text(formData, "summaryEn") || "Summary pending.",
    summaryUr: text(formData, "summaryUr") || "خلاصہ زیرِ التوا۔",
    language: text(formData, "language") || "Urdu",
    pages: num(formData, "pages", 10),
    fileSizeKb: num(formData, "fileSizeKb", 500),
    fileUrl: text(formData, "fileUrl") || `/api/pdf/library/${slug}`,
    status: text(formData, "status") || "draft",
    publishedAt: text(formData, "publishedAt") ? new Date(text(formData, "publishedAt")) : new Date(),
  });
  await logAudit(user.email, "pdf.create", "pdf_resources", slug, `Status ${text(formData, "status") || "draft"}`, user.role);
  revalidatePath("/admin/content");
  revalidatePath("/library");
}

export async function togglePdfStatusAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  const id = num(formData, "id");
  const status = text(formData, "status") === "published" ? "draft" : "published";
  await db.update(pdfResources).set({ status, publishedAt: new Date() }).where(eq(pdfResources.id, id));
  await logAudit(user.email, "pdf.status", "pdf_resources", String(id), status, user.role);
  revalidatePath("/admin/content");
  revalidatePath("/library");
}

export async function toggleSeasonalAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  const id = num(formData, "id");
  const active = formData.get("active") === "true";
  await db.update(seasonalBanners).set({ active }).where(eq(seasonalBanners.id, id));
  await logAudit(user.email, "seasonal.toggle", "seasonal_banners", String(id), active ? "shown" : "hidden", user.role);
  revalidatePath("/admin/content");
  revalidatePath("/");
}

/* ----------------------------- Darul Ifta ----------------------------- */

export async function answerQuestionAction(formData: FormData): Promise<void> {
  const user = await requirePermission("fatawa.manage");
  const id = num(formData, "id");
  const answerEn = text(formData, "answerEn");
  const answerUr = text(formData, "answerUr");
  const publish = formData.get("publish") === "1";
  const question = await db.select().from(fatwaQuestions).where(eq(fatwaQuestions.id, id));
  if (!question[0]) return;

  await db
    .update(fatwaQuestions)
    .set({
      answerEn: answerEn || null,
      answerUr: answerUr || null,
      status: publish ? "published" : "under_review",
      assignedTo: user.name,
    })
    .where(eq(fatwaQuestions.id, id));

  if (publish) {
    const questionRow = question[0];
    const fatwaNumber = `DI-${new Date().getFullYear()}-${String(1000 + id).slice(-4)}`;
    await db.insert(fatawa).values({
      slug: `${fatwaNumber.toLowerCase()}-${(questionRow.category || "general").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      fatwaNumber,
      category: questionRow.category,
      questionEn: questionRow.question,
      questionUr: questionRow.question,
      answerEn: answerEn || "Answer pending.",
      answerUr: answerUr || answerEn || "جواب زیرِ التوا۔",
      muftiName: user.name,
      approvedBy: `${user.name} (Darul Ifta Board)`,
      approvedAt: new Date(),
      status: "published",
      references: ["Reviewed by the Darul Ifta board"],
    });
  }
  await logAudit(user.email, publish ? "fatwa.publish" : "fatwa.review", "fatwa_questions", String(id), `Priority ${question[0].priority}`, user.role);
  revalidatePath("/admin/fatawa");
  revalidatePath("/darul-ifta");
}

export async function assignQuestionAction(formData: FormData): Promise<void> {
  const user = await requirePermission("fatawa.manage");
  const id = num(formData, "id");
  await db
    .update(fatwaQuestions)
    .set({ assignedTo: text(formData, "assignedTo"), status: "under_review" })
    .where(eq(fatwaQuestions.id, id));
  await logAudit(user.email, "fatwa.assign", "fatwa_questions", String(id), text(formData, "assignedTo"), user.role);
  revalidatePath("/admin/fatawa");
}

export async function toggleFatwaPublishedAction(formData: FormData): Promise<void> {
  const user = await requirePermission("fatawa.manage");
  const id = num(formData, "id");
  const status = text(formData, "status") === "published" ? "under_review" : "published";
  await db.update(fatawa).set({ status }).where(eq(fatawa.id, id));
  await logAudit(user.email, "fatwa.status", "fatawa", String(id), status, user.role);
  revalidatePath("/admin/fatawa");
  revalidatePath("/darul-ifta");
}

/* ----------------------------- Qurbani ----------------------------- */

export async function verifyQurbaniPaymentAction(formData: FormData): Promise<void> {
  const user = await requirePermission("payments.verify");
  const bookingId = num(formData, "bookingId");
  await confirmBookingPayment(bookingId, {
    actor: user.email,
    method: text(formData, "method") || "bank_transfer",
    transactionId: text(formData, "transactionId") || undefined,
  });
  revalidatePath("/admin/qurbani");
}

export async function recordCashPaymentAction(formData: FormData): Promise<void> {
  const user = await requirePermission("payments.verify");
  const bookingId = num(formData, "bookingId");
  await confirmBookingPayment(bookingId, { actor: user.email, method: "cash", transactionId: `CASH-${Date.now()}` });
  await db.insert(auditLogs).values({ actor: user.email, role: user.role, action: "qurbani.cash", entity: "qurbani_booking", entityId: String(bookingId), detail: "Manual receipt issued at the office." });
  revalidatePath("/admin/qurbani");
}

export async function qurbaniStatusAction(formData: FormData): Promise<void> {
  const user = await requirePermission("qurbani.status");
  const bookingId = num(formData, "bookingId");
  await updateBookingStatus(bookingId, text(formData, "status"), user.email, text(formData, "note") || undefined, {
    courier: text(formData, "courier") || undefined,
    trackingNumber: text(formData, "trackingNumber") || undefined,
    dispatchNotes: text(formData, "dispatchNotes") || undefined,
  });
  revalidatePath("/admin/qurbani");
}

export async function refundBookingAction(formData: FormData): Promise<void> {
  const user = await requirePermission("qurbani.manage");
  await refundBooking(num(formData, "bookingId"), user.email, text(formData, "reason") || "Refund within the policy window.");
  revalidatePath("/admin/qurbani");
}

export async function correctNameAction(formData: FormData): Promise<void> {
  const user = await requirePermission("qurbani.manage");
  const bookingId = num(formData, "bookingId");
  const name = text(formData, "buyerName");
  if (name.length < 2) return;
  await correctBuyerName(bookingId, name, user.email);
  revalidatePath("/admin/qurbani");
}

export async function updateCowStatusAction(formData: FormData): Promise<void> {
  const user = await requirePermission("qurbani.manage");
  const cowId = num(formData, "cowId");
  const vetStatus = text(formData, "vetStatus");
  const status = text(formData, "status");
  await db.update(qurbaniCows).set({ vetStatus, status }).where(eq(qurbaniCows.id, cowId));
  await db.insert(auditLogs).values({ actor: user.email, role: user.role, action: "cow.status", entity: "qurbani_cows", entityId: String(cowId), detail: `Vet ${vetStatus}, status ${status}` });
  revalidatePath("/admin/qurbani");
}

export async function releaseHissaAction(formData: FormData): Promise<void> {
  const user = await requirePermission("qurbani.manage");
  const shareId = num(formData, "shareId");
  await db.update(qurbaniShares).set({ status: "Available", bookingId: null, holdExpiresAt: null }).where(eq(qurbaniShares.id, shareId));
  await db.insert(auditLogs).values({ actor: user.email, role: user.role, action: "hissa.release", entity: "qurbani_shares", entityId: String(shareId), detail: "Freed by staff." });
  revalidatePath("/admin/qurbani");
}

export async function saveTemplatesAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  const ids = formData.getAll("templateId").map((value) => Number(value));
  for (const id of ids) {
    const body = text(formData, `body-${id}`);
    if (!body) continue;
    await db.update(qurbaniTemplates).set({ body }).where(eq(qurbaniTemplates.id, id));
  }
  await logAudit(user.email, "qurbani.templates", "qurbani_templates", null, `${ids.length} templates updated`, user.role);
  revalidatePath("/admin/qurbani");
}

export async function seasonResetAction(): Promise<void> {
  const user = await requirePermission("season.reset");
  const active = await db.select().from(qurbaniSeasons).where(eq(qurbaniSeasons.active, true));
  for (const season of active) {
    await db.update(qurbaniSeasons).set({ archived: true, active: false }).where(eq(qurbaniSeasons.id, season.id));
    await db.update(qurbaniShares).set({ status: "Available", bookingId: null, holdExpiresAt: null }).where(eq(qurbaniShares.seasonId, season.id));
  }
  await logAudit(user.email, "season.reset", "qurbani_seasons", null, "Season archived as read-only and the live board cleared.", user.role);
  revalidatePath("/admin/qurbani");
  revalidatePath("/qurbani");
}

export async function createSeasonAction(formData: FormData): Promise<void> {
  const user = await requirePermission("season.reset");
  await db.insert(qurbaniSeasons).values({
    name: text(formData, "name") || "New season",
    year: num(formData, "year", new Date().getFullYear() + 1),
    active: true,
    bookingOpenAt: new Date(),
    bookingDeadline: new Date(text(formData, "bookingDeadline") || Date.now() + 30 * 86400000),
    eidDate: new Date(text(formData, "eidDate") || Date.now() + 45 * 86400000),
    slaughterStart: new Date(text(formData, "eidDate") || Date.now() + 45 * 86400000),
    slaughterEnd: new Date(new Date(text(formData, "eidDate") || Date.now()).getTime() + 2 * 86400000),
    sharePrice: num(formData, "sharePrice", 45000),
    cowPrice: num(formData, "cowPrice", 315000),
    cowCount: num(formData, "cowCount", 14),
    slaughterLocation: text(formData, "slaughterLocation") || "Jamia Ghousia University Farm, Lahore (placeholder)",
  });
  await logAudit(user.email, "season.create", "qurbani_seasons", null, text(formData, "name"), user.role);
  revalidatePath("/admin/qurbani");
}

/* ----------------------------- Leads & donations ----------------------------- */

export async function updateLeadStatusAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content.manage");
  const id = num(formData, "id");
  await db.update(leads).set({ status: text(formData, "status") || "contacted" }).where(eq(leads.id, id));
  await logAudit(user.email, "lead.status", "leads", String(id), text(formData, "status"), user.role);
  revalidatePath("/admin/leads");
}

export async function confirmDonationAction(formData: FormData): Promise<void> {
  const user = await requirePermission("payments.verify");
  const id = num(formData, "id");
  await db.update(donations).set({ status: "verified" }).where(eq(donations.id, id));
  await logAudit(user.email, "donation.verify", "donations", String(id), "Donation verified and receipt queued.", user.role);
  revalidatePath("/admin/donations");
}

export async function qurbaniReportPdfData(): Promise<{ bookings: (typeof qurbaniBookings.$inferSelect)[] }> {
  const bookings = await db.select().from(qurbaniBookings).orderBy(sql`${qurbaniBookings.createdAt} desc`);
  return { bookings };
}
