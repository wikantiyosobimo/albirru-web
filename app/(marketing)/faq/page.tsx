import {
  HelpCircle, Wallet, Target, Crown, Building2, User, Settings, Search,
  MessageCircle, Mail, MessagesSquare, BookOpen, ArrowRight, Headset, Star, Quote,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Accordion } from "@/components/ui/accordion";
import { Monogram } from "@/components/common/monogram";

export const metadata = { title: "FAQ — Albirru" };

const TOPICS = [
  { icon: HelpCircle, title: "Pertanyaan Umum", desc: "Informasi umum seputar Albirru", active: true },
  { icon: Wallet, title: "Pembayaran", desc: "Metode pembayaran, harga, dan refund" },
  { icon: Target, title: "Try Out Nasional", desc: "Seputar try out, jadwal, dan hasil" },
  { icon: Crown, title: "Albirru PRO", desc: "Fitur PRO, akses, dan manfaatnya" },
  { icon: Building2, title: "Partnership Sekolah", desc: "Kerja sama sekolah dan program" },
  { icon: User, title: "Akun & Akses", desc: "Akun, login, dan masalah akses" },
  { icon: Settings, title: "Teknis", desc: "Masalah teknis & penggunaan platform" },
];

const FAQ = [
  { q: "Apa itu Albirru?", a: "Albirru adalah platform academic intelligence yang menggunakan data & AI untuk membantu siswa mengenali kelemahan, meningkatkan kemampuan, dan meraih kampus impian melalui try out, analisis, dan bimbingan personalised." },
  { q: "Apakah Albirru hanya untuk persiapan UTBK-SNBT?", a: "Tidak. Fokus utama kami UTBK-SNBT, namun arsitektur Albirru juga disiapkan untuk persiapan ujian lain seperti CPNS dan PPPK." },
  { q: "Siapa saja yang bisa menggunakan Albirru?", a: "Siswa yang mempersiapkan masuk PTN, alumni/gap year, serta sekolah dan tenaga akademik yang ingin memantau dan mendampingi siswa." },
  { q: "Bagaimana Albirru berbeda dengan platform belajar lainnya?", a: "Albirru bukan sekadar bank soal. Setiap hasil dianalisis hingga level subtopik, lalu diubah menjadi rekomendasi belajar personal dan prediksi peluang lolos." },
  { q: "Apakah Albirru menyediakan bimbingan atau mentor?", a: "Ya, melalui program Siswa Albirru yang menggabungkan fitur Pro dengan pendampingan tenaga akademik." },
  { q: "Apakah data dan informasi saya aman di Albirru?", a: "Data kamu dienkripsi dan disimpan dengan aman. Kami tidak membagikan data pribadimu tanpa izin." },
  { q: "Apakah ada aplikasi Albirru?", a: "Albirru dapat diakses melalui web. Versi aplikasi sedang dalam pengembangan." },
  { q: "Bagaimana cara mendaftar Albirru?", a: "Klik Daftar Gratis, pilih peranmu, lalu buat akun dengan email atau Google. Gratis dan tanpa kartu kredit." },
  { q: "Apakah ada garansi lolos di Albirru?", a: "Tidak ada platform yang bisa menjamin kelulusan. Albirru memaksimalkan peluangmu dengan analisis dan strategi yang terukur." },
  { q: "Bagaimana jika saya masih punya pertanyaan lainnya?", a: "Hubungi tim kami melalui WhatsApp, email, atau Live Chat. Kami siap membantu setiap hari." },
];

const CONTACTS = [
  { icon: MessageCircle, title: "WhatsApp", sub: "08xx-xxxx-xxxx" },
  { icon: Mail, title: "Email", sub: "halo@albirru.com" },
  { icon: MessagesSquare, title: "Live Chat", sub: "Tersedia setiap hari 08.00 – 22.00 WIB" },
];

