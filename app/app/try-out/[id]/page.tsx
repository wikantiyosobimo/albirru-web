import Link from "next/link";
import {
  Calendar, Clock, HelpCircle, FileText, BarChart3, BookOpen, AlarmClock, Award,
  ShieldCheck, ArrowRight, Bookmark, Layers, Lightbulb, MonitorSmartphone,
} from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { PortalTopbar } from "@/components/portal/topbar";
import { Countdown } from "@/components/portal/countdown";
import { ShareButton } from "@/components/portal/share-button";
import { TryoutCta, UpgradeBanner, type RegStatus } from "@/components/portal/tryout-cta";
import { Monogram } from "@/components/common/monogram";

export const metadata = { title: "Detail Try Out — Albirru" };

const MATERI = [
  { icon: BookOpen, color: "#6D49C9", t: "Pemahaman Bacaan dan Menulis", d: "Kemampuan memahami bacaan dan menulis informasi secara tertulis.", soal: 40 },
  { icon: Layers, color: "#16B47A", t: "Penalaran Umum", d: "Kemampuan menganalisis informasi dan menarik kesimpulan logis.", soal: 40 },
  { icon: BarChart3, color: "#E8910B", t: "Pengetahuan dan Pemahaman Umum", d: "Pengetahuan umum dan pemahaman terhadap berbagai informasi.", soal: 40 },
  { icon: BarChart3, color: "#2F5BFF", t: "Pengetahuan Kuantitatif", d: "Kemampuan memahami dan menggunakan konsep matematika dasar.", soal: 40 },
  { icon: BookOpen, color: "#E5484D", t: "Literasi dalam Bahasa Indonesia", d: "Kemampuan memahami dan menggunakan bahasa Indonesia dengan baik.", soal: 40 },
  { icon: BookOpen, color: "#16B47A", t: "Literasi dalam Bahasa Inggris", d: "Kemampuan memahami teks dan informasi dalam bahasa Inggris.", soal: 40 },
];

const INFO = [
  { icon: AlarmClock, t: "Kerjakan di waktu yang telah ditentukan", d: "Pastikan kamu mengerjakan sesuai jadwal." },
  { icon: ShieldCheck, t: "Tidak ada pengulangan", d: "Try out hanya dapat dikerjakan 1 kali." },
  { icon: BarChart3, t: "Hasil & Analisis Lengkap", d: "Dapatkan analisis mendalam dan prediksi peluang lolos." },
  { icon: Award, t: "Peringkat Nasional", d: "Lihat peringkatmu dibanding ribuan peserta lainnya." },
];

const MATERI_TABS = ["TPS", "TKA - Literasi", "TKA - Penalaran", "TKA - Matematika"];

