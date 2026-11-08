import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Public content                                                      */
/* ------------------------------------------------------------------ */

export const settings = pgTable("settings", {
  key: varchar("key", { length: 120 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  bodyEn: text("body_en"),
  bodyUr: text("body_ur"),
  date: timestamp("date", { withTimezone: true }).defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
  pinned: boolean("pinned").default(false).notNull(),
});

export const programmes = pgTable("programmes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  level: varchar("level", { length: 60 }).notNull(),
  durationYears: numeric("duration_years").notNull(),
  mode: varchar("mode", { length: 40 }).notNull(),
  department: varchar("department", { length: 80 }).notNull(),
  icon: varchar("icon", { length: 40 }).default("book").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryUr: text("summary_ur").notNull(),
  overviewEn: text("overview_en").notNull(),
  overviewUr: text("overview_ur").notNull(),
  eligibilityEn: text("eligibility_en").notNull(),
  eligibilityUr: text("eligibility_ur").notNull(),
  careersEn: text("careers_en").notNull(),
  careersUr: text("careers_ur").notNull(),
  feePerYear: integer("fee_per_year").notNull(),
  admissionFee: integer("admission_fee").default(15000).notNull(),
  curriculum: jsonb("curriculum").notNull(),
  published: boolean("published").default(true).notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionUr: text("description_ur").notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  venueEn: text("venue_en").notNull(),
  venueUr: text("venue_ur").notNull(),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  coverImage: text("cover_image"),
  liveStreamUrl: text("live_stream_url"),
  schedule: jsonb("schedule"),
  speakers: jsonb("speakers"),
  videoUrl: text("video_url"),
  published: boolean("published").default(true).notNull(),
});

export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id"),
  url: text("url").notNull(),
  captionEn: text("caption_en").notNull(),
  captionUr: text("caption_ur").notNull(),
  year: integer("year").notNull(),
  eventType: varchar("event_type", { length: 40 }).notNull(),
  venue: varchar("venue", { length: 120 }),
  isCover: boolean("is_cover").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pdfResources = pgTable("pdf_resources", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  speaker: text("speaker"),
  resourceDate: timestamp("resource_date", { withTimezone: true }).defaultNow().notNull(),
  tags: jsonb("tags"),
  pages: integer("pages").default(12).notNull(),
  fileSizeKb: integer("file_size_kb").default(820).notNull(),
  language: varchar("language", { length: 20 }).default("Urdu").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryUr: text("summary_ur").notNull(),
  downloads: integer("downloads").default(0).notNull(),
  status: varchar("status", { length: 20 }).default("published").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
  fileUrl: text("file_url").notNull(),
  surah: varchar("surah", { length: 80 }),
  book: varchar("book", { length: 80 }),
  topic: varchar("topic", { length: 80 }),
});

export const fatawa = pgTable("fatawa", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  fatwaNumber: varchar("fatwa_number", { length: 40 }).notNull().unique(),
  category: varchar("category", { length: 80 }).notNull(),
  questionEn: text("question_en").notNull(),
  questionUr: text("question_ur").notNull(),
  answerEn: text("answer_en").notNull(),
  answerUr: text("answer_ur").notNull(),
  references: jsonb("references"),
  muftiName: varchar("mufti_name", { length: 120 }),
  approvedBy: varchar("approved_by", { length: 120 }).notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  status: varchar("status", { length: 20 }).default("published").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
  askDate: timestamp("ask_date", { withTimezone: true }).defaultNow().notNull(),
});

export const fatwaQuestions = pgTable("fatwa_questions", {
  id: serial("id").primaryKey(),
  trackingNumber: varchar("tracking_number", { length: 40 }).notNull().unique(),
  name: text("name"),
  contact: text("contact").notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  question: text("question").notNull(),
  language: varchar("language", { length: 20 }).default("en").notNull(),
  anonymous: boolean("anonymous").default(false).notNull(),
  priority: varchar("priority", { length: 20 }).default("normal").notNull(),
  status: varchar("status", { length: 24 }).default("received").notNull(),
  assignedTo: varchar("assigned_to", { length: 120 }),
  answerEn: text("answer_en"),
  answerUr: text("answer_ur"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  excerptEn: text("excerpt_en").notNull(),
  excerptUr: text("excerpt_ur").notNull(),
  bodyEn: text("body_en").notNull(),
  bodyUr: text("body_ur").notNull(),
  image: text("image"),
  category: varchar("category", { length: 60 }).default("University").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  roleEn: text("role_en").notNull(),
  roleUr: text("role_ur").notNull(),
  quoteEn: text("quote_en").notNull(),
  quoteUr: text("quote_ur").notNull(),
});

export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 140 }).notNull(),
  nameUr: varchar("name_ur", { length: 140 }).notNull(),
  roleEn: text("role_en").notNull(),
  roleUr: text("role_ur").notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  bioEn: text("bio_en"),
  bioUr: text("bio_ur"),
  qualifications: text("qualifications"),
  isLeadership: boolean("is_leadership").default(false).notNull(),
  isBoard: boolean("is_board").default(false).notNull(),
  photo: text("photo"),
});

