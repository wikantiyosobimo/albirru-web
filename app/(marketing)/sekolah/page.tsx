import {
  ShieldCheck, BarChart3, Target, Users, TrendingUp, ArrowRight, Phone,
  CalendarDays, FileText, Trophy, Route, Plug, Award, Building2, Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/common/monogram";

export const metadata = { title: "Untuk Sekolah — Albirru" };

const TEAL = "#15BFA6";

const HERO_MINI = [
  { icon: BarChart3, title: "Berbasis Data & AI", desc: "Keputusan akademik lebih tepat dan objektif" },
  { icon: Plug, title: "Program Terintegrasi", desc: "Try out, analisis, learning path, dan laporan dalam satu sistem" },
  { icon: Target, title: "Dampak Nyata & Terukur", desc: "Meningkatkan hasil, motivasi, dan peluang siswa lolos PTN" },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "Keunggulan Akademik", desc: "Meningkatkan kualitas pembelajaran dan hasil siswa secara signifikan." },
  { icon: BarChart3, title: "Data & Laporan Komprehensif", desc: "Pantau perkembangan siswa dan ambil keputusan berdasarkan data akurat." },
  { icon: Target, title: "Program Siap Pakai", desc: "Kurikulum dan program terstruktur yang mudah diimplementasikan." },
  { icon: Users, title: "Pendampingan Berkelanjutan", desc: "Tim Albirru siap mendampingi sekolah setiap langkah." },
  { icon: Award, title: "Nilai Tambah Sekolah", desc: "Menjadi sekolah pilihan dengan program akademik berbasis teknologi." },
  { icon: TrendingUp, title: "Dampak Jangka Panjang", desc: "Membentuk budaya berprestasi yang berkelanjutan." },
];

const SCHOOL_FEATURES = [
  { icon: CalendarDays, title: "Try Out Terjadwal", desc: "Jadwalkan try out nasional atau mandiri sesuai kebutuhan sekolah." },
  { icon: FileText, title: "Laporan Otomatis", desc: "Laporan lengkap siap dibagikan ke guru, siswa, dan orang tua." },
  { icon: Trophy, title: "Ranking Sekolah", desc: "Pantau posisi sekolah Anda di tingkat nasional secara real-time." },
  { icon: Users, title: "Analisis Per Kelas & Individu", desc: "Analisis mendalam hingga level siswa untuk intervensi yang tepat." },
  { icon: Route, title: "Academic Journey", desc: "Rekomendasi belajar personal untuk setiap siswa secara otomatis." },
  { icon: Plug, title: "Integrasi Mudah", desc: "Sistem mudah digunakan dan dapat terintegrasi dengan platform sekolah." },
];

const SCHOOLS = ["SMA N 8 Jakarta", "MAN Insan Cendekia", "SMA N 3 Bandung", "SMAN 1 Yogyakarta", "SMA N 5 Surabaya", "SMA N 1 Makassar", "+120 Sekolah Lainnya"];

function TealLink({ href, children, solid }: { href: string; children: React.ReactNode; solid?: boolean }) {
  return (
    <a href={href} className="inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-label transition" style={solid ? { backgroundColor: TEAL, color: "#fff" } : { border: `1px solid ${TEAL}`, color: TEAL }}>
      {children} <ArrowRight size={16} />
    </a>
  );
}

