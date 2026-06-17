# Deploy Albirru Online — dari kode ke aplikasi sungguhan

Stack: **Next.js 14 (App Router) + Supabase (Auth + Postgres) + Vercel (hosting)**.
Alur target: pengunjung buka situs → daftar/masuk → onboarding → portal `/app`. Form Kontak tersimpan ke database.

---

## 0. Prasyarat
- **Node.js 18.18+** (cek: `node -v`)
- Akun **GitHub**, **Supabase** (gratis), **Vercel** (gratis)
- Untuk login Google: akun **Google Cloud Console**

---

## 1. Jalankan dulu di lokal (wajib, untuk memastikan jalan)
```bash
unzip albirru-web.zip && cd albirru-web
npm install
cp .env.local.example .env.local   # isi nilainya setelah langkah 2
npm run dev                         # buka http://localhost:3000
```
Tanpa env Supabase yang benar, halaman publik tetap tampil, tapi daftar/masuk/kontak belum berfungsi.

---

## 2. Siapkan Supabase (database + auth)
1. Buka https://supabase.com → **New project**. Catat **Database password**.
2. **Project Settings → API**, salin:
   - `Project URL`  → jadi `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public`  → jadi `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   Tempel keduanya ke `.env.local`.
3. **SQL Editor → New query** → tempel seluruh isi `supabase/schema.sql` → **Run**.
   Ini membuat tabel `leads`, `profiles` (+ trigger auto-buat profil saat user daftar), `contacts`, kolom onboarding, dan aturan keamanan (RLS).
4. **Authentication → Providers → Email**: aktifkan.
   - Untuk testing cepat: matikan **Confirm email** (Auth → Providers → Email → "Confirm email" off) agar bisa langsung login.
   - Untuk produksi: nyalakan kembali dan atur SMTP (Auth → Emails) supaya email verifikasi terkirim.
5. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (nanti diganti domain produksi)
   - **Redirect URLs**: tambahkan `http://localhost:3000/auth/callback`

### Login Google (opsional tapi ada tombolnya)
6. Google Cloud Console → buat **OAuth Client ID** (tipe Web). Di **Authorized redirect URI** isi:
   `https://<PROJECT-REF>.supabase.co/auth/v1/callback`
7. Supabase → **Authentication → Providers → Google**: aktifkan, tempel **Client ID & Secret**.
8. Tambahkan juga `http://localhost:3000/auth/callback` (dan nanti domain produksi) ke **Redirect URLs** Supabase.

Sekarang `npm run dev` lalu uji: **Daftar → Onboarding → /app**, dan kirim **form Kontak** (cek tabel `contacts` di Supabase → Table Editor).

---

## 3. Naikkan ke GitHub
```bash
git init
git add .
git commit -m "Albirru Online: situs publik + auth + onboarding"
git branch -M main
git remote add origin https://github.com/<user>/albirru-web.git
git push -u origin main
```
Pastikan `.env.local` **tidak** ikut ter-commit (sudah di `.gitignore`).

---

## 4. Deploy ke Vercel
1. https://vercel.com → **Add New → Project** → import repo GitHub tadi.
2. Framework otomatis terdeteksi **Next.js**. Build command `next build`, output default — biarkan.
3. **Environment Variables**, tambahkan (untuk Production & Preview):
   - `NEXT_PUBLIC_SUPABASE_URL` = (URL Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon key)
4. **Deploy**. Selesai → dapat domain `https://albirru-web.vercel.app`.

### Sambungkan balik domain produksi ke Supabase
5. Supabase → **Authentication → URL Configuration**:
   - **Site URL** → `https://albirru-web.vercel.app` (atau domain kustommu)
   - **Redirect URLs** → tambah `https://albirru-web.vercel.app/auth/callback`
6. Kalau pakai Google: tambahkan domain produksi yang sama di Redirect URLs Supabase.

---

