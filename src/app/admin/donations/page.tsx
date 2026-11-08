import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-guard";
import { can } from "@/lib/auth";
import { getDonations } from "@/lib/data";
import { confirmDonationAction } from "../actions";
import { formatDateTime, formatPkr } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Donations admin", robots: { index: false } };

export default async function AdminDonationsPage() {
  const user = await requireAdminPage();
  const donations = await getDonations();
  const paid = donations.filter((donation) => donation.status === "paid" || donation.status === "verified");
  const total = paid.reduce((sum, donation) => sum + donation.amount, 0);
  const byPurpose = paid.reduce<Record<string, number>>((acc, donation) => {
    acc[donation.purpose] = (acc[donation.purpose] ?? 0) + donation.amount;
    return acc;
  }, {});
  const byMethod = paid.reduce<Record<string, number>>((acc, donation) => {
    acc[donation.method] = (acc[donation.method] ?? 0) + donation.amount;
    return acc;
  }, {});
  const canVerify = can(user.role, "payments.verify");

  return (
    <div className="space-y-4">
      <header className="card p-4">
        <p className="eyebrow">Donations</p>
        <h1 className="text-2xl font-bold">Donations &amp; receipts</h1>
        <p className="text-sm text-ink/65">Confirmed total: <strong dir="ltr">{formatPkr(total)}</strong> across {paid.length} donations. Zakat and Sadaqah are tracked by purpose for separate accounting.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-4">
          <h2 className="text-sm font-bold text-deep">By purpose</h2>
          <ul className="mt-1 space-y-1 text-xs">
            {Object.entries(byPurpose).map(([purpose, amount]) => (
              <li key={purpose} className="flex justify-between"><span className="capitalize">{purpose}</span><span dir="ltr">{formatPkr(amount)}</span></li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <h2 className="text-sm font-bold text-deep">By method</h2>
          <ul className="mt-1 space-y-1 text-xs">
            {Object.entries(byMethod).map(([method, amount]) => (
              <li key={method} className="flex justify-between"><span>{method}</span><span dir="ltr">{formatPkr(amount)}</span></li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <h2 className="text-sm font-bold text-deep">Monthly giving</h2>
          <p className="mt-1 text-xs text-ink/70">{donations.filter((d) => d.recurring === "monthly").length} active monthly donors. Anonymised annual summary is published in the reports section.</p>
          <a href="/api/admin/qurbani-export?format=csv" className="btn btn-outline mt-2 !py-1 !text-[0.65rem]">Export CSV (bookings)</a>
        </div>
      </div>

      <section className="card p-4">
        <h2 className="text-lg font-bold">All donations</h2>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="uppercase tracking-wide text-ink/50">
              <tr><th className="p-1.5 text-start">Receipt</th><th className="p-1.5 text-start">Donor</th><th className="p-1.5 text-start">Purpose</th><th className="p-1.5 text-start">Method</th><th className="p-1.5 text-start">Amount</th><th className="p-1.5 text-start">Status</th><th className="p-1.5 text-start">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-deep/10">
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="p-1.5 font-mono">{donation.receiptNo}</td>
                  <td className="p-1.5">{donation.donorName}<br /><span className="text-ink/50">{donation.email}</span></td>
                  <td className="p-1.5 capitalize">{donation.purpose}<br /><span className="text-ink/50">{donation.recurring}</span></td>
                  <td className="p-1.5">{donation.method}</td>
                  <td className="p-1.5 font-semibold" dir="ltr">{formatPkr(donation.amount)}</td>
                  <td className="p-1.5">{donation.status}<br /><span className="text-ink/50">{formatDateTime(donation.createdAt)}</span></td>
                  <td className="p-1.5">
                    {canVerify && donation.status !== "verified" && donation.status !== "paid" ? (
                      <form action={confirmDonationAction}>
                        <input type="hidden" name="id" value={donation.id} />
                        <button type="submit" className="btn btn-primary !px-2 !py-1 !text-[0.62rem]">Verify</button>
                      </form>
                    ) : <span className="text-ink/40">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
