import { redirect } from "next/navigation";
import { getPortalProfile } from "@/lib/portal/session";

// Role-gate untuk Server Components di /staf & /admin.
// Middleware sudah memblokir akses (BAB 4.3); helper ini lapis kedua + menyediakan profile.

export async function requireStaff() {
  const { user, profile } = await getPortalProfile();
  const role = profile?.role ?? "siswa";
  if (role !== "staf" && role !== "admin") redirect("/app");
  return { user, profile, role };
}

export async function requireAdmin() {
  const { user, profile } = await getPortalProfile();
  const role = profile?.role ?? "siswa";
  if (role !== "admin") redirect(role === "staf" ? "/staf" : "/app");
  return { user, profile, role };
}
