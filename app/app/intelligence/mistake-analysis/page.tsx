import {
  Info, AlertCircle, RotateCcw, BookOpen, ArrowRight, Brain, Eye, Clock, FileQuestion,
  Map, Sparkles, Library,
} from "lucide-react";
import Link from "next/link";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { Ring } from "@/components/portal/ring";
import { cn } from "@/lib/utils";

export const metadata = { title: "Mistake Analysis — Albirru" };

const TYPES = [
  { icon: Brain, color: "#E5484D", bg: "#FDECEC", label: "Kesalahan Konsep", value: 96, pct: 39 },
  { icon: Eye, color: "#E8910B", bg: "#FFF1DC", label: "Kurang Teliti", value: 72, pct: 29 },
  { icon: FileQuestion, color: "#2F5BFF", bg: "#EAF0FF", label: "Salah Memahami Soal", value: 54, pct: 22 },
  { icon: Clock, color: "#6D49C9", bg: "#F2EBFF", label: "Kehabisan Waktu", value: 26, pct: 10 },
];

const PATTERNS = [
  { title: "Salah tanda pada operasi aljabar", topik: "Aljabar · 14 kali", color: "#E5484D" },
  { title: "Tertukar makna implisit vs eksplisit", topik: "Inferensi · 11 kali", color: "#E8910B" },
  { title: "Salah eliminasi pilihan jawaban", topik: "Analogi · 9 kali", color: "#2F5BFF" },
  { title: "Lewat batas waktu di 10 soal terakhir", topik: "TPS · 8 kali", color: "#6D49C9" },
];

const SUBTES = [
  { subtes: "TPS", total: 92, topik: "Inferensi", cause: "Kesalahan Konsep", color: "#E5484D" },
  { subtes: "Literasi Indonesia", total: 64, topik: "Bacaan Panjang", cause: "Kurang Teliti", color: "#E8910B" },
  { subtes: "Literasi Inggris", total: 38, topik: "Vocabulary in Context", cause: "Salah Memahami Soal", color: "#2F5BFF" },
  { subtes: "Penalaran Matematika", total: 54, topik: "Aljabar", cause: "Kesalahan Konsep", color: "#E5484D" },
];

const ROOT_CAUSES = [
  { icon: Brain, color: "#E5484D", bg: "#FDECEC", title: "Kesalahan Konsep", desc: "Pemahaman dasar terhadap rumus atau aturan masih belum kuat.", tip: "Ulangi materi dasar sebelum berlatih soal lanjutan." },
  { icon: Eye, color: "#E8910B", bg: "#FFF1DC", title: "Kurang Teliti", desc: "Sering salah membaca angka, satuan, atau kata kunci penting.", tip: "Latih membaca soal dua kali sebelum menjawab." },
  { icon: FileQuestion, color: "#2F5BFF", bg: "#EAF0FF", title: "Salah Memahami Soal", desc: "Maksud soal tertukar dengan informasi yang tidak relevan.", tip: "Garis bawahi pertanyaan utama sebelum membaca opsi." },
  { icon: Clock, color: "#6D49C9", bg: "#F2EBFF", title: "Kehabisan Waktu", desc: "Soal terlewat karena alokasi waktu di awal terlalu lama.", tip: "Latih manajemen waktu dengan simulasi per subtes." },
];

const ACTIONS = [
  { icon: Map, color: "#2F5BFF", bg: "#EAF0FF", title: "Lihat Weakness Mapping", desc: "Hubungkan kesalahanmu dengan area yang masih lemah.", href: "/app/intelligence/weakness-mapping" },
  { icon: Sparkles, color: "#6D49C9", bg: "#F2EBFF", title: "Smart Revision", desc: "Dapatkan rencana revisi berdasarkan akar kesalahanmu.", href: "/app/intelligence/smart-revision" },
  { icon: Library, color: "#16B47A", bg: "#E9F9F1", title: "Latihan Terarah", desc: "Latih topik dengan kesalahan terbanyak di Learning Center.", href: "/app/learning" },
];

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border bg-white p-5", className)}>{children}</div>;
}
function Head({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      <h2 className="text-h-sm text-ink">{title}</h2>
      <Info size={14} className="text-ink-muted" />
    </div>
  );
}

