-- ═══════════════════════════════════════════════════════════
-- FIX KRITIS: "infinite recursion detected in policy for relation profiles" (42P17)
-- (sudah diterapkan via MCP migration: fix_profiles_rls_infinite_recursion)
--
-- GEJALA: setiap user (admin/staf/siswa) setelah login selalu nyangkut di /onboarding,
--   meski onboarding_done=true di DB.
--
-- AKAR MASALAH: policy role-isolation pada tabel `profiles` (dari commit 87fa274)
--   men-subquery `FROM profiles` DI DALAM policy `profiles` itu sendiri:
--     EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND role IN ('admin','staf'))
--   Evaluasi subquery itu memicu policy SELECT profiles lagi → rekursi tak terbatas.
--   Akibatnya PostgREST mengembalikan ERROR (bukan data) saat user membaca profilnya,
--   sehingga `profile` = null → `!profile?.onboarding_done` true → redirect /onboarding,
--   dan halaman onboarding pun gagal baca profil → render form → STUCK.
--
-- SOLUSI: gunakan helper SECURITY DEFINER `public.current_role()` yang membaca role
--   TANPA tunduk RLS (jadi tidak rekursi). Definisi helper:
--     create function public.current_role() returns text language sql stable security definer
--     set search_path=public as $$ select coalesce((select role from public.profiles
--       where id = auth.uid()), 'anon') $$;
-- ═══════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "admin read all profiles" ON public.profiles;
CREATE POLICY "admin read all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (
    auth.uid() = id
    OR public.current_role() = ANY (ARRAY['admin','staf'])
  );

DROP POLICY IF EXISTS "admin update profiles" ON public.profiles;
CREATE POLICY "admin update profiles" ON public.profiles FOR UPDATE TO authenticated
  USING (
    auth.uid() = id
    OR public.current_role() = 'admin'
  );

-- Verifikasi: admin baca semua profil, siswa hanya miliknya (isolasi role terjaga).
