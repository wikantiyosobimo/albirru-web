import Link from "next/link";
import { GraduationCap, Users, ChevronRight, Plus, Info } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, Pill } from "@/components/console/ui";

export const metadata = { title: "Kelas — Staf Albirru" };

type Kelas = { id: string; nama: string; siswa: number; rata: number; topik_lemah: string };

async function getKelas(): Promise<Kelas[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("school_members").select("kelas, profiles(id)");
    if (!data || data.length === 0) return [];

    const map = new Map<string, number>();
    for (const row of data) {
      const k = (row as Record<string, unknown>).kelas as string | null;
      if (k) map.set(k, (map.get(k) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([nama, siswa]) => ({
      id: nama.toLowerCase().replace(/\s+/g, "-"),
      nama,
      siswa,
      rata: 0,
      topik_lemah: "-",
    }));
  } catch {
    return [];
  }
}

const CONTOH: Kelas[] = [
  { id: "12-ipa-1", nama: "XII IPA 1", siswa: 32, rata: 642, topik_lemah: "Penalaran Matematika" },
  { id: "12-ipa-2", nama: "XII IPA 2", siswa: 30, rata: 598, topik_lemah: "Literasi Inggris" },
  { id: "12-ips-1", nama: "XII IPS 1", siswa: 28, rata: 571, topik_lemah: "Penalaran Umum" },
];

export default async function StafKelasPage() {
  const { profile } = await requireStaff();
  const kelas = await getKelas();
  const list = kelas.length > 0 ? kelas : CONTOH;
  const isContoh = kelas.length === 0;

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik" title="Daftar Kelas" subtitle="Statistik kolektif per kelas." nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<button className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><Plus size={15} /> Tambah Kelas</button>} />

      {isContoh ? (
        <div className="mx-5 mt-5 flex items-start gap-2.5 rounded-xl border border-[#E8910B]/30 bg-[#FFF8EB] p-4 lg:mx-7">
          <Info size={16} className="mt-0.5 shrink-0 text-[#E8910B]" />
          <div className="text-body-sm text-ink-body">
            Data di bawah adalah <b>contoh ilustrasi</b>. Kelas aktif setelah siswa bergabung lewat tabel <code className="rounded bg-muted px-1">school_members</code>.
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3 lg:p-7">
        {list.map((k) => (
          <Link key={k.id} href={`/staf/kelas/${k.id}`} className="group rounded-2xl border bg-white p-5 transition-colors hover:border-brand">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand"><GraduationCap size={22} /></span>
              <ChevronRight size={18} className="text-ink-muted transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="mt-3 text-h-sm text-ink">{k.nama}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-caption text-ink-muted"><Users size={13} /> {k.siswa} siswa</div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <div><div className="text-caption text-ink-muted">Rata-rata</div><div className="text-body-lg font-bold text-ink">{k.rata || "—"}</div></div>
              {k.topik_lemah !== "-" ? (
                <div className="text-right"><div className="text-caption text-ink-muted">Topik Lemah</div><Pill tone="danger">{k.topik_lemah}</Pill></div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