export default async function Page() {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";

  return (
    <>
      <PortalTopbar
        eyebrow="Academic Intelligence  ›  Mistake Analysis"
        title="Mistake Analysis"
        subtitle="Pahami pola kesalahanmu untuk mencegahnya terulang."
        nama={nama}
      />

      <div className="space-y-5 p-5 lg:p-7">
        {/* ROW 1 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Head title="Total Kesalahan" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDECEC] text-[#E5484D]"><AlertCircle size={18} /></span>
            <div className="mt-2 text-[2rem] font-extrabold leading-none text-ink">248 <span className="text-body-sm font-normal text-ink-muted">soal</span></div>
            <div className="mt-1 text-caption text-ink-muted">dari 1.240 soal dikerjakan</div>
            <div className="text-caption font-semibold text-[#E5484D]">20% tingkat kesalahan</div>
          </Card>
          <Card>
            <Head title="Kesalahan Berulang" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1DC] text-[#E8910B]"><RotateCcw size={18} /></span>
            <div className="mt-2 text-[2rem] font-extrabold leading-none text-ink">36 <span className="text-body-sm font-normal text-ink-muted">pola</span></div>
            <div className="mt-1 text-caption text-ink-muted">Pola kesalahan yang berulang ≥ 3x</div>
          </Card>
          <Card>
            <Head title="Topik Kesalahan Terbanyak" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDECEC] text-[#E5484D]"><BookOpen size={18} /></span>
            <div className="mt-2 text-body-lg font-extrabold text-ink">Inferensi</div>
            <div className="text-caption font-semibold text-[#E5484D]">62 kesalahan (26%)</div>
          </Card>
          <Card>
            <Head title="Tingkat Perbaikan" />
            <div className="flex items-center gap-4">
              <Ring value={58} size={84} stroke={9} color="#16B47A">
                <span className="text-[1.4rem] font-extrabold leading-none text-ink">58%</span>
              </Ring>
              <div>
                <div className="text-body-sm font-bold text-ink">Mistakes Resolved</div>
                <div className="mt-1 text-caption font-semibold text-[#16B47A]">+12% dari periode lalu</div>
              </div>
            </div>
          </Card>
        </div>

        {/* ROW 2 — Jenis Kesalahan + Pola */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <Head title="Jenis Kesalahan" />
            <div className="space-y-4">
              {TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: t.bg, color: t.color }}><Icon size={18} /></span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-body-sm"><span className="font-semibold text-ink">{t.label}</span><span className="text-ink-muted">{t.value} soal · {t.pct}%</span></div>
                      <div className="mt-1 h-2 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <Head title="Pola Kesalahan Paling Sering" />
            <div className="space-y-3">
              {PATTERNS.map((p) => (
                <div key={p.title} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                  <div>
                    <div className="text-body-sm font-semibold text-ink">{p.title}</div>
                    <div className="text-caption text-ink-muted">{p.topik}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ROW 3 — Kesalahan per Subtes */}
        <Card>
          <Head title="Kesalahan per Subtes" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-3 text-caption font-semibold text-ink-muted">Subtes</th>
                  <th className="py-2 px-3 text-caption font-semibold text-ink-muted">Total Kesalahan</th>
                  <th className="py-2 px-3 text-caption font-semibold text-ink-muted">Topik Terbanyak</th>
                  <th className="py-2 px-3 text-caption font-semibold text-ink-muted">Penyebab Dominan</th>
                </tr>
              </thead>
              <tbody>
                {SUBTES.map((s) => (
                  <tr key={s.subtes} className="border-b last:border-0">
                    <td className="py-2.5 pr-3 text-body-sm font-semibold text-ink">{s.subtes}</td>
                    <td className="py-2.5 px-3 text-body-sm text-ink-body">{s.total} soal</td>
                    <td className="py-2.5 px-3 text-body-sm text-ink-body">{s.topik}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `${s.color}1A`, color: s.color }}>{s.cause}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ROW 4 — Root Cause Analysis */}
        <div>
          <h2 className="mb-3 text-h-sm text-ink">Root Cause Analysis</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROOT_CAUSES.map((r) => {
              const Icon = r.icon;
              return (
                <Card key={r.title}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: r.bg, color: r.color }}><Icon size={18} /></span>
                  <div className="mt-2 text-body-sm font-bold text-ink">{r.title}</div>
                  <p className="mt-1 text-caption text-ink-muted">{r.desc}</p>
                  <div className="mt-3 rounded-lg bg-muted p-2.5 text-caption text-ink-body">{r.tip}</div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ROW 5 — Actions */}
        <div>
          <h2 className="mb-3 text-h-sm text-ink">Lanjutkan Perbaikan</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.title} href={a.href} className="flex items-start gap-3 rounded-2xl border bg-white p-4 hover:bg-muted">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: a.bg, color: a.color }}><Icon size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-body-sm font-bold" style={{ color: a.color }}>{a.title} <ArrowRight size={13} /></div>
                    <p className="text-caption text-ink-muted">{a.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
