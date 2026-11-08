import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-guard";
import { can } from "@/lib/auth";
import {
  getActiveSeason, getAdminCounts, getAuditLogs, getDonations, getLeads, getQuestions,
  getRecentBookings, getQurbaniStats,
} from "@/lib/data";
import { Icon } from "@/components/Icon";
import { formatDateTime, formatPkr } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin dashboard", robots: { index: false } };

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireAdminPage();
  const { denied } = await searchParams;
  const [counts, questions, bookings, leads, donations, audit, season] = await Promise.all([
    getAdminCounts(), getQuestions(), getRecentBookings(5), getLeads(), getDonations(), getAuditLogs(8), getActiveSeason(),
  ]);
  const stats = season ? await getQurbaniStats(season.id) : null;

  const cards = [
    { label: "Darul Ifta questions", value: counts.questions, href: "/admin/fatawa", icon: "question" as const },
    { label: "Qurbani bookings", value: counts.bookings, href: "/admin/qurbani", icon: "cow" as const },
    { label: "Donations", value: counts.donations, href: "/admin/donations", icon: "heart" as const },
    { label: "Leads", value: counts.leads, href: "/admin/leads", icon: "users" as const },
  ];

  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-deep/15 bg-white p-5">
        <p className="eyebrow">Admin</p>
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <p className="text-sm text-ink/65">
          {season ? `${season.name} · booking deadline ${formatDateTime(season.bookingDeadline)}` : "No active Qurbani season"}
          {" · "}audit logging enabled.
        </p>
        {denied && <p className="mt-2 rounded border border-gold/40 bg-[#fdf8e8] p-2 text-xs text-[#6d5108]">You do not have permission for that action.</p>}
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card p-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-light text-deep"><Icon name={card.icon} size={18} /></span>
            <p className="mt-2 font-display text-2xl font-bold text-deep">{card.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">{card.label}</p>
          </Link>
        ))}
      </div>

      {stats && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Sold (bookings)", stats.sold],
            ["Paid", stats.paidCount],
            ["Pending payment", stats.pending],
            ["Refunded", stats.refunded],
            ["Revenue (paid)", formatPkr(stats.revenue)],
            ["Available hissas", stats.availableShares],
            ["Held hissas", stats.heldShares],
            ["Fully sold cows", stats.fullySold],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-deep/15 bg-white p-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink/55">{label}</p>
              <p className="font-display text-xl font-bold text-deep" dir="ltr">{value}</p>
            </div>
          ))}
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-4">
          <h2 className="text-lg font-bold">Darul Ifta queue</h2>
          <ul className="mt-2 divide-y divide-deep/10 text-sm">
            {questions.slice(0, 5).map((question) => (
              <li key={question.id} className="flex items-start justify-between gap-2 py-2">
                <div>
                  <p className="font-mono text-[0.7rem] text-ink/50">{question.trackingNumber}</p>
                  <p className="line-clamp-1 font-medium text-ink">{question.question}</p>
                  <p className="text-xs text-ink/55">{question.category} · {question.city} · {question.status}</p>
                </div>
                {question.priority === "urgent" && <span className="badge badge-gold">Urgent</span>}
              </li>
            ))}
          </ul>
          {can(user.role, "fatawa.manage") && <Link href="/admin/fatawa" className="btn btn-outline mt-2 w-full !py-1.5 !text-xs">Open queue</Link>}
        </section>

        <section className="card p-4">
          <h2 className="text-lg font-bold">Latest Qurbani bookings</h2>
          <ul className="mt-2 divide-y divide-deep/10 text-sm">
            {bookings.map((booking) => (
              <li key={booking.id} className="flex items-center justify-between gap-2 py-2">
                <div>
                  <p className="font-mono text-[0.7rem] text-ink/50">{booking.receiptId}</p>
                  <p className="font-medium">{booking.buyerName}</p>
                  <p className="text-xs text-ink/55">Cow {booking.cowNumber} · {booking.paymentMethod} · {booking.status}</p>
                </div>
                <span className="text-sm font-semibold text-deep" dir="ltr">{formatPkr(booking.amount)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-4">
          <h2 className="text-lg font-bold">Recent leads</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {leads.slice(0, 5).map((lead) => (
              <li key={lead.id} className="flex justify-between gap-2">
                <span className="text-ink">{lead.name} <span className="text-xs text-ink/50">({lead.kind})</span></span>
                <span className="text-xs text-ink/60" dir="ltr">{lead.phone}</span>
              </li>
            ))}
          </ul>
          <Link href="/admin/leads" className="btn btn-outline mt-2 w-full !py-1.5 !text-xs">All leads</Link>
        </section>

        <section className="card p-4">
          <h2 className="text-lg font-bold">Donations</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {donations.slice(0, 4).map((donation) => (
              <li key={donation.id} className="flex justify-between gap-2">
                <span className="text-ink">{donation.purpose} <span className="text-xs text-ink/50">({donation.method})</span></span>
                <span className="font-semibold text-deep" dir="ltr">{formatPkr(donation.amount)}</span>
              </li>
            ))}
          </ul>
          <Link href="/admin/donations" className="btn btn-outline mt-2 w-full !py-1.5 !text-xs">All donations</Link>
        </section>
      </div>

      <section className="card p-4">
        <h2 className="text-lg font-bold">Audit log</h2>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-start uppercase tracking-wide text-ink/50">
              <tr><th className="p-2 text-start">When</th><th className="p-2 text-start">Actor</th><th className="p-2 text-start">Action</th><th className="p-2 text-start">Detail</th></tr>
            </thead>
            <tbody className="divide-y divide-deep/10">
              {audit.map((entry) => (
                <tr key={entry.id}>
                  <td className="p-2 text-ink/60">{formatDateTime(entry.createdAt)}</td>
                  <td className="p-2">{entry.actor}</td>
                  <td className="p-2 font-mono">{entry.action}</td>
                  <td className="p-2 text-ink/70">{entry.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
