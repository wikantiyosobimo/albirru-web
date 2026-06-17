import {
  Users, Building2, GraduationCap, Trophy, Star, ArrowRight, X, Check, MapPin,
  Quote, BookOpen,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/common/monogram";

export const metadata = { title: "Success Story — Albirru" };

const CAMPUS = ["UI", "UGM", "ITB", "ITS", "UNAIR", "UNS"];
const STATS = [
  { icon: Users, value: "23.814+", label: "Siswa Terbantu" },
  { icon: Building2, value: "356+", label: "Kampus Tujuan" },
  { icon: GraduationCap, value: "1.842+", label: "Siswa Diterima PTN" },
  { icon: Trophy, value: "98,6%", label: "Puas dengan Albirru" },
  { icon: Star, value: "4,9/5", label: "Rating Pengguna" },
];
const ALUMNI = [
  { m: "A", badge: "UI", name: "Alya Putri", prodi: "Teknik Informatika - UI", quote: "Albirru membantu saya memahami kelemahan dan fokus belajar. Strateginya sangat terarah!", from: 515, to: 700, up: 185 },
  { m: "R", badge: "UGM", name: "Rafi Maulana", prodi: "Kedokteran - UGM", quote: "Fitur prediksi peluang kampus sangat akurat dan memotivasi saya untuk terus memperbaiki diri.", from: 528, to: 738, up: 210 },
  { m: "N", badge: "ITB", name: "Nadira Aulia", prodi: "Teknik Sipil - ITB", quote: "Analisis mendalam dari Albirru membuat saya tahu apa yang harus ditingkatkan. Hasilnya luar biasa!", from: 530, to: 702, up: 172 },
  { m: "F", badge: "ITS", name: "Fachri Alif", prodi: "Teknik Informatika - ITS", quote: "Try out Albirru sangat mirip UTBK asli. Pembahasannya detail dan mudah dipahami.", from: 517, to: 685, up: 168 },
  { m: "S", badge: "UNAIR", name: "Salma Dwi", prodi: "Psikologi - UNAIR", quote: "Dari tidak percaya diri menjadi diterima di kampus impian. Terima kasih Albirru!", from: 502, to: 652, up: 150 },
];
const BEFORE = ["Tidak tahu posisi diri", "Belajar tanpa arah dan strategi", "Tidak tahu kelemahan utama", "Ragu dengan peluang lolos"];
const AFTER = ["Mengetahui posisi & peluang diri", "Belajar terarah & terukur", "Fokus pada kelemahan utama", "Percaya diri menuju kampus impian"];
const DIST = [["UI", "142"], ["UGM", "186"], ["ITB", "98"], ["ITS", "167"], ["UNAIR", "201"], ["Lainnya", "1.048"]];

export default function SuccessStoryPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>Success Story Albirru</Eyebrow>
            <h1 className="mt-5 text-[clamp(2rem,1.5rem+2vw,2.875rem)] font-extrabold leading-[1.1] tracking-tight text-ink">
              Ribuan Siswa. Ratusan Kampus. Satu Tujuan: <span className="text-brand">Masa Depan Yang Lebih Baik.</span>
            </h1>
            <p className="mt-5 max-w-md text-body text-ink-body">
              Albirru berkomitmen membantu setiap siswa menemukan potensi terbaiknya dan diterima di kampus impian.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="#alumni" variant="primary" leadingIcon={BookOpen}>Lihat Kisah Alumni</Button>
              <Button href="#statistik" variant="secondary" leadingIcon={Trophy}>Lihat Statistik Hasil</Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {CAMPUS.map((c) => (
              <div key={c} className="grad-photo flex aspect-[3/4] flex-col justify-end rounded-xl bg-navy-800 p-2">
                <span className="inline-flex w-fit rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-brand">{c}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* STATS */}
      <section id="statistik" className="-mt-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 rounded-2xl border bg-white p-8 shadow-sm md:grid-cols-5">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <Icon size={22} className="mx-auto text-brand" />
                  <div className="mt-2 text-stat text-ink">{s.value}</div>
                  <div className="text-caption text-ink-muted">{s.label}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ALUMNI */}
      <section id="alumni" className="py-16 md:py-20">
        <Container>
          <div className="text-center">
            <h2 className="text-h-md text-ink">Kisah Sukses Alumni</h2>
            <p className="mt-2 text-body text-ink-body">Perjalanan mereka, inspirasi untukku.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {ALUMNI.map((a) => (
              <div key={a.name} className="flex flex-col rounded-xl border bg-white p-4 shadow-xs">
                <div className="grad-photo relative flex h-32 items-end rounded-lg bg-navy-800 p-2">
                  <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-brand">{a.badge}</span>
                </div>
                <div className="mt-3 text-body-sm font-bold text-ink">{a.name}</div>
                <div className="text-caption text-brand">{a.prodi}</div>
                <p className="mt-2 flex-1 text-caption text-ink-muted">&ldquo;{a.quote}&rdquo;</p>
                <div className="mt-3 rounded-lg bg-muted p-2.5">
                  <div className="flex items-center justify-between text-caption text-ink-muted">Skor UTBK <span className="font-semibold text-[#16B47A]">Naik {a.up} Poin</span></div>
                  <div className="mt-1 flex items-center gap-2 text-body-sm font-bold text-ink">{a.from} <ArrowRight size={14} className="text-brand" /> <span className="text-brand">{a.to}</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center"><Button variant="secondary" trailingIcon={ArrowRight}>Lihat Semua Kisah</Button></div>
        </Container>
      </section>

      {/* BEFORE/AFTER */}
      <section className="bg-muted py-16">
        <Container>
          <h2 className="text-center text-h-md text-ink">Sebelum &amp; Sesudah Bersama Albirru</h2>
          <div className="mt-10 grid items-stretch gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-muted text-white"><X size={15} /></span><span className="text-h-sm text-ink">Sebelum</span></div>
              <ul className="mt-4 space-y-3">
                {BEFORE.map((t) => <li key={t} className="flex items-center gap-2 text-body-sm text-ink-body"><X size={15} className="text-ink-muted" /> {t}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand bg-white p-6">
              <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white"><Check size={15} /></span><span className="text-h-sm text-ink">Sesudah</span></div>
              <ul className="mt-4 space-y-3">
                {AFTER.map((t) => <li key={t} className="flex items-center gap-2 text-body-sm text-ink"><Check size={15} className="text-brand" /> {t}</li>)}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* SEBARAN */}
      <section className="py-16">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-8">
            <h2 className="text-h-sm text-ink">Sebaran Alumni Albirru</h2>
            <p className="mt-2 text-body-sm text-ink-body">Diterima di lebih dari 350 kampus di seluruh Indonesia.</p>
            <div className="grad-photo mt-5 flex aspect-[16/9] items-center justify-center rounded-xl bg-navy-800 text-white/30"><MapPin size={48} /></div>
            <a href="/sekolah" className="mt-5 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-body-sm font-semibold text-ink"><MapPin size={15} /> Lihat Peta Sebaran Lengkap</a>
          </div>
          <div className="rounded-2xl border bg-white p-8">
            <h2 className="text-h-sm text-ink">Alumni Diterima di Kampus Top</h2>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {DIST.map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted p-4 text-center">
                  <GraduationCap size={18} className="mx-auto text-brand" />
                  <div className="mt-1 text-caption font-semibold text-ink">{k}</div>
                  <div className="text-h-sm text-brand">{v}</div>
                  <div className="text-[10px] text-ink-muted">Siswa</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-brand-100 p-5">
              <Quote className="text-brand-300" size={22} />
              <p className="mt-2 text-body-sm font-medium text-ink">Albirru bukan hanya platform try out, tapi partner perjalanan menuju masa depan.</p>
              <div className="mt-3 flex items-center gap-2"><Monogram label="A" size={32} /><span className="text-caption text-ink-muted">— Ahmad Fuady, Orang Tua Siswa</span></div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 px-8 py-10 md:flex-row">
            <div>
              <h2 className="text-h-md text-white">Ingin Jadi Kisah Sukses Berikutnya?</h2>
              <p className="mt-1 max-w-lg text-body-sm text-white/72">Bergabunglah dengan ribuan siswa lainnya dan wujudkan kampus impianmu bersama Albirru.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/try-out" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-6 text-label text-ink">Ikuti Try Out Nasional <ArrowRight size={16} /></a>
              <a href="/daftar" className="inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-label text-white" style={{ backgroundColor: "#15BFA6" }}>Daftar Gratis Sekarang <ArrowRight size={16} /></a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
