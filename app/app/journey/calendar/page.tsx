import Link from "next/link";
import { ArrowLeft, ClipboardList, BookOpen, RotateCcw } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { cn } from "@/lib/utils";

export const metadata = { title: "Kalender — Albirru" };

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
// Agenda contoh per tanggal (key = tanggal).
const AGENDA: Record<number, { t: string; warna: string }[]> = {
  3: [{ t: "Try Out", warna: "#2F5BFF" }],
  7: [{ t: "Belajar", warna: "#16B47A" }],
  12: [{ t: "Revisi", warna: "#6D49C9" }],
  18: [{ t: "Try Out", warna: "#2F5BFF" }, { t: "Belajar", warna: "#16B47A" }],
  25: [{ t: "Simulasi", warna: "#E8910B" }],
};

export default async function CalendarPage() {
  const { profile } = await getPortalProfile();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const namaBulan = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const LEGEND = [
    { t: "Try Out", icon: ClipboardList, c: "#2F5BFF" },
    { t: "Belajar", icon: BookOpen, c: "#16B47A" },
    { t: "Revisi", icon: RotateCcw, c: "#6D49C9" },
  ];

  return (
    <>
      <PortalTopbar eyebrow="Journey  ›  Kalender" title="Kalender Belajar" subtitle={namaBulan} nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/journey" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="flex flex-wrap gap-4">
          {LEGEND.map((l) => { const Icon = l.icon; return <span key={l.t} className="flex items-center gap-1.5 text-body-sm text-ink-body"><Icon size={15} style={{ color: l.c }} /> {l.t}</span>; })}
        </div>

        <div className="rounded-2xl border bg-white p-4 lg:p-5">
          <div className="grid grid-cols-7 gap-1 text-center text-caption font-semibold text-ink-muted">
            {HARI.map((h) => <div key={h} className="py-2">{h}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => (
              <div key={i} className={cn("min-h-[72px] rounded-lg border p-1.5", d === today ? "border-brand bg-brand-100/40" : d ? "bg-white" : "border-transparent bg-transparent")}>
                {d ? (
                  <>
                    <div className={cn("text-caption font-bold", d === today ? "text-brand" : "text-ink")}>{d}</div>
                    <div className="mt-1 space-y-0.5">
                      {(AGENDA[d] ?? []).map((a, j) => (
                        <div key={j} className="truncate rounded px-1 py-0.5 text-[9px] font-semibold text-white" style={{ backgroundColor: a.warna }}>{a.t}</div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <p className="text-caption text-ink-muted">Agenda contoh. Jadwal nyata akan terisi otomatis saat fitur perencanaan AI aktif.</p>
      </div>
    </>
  );
}
