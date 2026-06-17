import Link from "next/link";
import { ArrowLeft, ClipboardList, Clock, Target, PlayCircle, CheckCircle2 } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";

export const metadata = { title: "Latihan — Albirru" };

export default async function PracticePage({ params }: { params: { id: string } }) {
  const { profile } = await getPortalProfile();

  const INFO = [
    { icon: ClipboardList, label: "Jumlah Soal", value: "15" },
    { icon: Clock, label: "Estimasi", value: "20 menit" },
    { icon: Target, label: "Tingkat", value: "Menengah" },
  ];
  const ATURAN = [
    "Latihan terbimbing — pembahasan langsung muncul tiap soal.",
    "Tidak ada batas waktu ketat, fokus pada pemahaman.",
    "Hasil latihan memperbarui peta kelemahanmu.",
  ];

  return (
    <>
      <PortalTopbar eyebrow="Learning Center  ›  Latihan" title="Latihan Terbimbing" subtitle="Uji pemahaman setelah belajar." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/learning" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-7">
        <div className="rounded-2xl border bg-white p-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand"><ClipboardList size={26} /></span>
          <h2 className="mt-4 text-h-md text-ink">Latihan Set #{params.id}</h2>
          <p className="mt-1 text-body-sm text-ink-body">Kerjakan 15 soal terpilih sesuai topik. Pembahasan tersedia setiap selesai menjawab.</p>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {INFO.map((m) => { const Icon = m.icon; return (
              <div key={m.label} className="rounded-xl bg-muted p-4"><Icon size={18} className="text-brand" /><div className="mt-1.5 text-h-sm leading-none text-ink">{m.value}</div><div className="text-caption text-ink-muted">{m.label}</div></div>
            ); })}
          </div>
          <Link href="/app/try-out/tps-mini-04/kerjakan" className="mt-6 flex h-12 items-center justify-center gap-2 rounded-lg bg-brand text-label text-white transition-colors hover:bg-brand-600"><PlayCircle size={18} /> Mulai Latihan</Link>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-body-lg font-bold text-ink">Sebelum Mulai</h3>
          <ul className="mt-3 space-y-2.5">
            {ATURAN.map((a) => <li key={a} className="flex items-start gap-2 text-body-sm text-ink-body"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" /> {a}</li>)}
          </ul>
        </div>
      </div>
    </>
  );
}