export const seasonalBanners = pgTable("seasonal_banners", {
  id: serial("id").primaryKey(),
  seasonKey: varchar("season_key", { length: 40 }).notNull().unique(),
  active: boolean("active").default(false).notNull(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  bodyEn: text("body_en").notNull(),
  bodyUr: text("body_ur").notNull(),
  ctaLabelEn: text("cta_label_en"),
  ctaLabelUr: text("cta_label_ur"),
  ctaHref: text("cta_href"),
  tone: varchar("tone", { length: 20 }).default("celebration").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  kind: varchar("kind", { length: 40 }).notNull(),
  fileUrl: text("file_url").notNull(),
  sizeKb: integer("size_kb").default(1200).notNull(),
});

export const calendarEntries = pgTable("calendar_entries", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  kind: varchar("kind", { length: 40 }).default("term").notNull(),
  audience: varchar("audience", { length: 60 }).default("All programmes").notNull(),
});

export const examSchedule = pgTable("exam_schedule", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleUr: text("title_ur").notNull(),
  programmeSlug: varchar("programme_slug", { length: 160 }),
  examDate: timestamp("exam_date", { withTimezone: true }).notNull(),
  timeSlot: varchar("time_slot", { length: 60 }).notNull(),
  venue: varchar("venue", { length: 120 }).notNull(),
  kind: varchar("kind", { length: 40 }).default("midterm").notNull(),
});

