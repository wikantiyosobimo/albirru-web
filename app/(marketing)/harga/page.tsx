import {
  Rocket, Check, X, Crown, Sparkles, ShieldCheck, ArrowRight, TrendingUp,
  ClipboardList, BarChart3, Target, Compass, Route, GraduationCap, BadgeCheck,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { cn } from "@/lib/utils";

export const metadata = { title: "Paket & Harga — Albirru" };

const FREE: [string, string][] = [
  ["Try Out Gratis", "Akses try out nasional terbatas"],
  ["Hasil & Analisis Dasar", "Lihat skor dan pembahasan dasar"],
  ["Ranking Nasional", "Lihat posisimu di tingkat nasional"],
  ["Pembelian Try Out Satuan", "Beli paket try out sesuai kebutuhan"],
  ["Peta Kelemahan Ringkas", "Peta kelemahan dalam 3 subtes"],
  ["Target Kampus", "Estimasi peluang lolos dasar"],
  ["Academic Journey Lite", "Rekomendasi belajar dasar"],
];

const PRO: [string, string][] = [
  ["Academic Navigator (AI)", "Panduan personal menuju kampus impian"],
  ["Weakness Mapping Lengkap", "Peta kelemahan detail per subtopik"],
  ["Prediksi Lolos Akurat", "Prediksi peluang berdasarkan data"],
  ["Gap Analysis", "Analisis kesenjangan nilai & target"],
  ["Smart Revision", "Rekomendasi revisi berbasis AI"],
  ["AI Recommendation", "Rekomendasi materi & strategi"],
  ["Journey Engine Penuh", "Peta perjalanan belajar adaptif"],
  ["Kalender Belajar AI", "Atur jadwal belajar otomatis"],
  ["Analisis Mendalam", "Analisis per subtes & topik"],
  ["Laporan PDF", "Unduh laporan perkembangan"],
  ["Simulasi Strategi SNBT", "Simulasi kombinasi strategi optimal"],
];

const FREE_VS = ["Analisis dasar & terbatas", "Peta kelemahan ringkas", "Rekomendasi belajar umum", "Estimasi peluang dasar", "Tidak tahu prioritas utama"];
const PRO_VS = ["Analisis mendalam berbasis AI", "Peta kelemahan detail per subtopik", "Rekomendasi personal & adaptif", "Prediksi peluang akurat", "Tahu prioritas & langkah terbaik"];

const STEPS = [
  { icon: ClipboardList, label: "Try Out", desc: "Ukur kemampuanmu" },
  { icon: BarChart3, label: "Analysis", desc: "Analisis hasilmu" },
  { icon: Target, label: "Mapping", desc: "Peta kelemahan" },
  { icon: Compass, label: "Navigator", desc: "Panduan personal" },
  { icon: Route, label: "Journey", desc: "Rencana belajar" },
  { icon: GraduationCap, label: "Target", desc: "Kampus impian" },
];

function PlanFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand">
        <Check size={13} strokeWidth={3} />
      </span>
      <span>
        <span className="block text-body-sm font-semibold text-ink">{title}</span>
        <span className="block text-caption text-ink-muted">{desc}</span>
      </span>
    </li>
  );
}

