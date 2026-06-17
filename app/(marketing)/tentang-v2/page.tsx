import {
  FlaskConical, Users, Target, ShieldCheck, Heart, Lightbulb, HeartHandshake,
  Rocket, Cpu, GraduationCap, Building2, Star, MapPin, ArrowRight, Phone, Flag, Quote,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Monogram } from "@/components/common/monogram";

export const metadata = { title: "Tentang Kami — Albirru" };

const HERO_MINI = [
  { icon: FlaskConical, title: "Berbasis Riset", desc: "Dikembangkan oleh ahli pendidikan & teknologi." },
  { icon: Users, title: "Untuk Semua", desc: "Akses belajar berkualitas untuk seluruh Indonesia." },
  { icon: Target, title: "Berdampak Nyata", desc: "Membantu ribuan siswa meraih kampus impian." },
];
const NILAI = [
  { icon: ShieldCheck, title: "Integritas", desc: "Jujur dan bertanggung jawab dalam setiap langkah." },
  { icon: Heart, title: "Empati", desc: "Peduli terhadap kebutuhan dan perjuangan siswa." },
  { icon: Lightbulb, title: "Inovasi", desc: "Terus berinovasi menghadirkan solusi pendidikan terbaik." },
  { icon: HeartHandshake, title: "Kebermanfaatan", desc: "Setiap produk dan fitur untuk memberi dampak nyata." },
];
const TIMELINE = [
  { icon: Rocket, year: "2021", title: "Berawal dari Visi", desc: "Albirru didirikan dengan visi membantu siswa Indonesia meraih pendidikan terbaik melalui teknologi." },
  { icon: Cpu, year: "2022", title: "Pengembangan Platform", desc: "Mulai mengembangkan sistem try out adaptif dan analisis berbasis data UTBK-SNBT." },
  { icon: GraduationCap, year: "2023", title: "Peluncuran Albirru", desc: "Platform Albirru resmi diluncurkan untuk siswa secara nasional dengan fitur try out dan analisis." },
  { icon: Building2, year: "2024", title: "Kolaborasi Sekolah", desc: "Bekerja sama dengan ratusan sekolah di seluruh Indonesia untuk program academic intelligence." },
  { icon: Star, year: "2025+", title: "Berdampak Lebih Luas", desc: "Terus berinovasi dan memperluas dampak untuk generasi Indonesia yang lebih cerdas.", active: true },
];
const TEAM = [
  { m: "T", name: "Timothy Arifin, Ph.D.", role: "CEO & Co-Founder", desc: "Pakar pendidikan & asesmen akademik." },
  { m: "S", name: "Dr. Siti Nurhayati", role: "Head of Academic", desc: "Pakar evaluasi pendidikan & kurikulum." },
  { m: "R", name: "Rizky Pratama, M.T.", role: "CTO", desc: "Ahli teknologi & data intelligence." },
  { m: "A", name: "Anisa Rahmawati, M.Psi.", role: "Head of Student Growth", desc: "Psikolog pendidikan & konselor remaja." },
];
const ANGKA = [
  { icon: Users, value: "1.000.000+", label: "Siswa Terdaftar" },
  { icon: Building2, value: "8.500+", label: "Sekolah Mitra" },
  { icon: GraduationCap, value: "50.000.000+", label: "Try Out Dikerjakan" },
  { icon: MapPin, value: "38", label: "Provinsi Terjangkau" },
];
const SAYS = [
  { q: "Albirru sangat membantu siswa kami memahami kelemahan dan menentukan strategi belajar yang tepat. Hasilnya terlihat signifikan.", m: "B", name: "Budi Santoso, S.Pd.", sub: "Kepala Sekolah SMAN 2 Yogyakarta" },
  { q: "Try out Albirru berbeda. Analisisnya detail dan mudah dipahami. Sekarang saya jadi lebih percaya diri menghadapi UTBK-SNBT!", m: "A", name: "Adinda Putri", sub: "Siswa Kelas 12 – Jakarta" },
  { q: "Platform yang luar biasa! Data akurat, fitur lengkap, dan benar-benar membantu guru dan siswa.", m: "R", name: "Rina Kurniawati, S.Pd.", sub: "Guru BK – SMAN 1 Bandung" },
];

