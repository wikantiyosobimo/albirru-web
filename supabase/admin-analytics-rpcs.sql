-- ═══════════════════════════════════════════════════════════
-- ANALITIK ADMIN — kesehatan pipeline soal + funnel konversi
-- (diterapkan via MCP migration: admin_content_health_and_funnel)
-- Pola sama dgn RPC admin lain: SECURITY DEFINER, cek role 'admin' internal,
-- REVOKE dari public/anon, GRANT ke authenticated. Tak ada data sensitif balik ke klien.
-- ═══════════════════════════════════════════════════════════

-- Kesehatan bank soal: distribusi per mapel & tingkat, plus flag kualitas.
CREATE OR REPLACE FUNCTION public.admin_content_health()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_res jsonb;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller <> 'admin' THEN RAISE EXCEPTION 'forbidden'; END IF;

  SELECT jsonb_build_object(
    'total',           (SELECT count(*) FROM questions),
    'aktif',           (SELECT count(*) FROM questions WHERE aktif),
    'nonaktif',        (SELECT count(*) FROM questions WHERE NOT aktif),
    'tanpa_pembahasan',(SELECT count(*) FROM questions WHERE aktif AND coalesce(trim(pembahasan),'') = ''),
    'tanpa_topik',     (SELECT count(*) FROM questions WHERE aktif AND topic_id IS NULL),
    'per_mapel', coalesce((
      SELECT jsonb_agg(x ORDER BY x->>'mapel')
      FROM (SELECT jsonb_build_object('mapel', coalesce(nullif(trim(mapel),''),'Lainnya'),
                   'total', count(*), 'aktif', count(*) FILTER (WHERE aktif)) AS x
            FROM questions GROUP BY coalesce(nullif(trim(mapel),''),'Lainnya')) s
    ), '[]'::jsonb),
    'per_level', coalesce((
      SELECT jsonb_agg(jsonb_build_object('level', lvl, 'jml', jml) ORDER BY lvl)
      FROM (SELECT coalesce(level_kesulitan,0) AS lvl, count(*) AS jml
            FROM questions WHERE aktif GROUP BY coalesce(level_kesulitan,0)) s
    ), '[]'::jsonb)
  ) INTO v_res;
  RETURN v_res;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_content_health() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_content_health() TO authenticated;

-- Funnel: Daftar (siswa) → Aktivasi (≥1 tryout_attempt) → Pro (subscription active).
-- Fallback ke profiles.plan != 'free' jika subscriptions belum dipakai.
CREATE OR REPLACE FUNCTION public.admin_conversion_funnel()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_siswa int; v_aktivasi int; v_pro int; v_pendapatan bigint;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller <> 'admin' THEN RAISE EXCEPTION 'forbidden'; END IF;

  SELECT count(*) INTO v_siswa FROM profiles WHERE role = 'siswa';
  SELECT count(DISTINCT a.user_id) INTO v_aktivasi
  FROM tryout_attempts a JOIN profiles p ON p.id = a.user_id AND p.role = 'siswa';
  SELECT count(DISTINCT user_id) INTO v_pro
  FROM subscriptions WHERE status = 'active' AND (berakhir_at IS NULL OR berakhir_at > now());
  IF v_pro = 0 THEN
    SELECT count(*) INTO v_pro FROM profiles WHERE role = 'siswa' AND plan <> 'free';
  END IF;
  SELECT coalesce(sum(harga),0) INTO v_pendapatan FROM subscriptions WHERE status = 'active';

  RETURN jsonb_build_object('siswa', v_siswa, 'aktivasi', v_aktivasi, 'pro', v_pro, 'pendapatan', v_pendapatan);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_conversion_funnel() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_conversion_funnel() TO authenticated;
