-- ============================================================
-- Albirru — Realtime Leaderboard (Fase 3 lanjutan)
-- Jalankan di Supabase SQL Editor. Lalu aktifkan Realtime untuk tryout_attempts
-- (Database → Replication → tambah public.tryout_attempts ke publication supabase_realtime).
-- ============================================================

-- Papan peringkat per try out (lintas peserta) — SECURITY DEFINER, nama dimask sebagian.
-- Mengembalikan top-N + peringkat & total peserta milik caller.
create or replace function public.get_tryout_leaderboard(p_tryout_id text, p_limit int default 20)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_top jsonb; v_my_rank int; v_total int;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  with ranked as (
    select a.user_id, a.skor, a.submitted_at,
           rank() over (order by a.skor desc, a.submitted_at asc) as rnk
    from public.tryout_attempts a
    where a.tryout_id = p_tryout_id and a.status = 'selesai'
  )
  select
    (select coalesce(jsonb_agg(jsonb_build_object(
        'rank', r.rnk,
        'nama', public.mask_nama(p.nama),
        'skor', r.skor,
        'is_me', (r.user_id = v_user)
      ) order by r.rnk), '[]'::jsonb)
     from ranked r left join public.profiles p on p.id = r.user_id
     where r.rnk <= p_limit),
    (select min(rnk) from ranked where user_id = v_user),
    (select count(*) from ranked)
  into v_top, v_my_rank, v_total;

  return jsonb_build_object('top', v_top, 'my_rank', v_my_rank, 'total_peserta', coalesce(v_total, 0));
end; $$;
revoke all on function public.get_tryout_leaderboard(text, int) from public, anon;
grant execute on function public.get_tryout_leaderboard(text, int) to authenticated;

-- Helper masking nama: "Farhan Aditya" → "Farhan A."
create or replace function public.mask_nama(p_nama text)
returns text language sql immutable as $$
  select case
    when p_nama is null or p_nama = '' then 'Peserta'
    when position(' ' in p_nama) = 0 then p_nama
    else split_part(p_nama, ' ', 1) || ' ' || left(split_part(p_nama, ' ', 2), 1) || '.'
  end;
$$;
