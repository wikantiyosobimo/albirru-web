import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, Pill } from "@/components/console/ui";
import { TryOutForm } from "@/components/staf/tryout-form";

export const metadata = { title: "Buat Try Out — Staf Albirru" };

export default async function StafTryOutBuat() {
  const { profile } = await requireStaff();
  let totalSoal = 0;
  try {
    const supabase = await createClient();
    const { count } = await supabase.from("questions").select("id", { count: "exact", head: true });
    totalSoal = count ?? 0;
  } catch { /* 0 */ }

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik  ›  Try Out" title="Buat Try Out" subtitle="Susun paket dari bank soal." nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<Link href="/staf/try-out" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-7">
        <ConsoleCard title="Detail Paket">
          <TryOutForm totalSoal={totalSoal} />
        </ConsoleCard>

        <ConsoleCard title="Panduan">
          <ul className="space-y-3 text-body-sm text-ink-body">
            <li className="flex gap-2"><Info size={16} className="mt-0.5 shrink-0 text-brand" /> Soal diambil dari tabel <code className="rounded bg-muted px-1">questions</code> (kunci aman, server-side).</li>
            <li className="flex gap-2"><Info size={16} className="mt-0.5 shrink-0 text-brand" /> Gunakan <Link href="/admin/blueprint" className="font-semibold text-brand hover:underline">Blueprint</Link> untuk komposisi otomatis.</li>
            <li className="flex gap-2"><Info size={16} className="mt-0.5 shrink-0 text-brand" /> Status <Pill tone="success">tersedia</Pill> membuat paket terlihat oleh siswa.</li>
          </ul>
          <div className="mt-4 rounded-xl bg-brand-100/50 p-3.5 text-caption text-ink-body">Bank soal saat ini: <b className="text-ink">{totalSoal}</b> soal.</div>
        </ConsoleCard>
      </div>
    </>
  );
}
