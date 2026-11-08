import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { loginAction } from "../actions";
import { Logo } from "@/components/Icon";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Staff login", robots: { index: false } };

const DEMO = [
  ["admin@alnoor.edu.pk", "Admin@2027", "Super admin"],
  ["mufti@alnoor.edu.pk", "Mufti@2027", "Mufti / Darul Ifta"],
  ["qurbani@alnoor.edu.pk", "Qurbani@2027", "Qurbani in-charge"],
  ["cashier@alnoor.edu.pk", "Cashier@2027", "Cashier"],
  ["dispatch@alnoor.edu.pk", "Dispatch@2027", "Dispatch team"],
  ["viewer@alnoor.edu.pk", "Viewer@2027", "Viewer"],
];

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getSessionUser();
  if (user) redirect("/admin");
  const { error } = await searchParams;

  return (
    <section className="section">
      <div className="container-x max-w-4xl">
        <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
          <div className="card p-6">
            <Logo />
            <h1 className="mt-4 text-2xl font-bold">Staff login</h1>
            <p className="mt-1 text-sm text-ink/70">
              Role-based access for admin staff only. Sessions expire after 8 hours and every change is written to the audit log.
            </p>
            {error && <p className="mt-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">Invalid email or password.</p>}
            <form action={loginAction} className="mt-4 space-y-3">
              <label className="block">
                <span className="label">Email</span>
                <input name="email" type="email" required autoComplete="username" className="input" dir="ltr" defaultValue="admin@alnoor.edu.pk" />
              </label>
              <label className="block">
                <span className="label">Password</span>
                <input name="password" type="password" required autoComplete="current-password" className="input" dir="ltr" />
              </label>
              <button type="submit" className="btn btn-primary w-full"><Icon name="lock" size={16} /> Sign in</button>
            </form>
            <p className="mt-2 text-xs text-ink/55">HTTPS enforced · httpOnly session cookie · role permissions checked on the server for every action.</p>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold">Demo accounts</h2>
            <p className="text-xs text-ink/60">Passwords are placeholders for the demo. Staff roles: super admin, Qurbani in-charge, cashier, dispatch team, viewer, Mufti.</p>
            <ul className="mt-3 space-y-2 text-sm">
              {DEMO.map(([email, password, role]) => (
                <li key={email} className="rounded-md border border-deep/10 bg-light/50 p-2.5">
                  <p className="font-semibold text-deep">{role}</p>
                  <p className="font-mono text-xs" dir="ltr">{email}</p>
                  <p className="font-mono text-xs text-ink/60" dir="ltr">{password}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-md border border-gold/40 bg-[#fdf8e8] p-2.5 text-xs text-[#6d5108]">
              No real student records are stored here. Public content, donations, questions and Qurbani bookings live in protected tables separate from the university&apos;s main database.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
