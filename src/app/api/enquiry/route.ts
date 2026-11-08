import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { auditLogs, leads } from "@/db/schema";
import { ensureSeed } from "@/db/seed";

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(3).max(40),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().max(80).optional(),
  programme: z.string().max(160).optional(),
  message: z.string().max(1200).optional(),
  kind: z.enum(["enquiry", "callback", "event", "newsletter", "application", "prospectus"]).default("enquiry"),
});

export async function POST(request: Request) {
  try {
    await ensureSeed();
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Please check the required fields." }, { status: 400 });
    }
    const data = parsed.data;
    const [lead] = await db
      .insert(leads)
      .values({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        city: data.city || null,
        programme: data.programme || null,
        message: data.message || null,
        kind: data.kind,
      })
      .returning({ id: leads.id });
    await db.insert(auditLogs).values({
      actor: data.email || data.phone,
      role: "public",
      action: `lead.${data.kind}`,
      entity: "leads",
      entityId: String(lead.id),
      detail: "Saved to the Leads list; admin notification queued (email placeholder).",
    });
    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to save your enquiry." }, { status: 500 });
  }
}
