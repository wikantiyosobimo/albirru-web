import Link from "next/link";
import {
  Mail, GraduationCap, School, Target, Gem, Bell, Shield, ChevronRight, Pencil, Award,
  Users, BookOpen, ClipboardList, Settings,
} from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { Monogram } from "@/components/common/monogram";
import { getLocale, t } from "@/lib/i18n";
import { LogoutButton } from "@/components/portal/logout-button";

export const metadata = { title: "Profil — Albirru" };

export default async function ProfilPage() {
  const { user, profile } = await getPortalProfile();
  const locale = await getLocale();
  const nama = profile?.nama ?? "Farhan";
  const role = profile?.role ?? "siswa";
  const isStaf = role === "staf" || role === "admin";
  const aparatur = profile?.segment === "cpns" || profile?.segment === "pppk";
  const target = aparatur
    ? [profile?.target_instansi, profile?.target_jabatan].filter(Boolean).join(" — ")
    : [profile?.target_kampus, profile?.target_prodi].filter(Boolean).join(" — ");
  const isPro = (profile?.plan ?? "free") !== "free";

  const identitasSiswa: { icon: typeof Mail; label: string; value: string }[] = [
    { icon: Mail, label: t(locale, "profil.email"), value: user?.email ?? "-" },
    { icon: GraduationCap, label: t(locale, "profil.jenjang"), value: profile?.jenjang ? `Kelas ${profile.jenjang}` : "-" },
    { icon: School, label: t(locale, "profil.sekolah"), value: profile?.asal_sekolah ?? "-" },
    { icon: Target, label: t(locale, "profil.target"), value: target || t(locale, "common.notset") },
  ];

  const identitasStaf: { icon: typeof Mail; label: string; value: string }[] = [
    { icon: Mail, label: t(locale, "profil.email"), value: user?.email ?? "-" },
    { icon: Shield, label: t(locale, "profil.role"), value: role === "admin" ? "Administrator" : "Tenaga Pengajar" },
    { icon: School, label: t(locale, "profil.institusi"), value: profile?.asal_sekolah ?? "-" },
  ];

  const identitas = isStaf ? identitasStaf : identitasSiswa;

  const settingsSiswa = [
    { icon: Bell, label: t(locale, "profil.notif"), desc: t(locale, "profil.notif.desc"), href: "/app/notifikasi" },
    { icon: Shield, label: t(locale, "profil.security"), desc: t(locale, "profil.security.desc"), href: "/app/profil/keamanan" },
    { icon: Gem, label: t(locale, "profil.langganan"), desc: t(locale, "profil.langganan.desc"), href: "/app/profil/langganan" },
    { icon: Award, label: t(locale, "profil.achievement"), desc: t(locale, "profil.achievement.desc"), href: "/app/achievement" },
  ];

  const settingsStaf = [
    { icon: Users, label: t(locale, "profil.siswa"), desc: t(locale, "profil.siswa.desc"), href: "/staf/siswa" },
    { icon: BookOpen, label: t(locale, "profil.materi"), desc: t(locale, "profil.materi.desc"), href: "/staf/materi" },
    { icon: ClipboardList, label: t(locale, "profil.tryout"), desc: t(locale, "profil.tryout.desc"), href: "/staf/try-out" },
    { icon: Shield, label: t(locale, "profil.security"), desc: t(locale, "profil.security.desc"), href: "/app/profil/keamanan" },
    ...(role === "admin" ? [{ icon: Settings, label: t(locale, "profil.admin"), desc: t(locale, "profil.admin.desc"), href: "/admin" }] : []),
  ];

  const settings = isStaf ? settingsStaf : settingsSiswa;

  return (
    <>
      <PortalTopbar
        title={t(locale, "profil.title")}
        subtitle={isStaf ? t(locale, "profil.subtitle.staf") : t(locale, "profil.subtitle")}
        nama={nama}
        role={role}
        right={<LogoutButton />}
      />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-7">
        <div className="space-y-5">
          {/* HEADER PROFIL */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border bg-white p-6 sm:flex-row sm:items-center">
            <Monogram label={nama[0]?.toUpperCase() ?? "S"} size={84} />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-h-md text-ink">{nama}</h2>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  role === "admin" ? "bg-[#F2EBFF] text-[#6D49C9]"
                  : role === "staf" ? "bg-[#E9F9F1] text-[#16B47A]"
                  : isPro ? "bg-brand-100 text-brand"
                  : "bg-muted text-ink-muted"
                }`}>
                  {role === "admin" ? "Admin" : role === "staf" ? "Staf" : isPro ? "Pro" : "Free"}
                </span>
              </div>
              <p className="mt-0.5 text-body-sm text-ink-muted">{user?.email}</p>
            </div>
            <Link href="/app/profil/edit" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><Pencil size={15} /> {t(locale, "profil.edit")}</Link>
          </div>

          {/* IDENTITAS */}
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="text-h-sm text-ink">{t(locale, "profil.info")}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {identitas.map((i) => {
                const Icon = i.icon;
                return (
                  <div key={i.label} className="flex items-start gap-3 rounded-xl border p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={17} /></span>
                    <div className="min-w-0"><div className="text-caption text-ink-muted">{i.label}</div><div className="truncate text-body-sm font-semibold text-ink">{i.value}</div></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PENGATURAN */}
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="text-h-sm text-ink">{isStaf ? t(locale, "profil.settings.staf") : t(locale, "profil.settings")}</h3>
            <div className="mt-3 divide-y">
              {settings.map((s) => {
                const Icon = s.icon;
                return (
                  <Link key={s.label} href={s.href} className="flex items-center gap-3 py-3 transition-colors hover:bg-muted">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-ink-body"><Icon size={17} /></span>
                    <div className="min-w-0 flex-1"><div className="text-body-sm font-semibold text-ink">{s.label}</div><div className="text-caption text-ink-muted">{s.desc}</div></div>
                    <ChevronRight size={16} className="shrink-0 text-ink-muted" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-5">
          {isStaf ? (
            <div className="rounded-2xl border border-[#6D49C9]/20 bg-[#F2EBFF] p-5">
              <div className="flex items-center gap-2 text-ink"><Shield size={18} className="text-[#6D49C9]" /><span className="text-body-sm font-bold">Akses {role === "admin" ? "Admin" : "Staf"}</span></div>
              <p className="mt-1.5 text-caption text-ink-body">
                {role === "admin" ? "Kamu memiliki akses penuh ke seluruh sistem Albirru." : "Kamu memiliki akses ke portal manajemen kelas dan konten."}
              </p>
              <Link href={role === "admin" ? "/admin" : "/staf"}
                className="mt-3 flex h-10 items-center justify-center rounded-lg bg-[#6D49C9] text-body-sm font-semibold text-white">
                Buka Konsol {role === "admin" ? "Admin" : "Staf"}
              </Link>
            </div>
          ) : !isPro ? (
            <div className="rounded-2xl border border-brand/30 bg-brand-100 p-5">
              <div className="flex items-center gap-2 text-ink"><Gem size={18} className="text-brand" /><span className="text-body-sm font-bold">Albirru Pro</span></div>
              <p className="mt-1.5 text-caption text-ink-body">Akses semua try out & soal tanpa batas, plus analisis premium.</p>
              <Link href="/harga" className="mt-3 flex h-10 items-center justify-center rounded-lg bg-brand text-body-sm font-semibold text-white">Upgrade Sekarang</Link>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-5 text-center">
              <Gem size={28} className="mx-auto text-brand" />
              <div className="mt-2 text-body-sm font-bold text-ink">Kamu Pengguna Pro 🎉</div>
              <p className="mt-1 text-caption text-ink-muted">Nikmati akses tak terbatas ke semua fitur.</p>
            </div>
          )}

          {!isStaf && (
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="text-body-lg font-bold text-ink">{t(locale, "profil.stats")}</h3>
              <div className="mt-3 space-y-3 text-body-sm">
                {[["Try Out Diikuti", "12"], ["Skor Tertinggi", "780"], ["Streak Belajar", "41 hari"]].map((r) => (
                  <div key={r[0]} className="flex items-center justify-between"><span className="text-ink-muted">{r[0]}</span><span className="font-bold text-ink">{r[1]}</span></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
