import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-guard";
import { can } from "@/lib/auth";
import { getLeads } from "@/lib/data";
import { updateLeadStatusAction } from "../actions";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads admin", robots: { index: false } };

export default async function AdminLeadsPage() {
  const user = await requireAdminPage();
  const leads = await getLeads();
  const allowed = can(user.role, "content.manage");

  return (
    <div className="space-y-4">
      <header className="card p-4">
        <p className="eyebrow">Leads</p>
        <h1 className="text-2xl font-bold">Enquiries, callbacks &amp; newsletter</h1>
        <p className="text-sm text-ink/65">{leads.length} submissions. Forms are limited to five fields, validated on the server, and notify the admin inbox (email placeholder).</p>
      </header>

      <section className="card overflow-x-auto p-4">
        <table className="w-full text-xs">
          <thead className="uppercase tracking-wide text-ink/50">
            <tr><th className="p-1.5 text-start">When</th><th className="p-1.5 text-start">Name</th><th className="p-1.5 text-start">Contact</th><th className="p-1.5 text-start">Interest</th><th className="p-1.5 text-start">Message</th><th className="p-1.5 text-start">Kind</th><th className="p-1.5 text-start">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-deep/10">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="p-1.5 text-ink/55">{formatDateTime(lead.createdAt)}</td>
                <td className="p-1.5 font-medium">{lead.name}</td>
                <td className="p-1.5">{lead.phone}<br /><span className="text-ink/50">{lead.email}</span></td>
                <td className="p-1.5">{lead.city}<br /><span className="text-ink/50">{lead.programme}</span></td>
                <td className="p-1.5 max-w-xs text-ink/70">{lead.message}</td>
                <td className="p-1.5"><span className={`badge !text-[0.6rem] ${lead.kind === "application" ? "badge-dark" : ""}`}>{lead.kind}</span></td>
                <td className="p-1.5">
                  {allowed ? (
                    <form action={updateLeadStatusAction} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={lead.id} />
                      <select name="status" defaultValue={lead.status} className="select !w-24 !py-0.5 !text-[0.62rem]">
                        {["new", "contacted", "closed"].map((status) => <option key={status}>{status}</option>)}
                      </select>
                      <button type="submit" className="btn btn-outline !px-1.5 !py-0.5 !text-[0.6rem]">Save</button>
                    </form>
                  ) : lead.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="py-6 text-center text-sm text-ink/60">No leads yet.</p>}
      </section>

      <section className="card p-4 text-xs text-ink/60">
        <h2 className="text-sm font-bold text-deep">Data handling</h2>
        <p>Leads are used only to respond to the sender. Prospectus downloads and newsletter signups are tagged separately. See the privacy policy for retention and deletion requests.</p>
      </section>
    </div>
  );
}