export default function FaqPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-16">
          <div>
            <Eyebrow>FAQ Albirru</Eyebrow>
            <h1 className="mt-5 text-[clamp(2rem,1.6rem+1.8vw,2.75rem)] font-extrabold leading-[1.12] tracking-tight text-ink">
              Pertanyaan yang Sering Diajukan, <span className="text-brand">Jawaban</span> yang Jelas.
            </h1>
            <p className="mt-4 max-w-md text-body text-ink-body">
              Temukan jawaban dari pertanyaan umum seputar Albirru. Jika tidak menemukan jawaban yang Anda cari, tim kami siap membantu.
            </p>
            <div className="relative mt-6 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input aria-label="Cari pertanyaan atau topik" className="h-12 w-full rounded-full border bg-white pl-11 pr-4 text-body text-ink placeholder:text-ink-muted" placeholder="Cari pertanyaan atau topik..." />
            </div>
          </div>
          <div className="grad-photo flex aspect-[4/3] items-center justify-center rounded-2xl bg-navy-800 text-white/30"><HelpCircle size={72} /></div>
        </Container>
      </section>

      {/* TOPICS */}
      <section className="py-12">
        <Container>
          <h2 className="text-h-sm text-ink">Pilih Topik yang Anda Cari</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className={`rounded-xl border p-4 ${t.active ? "border-brand bg-white" : "bg-white"}`}>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.active ? "bg-brand text-white" : "bg-brand-100 text-brand"}`}><Icon size={17} /></div>
                  <div className="mt-2.5 text-body-sm font-bold text-ink">{t.title}</div>
                  <div className="text-caption text-ink-muted">{t.desc}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* MAIN */}
      <section className="pb-12">
        <Container className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-h-sm text-ink"><HelpCircle size={18} className="text-brand" /> Pertanyaan Umum</h2>
            <Accordion items={FAQ} />
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-xl bg-navy-900 p-5">
              <h3 className="text-body-lg font-bold text-white">Tidak menemukan jawaban yang Anda cari?</h3>
              <p className="mt-1 text-caption text-white/72">Tim Albirru siap membantu Anda secara cepat dan ramah.</p>
              <a href="/kontak" className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-label text-ink"><Headset size={16} /> Hubungi Tim Albirru</a>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <h3 className="text-body-lg font-bold text-ink">Butuh Bantuan Cepat?</h3>
              <p className="mt-1 text-caption text-ink-muted">Pilih cara terbaik untuk menghubungi kami.</p>
              <div className="mt-4 space-y-3">
                {CONTACTS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <a key={c.title} href="/kontak" className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={17} /></span>
                      <span className="flex-1"><span className="block text-body-sm font-semibold text-ink">{c.title}</span><span className="block text-caption text-ink-muted">{c.sub}</span></span>
                      <ArrowRight size={15} className="text-ink-muted" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border bg-muted p-5">
              <h3 className="text-body-lg font-bold text-ink">Panduan & Artikel Bantuan</h3>
              <p className="mt-1 text-caption text-ink-muted">Temukan panduan penggunaan, tips belajar, dan artikel lainnya di Help Center Albirru.</p>
              <a href="/blog" className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"><BookOpen size={15} /> Kunjungi Help Center <ArrowRight size={14} /></a>
            </div>
          </aside>
        </Container>
      </section>

      {/* SOCIAL PROOF */}
      <section className="pb-12">
        <Container>
          <div className="grid items-center gap-6 rounded-2xl bg-brand-100 p-8 md:grid-cols-[1fr_1.2fr]">
            <div className="grad-photo flex aspect-[16/9] items-center justify-center rounded-xl bg-navy-800 text-white/30"><MessageCircle size={48} /></div>
            <div>
              <Quote className="text-brand-300" size={26} />
              <p className="mt-2 text-h-sm text-ink">Albirru bukan sekadar platform belajar, tapi partner perjalanan menuju masa depan.</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-2">{["A", "B", "C"].map((m) => <Monogram key={m} label={m} size={32} />)}</div>
                <div>
                  <div className="text-caption text-ink-muted">Bergabung dengan 23.814+ siswa lainnya</div>
                  <div className="flex items-center gap-1 text-body-sm font-bold text-ink">4,9/5 <Star size={14} className="fill-[#F2B441] text-[#F2B441]" /> <span className="font-normal text-ink-muted">(3.260+ ulasan)</span></div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 px-8 py-10 md:flex-row">
            <div>
              <h2 className="text-h-md text-white">Siap Meraih Kampus Impianmu?</h2>
              <p className="mt-1 text-body-sm text-white/72">Gabung sekarang dan wujudkan masa depan terbaik bersama Albirru.</p>
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
