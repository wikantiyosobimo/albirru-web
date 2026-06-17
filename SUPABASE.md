# Pondasi Supabase — Langkah 7a (Lead Capture + Sesi)

Bagian backend yang sudah terpasang (independen UI). Auth pages menyusul setelah contoh UI-mu masuk.

## Yang sudah ada
- `lib/supabase/client.ts` — client browser (Client Components)
- `lib/supabase/server.ts` — client server (RSC / Server Actions)
- `lib/supabase/types.ts` — tipe `LeadRow` / `LeadInsert`
- `middleware.ts` — refresh sesi auth tiap request
- `lib/actions/leads.ts` — Server Action `createLead()` (validasi + insert)
- `supabase/schema.sql` — tabel `leads` + RLS (anon boleh insert, tidak boleh baca)
- `.env.local.example` — template environment

## Setup (5 langkah)
1. Buat project di https://supabase.com
2. **Settings → API** → salin `Project URL` & `anon public key`.
3. Copy env: `cp .env.local.example .env.local` lalu isi kedua nilai di atas.
4. **SQL Editor** → tempel isi `supabase/schema.sql` → **Run**.
5. Install dependency baru: `npm install` (sudah termasuk `@supabase/ssr` + `@supabase/supabase-js`).

## Menghubungkan form "Daftar Gratis"
Saat UI form-mu sudah ada, panggil action ini dari Client Component:

```tsx
"use client";
import { useState, useTransition } from "react";
import { createLead } from "@/lib/actions/leads";

// di dalam handler submit:
const res = await createLead({ nama, email, asal_sekolah });
if (res.ok) { /* sukses */ } else { /* tampilkan res.error */ }
```

## Keamanan
RLS aktif: kunci anon hanya bisa **insert** ke `leads`, **tidak bisa membaca**. Untuk dashboard internal yang membaca leads, buka policy `select` untuk role `authenticated` (lihat baris komentar di `schema.sql`).

## Belum dikerjakan (menunggu UI-mu)
- Halaman `/masuk` & `/daftar` (+ metode auth: email+password / magic link / Google)
- Route `/auth/callback` (kalau pakai magic link / OAuth)
- Proteksi route privat (kalau lanjut ke produk / langkah 8b)

---

## Auth (langkah a) — sudah terpasang
Halaman: `/masuk` (11), `/daftar` (12, pilih peran), `/daftar/buat-akun` (13, buat akun).
Backend: `lib/actions/auth.ts` (login/signup), `app/auth/callback/route.ts` (OAuth), `middleware.ts` (proteksi `/app` & `/staf`), tabel `profiles` + trigger di `schema.sql`.

### Setup di Supabase
1. **Authentication → Providers → Email**: aktifkan. Untuk dev cepat, **matikan "Confirm email"** agar signup langsung login (kalau dibiarkan ON, user harus verifikasi email dulu sebelum bisa masuk `/app`).
2. **Authentication → Providers → Google**: aktifkan, isi Client ID/Secret (dari Google Cloud Console).
3. **Authentication → URL Configuration → Redirect URLs**: tambahkan `http://localhost:3000/auth/callback` (dan domain produksi `/auth/callback`).
4. Jalankan ulang `supabase/schema.sql` (sudah termasuk `profiles` + trigger).

### Catatan
- **Metode auth** (dari UI): email + password + Google. Login menerima "Email atau Nomor HP" — saat ini diproses sebagai email; login nomor HP butuh Phone provider (menyusul).
- **Aset placeholder**: ilustrasi gunung/jalur/kampus & avatar 3D peran belum ada → panel kiri pakai gradient + ikon. Ganti dengan aset brand.
- **Belum termasuk**: langkah detail identitas/target (onboarding setelah signup) — sesuai catatanmu.
