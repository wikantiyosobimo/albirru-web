-- ═══════════════════════════════════════════════════════════
-- ADMIN QUESTION WRITE — RPC + RLS (sudah diterapkan via MCP migration)
--
-- Catatan penting: tabel `questions` SUDAH ADA dengan skema asli (PRD BAB 6):
--   - Teks soal & opsi disimpan di kolom `konten` (jsonb):
--       { "soal": "...", "opsi": ["A text","B text", ...] }
--   - `answer_key` (huruf A–E) di kolom terpisah — RAHASIA, tak di-grant ke klien.
--   - `tipe` CHECK: 'PG' | 'benar_salah' | 'menjodohkan' | 'isian' (BUKAN 'pilihan_ganda').
--   - `level_kesulitan` CHECK: 1..5.
-- Karena answer_key sensitif, penulisan soal lewat SECURITY DEFINER RPC (cek role internal),
-- selaras dengan pola submit_tryout/get_attempt_review.
-- ═══════════════════════════════════════════════════════════

-- Buat satu soal (modal "Soal Baru"). Mengembalikan id soal (bukan answer_key).
CREATE OR REPLACE FUNCTION public.admin_create_question(
  p_mapel text, p_soal text, p_opsi jsonb, p_answer_key text,
  p_level int DEFAULT 3, p_tipe text DEFAULT 'PG',
  p_skill text DEFAULT NULL, p_kode text DEFAULT NULL, p_pembahasan text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_id uuid; v_n int; v_key text; v_tipe text; v_level int;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller NOT IN ('admin','staf') THEN RAISE EXCEPTION 'forbidden'; END IF;

  v_key := upper(trim(p_answer_key));
  IF v_key NOT IN ('A','B','C','D','E') THEN RAISE EXCEPTION 'invalid answer_key'; END IF;
  IF coalesce(trim(p_soal),'') = '' THEN RAISE EXCEPTION 'empty soal'; END IF;

  v_n := jsonb_array_length(coalesce(p_opsi, '[]'::jsonb));
  IF v_n < 2 THEN RAISE EXCEPTION 'need at least 2 options'; END IF;
  IF (ascii(v_key) - 64) > v_n THEN RAISE EXCEPTION 'answer_key out of range'; END IF;

  v_tipe := CASE WHEN p_tipe IN ('PG','benar_salah','menjodohkan','isian') THEN p_tipe ELSE 'PG' END;
  v_level := LEAST(5, GREATEST(1, coalesce(p_level, 3)));

  INSERT INTO public.questions (kode, mapel, level_kesulitan, tipe, cognitive_skill, konten, answer_key, pembahasan, aktif, created_by)
  VALUES (
    nullif(trim(coalesce(p_kode,'')),''), coalesce(nullif(trim(p_mapel),''),'Penalaran Umum'),
    v_level, v_tipe, nullif(trim(coalesce(p_skill,'')),''),
    jsonb_build_object('soal', p_soal, 'opsi', p_opsi), v_key,
    nullif(trim(coalesce(p_pembahasan,'')),''), true, auth.uid()
  ) RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_create_question(text, text, jsonb, text, int, text, text, text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_create_question(text, text, jsonb, text, int, text, text, text, text) TO authenticated;

-- Import massal CSV. p_rows = array {baris,kode,mapel,level,tipe,skill,soal,opsi[],answer_key,pembahasan}.
-- Mengembalikan { inserted, ditolak, errors:[{baris,alasan}] }. Tidak mengembalikan answer_key.
CREATE OR REPLACE FUNCTION public.admin_import_questions(p_rows jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_row jsonb; v_i int := 0; v_ok int := 0;
        v_errors jsonb := '[]'::jsonb; v_key text; v_opsi jsonb; v_soal text; v_n int; v_tipe text; v_level int;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller NOT IN ('admin','staf') THEN RAISE EXCEPTION 'forbidden'; END IF;

  FOR v_row IN SELECT * FROM jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) LOOP
    v_i := v_i + 1;
    v_soal := trim(coalesce(v_row->>'soal',''));
    v_key := upper(trim(coalesce(v_row->>'answer_key','')));
    v_opsi := coalesce(v_row->'opsi', '[]'::jsonb);
    v_n := jsonb_array_length(v_opsi);

    IF v_soal = '' THEN
      v_errors := v_errors || jsonb_build_object('baris', (v_row->>'baris')::int, 'alasan', 'Teks soal kosong.'); CONTINUE;
    END IF;
    IF v_key NOT IN ('A','B','C','D','E') THEN
      v_errors := v_errors || jsonb_build_object('baris', (v_row->>'baris')::int, 'alasan', 'Kunci tidak valid (A-E).'); CONTINUE;
    END IF;
    IF v_n < 2 OR (ascii(v_key) - 64) > v_n THEN
      v_errors := v_errors || jsonb_build_object('baris', (v_row->>'baris')::int, 'alasan', 'Opsi kurang / kunci di luar jangkauan.'); CONTINUE;
    END IF;

    v_tipe := CASE WHEN (v_row->>'tipe') IN ('PG','benar_salah','menjodohkan','isian') THEN v_row->>'tipe' ELSE 'PG' END;
    v_level := LEAST(5, GREATEST(1, coalesce((v_row->>'level')::int, 1)));

    INSERT INTO public.questions (kode, mapel, level_kesulitan, tipe, cognitive_skill, konten, answer_key, pembahasan, aktif, created_by)
    VALUES (
      nullif(trim(coalesce(v_row->>'kode','')),''), coalesce(nullif(trim(coalesce(v_row->>'mapel','')),''),'Penalaran Umum'),
      v_level, v_tipe, nullif(trim(coalesce(v_row->>'skill','')),''),
      jsonb_build_object('soal', v_soal, 'opsi', v_opsi), v_key,
      nullif(trim(coalesce(v_row->>'pembahasan','')),''), true, auth.uid()
    );
    v_ok := v_ok + 1;
  END LOOP;

  RETURN jsonb_build_object('inserted', v_ok, 'ditolak', v_i - v_ok, 'errors', v_errors);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_import_questions(jsonb) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_import_questions(jsonb) TO authenticated;

-- RLS: tabel `schools` sebelumnya hanya punya policy SELECT — tambah INSERT untuk admin.
DROP POLICY IF EXISTS "schools admin write" ON public.schools;
CREATE POLICY "schools admin write" ON public.schools FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