## 5. Domain kustom (opsional)
Vercel → **Settings → Domains** → tambah domain (mis. `albirru.id`), ikuti instruksi DNS.
Setelah aktif, ganti **Site URL** + **Redirect URLs** di Supabase ke domain itu.

---

## 6. Checklist setelah live
- [ ] Halaman publik tampil (Beranda, Produk, Try Out, Sekolah, Blog, Tentang, Success Story, FAQ, Kontak)
- [ ] **Daftar** akun baru → diarahkan ke **/onboarding** → isi → masuk **/app**
- [ ] **Masuk** akun lama langsung ke /app (kalau onboarding sudah selesai)
- [ ] Akses `/app` tanpa login → dilempar ke `/masuk`
- [ ] **Form Kontak** menulis baris ke tabel `contacts`
- [ ] Login Google berhasil (jika diaktifkan)

---

## 7. Catatan teknis penting
- **Kunci jawaban & skoring** nantinya WAJIB di server (Edge Function/route server), jangan pernah di klien — sesuai arsitektur Assessment Engine.
- `anon key` aman dipakai di browser; keamanan data dijaga oleh **RLS** (sudah diset di `schema.sql`). Jangan pernah menaruh **service_role key** di kode frontend.
- Aset placeholder (foto, ilustrasi 3D, peta) tinggal di-swap di komponen terkait tanpa mengubah layout.
- Update berikutnya cukup `git push` → Vercel auto-deploy.

---

## 8. ADDENDUM Fase 3 — Portal Staf/Admin, AI, Pembayaran, Peringkat

### 8.1 Migration & seed tambahan (SQL Editor, urut)
1. `supabase/schema.sql` — engine try out (bila belum).
2. Migration Fase 3A (tabel PRD lengkap) — sudah diterapkan di project ref `lhygzydpmjamrzdtewxa`.
3. `supabase/seed-fase3.sql` — taksonomi `topics` + bank `questions` contoh (12 soal).
4. `supabase/migration-leaderboard.sql` — RPC papan peringkat realtime + masking nama.

### 8.2 Environment Variables tambahan (Vercel)
| Key | Wajib? | Fungsi |
|-----|--------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | untuk webhook | Bypass RLS — HANYA dipakai `/api/webhooks/midtrans`. ⚠️ rahasia. |
| `ANTHROPIC_API_KEY` | opsional | Laporan AI (Tier 3). Tanpa ini → fallback ringkasan deterministik. |
| `MIDTRANS_SERVER_KEY` + `MIDTRANS_ENV` | opsional | Pembayaran nyata. Tanpa ini → simulasi QRIS. |
| `RESEND_API_KEY` | opsional | Email transaksional. Tanpa ini → no-op (dilewati). |

> ❌ JANGAN set `DEV_FAKE_AUTH` / `DEV_FAKE_ROLE` di produksi (keduanya hanya untuk preview lokal).

### 8.3 Aktivasi fitur di Supabase
- **Realtime papan peringkat:** Database → Replication → tambahkan `public.tryout_attempts` ke publication `supabase_realtime`.
- **Webhook Midtrans (jika live):** dashboard Midtrans → Payment Notification URL → `https://<app>.vercel.app/api/webhooks/midtrans`.
- **Role staf/admin:** set kolom `profiles.role` = `staf` atau `admin` (via `/admin/pengguna` setelah ada 1 admin, atau manual di Table Editor). `/staf` butuh staf|admin, `/admin` butuh admin (dijaga middleware + layout).

### 8.4 Region
`vercel.json` mengunci region **`sin1` (Singapore)** agar dekat dengan Supabase `ap-southeast-1`.

### 8.5 Verifikasi fitur baru
- [ ] Kerjakan try out → Hasil → **Unduh PDF** (`/api/pdf/hasil`) & **Lihat Peringkat** (live).
- [ ] Navigator → **Buat Rekomendasi AI**; Journey/Misi → **Generate Misi AI**; Intelligence → **Laporan Mingguan**.
- [ ] Login admin → `/admin` (dashboard, pengguna, bank-soal, dst); login staf → `/staf`.