export default function HargaPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>Paket Harga</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
              Belajar Gratis.<br />Berkembang<br />
              <span className="text-brand">Dengan Data.</span>
            </h1>
            <p className="mt-5 max-w-md text-body text-ink-body">
              Semua siswa bisa memulai dengan Albirru Free. Ketika membutuhkan analisis yang lebih mendalam, buka seluruh potensi Academic Intelligence melalui Albirru Pro.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2.5">
              <Sparkles size={16} className="text-brand" />
              <span className="text-body-sm text-ink-body">Dipercaya 120.000+ siswa di seluruh Indonesia</span>
            </div>
          </div>

          {/* floating dashboard cluster (placeholder — aset asli di-swap nanti) */}
          <div className="relative lg:h-[520px]">
            {/* main */}
            <div className="rounded-2xl border bg-white p-5 shadow-md lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[320px] lg:-translate-x-1/2 lg:-translate-y-1/2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-body-sm font-semibold text-ink">Halo, Aisyah 👋</div>
                  <div className="text-caption text-ink-muted">Siap mencapai kampus impianmu hari ini?</div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">A</div>
              </div>
              <div className="mt-4 rounded-xl bg-muted p-3">
                <div className="text-caption text-ink-muted">Skor UTBK Terbaru</div>
                <div className="flex items-end gap-1"><span className="text-stat leading-none text-ink">620</span><span className="mb-1 text-caption text-ink-muted">/800</span></div>
                <div className="mt-1 text-caption text-[#16B47A]">+80 dari try out sebelumnya</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-hair"><div className="h-full w-[78%] rounded-full bg-brand" /></div>
              </div>
              <div className="mt-3">
                <div className="text-caption text-ink-muted">Peta Kelemahan</div>
                {[["Literasi", 70, "Sedang", "#B7791F"], ["Penalaran", 40, "Rendah", "#B4282C"], ["Matematika", 88, "Tinggi", "#16B47A"]].map((r) => (
                  <div key={r[0] as string} className="mt-2 flex items-center gap-2">
                    <span className="w-20 shrink-0 text-caption text-ink-body">{r[0]}</span>
                    <span className="h-1.5 flex-1 rounded-full bg-hair"><span className="block h-full rounded-full bg-brand" style={{ width: `${r[1]}%` }} /></span>
                    <span className="w-14 shrink-0 text-right text-[11px] font-semibold" style={{ color: r[3] as string }}>{r[2]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* prediksi lolos */}
            <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm lg:absolute lg:left-0 lg:top-0 lg:mt-0 lg:w-[190px]">
              <div className="text-caption text-ink-muted">Prediksi Lolos</div>
              <div className="text-body-sm font-semibold text-ink">Psikologi UI</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-h-md text-ink">78%</span>
                <span className="rounded-full bg-[#DCF5EA] px-2 py-0.5 text-[11px] font-semibold text-[#16B47A]">Tinggi</span>
              </div>
              <svg viewBox="0 0 120 36" className="mt-2 w-full text-brand"><polyline points="0,30 20,26 40,28 60,18 80,20 100,10 120,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            {/* rekomendasi fokus */}
            <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm lg:absolute lg:right-0 lg:top-6 lg:mt-0 lg:w-[210px]">
              <div className="text-body-sm font-semibold text-ink">Rekomendasi Fokus</div>
              {[["Penalaran Umum", "18%"], ["Literasi", "12%"], ["Matematika", "22%"]].map((r) => (
                <div key={r[0]} className="mt-2.5 flex items-center justify-between">
                  <span className="text-caption text-ink-body">{r[0]}</span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#16B47A]">Tingkatkan {r[1]} <TrendingUp size={12} /></span>
                </div>
              ))}
            </div>

            {/* target kampus */}
            <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm lg:absolute lg:bottom-0 lg:right-2 lg:mt-0 lg:w-[230px]">
              <div className="text-caption text-ink-muted">Target Kampus</div>
              <div className="text-body-sm font-semibold text-ink">Universitas Gadjah Mada</div>
              <div className="text-caption text-ink-muted">Teknik Informatika</div>
              <div className="mt-2 flex items-center justify-between">
                <div><div className="text-caption text-ink-muted">Peluang Saat Ini</div><div className="text-h-md text-ink">42%</div></div>
                <span className="rounded-full bg-[#FCE4E4] px-2 py-0.5 text-[11px] font-semibold text-[#B4282C]">Rendah</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-caption font-semibold text-brand">Lihat Rekomendasi <ArrowRight size={12} /></div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-2">
            {/* FREE */}
            <div className="flex flex-col rounded-2xl border bg-white p-8">
              <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-eyebrow uppercase text-ink-body">Free</span>
              <h2 className="mt-4 text-h-md text-ink">Albirru Free</h2>
              <p className="mt-1 text-body-sm text-ink-muted">Mulai perjalananmu secara gratis</p>
              <div className="mt-5 flex items-end gap-1"><span className="text-stat text-ink">Rp 0</span><span className="mb-1.5 text-body-sm text-ink-muted">/ selamanya</span></div>
              <ul className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
                {FREE.map(([t, d]) => <PlanFeature key={t} title={t} desc={d} />)}
              </ul>
              <div className="mt-auto pt-8">
                <Button href="/daftar" variant="secondary" fullWidth>Mulai Gratis</Button>
                <p className="mt-3 text-center text-caption text-ink-muted">Tidak perlu kartu kredit</p>
              </div>
            </div>

            {/* PRO */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-brand bg-white p-8 shadow-md">
              <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-bold uppercase text-brand">
                <Sparkles size={12} /> Rekomendasi Terbaik
              </div>
              <span className="inline-flex w-fit rounded-full bg-brand px-3 py-1 text-eyebrow uppercase text-white">Pro</span>
              <h2 className="mt-4 text-h-md text-ink">Albirru Pro</h2>
              <p className="mt-1 text-body-sm text-ink-muted">Buka seluruh potensi Academic Intelligence</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-stat text-ink">Rp 149.000</span>
                <span className="mb-1.5 text-body-sm text-ink-muted">/ bulan</span>
                <span className="mb-1.5 text-body-sm text-ink-muted line-through">Rp 199.900</span>
              </div>
              <div className="mt-5 inline-flex w-fit rounded-md bg-muted px-2.5 py-1 text-[11px] font-bold uppercase text-ink-body">Semua fitur Free +</div>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {PRO.map(([t, d]) => <PlanFeature key={t} title={t} desc={d} />)}
              </ul>
              <div className="mt-auto pt-8">
                <Button href="/daftar" variant="primary" fullWidth>Upgrade ke Pro</Button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-caption text-ink-muted">
                  <ShieldCheck size={13} /> Batalkan kapan saja • Aman &amp; terpercaya
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== PERBEDAAN (VS) ===== */}
      <section className="bg-muted py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Eyebrow>Apa yang berubah?</Eyebrow>
            <h2 className="mt-4 text-h-md text-ink">Perbedaan yang Bisa Kamu Rasakan</h2>
            <p className="mt-3 text-body text-ink-body">Albirru Free membantumu memulai. Albirru Pro membantumu melangkah lebih jauh.</p>
          </div>
          <div className="relative grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-6">
              <div className="text-label text-ink">Pengguna Free</div>
              <ul className="mt-4 space-y-3">
                {FREE_VS.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-body-sm text-ink-body">
                    <X size={16} className="mt-0.5 shrink-0 text-ink-muted" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-brand bg-white p-6">
              <div className="text-label text-brand">Pengguna Pro</div>
              <ul className="mt-4 space-y-3">
                {PRO_VS.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-body-sm text-ink">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute left-1/2 top-1/2 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900 text-[12px] font-bold text-white md:flex">VS</div>
          </div>
        </Container>
      </section>

      {/* ===== SISTEM TERINTEGRASI + KALKULATOR ===== */}
      <section className="py-16 md:py-20">
        <Container className="grid gap-6 lg:grid-cols-2">
          {/* left */}
          <div className="rounded-2xl border bg-muted p-8">
            <Eyebrow>Academic Intelligence Engine</Eyebrow>
            <h2 className="mt-4 text-h-md text-ink">Sistem Terintegrasi untuk Hasil Maksimal</h2>
            <p className="mt-2 text-body-sm text-ink-body">Albirru menggabungkan teknologi, data, dan metode terbaik dalam satu sistem.</p>
            <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
              {STEPS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-xs"><Icon size={18} /></div>
                    <div className="mt-2 text-[11px] font-semibold text-ink">{s.label}</div>
                    <div className="text-[10px] leading-tight text-ink-muted">{s.desc}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-7">
              <Button href="/daftar" variant="primary" leadingIcon={Crown} trailingIcon={ArrowRight}>Semua tahapan ini tersedia penuh di Albirru Pro</Button>
            </div>
          </div>

          {/* right — kalkulator (visual; interaktif menyusul) */}
          <div className="rounded-2xl border bg-white p-8">
            <Eyebrow>Hitung Peluang Lolos</Eyebrow>
            <h2 className="mt-4 text-h-md text-ink">Cek Peluangmu Sekarang</h2>
            <div className="mt-5 grid gap-4">
              <SelectField label="Target Kampus" name="kampus" defaultValue="ui" options={[{ value: "ui", label: "Universitas Indonesia (UI)" }, { value: "ugm", label: "Universitas Gadjah Mada (UGM)" }, { value: "itb", label: "Institut Teknologi Bandung (ITB)" }]} />
              <SelectField label="Program Studi" name="prodi" defaultValue="ti" options={[{ value: "ti", label: "Teknik Informatika" }, { value: "kedok", label: "Kedokteran" }, { value: "psi", label: "Psikologi" }]} />
              <div>
                <div className="mb-1.5 flex items-center justify-between"><span className="text-label text-ink">Skor UTBK Saat Ini</span><span className="text-body-sm text-ink-muted">620 <span className="text-ink-muted">/800</span></span></div>
                <input type="range" min={0} max={800} defaultValue={620} className="w-full accent-[#2F5BFF]" aria-label="Skor UTBK" />
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-muted p-5">
              <div className="flex items-center justify-between">
                <div><div className="text-caption text-ink-muted">Peluang Lolos Saat Ini</div><div className="text-stat text-ink">42%</div></div>
                <span className="rounded-full bg-[#FCE4E4] px-2.5 py-1 text-[11px] font-semibold text-[#B4282C]">Rendah</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-hair"><div className="h-full w-[42%] rounded-full bg-brand" /></div>
              <div className="mt-4 text-caption font-semibold text-ink">Fitur yang paling membantu:</div>
              <div className="mt-2 space-y-1.5">
                {["Weakness Mapping", "Academic Navigator", "Smart Revision"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-body-sm text-ink-body"><Check size={15} className="text-brand" /> {f}</div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg border border-brand bg-brand-100 p-3">
                <div><div className="text-caption text-ink-muted">Rekomendasi</div><div className="text-body-sm font-bold text-brand">Albirru Pro</div><div className="text-caption text-ink-body">Tingkatkan peluang lolos hingga 79%</div></div>
                <Crown size={20} className="text-brand" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl bg-navy-900 px-8 py-10 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"><Rocket size={26} /></div>
              <div>
                <h2 className="text-h-md text-white">Mulai Gratis Hari Ini</h2>
                <p className="mt-1 max-w-md text-body-sm text-white/72">Rasakan manfaat Albirru Free. Upgrade ke Pro saat kamu siap untuk hasil yang lebih maksimal.</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button href="/daftar" variant="inverse" trailingIcon={ArrowRight}>Mulai Gratis Sekarang</Button>
              <Button href="/daftar" variant="primary" trailingIcon={ArrowRight}>Upgrade ke Pro</Button>
            </div>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-caption text-ink-muted"><BadgeCheck size={14} /> Aman, terpercaya, dan bisa dibatalkan kapan saja</p>
        </Container>
      </section>
    </>
  );
}
