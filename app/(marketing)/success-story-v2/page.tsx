import { Users, GraduationCap, Building2, Trophy, Star, ArrowRight, Check, TrendingUp, Quote } from "lucide-react";
import { Container } from "@/components/layout/container";

export const metadata = { title: "Albirru Class of 2026 — Success Story" };

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;
const GOLD = "#C9A227";
const CREAM = "#F3EEE2";
const PAPER = "#FBF8F1";

const IMPACT = [
  { icon: Users, value: "23.814+", label: "Siswa Terbantu" },
  { icon: GraduationCap, value: "1.842+", label: "Siswa Diterima PTN" },
  { icon: Building2, value: "350+", label: "Kampus Tujuan" },
  { icon: Trophy, value: "98,6%", label: "Puas dengan Albirru" },
  { icon: Star, value: "4,9/5", label: "Rating Pengguna" },
];
const HERO_POLAROIDS = [
  { name: "Alya Putri", prodi: "Teknik Informatika - UI", from: 520, to: 700, rotate: -3, stamp: "LULUS UI" },
  { name: "Rafi Maulana", prodi: "Kedokteran - UGM", from: 528, to: 738, rotate: 2 },
  { name: "Nadira Aulia", prodi: "Teknik Sipil - ITB", from: 530, to: 702, rotate: -2 },
];
const SPOTLIGHTS = [
  { name: "Fachri Alif", prodi: "Teknik Informatika - ITS", from: 517, to: 685, rotate: -3, quote: "Albirru membantu saya memahami kelemahan dan fokus belajar dengan tepat." },
  { name: "Salma Dwi", prodi: "Psikologi - UNAIR", from: 502, to: 652, rotate: 2, quote: "Dari tidak percaya diri, sekarang saya yakin bisa bersaing." },
  { name: "Farhan Naufal", prodi: "Ilmu Komputer - UI", from: 515, to: 692, rotate: -1, quote: "Try out Albirru benar-benar mirip UTBK dan analisisnya sangat detail." },
  { name: "Aisyah Rahma", prodi: "Ekonomi - UGM", from: 524, to: 704, rotate: 3, quote: "Fitur Academic Navigator jadi penyelamat perjalanan saya." },
  { name: "Dimas Arkan", prodi: "Teknik Mesin - UNS", from: 498, to: 640, rotate: -2 },
];
const DIST = [["UI", "142"], ["UGM", "186"], ["ITB", "98"], ["ITS", "167"], ["UNAIR", "201"], ["UNS", "154"], ["UNDIP", "146"], ["UB", "173"], ["Lainnya", "1.048+"]];

function Tape({ className = "" }: { className?: string }) {
  return <span className={`pointer-events-none absolute h-5 w-14 ${className}`} style={{ background: "rgba(201,162,39,0.28)" }} />;
}

function Polaroid({ name, prodi, from, to, rotate, quote, stamp }: { name: string; prodi: string; from: number; to: number; rotate: number; quote?: string; stamp?: string }) {
  return (
    <div className="relative bg-white p-2 pb-4 shadow-lg" style={{ transform: `rotate(${rotate}deg)` }}>
      <Tape className="-top-2 left-1/2 -translate-x-1/2 -rotate-3" />
      <div className="grad-photo relative flex h-36 items-end justify-center rounded-sm bg-navy-800">
        {stamp ? (
          <span className="absolute right-1 top-1 flex h-12 w-12 rotate-[-12deg] items-center justify-center rounded-full border-2 border-dashed text-center text-[8px] font-bold leading-tight" style={{ borderColor: "#3B6BD6", color: "#3B6BD6" }}>{stamp}</span>
        ) : null}
      </div>
      <div className="mt-2 px-1 text-center">
        <div className="text-body-sm font-bold text-ink" style={SERIF}>{name}</div>
        <div className="text-[11px] text-ink-muted">{prodi}</div>
        <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-ink-body">Skor <b>{from}</b> <ArrowRight size={11} className="text-brand" /> <b className="text-brand">{to}</b></div>
        {quote ? <p className="mt-1 text-[10px] italic text-ink-muted">&ldquo;{quote}&rdquo;</p> : null}
      </div>
    </div>
  );
}

