import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { ConsoleTopbar } from "@/components/console/topbar";
import { MaterialForm } from "@/components/staf/material-form";

export const metadata = { title: "Upload Materi — Staf Albirru" };

export default async function StafMateriUpload() {
  const { profile } = await requireStaff();
  return (
    <>
      <ConsoleTopbar eyebrow="Akademik  ›  Materi" title="Upload Materi" subtitle="Tambahkan materi pembelajaran baru." nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<Link href="/staf/materi" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />
      <div className="p-5 lg:p-7"><MaterialForm /></div>
    </>
  );
}