export default function TentangV2Page() {
  return (
    <>
      {/* HERO */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>Tentang Albirru</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3rem)] font-extrabold leading-[1.08] tracking-tight text-ink">
              Bersama Membangun Generasi Cerdas, Berakhlak, dan <span className="text-brand">Siap Masa Depan.</span>
            </h1>
            <p className="mt-5 max-w-md text-body text-ink-body">
              Albirru hadir untuk membantu setiap pelajar Indonesia mendapatkan akses pendidikan berkualitas, teknologi yang bermanfaat, dan pendampingan akademik yang tepat.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {HERO_MINI.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.title} className="rounded-xl border bg-white p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={17} /></div>
                    <div className="mt-2 text-body-sm font-bold text-ink">{m.title}</div>
                    <div className="text-caption text-ink-muted">{m.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grad-photo flex aspect-[4/3] items-center justify-center rounded-2xl bg-navy-800 text-white/30"><Users size={64} /></div>
        </Container>
      </section>

      {/* MISI + NILAI */}
      <section className="py-14">
        <Container className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border bg-white p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand"><Flag size={22} /></div>
            <h2 className="mt-4 text-h-sm text-ink">Misi Kami</h2>
            <p className="mt-2 text-body-sm text-ink-body">Memberdayakan setiap pelajar dengan academic intelligence platform terbaik untuk mengukur potensi, memahami kelemahan, dan merancang langkah strategis menuju masa depan yang gemilang.</p>
          </div>
          <div className="rounded-2xl border bg-white p-8">
            <h2 className="text-h-sm text-ink">Nilai-Nilai Albirru</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {NILAI.map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.title} className="text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand"><Icon size={18} /></div>
                    <div className="mt-2.5 text-body-sm font-bold text-ink">{n.title}</div>
                    <div className="text-caption text-ink-muted">{n.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* TIMELINE */}
      <section className="bg-muted py-16">
        <Container>
          <h2 className="text-h-md text-ink">Perjalanan Kami</h2>
          <p className="mt-2 text-body text-ink-body">Terus tumbuh, belajar, dan berdampak untuk pendidikan Indonesia.</p>
          <div className="relative mt-10 grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-hair lg:block" />
            {TIMELINE.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.year} className="relative">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${t.active ? "bg-brand text-white" : "bg-white text-brand shadow-xs"}`}><Icon size={22} /></div>
                  <div className="mt-4 text-body-sm font-bold text-ink">{t.year}</div>
                  <div className={`text-body-sm font-semibold ${t.active ? "text-brand" : "text-ink"}`}>{t.title}</div>
                  <p className="mt-1 text-caption text-ink-muted">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* TIM + ANGKA */}
      <section className="py-16">
        <Container className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-h-md text-ink">Tim di Balik Albirru</h2>
            <p className="mt-2 text-body text-ink-body">Dipimpin oleh para ahli pendidikan, data, dan teknologi.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {TEAM.map((p) => (
                <div key={p.name} className="rounded-xl border bg-white p-4 text-center">
                  <div className="grad-photo mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-800 text-white/50"><Monogram label={p.m} size={48} /></div>
                  <div className="mt-3 text-body-sm font-bold text-ink">{p.name}</div>
                  <div className="text-caption font-semibold text-brand">{p.role}</div>
                  <div className="mt-1 text-caption text-ink-muted">{p.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-body-sm font-semibold text-ink">Lihat Semua Tim <ArrowRight size={15} /></div>
          </div>
          <div className="rounded-2xl bg-navy-900 p-8">
            <h3 className="text-h-sm text-white">Albirru dalam Angka</h3>
            <p className="mt-1 text-caption text-white/72">Terima kasih kepada siswa, guru, dan sekolah yang percaya pada kami.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {ANGKA.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.label} className="rounded-xl bg-white/5 p-4">
                    <Icon size={18} className="text-brand-300" />
                    <div className="mt-2 text-h-sm text-white">{a.value}</div>
                    <div className="text-caption text-white/72">{a.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* APA KATA MEREKA */}
      <section className="bg-muted py-16">
        <Container>
          <h2 className="text-center text-h-md text-ink">Apa Kata Mereka?</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {SAYS.map((s) => (
              <div key={s.name} className="rounded-xl border bg-white p-6">
                <Quote className="text-brand-300" size={24} />
                <p className="mt-3 text-body-sm text-ink-body">{s.q}</p>
                <div className="mt-5 flex items-center gap-3">
                  <Monogram label={s.m} size={36} />
                  <div><div className="text-body-sm font-semibold text-ink">{s.name}</div><div className="text-caption text-ink-muted">{s.sub}</div></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 px-8 py-10 md:flex-row">
            <div>
              <h2 className="text-h-md text-white">Mari Berkolaborasi untuk Pendidikan Indonesia</h2>
              <p className="mt-1 max-w-lg text-body-sm text-white/72">Bersama Albirru, wujudkan generasi yang cerdas, berkarakter, dan siap menghadapi masa depan.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/sekolah" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-6 text-label text-white">Untuk Sekolah <ArrowRight size={16} /></a>
              <a href="/kontak" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/30 px-6 text-label text-white"><Phone size={15} /> Hubungi Kami</a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