export default function SekolahPage() {
  return (
    <>
      {/* HERO (navy) */}
      <section className="bg-navy-900">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-eyebrow uppercase text-white">Albirru School Partnership</span>
            <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              Bersama Sekolah, Membentuk Generasi <span style={{ color: TEAL }}>Berprestasi.</span>
            </h1>
            <p className="mt-5 max-w-md text-body text-white/72">
              Albirru membantu sekolah menghadirkan program akademik berbasis data, analisis mendalam, dan pendampingan berkelanjutan untuk hasil yang terukur.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-3">
              {HERO_MINI.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"><Icon size={18} /></div>
                    <div className="mt-2 text-body-sm font-semibold text-white">{m.title}</div>
                    <div className="text-caption text-white/72">{m.desc}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <TealLink href="/kontak" solid>Jadwalkan Demo</TealLink>
              <a href="/kontak" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-white">Pelajari Lebih Lanjut <ArrowRight size={16} /></a>
            </div>
          </div>

          {/* DASHBOARD SEKOLAH (placeholder) */}
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-100 text-brand"><Building2 size={16} /></span>
                <div><div className="text-body-sm font-bold text-ink">Dashboard Sekolah</div><div className="text-caption text-ink-muted">SMAN 1 Yogyakarta</div></div>
              </div>
              <span className="rounded-md border px-2 py-1 text-[10px] text-ink-muted">Semester Genap 2024/2025</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {[["Total Siswa Aktif", "512", "+18%"], ["Rata-rata Skor UTBK", "623", "+24 poin"], ["Prediksi Lolos PTN", "78%", "+11%"], ["Peringkat Nasional", "#152", "dari 2.347"]].map((s) => (
                <div key={s[0]} className="rounded-lg bg-muted p-2.5">
                  <div className="text-[10px] text-ink-muted">{s[0]}</div>
                  <div className="text-h-sm text-ink">{s[1]}</div>
                  <div className="text-[10px] font-semibold text-[#16B47A]">{s[2]}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="text-[11px] font-semibold text-ink">Tren Skor Rata-rata</div>
                <svg viewBox="0 0 160 50" className="mt-2 w-full text-brand"><polyline points="0,42 26,38 52,40 78,28 104,30 130,18 160,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-[11px] font-semibold text-ink">Peluang Lolos Siswa</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-16 w-16 rounded-full" style={{ background: "conic-gradient(#2F5BFF 0 40%, #F2B441 40% 85%, #E06A5E 85% 100%)" }}>
                    <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white text-center"><span className="text-[11px] font-bold leading-none text-ink">512</span></div>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Tinggi 40%</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#F2B441]" /> Sedang 45%</div>
                    <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#E06A5E]" /> Rendah 15%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MANFAAT */}
      <section className="py-16 md:py-20">
        <Container>
          <h2 className="text-center text-h-md text-ink">Manfaat untuk <span className="text-brand">Sekolah Anda</span></h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-xl border bg-white p-6 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={20} /></div>
                  <h3 className="mt-4 text-h-sm text-ink">{b.title}</h3>
                  <p className="mt-1 text-body-sm text-ink-muted">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FITUR UNTUK SEKOLAH */}
      <section className="bg-muted py-16 md:py-20">
        <Container>
          <h2 className="text-center text-h-md text-ink">Fitur Unggulan <span className="text-brand">untuk Sekolah</span></h2>
          <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
            <div className="grid gap-5 sm:grid-cols-2">
              {SCHOOL_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand shadow-xs"><Icon size={18} /></div>
                    <div className="mt-3 text-body-sm font-bold text-ink">{f.title}</div>
                    <p className="mt-1 text-caption text-ink-muted">{f.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="grad-photo flex aspect-[4/3] items-center justify-center rounded-2xl bg-navy-800 text-white/30">
              <Building2 size={72} />
            </div>
          </div>
        </Container>
      </section>

      {/* TRUSTED SCHOOLS */}
      <section className="py-16">
        <Container>
          <h2 className="text-center text-h-md text-ink">Dipercaya oleh Sekolah di Seluruh Indonesia</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SCHOOLS.map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3">
                <ShieldCheck size={18} className="text-brand" />
                <span className="text-body-sm font-medium text-ink">{s}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TESTIMONIAL + STATS */}
      <section className="pb-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-6 rounded-2xl bg-navy-900 p-8 md:grid-cols-[1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <Monogram label="S" size={48} />
                  <div><div className="text-body-sm font-bold text-white">Dra. Siti Nurhayati, M.Pd.</div><div className="text-caption text-white/72">Kepala Sekolah SMAN 1 Yogyakarta</div></div>
                </div>
                <p className="mt-4 text-body-sm text-white/80">&ldquo;Albirru membantu kami memahami potensi setiap siswa secara detail. Hasilnya, lebih banyak siswa kami yang lolos ke PTN impian mereka.&rdquo;</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[["↑120", "poin", "Peningkatan 1 tahun"], ["↑28%", "", "Dibanding tahun lalu"], ["#152", "", "Dari 2.347 sekolah"]].map((s) => (
                  <div key={s[2]} className="rounded-xl bg-white/5 p-3 text-center">
                    <div className="text-h-sm text-white">{s[0]}</div>
                    <div className="text-[10px] text-white/72">{s[2]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border bg-muted p-8">
              <h3 className="text-h-sm text-ink">Tertarik Bermitra?</h3>
              <p className="mt-2 text-body-sm text-ink-body">Mari wujudkan program akademik terbaik di sekolah Anda bersama Albirru.</p>
              <div className="mt-5 flex flex-col gap-3">
                <TealLink href="/kontak" solid>Jadwalkan Demo</TealLink>
                <a href="/kontak" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border bg-white px-6 text-label text-ink"><Phone size={16} /> Hubungi Tim Albirru</a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 px-8 py-10 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"><Sparkles size={26} /></div>
              <div>
                <h2 className="text-h-md text-white">Siap Membawa Sekolah Anda ke Level Berikutnya?</h2>
                <p className="mt-1 max-w-xl text-body-sm text-white/72">Bergabunglah dengan ratusan sekolah yang telah merasakan manfaat Albirru School Partnership.</p>
              </div>
            </div>
            <TealLink href="/kontak" solid>Jadwalkan Demo Sekarang</TealLink>
          </div>
        </Container>
      </section>
    </>
  );
}
