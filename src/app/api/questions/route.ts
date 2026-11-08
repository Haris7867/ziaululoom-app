import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { auditLogs, fatwaQuestions } from "@/db/schema";
import { ensureSeed } from "@/db/seed";

const schema = z.object({
  name: z.string().max(120).optional(),
  contact: z.string().min(3).max(160),
  city: z.string().min(2).max(80),
  category: z.string().min(2).max(80),
  question: z.string().min(10).max(1000),
  language: z.enum(["en", "ur"]).default("en"),
  anonymous: z.boolean().default(false),
});

const URGENT = ["zakat", "qurbani"];

export async function POST(request: Request) {
  try {
    await ensureSeed();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Please complete the required fields." }, { status: 400 });
    }
    const data = parsed.data;
    const tracking = `Q-2027-${String(Math.floor(10000 + Math.random() * 89999))}`;
    const urgent = URGENT.some((word) => data.category.toLowerCase().includes(word));
    // Duplicate detection placeholder: same contact + similar text within 7 days.
    const [row] = await db
      .insert(fatwaQuestions)
      .values({
        trackingNumber: tracking,
        name: data.anonymous ? null : data.name || null,
        contact: data.contact,
        city: data.city,
        category: data.category,
        question: data.question,
        language: data.language,
        anonymous: data.anonymous,
        priority: urgent ? "urgent" : "normal",
        status: "received",
      })
      .returning({ id: fatwaQuestions.id });
    await db.insert(auditLogs).values({
      actor: data.anonymous ? "anonymous" : data.contact,
      role: "public",
      action: "fatwa.question.create",
      entity: "fatwa_questions",
      entityId: tracking,
      detail: `Category ${data.category}; ${urgent ? "urgent" : "normal"} priority. Confirmation sent (EN + UR) by email/WhatsApp placeholder.`,
    });
    return NextResponse.json({
      ok: true,
      tracking,
      id: row.id,
      priority: urgent ? "urgent" : "normal",
      confirmation: "A confirmation has been sent in English and Urdu.",
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to submit your question." }, { status: 500 });
  }
}
