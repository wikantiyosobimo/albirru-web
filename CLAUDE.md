# Albirru Online — Context untuk Claude

Platform persiapan UTBK/SNBT. Baca file ini di awal setiap session sebelum mengerjakan halaman baru.

## Stack Teknis
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (token custom, lihat `tailwind.config.ts` & `app/globals.css`)
- Supabase (Auth + Postgres, RLS) — `lib/portal/session.ts` -> `getPortalProfile()`
- lucide-react untuk ikon, recharts untuk chart
- Deploy: Vercel

## Design System
- Font: **Plus Jakarta Sans** (`var(--font-jakarta)`, fallback sans-serif)
- Sumber kebenaran token: `albirru-design-system.md` (§1-7) — `tailwind.config.ts` & `app/globals.css` adalah implementasinya
- Warna (CSS vars di `app/globals.css`):
  - Navy: `--navy-700/800/900` (sidebar, dark surfaces)
  - Brand/blue: `--blue-100/300/400/500/600/700` → `bg-brand`, `text-brand`, `bg-brand-100`
  - Success: `--success-100/500/700` → `bg-success-subtle`, `text-success`, `text-success-strong`
  - Ink: `--ink-strong` (`text-ink`), `--ink-body` (`text-ink-body`), `--ink-muted` (`text-ink-muted`)
  - `--border` → `border-hair` / `bg-hair`
  - `--bg-canvas` → `bg-canvas`, `--bg-muted` → `bg-muted`
- Radius: `rounded-md/lg/xl/2xl` = 12/16/20/24px
- Shadow: `shadow-xs/sm/md/lg`
- Font size scale: `text-display`, `text-h-xl`, `text-h-md`, `text-h-sm`, `text-stat`, `text-body-lg`, `text-body`, `text-body-sm`, `text-label`, `text-eyebrow`, `text-caption`
- Gradient utilities: `.grad-card`, `.grad-photo`, `.grad-monogram`, `.blob`

### Komponen portal yang sudah ada (reuse, jangan duplikasi)
- `components/portal/sidebar.tsx` — `PortalSidebar`, nav utama `/app/*`
- `components/portal/topbar.tsx` — `PortalTopbar` (props: `eyebrow`, `title`, `subtitle`, `nama`, `right`)
- `components/portal/ring.tsx` — `Ring` (circular progress, props `value`, `size`, `stroke`, `color`)
- `components/portal/coming-soon.tsx` — `ComingSoon` (placeholder stub, props `note`)
- `components/ui/*` — `button`, `card`, `badge`, `accordion`, `progress`, `field`, `select-field`, `password-field`, `submit-button`
- `components/common/*` — `feature-card`, `icon-tile`, `stat-item`, `testimonial-card`, `trust-item`, `cta-card`, `eyebrow`, `logo`, `monogram`, `nav-link`, `university-card`
- Pola umum card: `rounded-2xl border bg-white p-5` (atau `p-6`)
- Pola heatmap/peta jawaban, ring progress, dan layout grid sudah ada contoh lengkap di `app/app/try-out/[id]/hasil/page.tsx`

## Halaman Selesai
**Marketing** (`app/(marketing)/`): Beranda, Produk, Harga, Try Out, Sekolah, Blog, Tentang (+ v2), Success Story (+ v2), FAQ, Kontak (form tersimpan ke tabel `contacts`)

**Auth & Onboarding**: `(auth)/daftar`, `(auth)/daftar/buat-akun`, `(auth)/masuk`, `app/onboarding`, `app/auth/callback`

**Portal** (`app/app/`):
- `page.tsx` — Dashboard
- `try-out/page.tsx`, `try-out/[id]/page.tsx`, `try-out/[id]/kerjakan/page.tsx`, `try-out/[id]/hasil/page.tsx`, `try-out/[id]/hasil/detail/page.tsx`
- `notifikasi/page.tsx`
- `achievement/page.tsx`

## Halaman Masih Stub (pakai `<ComingSoon />`)
- `app/app/intelligence/page.tsx` (Academic Intelligence)
- `app/app/navigator/page.tsx` (Academic Navigator)
- `app/app/target/page.tsx` (Target Kampus)
- `app/app/journey/page.tsx` (Academic Journey)
- `app/app/learning/page.tsx` (Learning Center)
- `app/app/bookmark/page.tsx` (Bookmark)
- `app/app/profil/page.tsx` (Profil)

Setiap stub sudah punya `PortalTopbar` dengan title/subtitle yang sesuai — tinggal isi body-nya.

## Instruksi Penting
- Saat user mengupload mockup/desain untuk halaman tertentu, hasil implementasi **harus pixel-faithful** terhadap mockup tersebut: layout, spacing, ukuran font, warna, dan komponen harus mengikuti mockup persis — gunakan token design system di atas untuk menerjemahkannya, jangan improvisasi tata letak sendiri.
- Tetap konsisten dengan pola yang sudah ada (struktur file, penggunaan `PortalTopbar`, `getPortalProfile`, gaya card) saat membangun halaman baru.
- Kunci jawaban & skoring HARUS di server (route handler/Edge Function), tidak pernah di klien.
- Jangan taruh `service_role key` Supabase di kode frontend.
