import {
  Brain,
  Navigation,
  FileText,
  BarChart3,
  Trophy,
  Users,
  Building2,
  TrendingUp,
  LayoutDashboard,
  ClipboardList,
  Compass,
  BookOpen,
  Route,
  Calendar,
  User,
  ListChecks,
  Headset,
  BadgeCheck,
  Target,
} from "lucide-react";
import type {
  NavItem,
  FeatureItem,
  StatItem,
  UniversityItem,
  Testimonial,
  TrustItem,
  SidebarItem,
  ScheduleItem,
  SubjectProgress,
} from "@/lib/types";

export const NAV: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Produk & Fitur", href: "/produk" },
  { label: "Try Out Nasional", href: "/try-out" },
  { label: "Untuk Sekolah", href: "/sekolah" },
  { label: "Blog", href: "/blog" },
  {
    label: "Tentang Kami",
    href: "/tentang",
    children: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Success Story", href: "/success-story" },
      { label: "FAQ", href: "/faq" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
];

export const FEATURES: FeatureItem[] = [
  { id: "ai", icon: Brain, title: "Academic Intelligence", description: "AI menganalisis kekuatan & kelemahanmu secara mendalam." },
  { id: "navigator", icon: Navigation, title: "Personalized Navigator", description: "Panduan belajar personal menuju kampus impianmu." },
  { id: "tryout", icon: FileText, title: "Try Out Berkualitas", description: "Soal setara UTBK-SNBT terbaru dan paling relevan." },
  { id: "analisis", icon: BarChart3, title: "Analisis Mendalam", description: "Bukan hanya nilai, tapi insight yang membuatmu naik level." },
  { id: "journey", icon: Trophy, title: "Journey Terukur", description: "Pantau perkembanganmu setiap hari sampai mencapai target." },
];

export const STATS: StatItem[] = [
  { id: "siswa", icon: Users, value: "120.000+", label: "Siswa Aktif" },
  { id: "sekolah", icon: Building2, value: "1.200+", label: "Sekolah Mitra" },
  { id: "soal", icon: FileText, value: "2.500.000+", label: "Pengerjaan Soal" },
  { id: "naik", icon: TrendingUp, value: "85%", label: "Siswa Naik Skor" },
];

export const UNIVERSITIES: UniversityItem[] = [
  { id: "ui", abbr: "UI", name: "Universitas Indonesia" },
  { id: "ugm", abbr: "UGM", name: "Universitas Gadjah Mada" },
  { id: "itb", abbr: "ITB", name: "Institut Teknologi Bandung" },
  { id: "unair", abbr: "UNAIR", name: "Universitas Airlangga" },
  { id: "its", abbr: "ITS", name: "Institut Teknologi Sepuluh Nopember" },
  { id: "uns", abbr: "UNS", name: "Universitas Sebelas Maret" },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: "fikri", quote: "Albirru membantu saya memahami kelemahan dengan tepat. Skor UTBK saya naik 180 poin dan akhirnya lolos di kampus impian!", author: "M. Fikri Ramadan", program: "Teknik Informatika – ITB 2024" },
  { id: "nadia", quote: "Analisisnya benar-benar personal. Saya jadi tahu harus fokus ke mana setiap minggu, bukan sekadar latihan soal asal banyak.", author: "Nadia Salsabila", program: "Kedokteran – UNAIR 2024" },
  { id: "rizky", quote: "Try out-nya terasa seperti UTBK asli. Latihan rutin tiap pekan bikin saya jauh lebih siap dan tenang di hari-H.", author: "Rizky Pratama", program: "Teknik Industri – ITS 2025" },
  { id: "aisyah", quote: "Dari ragu jadi yakin. Journey-nya membuat progres saya kelihatan jelas tiap hari sampai akhirnya tembus pilihan pertama.", author: "Aisyah Putri", program: "Psikologi – UGM 2025" },
];

export const TRUST: TrustItem[] = [
  { id: "soal", icon: BadgeCheck, label: "Soal Berkualitas Setara UTBK" },
  { id: "analisis", icon: Target, label: "Analisis Akurat & Personal" },
  { id: "metode", icon: ListChecks, label: "Metode Belajar Terstruktur" },
  { id: "dukungan", icon: Headset, label: "Dukungan Tim Ahli" },
];

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "tryout", icon: ClipboardList, label: "Try Out" },
  { id: "navigator", icon: Compass, label: "Academic Navigator" },
  { id: "learning", icon: BookOpen, label: "Learning Center" },
  { id: "journey", icon: Route, label: "Journey" },
  { id: "kalender", icon: Calendar, label: "Kalender" },
  { id: "profil", icon: User, label: "Profil" },
];

export const SCORE_SERIES = [40, 44, 43, 50, 54, 58, 66, 72].map((v, i) => ({ i, v }));

export const SCHEDULE: ScheduleItem[] = [
  { id: "s1", time: "16.00 - 17.30", subject: "Matematika", topic: "Limit Fungsi", color: "#2f5bff" },
  { id: "s2", time: "19.00 - 20.30", subject: "Literasi", topic: "Inferensi Teks", color: "#16b47a" },
];

export const PROGRESS: SubjectProgress[] = [
  { id: "p1", label: "Literasi", value: 75 },
  { id: "p2", label: "Penalaran Umum", value: 68 },
  { id: "p3", label: "Matematika", value: 60 },
  { id: "p4", label: "Pengetahuan Kuantitatif", value: 80 },
];

export const MOCKUP = {
  greeting: { name: "Aisyah", subtitle: "Semangat belajar hari ini!" },
  prediction: { program: "Psikologi UGM", percentage: 78, target: "650+", current: "510" },
  score: { value: 72, max: 100 },
};
