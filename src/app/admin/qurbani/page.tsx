import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-guard";
import { can, ROLE_LABELS, type Role } from "@/lib/auth";
import {
  getActiveSeason, getCowBoard, getQurbaniLogs, getQurbaniStats, getQurbaniTemplates, getRecentBookings,
} from "@/lib/data";
import {
  correctNameAction, createSeasonAction, qurbaniStatusAction, recordCashPaymentAction, refundBookingAction,
  releaseHissaAction, saveTemplatesAction, seasonResetAction, updateCowStatusAction, verifyQurbaniPaymentAction,
} from "../actions";
import { Icon } from "@/components/Icon";
import { formatDateTime, formatPkr } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Qurbani admin", robots: { index: false } };

const STATUS_FLOW = ["Reserved", "Paid", "Slaughtered", "Packed", "Dispatched", "Completed", "Refunded", "Cancelled"];

export default async function AdminQurbaniPage() {
  const user = await requireAdminPage();
  const season = await getActiveSeason();
  if (!season) {
    return (
      <div className="card p-5">
        <h1 className="text-xl font-bold">No active season</h1>
        <p className="mt-1 text-sm text-ink/65">Create a new season below. Archived seasons remain read-only.</p>
        <SeasonForm canManage={can(user.role, "season.reset")} />
      </div>
    );
  }
  const [stats, board, bookings, logs, templates] = await Promise.all([
    getQurbaniStats(season.id), getCowBoard(season.id), getRecentBookings(60), getQurbaniLogs(15), getQurbaniTemplates(),
  ]);
  const canManage = can(user.role, "qurbani.manage");
  const canStatus = can(user.role, "qurbani.status");
  const canPay = can(user.role, "payments.verify");

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-deep/15 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Qurbani season</p>
            <h1 className="text-2xl font-bold">{season.name}</h1>
            <p className="text-xs text-ink/60">
              Bookings {formatDateTime(season.bookingOpenAt)} – {formatDateTime(season.bookingDeadline)} · Slaughter {formatDateTime(season.slaughterStart)} · {season.holdMinutes} min holds · refund window {season.refundWindowDays} days
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/api/admin/qurbani-export?format=csv" className="btn btn-outline !py-1.5 !text-xs"><Icon name="download" size={13} /> Excel (CSV)</a>
            <a href="/api/admin/qurbani-export?format=pdf" className="btn btn-outline !py-1.5 !text-xs"><Icon name="file" size={13} /> PDF report</a>
            <Link href="/qurbani" className="btn btn-green !py-1.5 !text-xs">Public board</Link>
          </div>
        </div>
        <p className="mt-2 rounded bg-light px-2 py-1 text-[0.7rem] text-deep">
          Signed in as {user.email} ({ROLE_LABELS[user.role as Role]}). Unpaid holds release automatically after {season.holdMinutes} minutes. Every status change is logged with staff name and timestamp.
        </p>
      </header>

      <section className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Sold", stats.sold], ["Paid", stats.paidCount], ["Pending", stats.pending], ["Refunded", stats.refunded],
          ["Revenue", formatPkr(stats.revenue)], ["Fully sold cows", stats.fullySold],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-deep/15 bg-white p-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink/55">{label}</p>
            <p className="font-display text-lg font-bold text-deep" dir="ltr">{value}</p>
          </div>
        ))}
      </section>

      <section className="card p-4">
        <h2 className="text-lg font-bold">Revenue by payment method</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(stats.byMethod).length === 0 && <p className="text-sm text-ink/60">No payments yet.</p>}
          {Object.entries(stats.byMethod).map(([method, data]) => (
            <div key={method} className="rounded border border-deep/10 bg-light/50 p-2 text-xs">
              <p className="font-semibold uppercase text-deep">{method}</p>
              <p className="text-ink/70">{data.count} txns</p>
              <p className="font-bold text-ink" dir="ltr">{formatPkr(data.amount)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="text-lg font-bold">Cow inventory &amp; hissa manager</h2>
        <p className="text-xs text-ink/60">Vet status must be &quot;Fit for Qurbani&quot; before sale. Releasing a hissa frees it immediately and is logged.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="uppercase tracking-wide text-ink/50">
              <tr>
                <th className="p-1.5 text-start">Cow</th><th className="p-1.5 text-start">Breed / weight</th>
                <th className="p-1.5 text-start">Vet</th><th className="p-1.5 text-start">Hissas</th>
                <th className="p-1.5 text-start">Vet / status</th><th className="p-1.5 text-start">Release</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-deep/10">
              {board.map((cow) => (
                <tr key={cow.id}>
                  <td className="p-1.5 font-bold text-deep">#{cow.cowNumber}</td>
                  <td className="p-1.5">{cow.breed} · {cow.weightKg} kg · {Math.floor(cow.ageMonths / 12)}y</td>
                  <td className="p-1.5"><span className={`badge !text-[0.6rem] ${cow.vetStatus === "Fit for Qurbani" ? "" : "badge-grey"}`}>{cow.vetStatus}</span></td>
                  <td className="p-1.5">
                    <div className="flex flex-wrap gap-0.5">
                      {cow.shares.map((share) => (
                        <span key={share.id} className={`rounded px-1 py-0.5 text-[0.58rem] font-bold ${share.status === "Paid" ? "bg-deep text-white" : share.status === "Reserved" ? "bg-[#fdf5e1] text-[#6d5108]" : share.status === "Available" ? "bg-light text-deep" : "bg-[#f1f2f1] text-ink/60"}`}>
                          {share.shareNumber}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-1.5">
                    {canManage ? (
                      <form action={updateCowStatusAction} className="flex items-center gap-1">
                        <input type="hidden" name="cowId" value={cow.id} />
                        <select name="vetStatus" defaultValue={cow.vetStatus} className="select !w-32 !py-1 !text-[0.65rem]">
                          <option>Fit for Qurbani</option>
                          <option>Under observation</option>
                          <option>Rejected — replacement needed</option>
                        </select>
                        <select name="status" defaultValue={cow.status} className="select !w-24 !py-1 !text-[0.65rem]">
                          {["Available", "Reserved", "Paid", "Slaughtered", "Packed", "Dispatched"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <button type="submit" className="btn btn-primary !px-2 !py-1 !text-[0.6rem]">Save</button>
                      </form>
                    ) : <span className="text-ink/50">{cow.status}</span>}
                  </td>
                  <td className="p-1.5">
                    {canManage && cow.shares.filter((share) => share.status === "Reserved").map((share) => (
                      <form key={share.id} action={releaseHissaAction}>
                        <input type="hidden" name="shareId" value={share.id} />
                        <button type="submit" className="mr-1 rounded border border-deep/20 px-1 py-0.5 text-[0.6rem]">Free {share.shareNumber}</button>
                      </form>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-4">
        <h2 className="text-lg font-bold">Bookings &amp; dispatch</h2>
        <div className="mt-2 space-y-2">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-lg border border-deep/10 bg-white p-2.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-[0.7rem] text-ink/50">{booking.receiptId} · {formatDateTime(booking.createdAt)}</p>
                  <p className="text-sm font-semibold text-ink">{booking.buyerName} <span className="text-xs text-ink/55">· {booking.whatsapp} · {booking.city}</span></p>
                  <p className="text-xs text-ink/60">
                    Cow {booking.cowNumber} · Hissas {Array.isArray(booking.shareNumbers) ? (booking.shareNumbers as number[]).join(", ") : "-"} · {booking.paymentMethod} · {booking.paymentStatus}
                  </p>
                  <p className="text-[0.68rem] text-ink/50">{booking.purpose}{booking.onBehalfOf ? ` — ${booking.onBehalfOf}` : ""}</p>
                </div>
                <div className="text-end">
                  <span className={`badge ${booking.paymentStatus === "paid" ? "badge-dark" : "badge-gold"}`}>{booking.status}</span>
                  <p className="mt-1 text-sm font-bold text-deep" dir="ltr">{formatPkr(booking.amount)}</p>
                  <a href={`/api/qurbani/receipt/${booking.receiptId}/pdf`} className="text-[0.65rem] link-underline">Receipt PDF</a>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-end gap-2">
                {canPay && booking.paymentStatus !== "paid" && (
                  <>
                    <form action={verifyQurbaniPaymentAction} className="flex items-end gap-1">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input name="transactionId" defaultValue={booking.transactionId ?? ""} placeholder="Txn ID" className="input !w-32 !py-1 !text-[0.65rem]" />
                      <select name="method" defaultValue={booking.paymentMethod} className="select !w-28 !py-1 !text-[0.65rem]">
                        {["card", "jazzcash", "easypaisa", "upaisa", "bank_transfer", "cash"].map((m) => <option key={m}>{m}</option>)}
                      </select>
                      <button type="submit" className="btn btn-primary !px-2 !py-1 !text-[0.62rem]">Verify</button>
                    </form>
                    <form action={recordCashPaymentAction}>
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <button type="submit" className="btn btn-outline !px-2 !py-1 !text-[0.62rem]">Cash paid</button>
                    </form>
                  </>
                )}
                {canStatus && (
                  <form action={qurbaniStatusAction} className="flex flex-wrap items-end gap-1">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <select name="status" defaultValue={booking.status} className="select !w-28 !py-1 !text-[0.65rem]">
                      {STATUS_FLOW.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <input name="courier" placeholder="Courier" className="input !w-24 !py-1 !text-[0.65rem]" />
                    <input name="trackingNumber" placeholder="Tracking" className="input !w-24 !py-1 !text-[0.65rem]" />
                    <input name="note" placeholder="Note" className="input !w-28 !py-1 !text-[0.65rem]" />
                    <button type="submit" className="btn btn-green !px-2 !py-1 !text-[0.62rem]">Update + notify</button>
                  </form>
                )}
                {canManage && (
                  <form action={correctNameAction} className="flex items-end gap-1">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input name="buyerName" defaultValue={booking.buyerName} className="input !w-36 !py-1 !text-[0.65rem]" />
                    <button type="submit" className="btn btn-outline !px-2 !py-1 !text-[0.62rem]">Correct name</button>
                  </form>
                )}
                {canManage && booking.paymentStatus === "paid" && (
                  <form action={refundBookingAction} className="flex items-end gap-1">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input name="reason" placeholder="Refund reason" className="input !w-36 !py-1 !text-[0.65rem]" />
                    <button type="submit" className="btn btn-outline !px-2 !py-1 !text-[0.62rem]">Refund</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[0.65rem] text-ink/60">
          <span>Dispatch slips and packing labels:</span>
          <a href="/api/admin/qurbani-export?format=csv&kind=dispatch" className="link-underline">Export dispatch list (CSV)</a>
          <span>·</span>
          <span>WhatsApp / SMS updates are queued on each status change.</span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="text-lg font-bold">WhatsApp message templates</h2>
          <p className="text-xs text-ink/60">English and Urdu templates used for booking, payment, slaughter and dispatch updates.</p>
          <form action={saveTemplatesAction} className="mt-2 space-y-2">
            {templates.map((template) => (
              <label key={template.id} className="block text-xs">
                <span className="font-semibold uppercase tracking-wide text-deep">{template.templateKey} · {template.language}</span>
                <input type="hidden" name="templateId" value={template.id} />
                <textarea name={`body-${template.id}`} defaultValue={template.body} rows={2} className="textarea mt-1 !text-xs" dir={template.language === "ur" ? "rtl" : "ltr"} />
              </label>
            ))}
            {can(user.role, "content.manage") && <button type="submit" className="btn btn-primary w-full !py-1.5 !text-xs">Save templates</button>}
          </form>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <h2 className="text-lg font-bold">Status log</h2>
            <ul className="mt-2 space-y-1 text-xs">
              {logs.map((log) => (
                <li key={log.id} className="flex justify-between gap-2 border-b border-deep/5 pb-1">
                  <span><span className="font-semibold">{log.fromStatus ?? "-"} → {log.toStatus}</span> · {log.staff}</span>
                  <span className="text-ink/45">{formatDateTime(log.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
          <SeasonForm canManage={can(user.role, "season.reset")} />
        </div>
      </section>
    </div>
  );
}

function SeasonForm({ canManage }: { canManage: boolean }) {
  if (!canManage) {
    return <div className="card p-4 text-xs text-ink/60">Only a super admin can set up a season or reset the board.</div>;
  }
  return (
    <div className="card p-4">
      <h2 className="text-lg font-bold">Season setup</h2>
      <form action={createSeasonAction} className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
        <input name="name" placeholder="Season name (e.g. Qurbani 2028)" className="input !py-1.5" required />
        <input name="year" type="number" placeholder="Year" className="input !py-1.5" />
        <input name="bookingDeadline" type="date" className="input !py-1.5" aria-label="Booking deadline" />
        <input name="eidDate" type="date" className="input !py-1.5" aria-label="Eid date" />
        <input name="sharePrice" type="number" placeholder="Price per hissa" className="input !py-1.5" />
        <input name="cowPrice" type="number" placeholder="Price per cow" className="input !py-1.5" />
        <input name="cowCount" type="number" placeholder="Cow count" className="input !py-1.5" />
        <input name="slaughterLocation" placeholder="Slaughter location" className="input !py-1.5" />
        <button type="submit" className="btn btn-primary sm:col-span-2 !py-1.5 !text-xs">Create season</button>
      </form>
      <form action={seasonResetAction} className="mt-3 border-t border-deep/10 pt-3">
        <p className="text-xs text-ink/60">Archive the current season as read-only and clear the live board. Data is retained for reports.</p>
        <button type="submit" className="btn btn-outline mt-1 !py-1.5 !text-xs">Archive season &amp; reset board</button>
      </form>
    </div>
  );
}
