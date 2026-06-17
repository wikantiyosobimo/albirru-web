import {
  Rocket, CalendarDays, Users, Building2, Globe, Check, BadgeCheck, ClipboardCheck,
  Cpu, BarChart3, Sparkles, ShieldCheck, Users2, Clock, ArrowRight, Quote, Layers,
  PieChart, GraduationCap, FileText, School, ChevronRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/common/monogram";

export const metadata = { title: "Try Out Nasional — Albirru" };

const CAMPUS = ["UI", "UGM", "ITB", "ITS", "UNAIR", "UNS"];

const STEPS = [
  { icon: ClipboardCheck, title: "Kerjakan Try Out", desc: "Kerjakan soal UTBK-SNBT terbaru secara online dengan waktu & sistem yang mirip ujian asli." },
  { icon: Cpu, title: "Sistem Menganalisis", desc: "AI Albirru menganalisis jawabanmu hingga level subtopik untuk menemukan kelemahan dan kekuatanmu." },
  { icon: BarChart3, title: "Dapatkan Hasil & Insight", desc: "Lihat skor, ranking nasional, peta kelemahan, dan prediksi peluang lolos ke kampus pilihanmu." },
  { icon: Sparkles, title: "Rekomendasi Personal", desc: "Dapatkan rekomendasi belajar & strategi yang paling efektif untuk meningkatkan skor." },
  { icon: Rocket, title: "Tingkatkan & Ulangi", desc: "Belajar lebih terarah, ulangi try out, dan lihat progresmu dari waktu ke waktu." },
];

const FEATURES = [
  { icon: Layers, title: "Analisis Subtopik", desc: "Mengetahui kelemahan hingga level subtopik, bukan hanya mata pelajaran." },
  { icon: PieChart, title: "Prediksi Peluang Lolos", desc: "Estimasi peluang lolos ke ribuan program studi berdasarkan data terkini." },
  { icon: Users2, title: "Rekomendasi Adaptif", desc: "Rekomendasi belajar yang menyesuaikan kelemahan, target, dan progresmu." },
  { icon: ShieldCheck, title: "Standar Nasional", desc: "Soal dan sistem mengacu pada standar UTBK-SNBT terbaru dari BSNP." },
  { icon: BarChart3, title: "Benchmark Nasional", desc: "Lihat posisimu dibandingkan ratusan ribu peserta di seluruh Indonesia." },
  { icon: Clock, title: "Akses Fleksibel", desc: "Kerjakan kapan saja, di mana saja. Hasil langsung tersedia setelah selesai." },
];

const TYPES = [
  { icon: GraduationCap, title: "Try Out UTBK-SNBT", desc: "Simulasi UTBK-SNBT terbaru secara lengkap dan akurat.", items: ["Tes Potensi Skolastik", "Literasi Bahasa Indonesia & Inggris"], cta: "Lihat Jadwal", href: "/try-out" },
  { icon: ClipboardCheck, title: "Try Out Mandiri", desc: "Pilih paket try out sesuai kebutuhanmu.", items: ["1x Try Out", "5x Try Out", "10x Try Out"], cta: "Lihat Paket", href: "/harga" },
  { icon: School, title: "Try Out Sekolah", desc: "Program khusus untuk sekolah dan komunitas belajar.", items: ["Laporan kelas & sekolah", "Ranking antar sekolah", "Analisis kolektif"], cta: "Untuk Sekolah", href: "/sekolah" },
];

export default function TryOutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>Try Out Nasional Albirru</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3rem)] font-extrabold leading-[1.08] tracking-tight text-ink">
              Setiap Skor Membawamu Lebih Dekat Ke <span className="text-brand">Kampus Impian.</span>
            </h1>
            <p className="mt-5 max-w-md text-body text-ink-body">
              Try Out Nasional Albirru membantu kamu memahami posisi saat ini, peluang lolos, dan langkah berikutnya menuju program studi impian.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/daftar" variant="primary" leadingIcon={Rocket}>Ikuti Try Out Nasional</Button>
              <Button href="#jadwal" variant="secondary" leadingIcon={CalendarDays}>Lihat Jadwal</Button>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
              {[[Users, "27.421+", "Peserta Aktif"], [Building2, "1.284+", "Sekolah"], [Globe, "38", "Provinsi"]].map(([Icon, v, l]) => {
                const I = Icon as typeof Users;
                return (
                  <div key={l as string}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand"><I size={16} /></div>
                    <div className="mt-2 text-h-sm text-ink">{v as string}</div>
                    <div className="text-caption text-ink-muted">{l as string}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 space-y-1.5">
              {["Disusun oleh tim akademik berpengalaman", "Berstandar UTBK-SNBT terbaru"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-body-sm text-ink-body"><BadgeCheck size={16} className="text-brand" /> {t}</div>
              ))}
            </div>
          </div>

          {/* campus + result cards (placeholder) */}
          <div>
            <div className="grid grid-cols-3 gap-3">
              {CAMPUS.map((c) => (
                <div key={c} className="grad-photo flex aspect-[4/3] flex-col justify-end rounded-xl bg-navy-800 p-2">
                  <span className="inline-flex w-fit rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-brand">{c}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-white p-3">
                <div className="text-caption text-ink-muted">Target Kampus</div>
                <div className="text-body-sm font-semibold text-ink">UGM</div>
                <div className="text-caption text-ink-muted">Teknik Informatika</div>
                <div className="mt-1 text-h-sm text-ink">42%</div>
                <div className="mt-1 h-1.5 rounded-full bg-hair"><div className="h-full w-[42%] rounded-full bg-brand" /></div>
              </div>
              <div className="rounded-xl border bg-white p-3">
                <div className="text-body-sm font-semibold text-ink">Rekomendasi Fokus</div>
                {[["Literasi", "+14%"], ["Penalaran", "+8%"], ["Matematika", "+12%"]].map((r) => (
                  <div key={r[0]} className="mt-1.5 flex justify-between text-[11px]"><span className="text-ink-body">{r[0]}</span><span className="font-semibold text-[#16B47A]">{r[1]}</span></div>
                ))}
              </div>
              <div className="rounded-xl border bg-white p-3">
                <div className="text-body-sm font-semibold text-ink">Prediksi Peluang</div>
                {[["UGM-TI", "42%", "#B4282C"], ["ITS-TI", "68%", "#B7791F"], ["UNS-TI", "84%", "#16B47A"]].map((r) => (
                  <div key={r[0]} className="mt-1.5 flex justify-between text-[11px]"><span className="text-ink-body">{r[0]}</span><span className="font-semibold" style={{ color: r[2] }}>{r[1]}</span></div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-20">
        <Container>
          <h2 className="text-center text-h-md text-ink">Bagaimana Try Out <span className="text-brand">Albirru</span> Bekerja?</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-5">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="relative rounded-xl border bg-white p-5 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand"><Icon size={20} /></div>
                  <div className="mt-3 text-body-sm font-bold text-ink">{i + 1}. {s.title}</div>
                  <p className="mt-1 text-caption text-ink-muted">{s.desc}</p>
                  {i < STEPS.length - 1 ? <ChevronRight className="absolute -right-3.5 top-9 hidden text-hair md:block" /> : null}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* DEEPER + FEATURES */}
      <section className="bg-muted py-16 md:py-20">
        <Container className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between rounded-2xl bg-navy-900 p-8">
            <div>
              <h2 className="text-h-md text-white">Lebih dari sekadar nilai. Ini tentang memahami dirimu dan merancang langkah menuju kampus impian.</h2>
              <p className="mt-3 text-body-sm text-white/72">Albirru tidak hanya memberi tahu hasilmu, tapi juga cara meningkatkannya.</p>
            </div>
            <svg viewBox="0 0 240 70" className="mt-6 w-full text-brand-300"><polyline points="0,60 30,52 60,55 90,40 120,44 150,28 180,32 210,16 240,10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-xl border bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={18} /></div>
                  <div className="mt-3 text-body-sm font-bold text-ink">{f.title}</div>
                  <p className="mt-1 text-caption text-ink-muted">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* TYPES */}
      <section id="jadwal" className="py-16 md:py-20">
        <Container>
          <h2 className="text-center text-h-md text-ink">Jenis Try Out yang <span className="text-brand">Tersedia</span></h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="flex flex-col rounded-xl border bg-white p-6 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={20} /></div>
                  <h3 className="mt-4 text-h-sm text-ink">{t.title}</h3>
                  <p className="mt-1 text-body-sm text-ink-muted">{t.desc}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {t.items.map((it) => <li key={it} className="flex items-center gap-2 text-body-sm text-ink-body"><Check size={15} className="text-brand" /> {it}</li>)}
                  </ul>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"><a href={t.href}>{t.cta}</a> <ArrowRight size={14} /></div>
                </div>
              );
            })}
            <div className="flex flex-col justify-between rounded-xl bg-brand-100 p-6">
              <Quote className="text-brand-300" size={26} />
              <p className="text-body-sm text-ink">Try out Albirru membantu saya memahami kelemahan yang selama ini tidak saya sadari. Setelah fokus sesuai rekomendasi, skor saya naik 120 poin!</p>
              <div className="mt-4 flex items-center gap-3">
                <Monogram label="A" size={36} />
                <div><div className="text-body-sm font-semibold text-ink">Anisa Rahmawati</div><div className="text-caption text-ink-muted">Lolos UI – Psikologi</div></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 px-8 py-10 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"><Rocket size={26} /></div>
              <div>
                <h2 className="text-h-md text-white">Siap mengukur potensimu?</h2>
                <p className="mt-1 max-w-md text-body-sm text-white/72">Ikuti Try Out Nasional Albirru sekarang dan temukan langkah terbaik menuju kampus impianmu.</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button href="/daftar" variant="inverse" trailingIcon={ArrowRight}>Ikuti Try Out Nasional</Button>
              <Button href="#jadwal" variant="ghostInverse" trailingIcon={ArrowRight}>Lihat Jadwal Lengkap</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
