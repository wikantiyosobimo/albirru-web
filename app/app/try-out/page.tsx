import Link from "next/link";
import {
  Calendar, Clock, HelpCircle, ShieldCheck, BarChart3, Clock4, Trophy,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { PortalTopbar } from "@/components/portal/topbar";
import { NavDropdown } from "@/components/portal/nav-dropdown";
import { TryoutCta, UpgradeBanner, type RegStatus } from "@/components/portal/tryout-cta";
import { SEGMENTS } from "@/lib/data/targets";
import { cn } from "@/lib/utils";

const JENIS_OPTS = [{ label: "Semua Jenis", value: "all" }, ...SEGMENTS.map((s) => ({ label: s.short, value: s.value }))];

export const metadata = { title: "Daftar Try Out — Albirru" };

type SStatus = "dibuka" | "bisa" | "selesai" | "datang";
type TryOut = {
  id: string; tileLabel: string; tileGrad: string;
  kategori: string; kbg: string; kfg: string;
  title: string; tanggal: string; waktu: string; soal: number;
  tags?: string[]; status: SStatus; harga: string; hargaNum: number; kategoriSlug: string; segment: string;
};

const TRYOUTS: TryOut[] = [
  { id: "snbt-06", tileLabel: "SIMULASI SNBT 2024", tileGrad: "from-[#6D49C9] to-[#3B1E78]", kategori: "Nasional", kbg: "#DCF5EA", kfg: "#16864F", title: "Simulasi SNBT Nasional 2024", tanggal: "25 Mei 2024", waktu: "07:30 - 11:45 WIB", soal: 240, tags: ["TPS", "Literasi", "Penalaran", "Matematika"], status: "dibuka", harga: "Rp 29.000", hargaNum: 29000, kategoriSlug: "snbt", segment: "utbk" },
  { id: "tps-mini-04", tileLabel: "MINI TRY OUT TPS", tileGrad: "from-[#2F5BFF] to-[#1B3FB0]", kategori: "Harian", kbg: "#EAF0FF", kfg: "#2F5BFF", title: "Mini Try Out TPS (20 soal)", tanggal: "Setiap Hari", waktu: "16:00 - 17:30 WIB", soal: 20, status: "bisa", harga: "Gratis", hargaNum: 0, kategoriSlug: "snbt", segment: "utbk" },
  { id: "literasi-03", tileLabel: "TRY OUT LITERASI", tileGrad: "from-[#16B47A] to-[#0B7A4F]", kategori: "Mingguan", kbg: "#DCF5EA", kfg: "#16864F", title: "Try Out Literasi", tanggal: "28 Mei 2024", waktu: "19:00 - 21:00 WIB", soal: 120, status: "dibuka", harga: "Rp 19.000", hargaNum: 19000, kategoriSlug: "literasi", segment: "utbk" },
  { id: "pm-02", tileLabel: "TRY OUT PENALARAN", tileGrad: "from-[#6D49C9] to-[#3B1E78]", kategori: "Mingguan", kbg: "#F3ECFF", kfg: "#6D49C9", title: "Try Out Penalaran", tanggal: "27 Mei 2024", waktu: "19:00 - 21:00 WIB", soal: 120, status: "dibuka", harga: "Rp 19.000", hargaNum: 19000, kategoriSlug: "penalaran", segment: "utbk" },
  { id: "fisika-01", tileLabel: "TRY OUT MAPEL FISIKA", tileGrad: "from-[#2F5BFF] to-[#1B3FB0]", kategori: "Mapel", kbg: "#EAF0FF", kfg: "#2F5BFF", title: "Try Out Fisika (Mandiri)", tanggal: "30 Mei 2024", waktu: "19:00 - 20:30 WIB", soal: 30, status: "datang", harga: "Rp 9.000", hargaNum: 9000, kategoriSlug: "mapel", segment: "mandiri" },
  { id: "cpns-01", tileLabel: "SKD CPNS NASIONAL", tileGrad: "from-[#16864F] to-[#0B4A2D]", kategori: "CPNS", kbg: "#DCF5EA", kfg: "#16864F", title: "Try Out SKD CPNS Nasional", tanggal: "2 Jun 2024", waktu: "08:00 - 09:40 WIB", soal: 110, tags: ["TWK", "TIU", "TKP"], status: "dibuka", harga: "Rp 25.000", hargaNum: 25000, kategoriSlug: "cpns", segment: "cpns" },
  { id: "kedinasan-01", tileLabel: "TRY OUT KEDINASAN SKD", tileGrad: "from-[#B7791F] to-[#7A4F0B]", kategori: "Kedinasan", kbg: "#FFF1DC", kfg: "#B7791F", title: "Try Out Sekolah Kedinasan (SKD)", tanggal: "4 Jun 2024", waktu: "08:00 - 09:40 WIB", soal: 110, tags: ["TWK", "TIU", "TKP"], status: "datang", harga: "Rp 20.000", hargaNum: 20000, kategoriSlug: "kedinasan", segment: "kedinasan" },
  { id: "snbt-05", tileLabel: "SIMULASI SNBT FULL TEST", tileGrad: "from-[#E8910B] to-[#B96A00]", kategori: "Premium", kbg: "#FFF1DC", kfg: "#B7791F", title: "Simulasi SNBT Full Test", tanggal: "5 Mei 2024", waktu: "07:30 - 12:00 WIB", soal: 240, status: "selesai", harga: "Rp 29.000", hargaNum: 29000, kategoriSlug: "snbt", segment: "utbk" },
];

const TABS = [
  { label: "Semua", slug: "" },
  { label: "Simulasi SNBT", slug: "snbt" },
  { label: "UTBK SNBT", slug: "utbk" },
  { label: "Try Out Literasi", slug: "literasi" },
  { label: "Try Out Penalaran", slug: "penalaran" },
  { label: "Try Out Mapel", slug: "mapel" },
  { label: "Lainnya", slug: "lainnya" },
];

const FEATURES = [
  { icon: ShieldCheck, color: "#16B47A", t: "Standar Nasional", d: "Soal disusun mengikuti standar UTBK/SNBT terbaru." },
  { icon: BarChart3, color: "#6D49C9", t: "Analisis Lengkap", d: "Dapatkan analisis mendalam setelah try out selesai." },
  { icon: Clock4, color: "#2F5BFF", t: "Simulasi Realistis", d: "Waktu, jumlah soal, dan sistem sama seperti ujian asli." },
  { icon: Trophy, color: "#E8910B", t: "Peringkat Nasional", d: "Lihat posisi kamu dibanding ribuan peserta lainnya." },
];

const STATUS: Record<SStatus, { label: string; bg: string; fg: string }> = {
  dibuka: { label: "Pendaftaran Dibuka", bg: "#DCF5EA", fg: "#16864F" },
  bisa: { label: "Bisa Dikerjakan", bg: "#EAF0FF", fg: "#2F5BFF" },
  selesai: { label: "Selesai", bg: "#EEF1F6", fg: "#64748B" },
  datang: { label: "Akan Datang", bg: "#FFF1DC", fg: "#B7791F" },
};

export default async function TryOutListPage({ searchParams }: { searchParams: { kategori?: string; biaya?: string; sort?: string; jenis?: string } }) {
  const { profile } = await getPortalProfile();
  const plan = profile?.plan ?? "free";
  const kategori = searchParams?.kategori ?? "";
  const biaya = searchParams?.biaya ?? "";
  const sort = searchParams?.sort ?? "";
  // Default tampilkan try out sesuai segment user; "all" untuk semua.
  const userSegment = profile?.segment ?? "utbk";
  const jenis = searchParams?.jenis ?? userSegment;

  let list = kategori ? TRYOUTS.filter((t) => t.kategoriSlug === kategori) : [...TRYOUTS];
  if (jenis !== "all") list = list.filter((t) => t.segment === jenis);
  if (biaya === "gratis") list = list.filter((t) => t.hargaNum === 0);
  if (biaya === "berbayar") list = list.filter((t) => t.hargaNum > 0);
  if (sort === "harga-rendah") list = [...list].sort((a, b) => a.hargaNum - b.hargaNum);
  if (sort === "harga-tinggi") list = [...list].sort((a, b) => b.hargaNum - a.hargaNum);
  if (sort === "soal") list = [...list].sort((a, b) => b.soal - a.soal);

  // Status pendaftaran user per try out.
  const supabase = await createClient();
  const { data: regs } = await supabase.from("tryout_registrations").select("tryout_id, status");
  const regMap = new Map<string, RegStatus>((regs ?? []).map((r) => [r.tryout_id, r.status as RegStatus]));

  return (
    <>
      <PortalTopbar title="Daftar Try Out" subtitle="Pilih try out yang ingin kamu ikuti dan tingkatkan skor terbaikmu." nama={profile?.nama ?? "Farhan"} />

      <div className="space-y-5 p-5 lg:p-7">
        {plan === "free" ? <UpgradeBanner /> : null}

        {/* TABS + FILTER */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => {
              const active = t.slug === kategori;
              return (
                <Link key={t.label} href={t.slug ? `/app/try-out?kategori=${t.slug}` : "/app/try-out"} className={cn("shrink-0 rounded-lg px-4 py-2 text-body-sm font-semibold transition-colors", active ? "bg-brand text-white" : "border bg-white text-ink-body hover:bg-muted")}>{t.label}</Link>
              );
            })}
          </div>
          <NavDropdown paramKey="jenis" align="right" options={JENIS_OPTS} defaultValue={userSegment} />
          <NavDropdown paramKey="biaya" align="right" options={[{ label: "Semua Biaya", value: "" }, { label: "Gratis", value: "gratis" }, { label: "Berbayar", value: "berbayar" }]} />
        </div>

        {/* FEATURE STRIP */}
        <div className="grid gap-px overflow-hidden rounded-2xl border bg-hair sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.t} className="flex items-start gap-3 bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${f.color}1A`, color: f.color }}><Icon size={20} /></span>
                <div><div className="text-body-sm font-bold text-ink">{f.t}</div><p className="mt-0.5 text-caption text-ink-muted">{f.d}</p></div>
              </div>
            );
          })}
        </div>

        {/* HEADER LIST */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-h-sm text-ink">{kategori ? TABS.find((t) => t.slug === kategori)?.label : "Semua Try Out"}</h2>
            <span className="rounded-md bg-muted px-2 py-0.5 text-caption font-semibold text-ink-muted">{list.length} Try Out</span>
          </div>
          <NavDropdown paramKey="sort" size="sm" align="right" options={[{ label: "Urutkan: Terbaru", value: "" }, { label: "Soal Terbanyak", value: "soal" }, { label: "Harga Terendah", value: "harga-rendah" }, { label: "Harga Tertinggi", value: "harga-tinggi" }]} />
        </div>

        {/* LIST */}
        <div className="divide-y rounded-2xl border bg-white">
          {list.length === 0 ? (
            <div className="p-10 text-center text-body-sm text-ink-muted">Tidak ada try out pada kategori ini.</div>
          ) : list.map((to) => {
            const st = STATUS[to.status];
            return (
              <div key={to.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br p-2 text-center text-[8px] font-extrabold uppercase leading-tight text-white", to.tileGrad)}>{to.tileLabel}</div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: to.kbg, color: to.kfg }}>{to.kategori}</span>
                    <Link href={`/app/try-out/${to.id}`} className="text-body-lg font-bold text-ink hover:text-brand">{to.title}</Link>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-muted">
                    <span className="flex items-center gap-1"><Calendar size={13} /> {to.tanggal}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {to.waktu}</span>
                    <span className="flex items-center gap-1"><HelpCircle size={13} /> {to.soal} Soal</span>
                  </div>
                  {to.tags ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {to.tags.map((tag) => <span key={tag} className="rounded-md border px-2 py-0.5 text-[11px] text-ink-body">{tag}</span>)}
                    </div>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center justify-between gap-5 lg:flex-col lg:items-end lg:justify-center">
                  <span className="rounded-md px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: st.bg, color: st.fg }}>{st.label}</span>
                  <span className="text-body-lg font-extrabold text-ink">{to.harga}</span>
                </div>
                <div className="shrink-0 lg:w-36 lg:text-right">
                  <TryoutCta
                    tryoutId={to.id} plan={plan} harga={to.hargaNum} hargaLabel={to.harga}
                    started={to.status === "bisa"} selesai={to.status === "selesai"}
                    initialStatus={regMap.get(to.id) ?? "none"}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-1.5">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-ink-body hover:bg-muted"><ChevronLeft size={16} /></button>
          {[1, 2, 3].map((p) => (
            <button key={p} className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-body-sm font-semibold transition-colors", p === 1 ? "bg-brand text-white" : "border bg-white text-ink-body hover:bg-muted")}>{p}</button>
          ))}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-ink-body hover:bg-muted"><ChevronRight size={16} /></button>
        </div>
      </div>
    </>
  );
}
