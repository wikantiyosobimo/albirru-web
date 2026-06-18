import {
  Trophy, CheckCircle2, Calendar, Star, BarChart3, Medal, Bell, Filter,
  Megaphone, Target, ClipboardList, Settings, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { NavDropdown } from "@/components/portal/nav-dropdown";
import { cn } from "@/lib/utils";

type Notif = { icon: typeof Trophy; color: string; title: string; penting?: boolean; sub: string; time: string; unread: boolean; kat: string };
const ITEMS: Notif[] = [
  { icon: Trophy, color: "#6D49C9", title: "Skor Try Out kamu meningkat!", penting: true, sub: "Selamat! Skor TPS kamu naik 41 poin dari try out sebelumnya.", time: "7 menit lalu", unread: true, kat: "pencapaian" },
  { icon: CheckCircle2, color: "#16B47A", title: "Misi harian berhasil diselesaikan", sub: "Kamu mendapatkan 30 poin konsistensi.", time: "1 jam lalu", unread: true, kat: "pencapaian" },
  { icon: Calendar, color: "#2F5BFF", title: "Jadwal Try Out Besok", sub: "Mini Try Out TPS (20 soal) akan dimulai besok 16:00 - 17:00 WIB", time: "3 jam lalu", unread: true, kat: "jadwal" },
  { icon: Star, color: "#E8910B", title: "Laporan Mingguan Tersedia", sub: "Lihat perkembangan akademikmu minggu ini.", time: "5 jam lalu", unread: true, kat: "rekomendasi" },
  { icon: BarChart3, color: "#6D49C9", title: "Rekomendasi Baru Untukmu", sub: "Kami menambahkan 3 latihan baru sesuai kelemahanmu.", time: "6 jam lalu", unread: true, kat: "rekomendasi" },
  { icon: Medal, color: "#2F5BFF", title: "Pencapaian Baru Diraih 🏅", sub: "Selamat! Kamu telah menyelesaikan 50 soal hari ini.", time: "1 hari lalu", unread: false, kat: "pencapaian" },
];

const TABS = [{ label: "Semua", value: "" }, { label: "Belum Dibaca", value: "unread" }, { label: "Penting", value: "penting" }];

const SUMMARY = [
  { icon: Bell, color: "#2F5BFF", value: "4", label: "Belum Dibaca" },
  { icon: Star, color: "#E8910B", value: "2", label: "Penting" },
  { icon: CheckCircle2, color: "#16B47A", value: "12", label: "Hari Ini" },
  { icon: Calendar, color: "#6D49C9", value: "28", label: "Minggu Ini" },
];

const PREFS = [
  { icon: Megaphone, color: "#2F5BFF", title: "Informasi Try Out", sub: "Jadwal, pengingat, dan hasil try out", on: true },
  { icon: Target, color: "#16B47A", title: "Misi & Aktivitas", sub: "Misi harian, poin, dan pencapaian", on: true },
  { icon: ClipboardList, color: "#E8910B", title: "Rekomendasi & Insight", sub: "Rekomendasi belajar dan laporan", on: true },
  { icon: Calendar, color: "#6D49C9", title: "Jadwal & Pengingat", sub: "Pengingat jadwal dan deadline", on: true },
  { icon: Megaphone, color: "#94A3B8", title: "Promo & Info Produk", sub: "Info produk dan penawaran spesial", on: false },
];

function Toggle({ on }: { on?: boolean }) {
  return (
    <span className={cn("relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors", on ? "bg-brand" : "bg-hair")}>
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
    </span>
  );
}

export default async function NotifikasiPage({ searchParams }: { searchParams: { f?: string; kat?: string } }) {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";
  const f = searchParams?.f ?? "";
  const kat = searchParams?.kat ?? "";

  let items = ITEMS;
  if (f === "unread") items = items.filter((n) => n.unread);
  if (f === "penting") items = items.filter((n) => n.penting);
  if (kat) items = items.filter((n) => n.kat === kat);

  return (
    <>
      <PortalTopbar title="Notification Center" subtitle="Semua informasi penting tentang aktivitas akademikmu." nama={nama}
        right={<div className="relative hidden md:block"><Bell size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" /><input aria-label="Cari notifikasi" className="h-10 w-64 rounded-lg border bg-muted pl-10 pr-4 text-body-sm text-ink placeholder:text-ink-muted" placeholder="Cari notifikasi…" /></div>} />

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px] lg:p-7">
        {/* LIST */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              {TABS.map((t) => {
                const qs = new URLSearchParams();
                if (t.value) qs.set("f", t.value);
                if (kat) qs.set("kat", kat);
                const href = qs.toString() ? `/app/notifikasi?${qs}` : "/app/notifikasi";
                return <Link key={t.label} href={href} className={cn("rounded-lg px-4 py-2 text-body-sm font-medium transition-colors", t.value === f ? "bg-brand text-white" : "border bg-white text-ink-body hover:bg-muted")}>{t.label}</Link>;
              })}
            </div>
            <Suspense><NavDropdown paramKey="kat" icon={Filter} align="right" options={[{ label: "Semua Kategori", value: "" }, { label: "Pencapaian", value: "pencapaian" }, { label: "Jadwal", value: "jadwal" }, { label: "Rekomendasi", value: "rekomendasi" }]} /></Suspense>
          </div>

          <div className="divide-y rounded-2xl border bg-white">
            {items.length === 0 ? <div className="p-10 text-center text-body-sm text-ink-muted">Tidak ada notifikasi pada filter ini.</div> : null}
            {items.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.title} className="flex items-start gap-3.5 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: n.color }}><Icon size={20} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm font-bold text-ink">{n.title}</span>
                      {n.penting ? <span className="rounded-md bg-[#FCE4E4] px-1.5 py-0.5 text-[10px] font-bold text-[#B4282C]">Penting</span> : null}
                    </div>
                    <p className="mt-0.5 text-body-sm text-ink-muted">{n.sub}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-caption text-ink-muted">{n.time}</span>
                    {n.unread ? <span className="h-2.5 w-2.5 rounded-full bg-brand" /> : <span className="h-2.5 w-2.5 rounded-full border border-hair" />}
                  </div>
                </div>
              );
            })}
            <div className="p-4 text-center"><span className="text-body-sm font-semibold text-brand">Lihat Semua Notifikasi</span></div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-h-sm text-ink">Ringkasan Notifikasi</h2>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {SUMMARY.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-xl border p-3 text-center">
                    <Icon size={20} className="mx-auto" style={{ color: s.color }} />
                    <div className="mt-1.5 text-h-md text-ink">{s.value}</div>
                    <div className="text-[10px] leading-tight text-ink-muted">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-h-sm text-ink">Preferensi Notifikasi</h2>
            <p className="mt-1 text-caption text-ink-muted">Atur jenis notifikasi yang ingin kamu terima.</p>
            <div className="mt-4 divide-y">
              {PREFS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${p.color}1A`, color: p.color }}><Icon size={16} /></span>
                    <div className="min-w-0 flex-1"><div className="text-body-sm font-semibold text-ink">{p.title}</div><div className="text-caption text-ink-muted">{p.sub}</div></div>
                    <Toggle on={p.on} />
                  </div>
                );
              })}
            </div>
            <Link href="/app/profil" className="mt-3 flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-body-sm font-semibold text-ink transition-colors hover:bg-hair"><span className="flex items-center gap-2"><Settings size={16} /> Kelola Preferensi Lengkap</span><ChevronRight size={16} /></Link>
          </div>
        </div>
      </div>
    </>
  );
}