export default async function TryOutOverviewPage({ params }: { params: { id: string } }) {
  const { profile } = await getPortalProfile();
  const plan = profile?.plan ?? "free";
  const supabase = await createClient();
  const [{ data: tryout }, { data: reg }] = await Promise.all([
    supabase.from("tryouts").select("title, tipe, harga, mulai_at, status").eq("id", params.id).maybeSingle(),
    supabase.from("tryout_registrations").select("status").eq("tryout_id", params.id).maybeSingle(),
  ]);
  const judul = tryout?.title ?? "Simulasi SNBT Nasional 2024";
  const harga = tryout?.harga ?? 29000;
  const hargaLabel = harga === 0 ? "Gratis" : `Rp ${harga.toLocaleString("id-ID")}`;
  const started = tryout?.mulai_at ? new Date(tryout.mulai_at).getTime() <= Date.now() : false;
  const selesai = tryout?.status === "selesai";
  const initialStatus = (reg?.status as RegStatus) ?? "none";

  const target = tryout?.mulai_at ?? new Date(Date.now() + 3 * 86400000 + 12 * 3600000 + 45 * 60000).toISOString();

  return (
    <>
      <PortalTopbar eyebrow="Try Out  ›  Detail Try Out" title={judul} nama={profile?.nama ?? "Farhan"} right={<ShareButton title={judul} />} />

      <div className="space-y-5 p-5 lg:p-7">
        {/* META TAGS */}
        <div className="flex flex-wrap items-center gap-2 text-caption">
          <span className="rounded-md bg-success-subtle px-2.5 py-1 font-semibold text-success-strong">Nasional</span>
          <span className="rounded-md bg-brand-100 px-2.5 py-1 font-semibold text-brand">UTBK SNBT</span>
          <span className="flex items-center gap-1 text-ink-muted"><Calendar size={13} /> 25 Mei 2024</span>
          <span className="flex items-center gap-1 text-ink-muted"><Clock size={13} /> 07:30 - 11:45 WIB</span>
          <span className="flex items-center gap-1 text-ink-muted"><HelpCircle size={13} /> 240 Menit</span>
        </div>

        {plan === "free" ? <UpgradeBanner /> : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* LEFT MAIN */}
          <div className="space-y-5">
            {/* MASTHEAD: deskripsi + ilustrasi */}
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="rounded-2xl border bg-white p-6">
                <div className="flex gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D49C9] to-[#3B1E78] p-2 text-center text-[9px] font-extrabold uppercase leading-tight text-white">SIMULASI SNBT 2024</div>
                  <p className="text-body-sm leading-relaxed text-ink-body">Try out nasional dengan standar UTBK SNBT terbaru yang dirancang untuk mengukur kemampuanmu secara akurat dan memprediksi peluang lolos PTN impian.</p>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { icon: FileText, t: "240", s: "Soal" },
                    { icon: Clock, t: "240", s: "Menit" },
                    { icon: Layers, t: "TPS & TKA", s: "Literasi, Penalaran, Matematika" },
                    { icon: BarChart3, t: "Prediksi Skor", s: "& Peluang Lolos" },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.s}>
                        <Icon size={18} className="text-brand" />
                        <div className="mt-1.5 text-body-lg font-extrabold leading-tight text-ink">{m.t}</div>
                        <div className="text-caption text-ink-muted">{m.s}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-success-subtle px-4 py-3 text-body-sm font-medium text-success-strong">
                  <ShieldCheck size={16} /> Setara dengan UTBK SNBT resmi sesuai standar terbaru 2024.
                </div>
              </div>

              <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border grad-photo p-6">
                <div className="blob pointer-events-none absolute -right-8 -top-8 h-48 w-48" />
                <MonitorSmartphone size={64} className="relative text-white/80" />
              </div>
            </div>

            {/* MATERI YANG DIUJIKAN */}
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-h-sm text-ink">Materi yang Diujikan</h2>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {MATERI_TABS.map((t, i) => (
                  <span key={t} className={i === 0 ? "shrink-0 rounded-lg bg-brand px-4 py-2 text-body-sm font-semibold text-white" : "shrink-0 rounded-lg border bg-white px-4 py-2 text-body-sm text-ink-body"}>{t}</span>
                ))}
              </div>
              <div className="mt-4 divide-y">
                {MATERI.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.t} className="flex items-center gap-3 py-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${m.color}1A`, color: m.color }}><Icon size={18} /></span>
                      <div className="min-w-0 flex-1"><div className="text-body-sm font-bold text-ink">{m.t}</div><div className="text-caption text-ink-muted">{m.d}</div></div>
                      <span className="shrink-0 text-right text-caption"><b className="text-ink">{m.soal}</b><div className="text-ink-muted">Soal</div></span>
                    </div>
                  );
                })}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-muted py-2.5 text-body-sm font-semibold text-ink transition-colors hover:bg-hair"><FileText size={15} /> Lihat Blueprint Resmi <ArrowRight size={14} /></button>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">
            {/* PENDAFTARAN */}
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-h-sm text-ink">Pendaftaran</h2>
                <span className="rounded-md bg-success-subtle px-2.5 py-1 text-[11px] font-semibold text-success-strong">Dibuka</span>
              </div>
              <div className="mt-4 text-caption text-ink-muted">Sisa Waktu Pendaftaran</div>
              <div className="mt-2"><Countdown target={target} /></div>
              <div className="mt-4 text-caption text-ink-muted">Harga</div>
              <div className="text-h-md text-ink">{hargaLabel}</div>
              <div className="mt-4">
                <TryoutCta tryoutId={params.id} plan={plan} harga={harga} hargaLabel={hargaLabel} started={started} selesai={selesai} initialStatus={initialStatus} variant="block" />
              </div>
              <Link href="/app/bookmark" className="mt-2 flex h-11 items-center justify-center gap-2 rounded-lg border text-label text-ink transition-colors hover:bg-muted"><Bookmark size={16} /> Simpan ke Bookmark</Link>
            </div>

            {/* INFORMASI PENTING */}
            <div className="rounded-2xl border bg-white p-5">
              <h2 className="text-h-sm text-ink">Informasi Penting</h2>
              <div className="mt-4 space-y-4">
                {INFO.map((i) => {
                  const Icon = i.icon;
                  return (
                    <div key={i.t} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={17} /></span>
                      <div><div className="text-body-sm font-semibold text-ink">{i.t}</div><div className="text-caption text-ink-muted">{i.d}</div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PESERTA TERDAFTAR */}
            <div className="rounded-2xl border bg-white p-5">
              <h2 className="text-h-sm text-ink">Peserta Terdaftar</h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["A", "R", "S", "D"].map((l) => <Monogram key={l} label={l} size={32} ring />)}
                  <span className="flex h-8 items-center rounded-full bg-brand-100 px-2 text-caption font-bold text-brand ring-2 ring-white">+2.4K</span>
                </div>
                <span className="text-body-sm text-ink-body">3.256 siswa telah terdaftar</span>
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#FFF8EC] p-4">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#E8910B]" />
                <div><div className="text-body-sm font-semibold text-ink">Tips Albirru</div><p className="mt-0.5 text-caption text-ink-body">Kerjakan try out secara rutin untuk melacak perkembangan skor dan meningkatkan peluang lolos PTN impianmu.</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-4 rounded-2xl border bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand"><Calendar size={22} /></span>
            <div>
              <div className="text-caption text-ink-muted">Try out akan dimulai dalam</div>
              <div className="text-body-lg font-extrabold text-ink">03 hari 12 jam 45 menit</div>
              <div className="text-caption text-ink-muted">25 Mei 2024, 07:30 WIB</div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/app/journey" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-label text-ink transition-colors hover:bg-muted">Lihat Jadwal Try Out Lainnya</Link>
            <div className="sm:w-52"><TryoutCta tryoutId={params.id} plan={plan} harga={harga} hargaLabel={hargaLabel} started={started} selesai={selesai} initialStatus={initialStatus} variant="block" /></div>
          </div>
        </div>
      </div>
    </>
  );
}