/* ------------------------------------------------------------------ */
/* Donations, leads and payments                                       */
/* ------------------------------------------------------------------ */

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  receiptNo: varchar("receipt_no", { length: 40 }).notNull().unique(),
  donorName: text("donor_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  amount: integer("amount").notNull(),
  purpose: varchar("purpose", { length: 60 }).notNull(),
  recurring: varchar("recurring", { length: 20 }).default("one-time").notNull(),
  method: varchar("method", { length: 30 }).notNull(),
  status: varchar("status", { length: 24 }).default("pending").notNull(),
  transactionId: text("transaction_id"),
  anonymous: boolean("anonymous").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: varchar("city", { length: 80 }),
  programme: varchar("programme", { length: 160 }),
  message: text("message"),
  kind: varchar("kind", { length: 30 }).default("enquiry").notNull(),
  status: varchar("status", { length: 30 }).default("new").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: serial("id").primaryKey(),
  originalName: text("original_name").notNull(),
  storedName: text("stored_name").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  sizeKb: integer("size_kb").notNull(),
  private: boolean("private").default(true).notNull(),
  ownerRef: varchar("owner_ref", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------------------------------------------ */
/* Qurbani                                                             */
/* ------------------------------------------------------------------ */

export const qurbaniSeasons = pgTable("qurbani_seasons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  year: integer("year").notNull(),
  active: boolean("active").default(true).notNull(),
  archived: boolean("archived").default(false).notNull(),
  bookingOpenAt: timestamp("booking_open_at", { withTimezone: true }).notNull(),
  bookingDeadline: timestamp("booking_deadline", { withTimezone: true }).notNull(),
  eidDate: timestamp("eid_date", { withTimezone: true }).notNull(),
  slaughterStart: timestamp("slaughter_start", { withTimezone: true }).notNull(),
  slaughterEnd: timestamp("slaughter_end", { withTimezone: true }).notNull(),
  sharePrice: integer("share_price").notNull(),
  cowPrice: integer("cow_price").notNull(),
  aqeeqahPrice: integer("aqeeqah_price").default(45000).notNull(),
  cowCount: integer("cow_count").default(14).notNull(),
  slaughterLocation: text("slaughter_location").notNull(),
  refundWindowDays: integer("refund_window_days").default(7).notNull(),
  holdMinutes: integer("hold_minutes").default(30).notNull(),
  dispatchDate: timestamp("dispatch_date", { withTimezone: true }),
  distributionPolicyEn: text("distribution_policy_en"),
  distributionPolicyUr: text("distribution_policy_ur"),
  meatToNeedyKg: integer("meat_to_needy_kg").default(0).notNull(),
});

export const qurbaniCows = pgTable("qurbani_cows", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").notNull(),
  cowNumber: varchar("cow_number", { length: 20 }).notNull(),
  breed: varchar("breed", { length: 80 }).notNull(),
  ageMonths: integer("age_months").notNull(),
  weightKg: integer("weight_kg").notNull(),
  healthCheck: text("health_check").notNull(),
  vetStatus: varchar("vet_status", { length: 40 }).default("Fit for Qurbani").notNull(),
  purchasePrice: integer("purchase_price"),
  source: varchar("source", { length: 120 }).default("University farm").notNull(),
  photos: jsonb("photos"),
  status: varchar("status", { length: 40 }).default("Available").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qurbaniBookings = pgTable("qurbani_bookings", {
  id: serial("id").primaryKey(),
  receiptId: varchar("receipt_id", { length: 40 }).notNull().unique(),
  seasonId: integer("season_id").notNull(),
  buyerName: text("buyer_name").notNull(),
  guardianName: text("guardian_name"),
  cnic: text("cnic"),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  purpose: varchar("purpose", { length: 40 }).notNull(),
  onBehalfOf: text("on_behalf_of"),
  shareCount: integer("share_count").notNull(),
  cowId: integer("cow_id"),
  cowNumber: varchar("cow_number", { length: 20 }),
  shareNumbers: jsonb("share_numbers"),
  amount: integer("amount").notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 24 }).default("pending").notNull(),
  transactionId: text("transaction_id"),
  proofUrl: text("proof_url"),
  notes: text("notes"),
  status: varchar("status", { length: 24 }).default("Reserved").notNull(),
  holdExpiresAt: timestamp("hold_expires_at", { withTimezone: true }),
  slaughterDate: timestamp("slaughter_date", { withTimezone: true }),
  slaughterLocation: text("slaughter_location"),
  dispatchDate: timestamp("dispatch_date", { withTimezone: true }),
  dispatchNotes: text("dispatch_notes"),
  courier: text("courier"),
  trackingNumber: text("tracking_number"),
  nameChangeLog: jsonb("name_change_log"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qurbaniShares = pgTable("qurbani_shares", {
  id: serial("id").primaryKey(),
  cowId: integer("cow_id").notNull(),
  seasonId: integer("season_id").notNull(),
  shareNumber: integer("share_number").notNull(),
  status: varchar("status", { length: 24 }).default("Available").notNull(),
  bookingId: integer("booking_id"),
  holdExpiresAt: timestamp("hold_expires_at", { withTimezone: true }),
});

export const qurbaniPayments = pgTable("qurbani_payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  method: varchar("method", { length: 30 }).notNull(),
  amount: integer("amount").notNull(),
  transactionId: text("transaction_id"),
  status: varchar("status", { length: 24 }).default("pending").notNull(),
  providerRef: text("provider_ref"),
  screenshotUrl: text("screenshot_url"),
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qurbaniLogs = pgTable("qurbani_logs", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id"),
  cowId: integer("cow_id"),
  fromStatus: varchar("from_status", { length: 40 }),
  toStatus: varchar("to_status", { length: 40 }),
  staff: varchar("staff", { length: 120 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qurbaniTemplates = pgTable("qurbani_templates", {
  id: serial("id").primaryKey(),
  templateKey: varchar("template_key", { length: 40 }).notNull(),
  language: varchar("language", { length: 8 }).notNull(),
  body: text("body").notNull(),
});

export const qurbaniFaqs = pgTable("qurbani_faqs", {
  id: serial("id").primaryKey(),
  questionEn: text("question_en").notNull(),
  questionUr: text("question_ur").notNull(),
  answerEn: text("answer_en").notNull(),
  answerUr: text("answer_ur").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

/* ------------------------------------------------------------------ */
/* Admin auth + audit                                                  */
/* ------------------------------------------------------------------ */

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 40 }).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  token: varchar("token", { length: 80 }).primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actor: varchar("actor", { length: 160 }).notNull(),
  role: varchar("role", { length: 40 }),
  action: varchar("action", { length: 80 }).notNull(),
  entity: varchar("entity", { length: 60 }),
  entityId: varchar("entity_id", { length: 60 }),
  detail: text("detail"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
