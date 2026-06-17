import {
  Database, Sparkles, Target, BarChart3, Rocket, Check, Users, Building2, FileText,
  Trophy, ShieldCheck, Heart, Lightbulb, TrendingUp, ArrowRight, Quote,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/common/monogram";

export const metadata = { title: "Tentang Kami — Albirru" };

const HERO_MINI = [
  { icon: Database, title: "Berbasis Data & AI", desc: "Analisis akurat untuk rekomendasi yang personal dan relevan." },
  { icon: Sparkles, title: "Metode Terbaik", desc: "Berdasarkan riset, pengalaman, dan praktik pendidikan terbaik." },
];
const MISI = [
  { icon: Target, title: "Membimbing", desc: "Memberi arah belajar yang jelas sesuai potensi dan target kampus impian." },
  { icon: BarChart3, title: "Menganalisis", desc: "Menganalisis kekuatan, kelemahan, dan peluang secara mendalam." },
  { icon: Rocket, title: "Mengoptimalkan", desc: "Memberi rekomendasi terbaik untuk hasil belajar yang maksimal." },
];
const BEDA = [
  ["Academic Intelligence", "Analisis kemampuan & prediksi kelulusan yang akurat"],
  ["Data-Driven", "Keputusan belajar berdasarkan data nyata dan terukur"],
  ["Personalized Navigator", "Panduan belajar personal menuju target kampus"],
  ["Continuous Improvement", "Sistem yang terus belajar dan beradaptasi untukmu"],
];
const STATS = [
  { icon: Users, value: "120.000+", label: "Siswa Aktif" },
  { icon: Building2, value: "1.200+", label: "Sekolah Mitra" },
  { icon: FileText, value: "2.500.000+", label: "Pengerjaan Soal" },
  { icon: Trophy, value: "85%", label: "Siswa Naik Skor" },
];
const NILAI = [
  { icon: ShieldCheck, title: "Integritas", desc: "Kami menjunjung tinggi kejujuran dan transparansi." },
  { icon: Heart, title: "Peduli", desc: "Kami peduli terhadap perkembangan setiap siswa." },
  { icon: Lightbulb, title: "Inovasi", desc: "Kami terus berinovasi untuk memberi yang terbaik." },
  { icon: Users, title: "Kolaborasi", desc: "Kami bekerja bersama untuk hasil yang lebih baik." },
  { icon: TrendingUp, title: "Berorientasi Hasil", desc: "Kami fokus pada hasil nyata dan terukur." },
];

export default function TentangPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>Tentang Albirru</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3rem)] font-extrabold leading-[1.06] tracking-tight text-ink">
              Lebih dari sekadar platform try out. <span className="text-brand">Kami adalah mitra perjalananmu.</span>
            </h1>
            <p className="mt-5 max-w-md text-body text-ink-body">
              Albirru hadir sebagai Personal Academic Intelligence System yang memadukan teknologi, data, dan metode terbaik untuk membimbing setiap siswa mencapai hasil yang terukur dan masuk ke kampus impian.
            </p>
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              {HERO_MINI.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand"><Icon size={18} /></div>
                    <div className="mt-2 text-body-sm font-semibold text-ink">{m.title}</div>
                    <div className="text-caption text-ink-muted">{m.desc}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-7"><Button variant="primary" trailingIcon={ArrowRight}>Kenali Albirru Lebih Dalam</Button></div>
          </div>
          <div className="relative">
            <div className="grad-photo aspect-square rounded-full bg-navy-800" />
            <div className="rounded-xl bg-navy-900 p-5 shadow-md lg:absolute lg:-bottom-4 lg:left-0 lg:max-w-[290px]">
              <Quote className="text-brand-300" size={22} />
              <div className="mt-2 text-body-sm font-bold text-white">Membimbing, Menganalisis, Mengoptimalkan.</div>
              <div className="text-caption text-white/72">Itulah komitmen kami.</div>
            </div>
          </div>
        </Container>
      </section>

      {/* MISI */}
      <section className="py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>Misi Kami</Eyebrow>
            <h2 className="mt-4 text-h-md text-ink">Membantu setiap siswa <span className="text-brand">meraih potensi terbaiknya.</span></h2>
            <p className="mt-4 text-body text-ink-body">Kami percaya setiap siswa memiliki potensi luar biasa. Tugas kami adalah membantu menemukan, memahami, dan mengoptimalkannya.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {MISI.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="rounded-xl border bg-white p-5 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand"><Icon size={20} /></div>
                  <h3 className="mt-4 text-h-sm text-ink">{m.title}</h3>
                  <p className="mt-1 text-body-sm text-ink-muted">{m.desc}</p>
                  <div className="mt-6 text-[2rem] font-extrabold text-hair">0{i + 1}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* BEDA */}
      <section className="pb-4">
        <Container>
          <div className="grid gap-6 rounded-2xl lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl bg-navy-900 p-8">
              <div className="text-eyebrow uppercase text-brand-300">Apa yang membuat kami berbeda?</div>
              <h2 className="mt-4 text-h-md text-white">Apa yang Membuat Kami Berbeda?</h2>
              <p className="mt-3 text-body-sm text-white/72">Albirru bukan hanya menyediakan soal, tetapi sistem lengkap untuk memahami dirimu dan mengantarkanmu ke hasil terbaik.</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-body-sm font-semibold text-white">Lihat Fitur Unggulan <ArrowRight size={16} /></div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {BEDA.map(([t, d]) => (
                <div key={t} className="rounded-xl border bg-white p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand"><Check size={14} strokeWidth={3} /></span>
                    <span className="text-body-sm font-bold text-ink">{t}</span>
                  </div>
                  <p className="mt-2 text-caption text-ink-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* STATS */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 gap-6 rounded-2xl bg-navy-900 p-8 md:grid-cols-4 md:p-10">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"><Icon size={20} /></span>
                  <div><div className="text-stat leading-none text-white">{s.value}</div><div className="mt-1 text-caption text-white/72">{s.label}</div></div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* NILAI */}
      <section className="pb-16">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Eyebrow>Nilai-Nilai Kami</Eyebrow>
            <h2 className="mt-4 text-h-md text-ink">Nilai yang menjadi <span className="text-brand">fondasi setiap langkah.</span></h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {NILAI.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand"><Icon size={20} /></div>
                  <div className="mt-3 text-body-sm font-bold text-ink">{n.title}</div>
                  <div className="mt-1 text-caption text-ink-muted">{n.desc}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* VISI */}
      <section className="pb-20">
        <Container>
          <div className="grid gap-8 overflow-hidden rounded-2xl bg-navy-900 p-8 md:grid-cols-2 md:p-12">
            <div>
              <div className="text-eyebrow uppercase text-brand-300">Visi Kami</div>
              <h2 className="mt-4 text-h-md text-white">Menjadi ekosistem belajar terpercaya untuk mencetak generasi berprestasi dan berakhlak mulia.</h2>
              <p className="mt-4 text-body-sm text-white/72">Kami ingin hadir di setiap langkah perjalanan belajarmu, hari ini hingga kamu mencapai puncak impianmu.</p>
            </div>
            <div className="flex flex-col justify-center rounded-xl bg-white/5 p-6">
              <Quote className="text-brand-300" size={26} />
              <p className="mt-3 text-body-lg text-white">Albirru membantu saya memahami kekuatan dan kelemahan saya. Hasilnya, saya bisa fokus belajar dan lolos ke kampus impian saya.</p>
              <div className="mt-5 flex items-center gap-3">
                <Monogram label="N" size={40} />
                <div><div className="text-body-sm font-semibold text-white">Nadia A.</div><div className="text-caption text-white/72">Psikologi UGM 2024</div></div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
