import { redirect } from "next/navigation";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalSidebar } from "@/components/portal/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getPortalProfile();
  if (!profile?.onboarding_done) redirect("/onboarding");

  return (
    <div className="flex min-h-screen bg-muted">
      <PortalSidebar plan={profile?.plan ?? "free"} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
