import type { ReactNode } from "react";
import Link from "next/link";
import { getSessionUser, ROLE_LABELS, type Role } from "@/lib/auth";
import { logoutAction } from "./actions";
import { Icon, Logo } from "@/components/Icon";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "cap" as const },
  { href: "/admin/qurbani", label: "Qurbani season", icon: "cow" as const },
  { href: "/admin/fatawa", label: "Darul Ifta queue", icon: "question" as const },
  { href: "/admin/content", label: "Content & seasonal", icon: "book" as const },
  { href: "/admin/donations", label: "Donations", icon: "money" as const },
  { href: "/admin/leads", label: "Leads", icon: "users" as const },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="bg-light/30">
      <div className="container-x py-6">
        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-deep/15 bg-deep p-4 text-white">
              <Logo />
              <p className="mt-3 text-xs uppercase tracking-wider text-gold">Admin panel</p>
              {user ? (
                <>
                  <p className="mt-1 text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-white/70">{ROLE_LABELS[user.role as Role]}</p>
                  <form action={logoutAction} className="mt-2">
                    <button type="submit" className="btn btn-ghost-light w-full !py-1.5 !text-xs">
                      <Icon name="logout" size={14} /> Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/admin/login" className="btn btn-gold mt-2 w-full !py-1.5 !text-xs">Staff login</Link>
              )}
            </div>
            {user && (
              <nav aria-label="Admin sections" className="mt-3 rounded-lg border border-deep/15 bg-white p-2">
                {LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-ink/80 hover:bg-light hover:text-deep">
                    <Icon name={link.icon} size={16} className="text-fresh" /> {link.label}
                  </Link>
                ))}
                <Link href="/" className="mt-1 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold text-deep hover:bg-light">
                  <Icon name="external" size={14} /> Public website
                </Link>
              </nav>
            )}
            <div className="mt-3 rounded-lg border border-deep/15 bg-white p-3 text-[0.68rem] text-ink/60">
              Audit trail active. Payments verified only by cashier, Qurbani in-charge or super admin. Card numbers are never stored.
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