export default function SuccessStoryV2Page() {
  return (
    <div style={{ backgroundColor: CREAM }}>
      {/* HERO */}
      <section>
        <Container className="grid items-center gap-8 py-12 lg:grid-cols-2 lg:py-16">
          <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-8 lg:p-10">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">Success Story Albirru</span>
            <div className="mt-6 text-[clamp(2.5rem,2rem+3vw,4rem)] font-extrabold leading-[0.95] tracking-tight" style={{ ...SERIF, color: GOLD }}>
              ALBIRRU<br />CLASS OF<br /><span className="italic">2026</span>
            </div>
            <p className="mt-6 text-body-sm text-white/80">Setiap halaman adalah bukti.<br />Setiap nama adalah inspirasi.</p>
            <p className="mt-4 text-body-lg italic" style={{ ...SERIF, color: GOLD }}>Ini bukan akhir,<br />ini baru permulaan.</p>
          </div>

          <div className="relative rounded-2xl p-5" style={{ backgroundColor: PAPER }}>
            <p className="mb-4 text-body italic text-ink-body" style={SERIF}>Ribuan mimpi. Ratusan kampus.<br />Satu perjuangan yang nyata.</p>
            <div className="grid grid-cols-2 gap-4">
              {HERO_POLAROIDS.map((p) => <Polaroid key={p.name} {...p} />)}
              <div className="flex items-center justify-center text-center text-[11px] italic text-ink-muted" style={SERIF}>♡ Mereka berhasil. Kamu berikutnya.</div>
            </div>
          </div>
        </Container>
      </section>

      {/* OUR IMPACT */}
      <section className="py-6">
        <Container>
          <div className="rounded-2xl border border-dashed p-6" style={{ borderColor: "rgba(201,162,39,0.5)", backgroundColor: PAPER }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-h-md italic text-ink" style={SERIF}>Our Impact</h2>
              <span className="rounded-md bg-navy-900 px-3 py-1.5 text-body-sm italic text-white" style={SERIF}>Dan akan terus bertambah! ↗</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {IMPACT.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center">
                    <Icon size={20} className="mx-auto text-brand" />
                    <div className="mt-1 text-stat text-ink" style={SERIF}>{s.value}</div>
                    <div className="text-caption text-ink-muted">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ALUMNI SPOTLIGHTS */}
      <section className="py-12">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-h-md text-ink" style={SERIF}>Alumni Spotlights <span style={{ color: GOLD }}>✶</span></h2>
            <div className="text-right">
              <a href="/success-story" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand">Lihat Semua Alumni <ArrowRight size={14} /></a>
              <p className="mt-1 text-caption italic text-ink-muted" style={SERIF}>Mereka datang dengan harapan.<br />Mereka pulang dengan pencapaian.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {SPOTLIGHTS.map((p) => <Polaroid key={p.name} {...p} />)}
          </div>
        </Container>
      </section>

      {/* SEBELUM & SESUDAH */}
      <section className="py-12">
        <Container>
          <h2 className="text-h-md italic text-ink" style={SERIF}>Sebelum &amp; Sesudah</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl p-6" style={{ backgroundColor: PAPER }}>
              <p className="text-body-sm text-ink-body">Rata-rata peningkatan skor siswa Albirru</p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 text-h-sm font-bold text-ink" style={{ borderColor: GOLD }}>520</span>
                <ArrowRight className="text-brand" />
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] text-h-sm font-bold text-brand" style={{ borderColor: "#3B6BD6" }}>702</span>
              </div>
              <p className="mt-3 text-center text-caption italic text-ink-muted" style={SERIF}>(Berdasarkan siswa aktif Try Out Albirru)</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5">
                <span className="inline-flex rounded-md bg-ink-muted px-2 py-0.5 text-[10px] font-bold uppercase text-white">Dulu</span>
                <div className="grad-photo my-3 h-24 rounded-md" style={{ filter: "grayscale(1)", background: "#9aa3b2" }} />
                <ul className="space-y-2">
                  {["Tidak tahu kelemahan", "Belajar tanpa arah", "Ragu dengan kemampuan", "Skor stagnan"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-caption text-ink-muted"><span className="h-3.5 w-3.5 rounded-[3px] border" /> {t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-brand bg-white p-5">
                <span className="inline-flex rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold uppercase text-white">Sekarang</span>
                <div className="grad-photo my-3 h-24 rounded-md bg-navy-800" />
                <ul className="space-y-2">
                  {["Tahu kelemahan", "Belajar terarah & terukur", "Percaya diri meningkat", "Skor terus naik", "Lolos kampus impian!"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-caption text-ink"><Check size={14} className="text-brand" /> {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-navy-900 p-6">
            <Quote className="text-brand-300" size={24} />
            <p className="mt-2 text-body-lg italic text-white" style={SERIF}>Perjalanan ini mengubah cara saya belajar dan melihat diri sendiri. Albirru bukan hanya platform, tapi partner terbaik saya.</p>
            <div className="mt-3 text-body-sm text-white/72">— Rizky Pratama, Teknik Informatika - ITB</div>
          </div>
        </Container>
      </section>

      {/* DITERIMA DI KAMPUS */}
      <section className="py-12">
        <Container>
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-h-sm text-ink" style={SERIF}>Diterima di Kampus Impian</h2>
            <div className="mt-5 grid grid-cols-3 gap-5 sm:grid-cols-5 lg:grid-cols-9">
              {DIST.map(([k, v]) => (
                <div key={k} className="text-center">
                  <GraduationCap size={18} className="mx-auto" style={{ color: GOLD }} />
                  <div className="mt-1 text-caption font-semibold text-ink">{k}</div>
                  <div className="text-h-sm text-brand" style={SERIF}>{v}</div>
                  <div className="text-[10px] text-ink-muted">Siswa</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 px-8 py-10 md:flex-row">
            <div>
              <h2 className="text-h-md text-white" style={SERIF}>Kamu bisa jadi bagian dari cerita sukses berikutnya!</h2>
              <p className="mt-1 max-w-lg text-body-sm text-white/72">Mulai perjalananmu sekarang dan raih kampus impianmu bersama Albirru.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/try-out" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-6 text-label text-ink">Ikuti Try Out Nasional <ArrowRight size={16} /></a>
              <a href="/daftar" className="inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-label text-white" style={{ backgroundColor: "#15BFA6" }}>Daftar Gratis Sekarang <ArrowRight size={16} /></a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
