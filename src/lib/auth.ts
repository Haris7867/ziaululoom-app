import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { adminSessions, adminUsers, auditLogs } from "@/db/schema";
import { verifyPassword } from "./passwords";

export const SESSION_COOKIE = "alnoor_admin";
const SESSION_HOURS = 8;

export type Role =
  | "super_admin"
  | "qurbani_incharge"
  | "cashier"
  | "dispatch"
  | "viewer"
  | "mufti";

export type Permission =
  | "content.manage"
  | "fatawa.manage"
  | "qurbani.manage"
  | "qurbani.status"
  | "payments.verify"
  | "reports.view"
  | "season.reset"
  | "users.manage";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    "content.manage",
    "fatawa.manage",
    "qurbani.manage",
    "qurbani.status",
    "payments.verify",
    "reports.view",
    "season.reset",
    "users.manage",
  ],
  qurbani_incharge: ["qurbani.manage", "qurbani.status", "payments.verify", "reports.view"],
  cashier: ["payments.verify", "reports.view"],
  dispatch: ["qurbani.status"],
  viewer: ["reports.view"],
  mufti: ["fatawa.manage", "reports.view"],
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super admin",
  qurbani_incharge: "Qurbani in-charge",
  cashier: "Cashier",
  dispatch: "Dispatch team",
  viewer: "Viewer",
  mufti: "Mufti / Darul Ifta",
};

export function can(role: string, permission: Permission): boolean {
  const list = ROLE_PERMISSIONS[role as Role];
  return Boolean(list?.includes(permission));
}

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export async function signIn(email: string, password: string): Promise<SessionUser | null> {
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase().trim()));
  const user = rows[0];
  if (!user || !user.active) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await db.insert(adminSessions).values({ token, userId: user.id, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  await logAudit(user.email, "sign-in", "admin_user", String(user.id), `Role ${user.role}`);
  return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({
      id: adminUsers.id,
      name: adminUsers.name,
      email: adminUsers.email,
      role: adminUsers.role,
      active: adminUsers.active,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, new Date())));
  const user = rows[0];
  if (!user || !user.active) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
}

export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (!can(user.role, permission)) throw new Error("FORBIDDEN");
  return user;
}

export async function logAudit(
  actor: string,
  action: string,
  entity: string,
  entityId: string | null,
  detail?: string,
  role?: string,
): Promise<void> {
  await db.insert(auditLogs).values({ actor, action, entity, entityId, detail, role });
}
