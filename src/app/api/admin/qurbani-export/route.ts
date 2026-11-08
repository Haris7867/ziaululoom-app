import { NextResponse } from "next/server";
import { can, getSessionUser } from "@/lib/auth";
import { getActiveSeason, getCowBoard, getQurbaniStats, getRecentBookings } from "@/lib/data";
import { buildContentPdf } from "@/lib/pdf";
import { formatDateTime, formatPkr } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user || !can(user.role, "reports.view")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "csv";
  const [bookings, season] = await Promise.all([getRecentBookings(500), getActiveSeason()]);
  const stats = season ? await getQurbaniStats(season.id) : null;
  const board = season ? await getCowBoard(season.id) : [];

  if (format === "csv") {
    const header = ["receipt_id", "created_at", "buyer_name", "whatsapp", "email", "city", "cow", "hissas", "purpose", "amount", "method", "payment_status", "status", "courier", "tracking"];
    const rows = bookings.map((booking) => [
      booking.receiptId,
      formatDateTime(booking.createdAt),
      booking.buyerName,
      booking.whatsapp,
      booking.email,
      booking.city,
      booking.cowNumber ?? "",
      Array.isArray(booking.shareNumbers) ? (booking.shareNumbers as number[]).join(" ") : "",
      booking.purpose,
      String(booking.amount),
      booking.paymentMethod,
      booking.paymentStatus,
      booking.status,
      booking.courier ?? "",
      booking.trackingNumber ?? "",
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="qurbani-bookings-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const bytes = await buildContentPdf({
    title: `${season?.name ?? "Qurbani"} — season report`,
    subtitle: "Sample report generated from the admin dashboard",
    meta: `Prepared by ${user.name} (${user.role}) on ${formatDateTime(new Date())}`,
    sections: [
      {
        heading: "Summary",
        lines: [
          `Bookings: ${stats?.sold ?? 0}; paid: ${stats?.paidCount ?? 0}; pending: ${stats?.pending ?? 0}; refunded: ${stats?.refunded ?? 0}.`,
          `Revenue confirmed: ${formatPkr(stats?.revenue ?? 0)}. Available hissas: ${stats?.availableShares ?? 0}; held: ${stats?.heldShares ?? 0}; fully sold cows: ${stats?.fullySold ?? 0}.`,
          `Cows slaughtered: ${stats?.cowsSlaughtered ?? 0} of ${board.length}.`,
        ],
      },
      { heading: "Revenue by payment method", lines: Object.entries(stats?.byMethod ?? {}).map(([method, data]) => `${method}: ${data.count} transactions, ${formatPkr(data.amount)}.`) },
      {
        heading: "Cow inventory",
        lines: board.map((cow) => `Cow ${cow.cowNumber} — ${cow.breed}, ${cow.weightKg} kg, vet: ${cow.vetStatus}, status: ${cow.status}, paid hissas: ${cow.shares.filter((share) => share.status === "Paid").length}/7.`),
      },
      {
        heading: "Bookings (latest 60)",
        lines: bookings.slice(0, 60).map((booking) => `${booking.receiptId} — ${booking.buyerName}, Cow ${booking.cowNumber}, hissas ${Array.isArray(booking.shareNumbers) ? (booking.shareNumbers as number[]).join("/") : "-"}, ${formatPkr(booking.amount)}, ${booking.paymentMethod}, ${booking.status}.`),
      },
    ],
    footerNote: "Confidential — Qurbani administration report (sample data). Do not distribute publicly.",
  });

  return new NextResponse(Buffer.from(bytes) as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="qurbani-report-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
