# Albirru — Personal Academic Intelligence System (Web)

Landing page produksi untuk **Albirru**, hasil langkah **6 (Generate Code)** dari pipeline:
`Screenshot → UI Reverse Engineering → Design System → Component Library → React Architecture → Generate Code → Supabase → Production App`.

Dibangun mengikuti tiga dokumen sumber: **UI spec**, **design system**, dan **frontend architecture**.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · konvensi shadcn/ui
- **Ikon:** lucide-react · **Chart:** recharts
- **Render:** Server Components secara default; client hanya pada island interaktif (header drawer, carousel testimoni, chart).

---

## Prasyarat
- Node.js **18.18+** (disarankan 20+)
- npm / pnpm / yarn

## Menjalankan
```bash
npm install
npm run dev      # http://localhost:3000
```
Build produksi:
```bash
npm run build && npm run start
```

Skrip: `dev`, `build`, `start`, `lint`.

---

## Struktur folder
```
albirru-web/
├── app/
│   ├── layout.tsx           # root layout, font Plus Jakarta Sans, metadata
│   ├── page.tsx             # komposisi section halaman
│   └── globals.css          # design tokens (CSS variables) + base + utilities
├── components/
│   ├── ui/                  # primitif gaya shadcn (button, card, badge, progress)
│   ├── layout/              # container
│   ├── common/              # komponen reusable (logo, cards, monogram, dst.)
│   └── sections/            # header, hero/, features, stats, universities, conversion, footer
├── lib/
│   ├── content.ts           # SEMUA konten sebagai data bertipe (content-as-data)
│   ├── types.ts             # tipe konten
│   └── utils.ts             # cn()
├── tailwind.config.ts       # token → Tailwind theme
└── components.json          # konfigurasi shadcn/ui
```

## Design tokens
Semua warna/radius/shadow ada sebagai CSS variables di `app/globals.css` dan dipetakan ke Tailwind di `tailwind.config.ts` (lihat `albirru-design-system.md`). Contoh kelas: `bg-navy-900`, `text-brand`, `text-brand-300`, `rounded-xl` (=20px), `shadow-lg`, `text-display`, `text-h-xl`, `text-eyebrow`. **Tidak ada hex hardcoded** di komponen.

## Catatan shadcn/ui
Proyek ini memakai **konvensi & struktur shadcn** (CVA + `cn` + folder `components/ui`, plus `components.json`). Primitif ditulis ringan agar **langsung jalan tanpa CLI**. API/strukturnya kompatibel, jadi kamu bisa menimpa salah satunya dengan versi resmi:
```bash
npx shadcn@latest add button card badge progress
```
Variant brand (`primary`, `navy`, `inverse`, `secondary`, `ghostInverse`, `link`) tinggal dipindahkan ke file hasil CLI.

## Aset placeholder (WAJIB diganti)
Aku tidak punya aset asli Albirru, jadi ini placeholder yang harus ditukar dengan aset brand:
- **Foto** (siswi hero, grup di stats band, siswa di kartu daftar) → saat ini panel gradient (`.grad-photo`). Ganti dengan `next/image`.
- **Logo universitas** (UI, UGM, ITB, UNAIR, ITS, UNS) → saat ini monogram. Ganti dengan SVG crest resmi (perhatikan hak guna merek).
- **Avatar** (social proof + testimoni) → monogram inisial.

Selain aset, semua layout/tipografi/warna/spacing/komponen sudah sesuai spesifikasi.

## Aksesibilitas
Landmark semantik (`header`/`main`/`section`/`footer`), satu `h1` (headline hero), `aria-current` pada nav aktif, focus ring keyboard global, dots testimoni pakai `role="tablist"` + `aria-selected`, dan `prefers-reduced-motion` dihormati.

---

## Langkah berikutnya

### Langkah 7 — Integrasi Supabase
Halaman ini statis; Supabase masuk untuk **auth** dan **lead capture** (lalu, kalau lanjut ke produk, untuk data dashboard).
1. Buat project Supabase, simpan kredensial di `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
2. `npm i @supabase/supabase-js @supabase/ssr`
3. Tambahkan `lib/supabase/client.ts` (browser) & `lib/supabase/server.ts` (RSC/Server Actions).
4. **Lead capture:** form "Daftar Gratis" → Server Action `insert` ke tabel `leads(id, nama, email, asal_sekolah, created_at)`.
5. **Auth:** halaman `/masuk` & `/daftar` → Supabase Auth (email OTP / Google), middleware sesi via `@supabase/ssr`.
6. **Konten dinamis (opsional):** pindahkan `testimonials` / `stats` ke tabel Supabase, fetch di RSC saat build/request — komponen tidak berubah karena sudah `content-as-data`.

### Langkah 8 — Production App
Dua kemungkinan scope (perlu kita sepakati):
- **(a) Deploy landing + funnel:** halaman ini + auth + lead capture, deploy ke Vercel.
- **(b) Bangun produk aslinya:** dashboard yang ada di mockup hero (Prediksi Lolos, Academic Score, Try Out, Journey) sebagai app ber-auth penuh.

Deploy: hubungkan repo ke **Vercel**, set env vars Supabase, `vercel --prod`.

---

## Pondasi Supabase (Langkah 7a — sudah terpasang)
Lihat **`SUPABASE.md`** untuk setup. Ditambahkan: `lib/supabase/*`, `middleware.ts`, `lib/actions/leads.ts`, `supabase/schema.sql`, `.env.local.example`. Auth pages menyusul setelah contoh UI diberikan.
