import Link from "next/link";
import { GraduationCap, Users, ChevronRight, Plus } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, Pill } from "@/components/console/ui";

export const metadata = { title: "Kelas — Staf Albirru" };

// Ilustratif: butuh tabel school_members terisi. RLS sudah siap (Fase 3A).
const KELAS = [
  { id: "12-ipa-1", nama: "XII IPA 1", siswa: 32, rata: 642, topik_lemah: "Penalaran Matematika" },
  { id: "12-ipa-2", nama: "XII IPA 2", siswa: 30, rata: 598, topik_lemah: "Literasi Inggris" },
  { id: "12-ips-1", nama: "XII IPS 1", siswa: 28, rata: 571, topik_lemah: "Penalaran Umum" },
];

export default async function StafKelasPage() {
  const { profile } = await requireStaff();

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik" title="Daftar Kelas" subtitle="Statistik kolektif per kelas." nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<button className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><Plus size={15} /> Tambah Kelas</button>} />

      <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3 lg:p-7">
        {KELAS.map((k) => (
          <Link key={k.id} href={`/staf/kelas/${k.id}`} className="group rounded-2xl border bg-white p-5 transition-colors hover:border-brand">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand"><GraduationCap size={22} /></span>
              <ChevronRight size={18} className="text-ink-muted transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="mt-3 text-h-sm text-ink">{k.nama}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-caption text-ink-muted"><Users size={13} /> {k.siswa} siswa</div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <div><div className="text-caption text-ink-muted">Rata-rata</div><div className="text-body-lg font-bold text-ink">{k.rata}</div></div>
              <div className="text-right"><div className="text-caption text-ink-muted">Topik Lemah</div><Pill tone="danger">{k.topik_lemah}</Pill></div>
            </div>
          </Link>
        ))}
      </div>
      <p className="px-5 pb-7 text-caption text-ink-muted lg:px-7">Data kelas aktif setelah siswa bergabung lewat <code className="rounded bg-muted px-1">school_members</code>.</p>
    </>
  );
}
