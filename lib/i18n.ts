import { cookies } from "next/headers";

export type Locale = "id" | "en";

export const DICT = {
  id: {
    // Topbar
    "topbar.search": "Cari materi, try out, atau topik…",
    "topbar.role.siswa": "Siswa",
    "topbar.role.staf": "Staf",
    "topbar.role.admin": "Admin",

    // Sidebar
    "nav.dashboard": "Dashboard",
    "nav.tryout": "Try Out",
    "nav.intelligence": "Academic Intelligence",
    "nav.navigator": "Academic Navigator",
    "nav.target": "Target Kampus",
    "nav.journey": "Academic Journey",
    "nav.learning": "Learning Center",
    "nav.achievement": "Achievement",
    "nav.bookmark": "Bookmark",
    "nav.notifikasi": "Notifikasi",
    "nav.profil": "Profil",
    "nav.upgrade": "Tingkatkan ke Albirru Pro",
    "nav.upgrade.desc": "Akses semua fitur premium untuk persiapan maksimal.",
    "nav.upgrade.btn": "Upgrade Sekarang",
    "nav.help": "Butuh bantuan?",
    "nav.help.sub": "Hubungi kami",
    "nav.collapse": "Perkecil",
    "nav.expand": "Perbesar",

    // Dashboard
    "dash.welcome": "Selamat datang kembali,",
    "dash.subtitle": "Terus konsisten, setiap langkah kecil membawamu lebih dekat ke impian.",

    // Profil
    "profil.title": "Profil",
    "profil.subtitle": "Kelola akun dan preferensimu.",
    "profil.subtitle.staf": "Kelola akun dan akses konsolmu.",
    "profil.info": "Informasi Akun",
    "profil.settings": "Pengaturan",
    "profil.settings.staf": "Akses Cepat",
    "profil.edit": "Edit Profil",
    "profil.stats": "Statistik Singkat",
    "profil.email": "Email",
    "profil.jenjang": "Jenjang",
    "profil.sekolah": "Asal Sekolah",
    "profil.target": "Target",
    "profil.role": "Role",
    "profil.institusi": "Institusi",
    "profil.notif": "Notifikasi",
    "profil.notif.desc": "Atur preferensi pemberitahuan",
    "profil.security": "Keamanan & Kata Sandi",
    "profil.security.desc": "Ubah kata sandi & keamanan akun",
    "profil.langganan": "Langganan",
    "profil.langganan.desc": "Kelola paket Albirru-mu",
    "profil.achievement": "Pencapaian",
    "profil.achievement.desc": "Lihat badge dan progres XP",
    "profil.siswa": "Manajemen Siswa",
    "profil.siswa.desc": "Kelola daftar dan data siswa",
    "profil.materi": "Materi & Konten",
    "profil.materi.desc": "Upload dan kelola materi ajar",
    "profil.tryout": "Try Out & Penugasan",
    "profil.tryout.desc": "Buat dan pantau try out",
    "profil.admin": "Panel Admin",
    "profil.admin.desc": "Kelola pengguna dan konfigurasi sistem",

    // Notifikasi
    "notif.title": "Notification Center",
    "notif.subtitle": "Semua informasi penting tentang aktivitas akademikmu.",
    "notif.all": "Semua",
    "notif.unread": "Belum Dibaca",
    "notif.important": "Penting",
    "notif.summary": "Ringkasan Notifikasi",
    "notif.prefs": "Preferensi Notifikasi",
    "notif.prefs.desc": "Atur jenis notifikasi yang ingin kamu terima.",
    "notif.manage": "Kelola Preferensi Lengkap",
    "notif.empty": "Tidak ada notifikasi pada filter ini.",
    "notif.viewall": "Lihat Semua Notifikasi",

    // Intelligence
    "intel.title": "Academic Intelligence",
    "intel.subtitle": "Profil akademikmu terus berkembang. Berikut analisis terbaru berdasarkan 12 Try Out dan 4.200 jawaban soal.",
    "intel.weekly": "Laporan Mingguan",
    "intel.weekly.desc": "Ringkasan progres, kekuatan, area perbaikan & proyeksi skor hari-H dari data nyatamu.",
    "intel.health": "Academic Health Score",
    "intel.growth": "Growth Trend",
    "intel.consistency": "Learning Consistency",
    "intel.readiness": "Target Readiness",
    "intel.dna": "Academic DNA",
    "intel.strengths": "Kekuatan Utama",
    "intel.improvements": "Area Perbaikan",
    "intel.progress": "Progress Intelligence",
    "intel.actions": "Intelligence Actions",
    "intel.actions.desc": "Pilih analisis yang ingin kamu dalami lebih lanjut.",

    // Common
    "common.pro": "Pro",
    "common.free": "Free",
    "common.close": "Tutup",
    "common.save": "Simpan",
    "common.cancel": "Batal",
    "common.loading": "Memuat…",
    "common.search": "Cari…",
    "common.notset": "Belum diatur",
  },
  en: {
    // Topbar
    "topbar.search": "Search materials, try outs, or topics…",
    "topbar.role.siswa": "Student",
    "topbar.role.staf": "Staff",
    "topbar.role.admin": "Admin",

    // Sidebar
    "nav.dashboard": "Dashboard",
    "nav.tryout": "Try Out",
    "nav.intelligence": "Academic Intelligence",
    "nav.navigator": "Academic Navigator",
    "nav.target": "Target University",
    "nav.journey": "Academic Journey",
    "nav.learning": "Learning Center",
    "nav.achievement": "Achievement",
    "nav.bookmark": "Bookmark",
    "nav.notifikasi": "Notifications",
    "nav.profil": "Profile",
    "nav.upgrade": "Upgrade to Albirru Pro",
    "nav.upgrade.desc": "Access all premium features for maximum preparation.",
    "nav.upgrade.btn": "Upgrade Now",
    "nav.help": "Need help?",
    "nav.help.sub": "Contact us",
    "nav.collapse": "Collapse",
    "nav.expand": "Expand",

    // Dashboard
    "dash.welcome": "Welcome back,",
    "dash.subtitle": "Stay consistent — every small step brings you closer to your goal.",

    // Profil
    "profil.title": "Profile",
    "profil.subtitle": "Manage your account and preferences.",
    "profil.subtitle.staf": "Manage your account and console access.",
    "profil.info": "Account Information",
    "profil.settings": "Settings",
    "profil.settings.staf": "Quick Access",
    "profil.edit": "Edit Profile",
    "profil.stats": "Quick Stats",
    "profil.email": "Email",
    "profil.jenjang": "Grade",
    "profil.sekolah": "School",
    "profil.target": "Target",
    "profil.role": "Role",
    "profil.institusi": "Institution",
    "profil.notif": "Notifications",
    "profil.notif.desc": "Set your notification preferences",
    "profil.security": "Security & Password",
    "profil.security.desc": "Change password & account security",
    "profil.langganan": "Subscription",
    "profil.langganan.desc": "Manage your Albirru plan",
    "profil.achievement": "Achievements",
    "profil.achievement.desc": "View badges and XP progress",
    "profil.siswa": "Student Management",
    "profil.siswa.desc": "Manage student list and data",
    "profil.materi": "Materials & Content",
    "profil.materi.desc": "Upload and manage learning materials",
    "profil.tryout": "Try Out & Assignments",
    "profil.tryout.desc": "Create and monitor try outs",
    "profil.admin": "Admin Panel",
    "profil.admin.desc": "Manage users and system configuration",

    // Notifikasi
    "notif.title": "Notification Center",
    "notif.subtitle": "All important updates about your academic activity.",
    "notif.all": "All",
    "notif.unread": "Unread",
    "notif.important": "Important",
    "notif.summary": "Notification Summary",
    "notif.prefs": "Notification Preferences",
    "notif.prefs.desc": "Set which notifications you want to receive.",
    "notif.manage": "Manage All Preferences",
    "notif.empty": "No notifications match this filter.",
    "notif.viewall": "View All Notifications",

    // Intelligence
    "intel.title": "Academic Intelligence",
    "intel.subtitle": "Your academic profile is growing. Here's the latest analysis from 12 Try Outs and 4,200 answers.",
    "intel.weekly": "Weekly Report",
    "intel.weekly.desc": "Summary of progress, strengths, areas for improvement & D-day score projection from your real data.",
    "intel.health": "Academic Health Score",
    "intel.growth": "Growth Trend",
    "intel.consistency": "Learning Consistency",
    "intel.readiness": "Target Readiness",
    "intel.dna": "Academic DNA",
    "intel.strengths": "Key Strengths",
    "intel.improvements": "Areas for Improvement",
    "intel.progress": "Progress Intelligence",
    "intel.actions": "Intelligence Actions",
    "intel.actions.desc": "Choose which analysis you want to explore further.",

    // Common
    "common.pro": "Pro",
    "common.free": "Free",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading…",
    "common.search": "Search…",
    "common.notset": "Not set",
  },
} as const;

export type DictKey = keyof (typeof DICT)["id"];

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  return c.get("locale")?.value === "en" ? "en" : "id";
}

export function t(locale: Locale, key: DictKey): string {
  return DICT[locale][key] ?? DICT.id[key] ?? key;
}
