import {
  BarChart3, SlidersHorizontal, ShieldCheck, Sparkles, ClipboardList, Compass,
  Target, Play, TrendingUp, Route, CalendarDays, Database, Brain, GraduationCap,
  ArrowRight, Check, Clock, Wand2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Produk & Fitur — Albirru" };

const HERO_MINI = [
  { icon: BarChart3, title: "Terukur & Akurat", desc: "Analisis berbasis data nyata dan model prediktif." },
  { icon: SlidersHorizontal, title: "Personal & Adaptif", desc: "Sistem menyesuaikan dengan kekuatan dan kelemahanmu." },
  { icon: ShieldCheck, title: "Terarah & Efektif", desc: "Fokus pada strategi yang paling berdampak." },
];

const ENGINES = [
  { icon: ClipboardList, title: "Assessment Engine", desc: "Evaluasi kemampuan awal secara adaptif." },
  { icon: Database, title: "Data & Analytics Engine", desc: "Mengolah data menjadi insight mendalam." },
  { icon: Brain, title: "Academic Intelligence Engine", desc: "AI memprediksi peluang dan rekomendasi terbaikmu." },
  { icon: SlidersHorizontal, title: "Learning Adaptation Engine", desc: "Menyesuaikan materi dan latihan sesuai kebutuhan." },
  { icon: Route, title: "Journey Engine", desc: "Menyusun peta perjalananmu hingga mencapai target." },
  { icon: GraduationCap, title: "School Intelligence", desc: "Memberi insight bagi sekolah untuk hasil yang lebih baik." },
];

function Tile({ icon: Icon }: { icon: any }) {
  return <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white"><Icon size={18} /></div>;
}
function Bar({ w, color = "var(--brand)" }: { w: number; color?: string }) {
  return <span className="block h-1.5 rounded-full bg-hair"><span className="block h-full rounded-full" style={{ width: `${w}%`, background: color }} /></span>;
}

export default function ProdukPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>Produk &amp; Fitur</Eyebrow>
            <h1 className="mt-5 text-[clamp(2rem,1.5rem+2vw,2.75rem)] font-extrabold leading-[1.08] tracking-tight text-ink">
              Satu Platform.<br />Semua yang Kamu Butuhkan untuk <span className="text-brand">Masuk Kampus Impian.</span>
            </h1>
            <p className="mt-5 max-w-xl text-body text-ink-body">
              Albirru menggabungkan teknologi, data, dan metode terbaik untuk membimbingmu memahami dirimu, meningkatkan kemampuan, dan mencapai hasil terbaik di UTBK-SNBT.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {HERO_MINI.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.title}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={17} /></div>
                    <div className="mt-2.5 text-body-sm font-semibold text-ink">{m.title}</div>
                    <div className="mt-1 text-caption text-ink-muted">{m.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <div className="grad-photo aspect-[4/3] w-full rounded-2xl" />
            <div className="absolute bottom-5 left-5 right-5 flex items-start gap-3 rounded-xl bg-navy-900 p-4 shadow-md md:left-8 md:right-auto md:max-w-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-white"><Sparkles size={16} /></div>
              <div>
                <div className="text-body-sm font-semibold text-white">Personal Academic Intelligence System</div>
                <div className="mt-1 text-caption text-white/72">Sistem yang memahami kamu secara personal, bukan sekadar memberi soal.</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FITUR UNGGULAN */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h-md text-ink">Fitur Unggulan Albirru</h2>
            <p className="mt-3 text-body text-ink-body">Dirancang khusus untuk memberikan pengalaman belajar yang lebih personal, efektif, dan terarah.</p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1 Try Out */}
            <div className="rounded-2xl border bg-white p-5">
              <Tile icon={ClipboardList} />
              <h3 className="mt-4 text-body-lg font-semibold text-ink">Try Out Berkualitas</h3>
              <p className="mt-1 text-caption text-ink-muted">Soal setara UTBK-SNBT terbaru yang disusun oleh tim ahli.</p>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div><div className="text-body-sm font-semibold text-ink">Try Out Nasional</div><div className="text-caption text-ink-muted">Gelombang 2</div></div>
                  <BarChart3 size={20} className="text-brand-300" />
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="flex-1 rounded-lg bg-brand py-1.5 text-center text-[11px] font-semibold text-white">Ikuti Try Out</span>
                  <span className="flex-1 rounded-lg border bg-white py-1.5 text-center text-[11px] font-semibold text-ink-body">Detail</span>
                </div>
              </div>
            </div>
            {/* 2 Navigator */}
            <div className="rounded-2xl border bg-white p-5">
              <Tile icon={Compass} />
              <h3 className="mt-4 text-body-lg font-semibold text-ink">Academic Navigator</h3>
              <p className="mt-1 text-caption text-ink-muted">Panduan personal berbasis AI menuju kampus impianmu.</p>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="text-caption font-semibold text-ink">Rekomendasi Fokus</div>
                {[["Literasi Bahasa Indonesia", 16, 64], ["Penalaran Umum", 14, 72], ["Matematika", 22, 50]].map((r) => (
                  <div key={r[0] as string} className="mt-2.5">
                    <div className="flex items-center justify-between text-[11px]"><span className="text-ink-body">{r[0]}</span><span className="font-semibold text-[#16B47A]">Tingkatkan {r[1]}%</span></div>
                    <div className="mt-1"><Bar w={r[2] as number} /></div>
                  </div>
                ))}
              </div>
            </div>
            {/* 3 Weakness */}
            <div className="rounded-2xl border bg-white p-5">
              <Tile icon={Target} />
              <h3 className="mt-4 text-body-lg font-semibold text-ink">Weakness Mapping</h3>
              <p className="mt-1 text-caption text-ink-muted">Peta kelemahan yang detail hingga ke subtopik.</p>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="text-caption font-semibold text-ink">Peta Kelemahan</div>
                <div className="mt-2 grid grid-cols-[1fr_auto] gap-y-2 text-[11px]">
                  {[["Aljabar", 30, "#B4282C"], ["Geometri", 55, "#B7791F"], ["Statistika", 75, "#16B47A"], ["Trigonometri", 40, "#B4282C"]].map((r) => (
                    <div key={r[0] as string} className="contents">
                      <div className="flex items-center gap-2 pr-2"><span className="w-16 text-ink-body">{r[0]}</span><span className="flex-1"><Bar w={r[1] as number} color={r[2] as string} /></span></div>
                      <span className="self-center text-right font-semibold" style={{ color: r[2] as string }}>•</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 4 Smart Revision */}
            <div className="rounded-2xl border bg-white p-5">
              <Tile icon={Wand2} />
              <h3 className="mt-4 text-body-lg font-semibold text-ink">Smart Revision</h3>
              <p className="mt-1 text-caption text-ink-muted">Rangkuman materi &amp; video singkat sesuai kebutuhanmu.</p>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="text-caption font-semibold text-ink">Rekomendasi Materi</div>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand"><Play size={15} /></span>
                  <div className="flex-1"><div className="text-[11px] font-semibold text-ink">Aljabar – Persamaan Kuadrat</div><div className="text-[10px] text-ink-muted">Video • 12 menit</div></div>
                </div>
                <span className="mt-3 block w-fit rounded-lg bg-brand px-3 py-1 text-[11px] font-semibold text-white">Tonton</span>
              </div>
            </div>
            {/* 5 Prediksi */}
            <div className="rounded-2xl border bg-white p-5">
              <Tile icon={TrendingUp} />
              <h3 className="mt-4 text-body-lg font-semibold text-ink">Prediksi Lolos</h3>
              <p className="mt-1 text-caption text-ink-muted">Prediksi peluang lolos ke program studi dan kampus tujuanmu.</p>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="text-caption text-ink-muted">Psikologi UGM</div>
                <div className="text-caption text-ink-muted">Peluang Lolos</div>
                <div className="mt-1 flex items-center gap-2"><span className="text-h-md text-ink">78%</span><span className="rounded-full bg-[#DCF5EA] px-2 py-0.5 text-[10px] font-semibold text-[#16B47A]">Tinggi</span></div>
                <div className="mt-2"><Bar w={78} /></div>
              </div>
            </div>
            {/* 6 Journey */}
            <div className="rounded-2xl border bg-white p-5">
              <Tile icon={Route} />
              <h3 className="mt-4 text-body-lg font-semibold text-ink">Academic Journey</h3>
              <p className="mt-1 text-caption text-ink-muted">Peta perjalanan belajar dari sekarang hingga hari H.</p>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="text-caption font-semibold text-ink">Perjalananmu</div>
                <ol className="mt-2 space-y-2">
                  {[["Sekarang", "Evaluasi & Pemetaan"], ["2-3 Bulan", "Peningkatan & Latihan"], ["Hari H", "Ujian UTBK-SNBT"]].map((s, i) => (
                    <li key={s[0]} className="flex gap-2"><span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${i === 0 ? "bg-brand text-white" : "bg-brand-100 text-brand"}`}>{i + 1}</span><span><span className="block text-[11px] font-semibold text-ink">{s[0]}</span><span className="block text-[10px] text-ink-muted">{s[1]}</span></span></li>
                  ))}
                </ol>
              </div>
            </div>
            {/* 7 Analisis */}
            <div className="rounded-2xl border bg-white p-5">
              <Tile icon={BarChart3} />
              <h3 className="mt-4 text-body-lg font-semibold text-ink">Analisis Mendalam</h3>
              <p className="mt-1 text-caption text-ink-muted">Analisis lengkap setiap try out hingga rekomendasi strategi.</p>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="text-caption font-semibold text-ink">Skor Tiap Subtes</div>
                {[["Literasi", 720, 90], ["Penalaran Umum", 640, 80], ["Matematika", 680, 85]].map((r) => (
                  <div key={r[0] as string} className="mt-2.5">
                    <div className="flex items-center justify-between text-[11px]"><span className="text-ink-body">{r[0]}</span><span className="font-semibold text-ink">{r[1]}<span className="text-ink-muted">/800</span></span></div>
                    <div className="mt-1"><Bar w={r[2] as number} /></div>
                  </div>
                ))}
              </div>
            </div>
            {/* 8 Kalender */}
            <div className="rounded-2xl border bg-white p-5">
              <Tile icon={CalendarDays} />
              <h3 className="mt-4 text-body-lg font-semibold text-ink">Kalender &amp; Planner</h3>
              <p className="mt-1 text-caption text-ink-muted">Atur jadwal belajar harian dengan rekomendasi AI.</p>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="text-caption font-semibold text-ink">Jadwal Hari Ini</div>
                {[["09.00 - 10.30", "Matematika: Limit Fungsi"], ["13.00 - 14.30", "Literasi: Inferensi Teks"]].map((s) => (
                  <div key={s[0]} className="mt-2.5 flex items-start gap-2"><Clock size={13} className="mt-0.5 text-brand" /><div><div className="text-[11px] font-semibold text-ink">{s[0]}</div><div className="text-[10px] text-ink-muted">{s[1]}</div></div></div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button href="/harga" variant="secondary" trailingIcon={ArrowRight}>Lihat Semua Fitur</Button>
          </div>
        </Container>
      </section>

      {/* 6 ENGINES */}
      <section className="pb-16 md:pb-20">
        <Container>
          <div className="rounded-2xl border bg-muted p-8 md:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_2fr] lg:items-center">
              <div>
                <Eyebrow>Di Balik Albirru</Eyebrow>
                <h2 className="mt-4 text-h-md text-ink">Ditenagai oleh 6 Intelligent Engines</h2>
                <p className="mt-3 text-body-sm text-ink-body">Enam teknologi inti yang bekerja bersama untuk memberikan pengalaman belajar paling personal dan efektif.</p>
                <a href="/produk" className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand">Pelajari Teknologi Kami <ArrowRight size={15} /></a>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
                {ENGINES.map((e) => {
                  const Icon = e.icon;
                  return (
                    <div key={e.title} className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white"><Icon size={22} /></div>
                      <div className="mt-3 text-[12px] font-bold leading-tight text-ink">{e.title}</div>
                      <div className="mt-1.5 text-[11px] leading-snug text-ink-muted">{e.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-navy-900 px-8 py-10 md:flex-row md:justify-between">
            <div className="flex items-center gap-5">
              <div className="grad-card hidden h-24 w-24 shrink-0 rounded-xl md:block" />
              <div>
                <h2 className="text-h-md text-white">Fitur lengkap untuk perjalananmu menuju kampus impian.</h2>
                <p className="mt-2 max-w-lg text-body-sm text-white/72">Gabung bersama 120.000+ siswa yang sudah belajar lebih terarah bersama Albirru.</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <Button href="/try-out" variant="inverse" trailingIcon={ArrowRight}>Coba Try Out Gratis</Button>
              <Button href="/harga" variant="ghostInverse" trailingIcon={ArrowRight}>Lihat Paket Premium</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
