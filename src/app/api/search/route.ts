import { NextResponse } from "next/server";
import { searchEverything } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (term.length < 2) return NextResponse.json({ ok: true, results: [] });
  const results = await searchEverything(term.slice(0, 80));
  const flat = [
    ...results.programmes.map((r) => ({ ...r, type: "Programme", href: `/academics/${r.slug}` })),
    ...results.fatawa.map((r) => ({ ...r, type: "Fatwa", href: `/darul-ifta/${r.slug}` })),
    ...results.pdfs.map((r) => ({ ...r, type: "PDF", href: `/library/${r.slug}` })),
    ...results.events.map((r) => ({ ...r, type: "Event", href: `/events/${r.slug}` })),
  ];
  return NextResponse.json({ ok: true, results: flat });
}
