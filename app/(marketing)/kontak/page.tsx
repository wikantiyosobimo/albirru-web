import {
  ShieldCheck, Headset, Users, Building2, MessageCircle, Mail, Phone, Clock,
  ArrowRight, MapPin, Users2, Newspaper, CalendarDays, HeartHandshake, TrendingUp,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { ContactForm } from "@/components/sections/marketing/contact-form";

export const metadata = { title: "Kontak — Albirru" };

const HERO_MINI = [
  { icon: ShieldCheck, title: "Dipercaya Ribuan Siswa", desc: "23.814+ siswa telah meraih kampus impian bersama Albirru." },
  { icon: Headset, title: "Siap Membantu", desc: "Tim kami siap membantu Anda dengan cepat dan ramah." },
  { icon: Users, title: "Bersama Lebih Berdampak", desc: "Kolaborasi dengan sekolah, komunitas, dan mitra pendidikan." },
];

const DIRECT = [
  { icon: MessageCircle, title: "WhatsApp", sub: "08xx-xxxx-xxxx" },
  { icon: Mail, title: "Email", sub: "halo@albirru.com" },
  { icon: Phone, title: "Telepon", sub: "(021) 1234 5678" },
  { icon: Clock, title: "Jam Operasional", sub: "Senin – Jumat, 08.00 – 17.00 WIB" },
];

const COLLAB = [
  { icon: Building2, title: "Partnership Sekolah", desc: "Program & implementasi di sekolah" },
  { icon: Users2, title: "Komunitas & Organisasi", desc: "Edukasi, pelatihan, dan kolaborasi" },
  { icon: Newspaper, title: "Media & Publikasi", desc: "Liputan, artikel, dan publikasi bersama" },
  { icon: CalendarDays, title: "Event & Webinar", desc: "Narasumber, sponsor, dan kolaborasi acara" },
  { icon: HeartHandshake, title: "Karier & Relawan", desc: "Bergabung bersama tim Albirru" },
];

export default function KontakPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-muted">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-16">
          <div>
            <Eyebrow>Hubungi Kami</Eyebrow>
            <h1 className="mt-5 text-[clamp(2rem,1.6rem+1.8vw,2.75rem)] font-extrabold leading-[1.12] tracking-tight text-ink">
              Mari Terhubung. Bersama Wujudkan <span className="text-brand">Masa Depan Terbaik.</span>
            </h1>
            <p className="mt-4 max-w-md text-body text-ink-body">
              Albirru siap menjadi partner perjalanan belajar Anda. Hubungi kami untuk informasi, kolaborasi, atau pertanyaan lainnya.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-3">
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
          </div>
          <div className="relative">
            <div className="grad-photo flex aspect-[4/3] items-center justify-center rounded-2xl bg-navy-800 text-white/30"><Building2 size={64} /></div>
            <div className="rounded-xl bg-white p-4 shadow-md lg:absolute lg:-bottom-5 lg:right-6">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand"><Users size={18} /></span>
                <div><div className="text-h-sm text-ink">23.814+</div><div className="text-caption text-ink-muted">Siswa Terbantu</div></div>
                <TrendingUp size={18} className="ml-2 text-[#16B47A]" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FORM + DIRECT */}
      <section className="py-14">
        <Container className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border bg-white p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand"><MessageCircle size={20} /></span>
              <div>
                <h2 className="text-h-sm text-ink">Kirim Pesan kepada Kami</h2>
                <p className="text-caption text-ink-muted">Isi formulir di bawah ini dan tim Albirru akan segera merespons Anda.</p>
              </div>
            </div>
            <div className="mt-6"><ContactForm /></div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-h-sm text-ink">Hubungi Kami Langsung</h2>
              <p className="text-caption text-ink-muted">Pilih cara yang paling nyaman untuk Anda.</p>
              <div className="mt-4 space-y-3">
                {DIRECT.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div key={d.title} className="flex items-center gap-3 rounded-lg border p-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={17} /></span>
                      <span className="flex-1"><span className="block text-body-sm font-semibold text-ink">{d.title}</span><span className="block text-caption text-ink-muted">{d.sub}</span></span>
                      <ArrowRight size={15} className="text-ink-muted" />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl bg-navy-900 p-6">
              <h3 className="text-body-lg font-bold text-white">Anda Sekolah atau Lembaga Pendidikan?</h3>
              <p className="mt-1 text-caption text-white/72">Mari bekerja sama untuk membantu lebih banyak siswa mencapai potensi terbaiknya.</p>
              <a href="/sekolah" className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-label text-ink">Lihat Program Partnership <ArrowRight size={16} /></a>
            </div>
          </div>
        </Container>
      </section>

      {/* COLLAB */}
      <section className="bg-muted py-14">
        <Container>
          <h2 className="text-h-md text-ink">Kolaborasi untuk Dampak yang Lebih Luas</h2>
          <p className="mt-2 max-w-xl text-body text-ink-body">Albirru terbuka untuk berbagai bentuk kerja sama yang bermanfaat bagi dunia pendidikan.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {COLLAB.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="text-center sm:text-left">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand shadow-xs sm:mx-0"><Icon size={18} /></div>
                  <div className="mt-3 text-body-sm font-bold text-ink">{c.title}</div>
                  <div className="text-caption text-ink-muted">{c.desc}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* MAP / OFFICE */}
      <section className="py-14">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div className="grad-photo flex min-h-[260px] items-end rounded-2xl bg-navy-800 p-5">
            <div className="rounded-lg bg-white p-3 shadow-md">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-brand" /><span className="text-body-sm font-bold text-ink">Albirru HQ</span></div>
              <div className="mt-1 text-caption text-ink-muted">Jl. Pendidikan No.10<br />Jakarta Selatan 12190</div>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border bg-white p-8">
            <h2 className="flex items-center gap-2 text-h-sm text-ink"><MapPin size={18} className="text-brand" /> Kunjungi Kantor Kami</h2>
            <div className="mt-3 text-body-sm font-semibold text-ink">Jl. Pendidikan No.10</div>
            <div className="text-body-sm text-ink-muted">Kebayoran Baru, Jakarta Selatan 12190</div>
            <p className="mt-3 text-body-sm text-ink-body">Datang langsung ke kantor Albirru dan rasakan lingkungan belajar yang inspiratif.</p>
            <a href="https://maps.google.com" className="mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-md border px-5 text-label text-ink"><MapPin size={16} /> Lihat Rute di Maps</a>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 px-8 py-10 md:flex-row">
            <div>
              <h2 className="text-h-md text-white">Siap Melangkah Lebih Jauh Bersama Albirru?</h2>
              <p className="mt-1 max-w-lg text-body-sm text-white/72">Satu pesan kecil dari Anda bisa menjadi awal perubahan besar bagi masa depan ribuan siswa.</p>
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
