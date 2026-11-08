import "server-only";
import { redirect } from "next/navigation";
import { can, getSessionUser, type Permission, type SessionUser } from "./auth";

export async function requireAdminPage(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requirePermissionPage(permission: Permission): Promise<SessionUser> {
  const user = await requireAdminPage();
  if (!can(user.role, permission)) redirect("/admin?denied=1");
  return user;
}
