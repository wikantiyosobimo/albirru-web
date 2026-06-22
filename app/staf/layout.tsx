import { requireStaff } from "@/lib/portal/roles";
import { StafSidebar } from "@/components/staf/sidebar";

export default async function StafLayout({ children }: { children: React.ReactNode }) {
  await requireStaff();
  return (
    <div className="flex min-h-screen bg-muted">
      <StafSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
