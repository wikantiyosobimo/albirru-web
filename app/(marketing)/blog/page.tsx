import {
  Search, LayoutGrid, GraduationCap, BookOpen, Lightbulb, Target, Smile, Star,
  Flame, ArrowRight, ArrowDown, Send, BadgeCheck, RefreshCw, Wrench, Gift, Quote,
  CalendarDays, Clock,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/lib/data/blog";

export const metadata = { title: "Blog — Albirru" };

const tanggalID = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const CATEGORIES = [
  { icon: LayoutGrid, label: "Semua", active: true },
  { icon: GraduationCap, label: "UTBK-SNBT" },
  { icon: BookOpen, label: "Strategi Belajar" },
  { icon: Lightbulb, label: "Motivasi" },
  { icon: Target, label: "Perencanaan Akademik" },
  { icon: Smile, label: "Psikologi & Remaja" },
  { icon: Star, label: "Kisah Inspiratif" },
];

const POPULAR = [
  ["10 Kesalahan Belajar yang Sering Dilakukan Siswa", "12 Mei 2024"],
  ["Cara Meningkatkan Skor Penalaran Umum", "10 Mei 2024"],
  ["Contoh Soal UTBK-SNBT dan Pembahasannya", "9 Mei 2024"],
  ["Strategi Mengerjakan Soal Literasi dengan Cepat", "7 Mei 2024"],
  ["Memilih Jurusan yang Tepat: Ikuti Passion atau Peluang?", "5 Mei 2024"],
];

const WHY = [
  { icon: BadgeCheck, title: "Konten Berkualitas", desc: "Ditulis oleh tim ahli dan praktisi pendidikan berpengalaman." },
  { icon: RefreshCw, title: "Selalu Update", desc: "Informasi terbaru seputar UTBK-SNBT dan dunia pendidikan." },
  { icon: Wrench, title: "Praktis & Aplikatif", desc: "Tips dan strategi yang bisa langsung kamu terapkan." },
  { icon: Gift, title: "Gratis untuk Semua", desc: "Semua konten bisa diakses kapan saja tanpa biaya." },
];

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold uppercase text-white">{children}</span>;
}
function Meta({ date, read }: { date: string; read?: string }) {
  return (
    <div className="flex items-center gap-3 text-caption text-ink-muted">
      <span className="flex items-center gap-1"><CalendarDays size={12} /> {date}</span>
      {read ? <span className="flex items-center gap-1"><Clock size={12} /> {read}</span> : null}
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-16">
          <div>
            <h1 className="text-[clamp(2rem,1.6rem+1.8vw,2.75rem)] font-extrabold leading-[1.12] tracking-tight text-ink">
              Artikel, Tips, dan Strategi <span className="text-brand">untuk Masa Depanmu.</span>
            </h1>
            <p className="mt-4 max-w-md text-body text-ink-body">
              Dapatkan inspirasi, pengetahuan, dan strategi terbaik seputar UTBK-SNBT, belajar efektif, dan perencanaan akademik bersama Albirru.
            </p>
            <div className="relative mt-6 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input aria-label="Cari artikel, tips, atau topik" className="h-12 w-full rounded-full border bg-white pl-11 pr-4 text-body text-ink placeholder:text-ink-muted" placeholder="Cari artikel, tips, atau topik..." />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-caption text-ink-muted"><CalendarDays size={13} /> Konten terbaru setiap minggu untuk membantumu melangkah lebih jauh.</p>
          </div>
          <div className="grad-photo flex aspect-[4/3] items-center justify-center rounded-2xl bg-navy-800 text-white/30"><BookOpen size={64} /></div>
        </Container>
      </section>

      {/* CATEGORIES */}
      <section className="border-b bg-white py-5">
        <Container className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <span key={c.label} className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-body-sm ${c.active ? "border-brand bg-brand text-white" : "bg-white text-ink-body"}`}>
                <Icon size={15} /> {c.label}
              </span>
            );
          })}
        </Container>
      </section>

      {/* MAIN GRID */}
      <section className="py-12">
        <Container className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-h-sm text-ink">Artikel Unggulan</h2>
              <span className="inline-flex items-center gap-1 text-body-sm font-semibold text-brand">Lihat Semua <ArrowRight size={14} /></span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="grad-photo flex min-h-[280px] flex-col justify-end rounded-xl bg-navy-800 p-5 transition-opacity hover:opacity-95">
                <Tag>{BLOG_POSTS[0].kategori}</Tag>
                <h3 className="mt-3 text-h-md text-white">{BLOG_POSTS[0].judul}</h3>
                <p className="mt-1 text-body-sm text-white/72">{BLOG_POSTS[0].ringkasan}</p>
                <div className="mt-3 text-caption text-white/72">{BLOG_POSTS[0].penulis} • {tanggalID(BLOG_POSTS[0].tanggal)} • {BLOG_POSTS[0].baca_menit} min read</div>
              </Link>
              <div className="flex flex-col gap-4">
                {BLOG_POSTS.slice(1, 3).map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`} className="grad-photo flex flex-1 flex-col justify-end rounded-xl bg-navy-800 p-4 transition-opacity hover:opacity-95">
                    <Tag>{a.kategori}</Tag>
                    <h3 className="mt-2 text-body-lg font-bold text-white">{a.judul}</h3>
                    <div className="mt-1 text-caption text-white/72">{tanggalID(a.tanggal)} • {a.baca_menit} min read</div>
                  </Link>
                ))}
              </div>
            </div>

            <h2 className="mt-10 text-h-sm text-ink">Artikel Terbaru</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {BLOG_POSTS.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-sm">
                  <div className="grad-photo h-32 bg-navy-800" />
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase text-brand">{a.kategori}</span>
                    <h3 className="mt-1 text-body-sm font-bold text-ink group-hover:text-brand">{a.judul}</h3>
                    <div className="mt-2"><Meta date={tanggalID(a.tanggal)} read={`${a.baca_menit} min read`} /></div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button variant="secondary" trailingIcon={ArrowDown}>Muat Lebih Banyak Artikel</Button>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-xl border bg-white p-5">
              <h3 className="flex items-center gap-2 text-h-sm text-ink">Artikel Populer <Flame size={16} className="text-[#E06A5E]" /></h3>
              <ol className="mt-4 space-y-3.5">
                {POPULAR.map((p, i) => (
                  <li key={p[0]} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand">{i + 1}</span>
                    <div><div className="text-body-sm font-semibold text-ink">{p[0]}</div><div className="text-caption text-ink-muted">{p[1]}</div></div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 inline-flex items-center gap-1 text-body-sm font-semibold text-brand">Lihat Semua Artikel Populer <ArrowRight size={14} /></div>
            </div>

            <div className="rounded-xl bg-navy-900 p-5">
              <h3 className="text-body-lg font-bold text-white">Dapatkan Artikel Terbaru Langsung di Emailmu!</h3>
              <p className="mt-1 text-caption text-white/72">Tips belajar, strategi UTBK, dan motivasi setiap minggu.</p>
              <input className="mt-4 h-11 w-full rounded-md border-0 bg-white px-3 text-body-sm text-ink placeholder:text-ink-muted" placeholder="Email kamu" />
              <button className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-label text-white">Berlangganan <Send size={15} /></button>
              <p className="mt-2 text-center text-caption text-white/72">Bergabung dengan 15.000+ siswa lainnya</p>
            </div>

            <div className="rounded-xl bg-brand-100 p-5">
              <Quote className="text-brand-300" size={22} />
              <p className="mt-2 text-body-sm font-medium text-ink">Pengetahuan adalah investasi terbaik untuk masa depan.</p>
              <p className="mt-1 text-caption text-ink-muted">— Albirru</p>
            </div>
          </aside>
        </Container>
      </section>

      {/* WHY */}
      <section className="bg-muted py-14">
        <Container>
          <h2 className="text-center text-h-md text-ink">Kenapa Membaca Blog Albirru?</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="rounded-xl border bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={18} /></div>
                  <div className="mt-3 text-body-sm font-bold text-ink">{w.title}</div>
                  <p className="mt-1 text-caption text-ink-muted">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 px-8 py-10 md:flex-row">
            <div>
              <h2 className="text-h-md text-white">Siap melangkah lebih jauh?</h2>
              <p className="mt-1 text-body-sm text-white/72">Try out, analisis, dan wujudkan impianmu bersama Albirru.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/try-out" variant="inverse" trailingIcon={ArrowRight}>Ikuti Try Out Nasional</Button>
              <Button href="/daftar" variant="primary" trailingIcon={ArrowRight}>Mulai Gratis Sekarang</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
