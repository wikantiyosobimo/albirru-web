"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy, Loader2, RefreshCw, Radio, Medal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Row = { rank: number; nama: string; skor: number; is_me: boolean };
type Data = { top: Row[]; my_rank: number | null; total_peserta: number };

const MEDAL: Record<number, string> = { 1: "#F5B301", 2: "#9AA3AF", 3: "#C97B3F" };

export function Leaderboard({ tryoutId }: { tryoutId: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  const fetchBoard = useCallback(async () => {
    try {
      const supabase = supabaseRef.current ?? (supabaseRef.current = createClient());
      const { data: res, error: err } = await supabase.rpc("get_tryout_leaderboard", { p_tryout_id: tryoutId, p_limit: 20 });
      if (err) throw err;
      setData(res as Data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat peringkat");
    } finally {
      setLoading(false);
    }
  }, [tryoutId]);

  useEffect(() => {
    fetchBoard();
    const supabase = supabaseRef.current ?? (supabaseRef.current = createClient());
    // Subscribe perubahan attempt untuk try out ini → refetch (realtime ranking).
    const channel = supabase
      .channel(`leaderboard-${tryoutId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tryout_attempts", filter: `tryout_id=eq.${tryoutId}` }, () => fetchBoard())
      .subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => { supabase.removeChannel(channel); };
  }, [tryoutId, fetchBoard]);

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-h-sm text-ink"><Trophy size={18} className="text-[#F5B301]" /> Papan Peringkat</h2>
        <div className="flex items-center gap-2">
          {live ? <span className="flex items-center gap-1 rounded-md bg-success-subtle px-2 py-0.5 text-[11px] font-bold text-success-strong"><Radio size={11} className="animate-pulse" /> LIVE</span> : null}
          <button onClick={() => fetchBoard()} className="flex h-8 w-8 items-center justify-center rounded-lg border text-ink-body hover:bg-muted" title="Muat ulang"><RefreshCw size={14} /></button>
        </div>
      </div>

      {data?.my_rank ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-100/60 px-4 py-2.5 text-body-sm">
          <Medal size={16} className="text-brand" /> Peringkatmu <b className="text-brand">#{data.my_rank}</b> dari {data.total_peserta} peserta.
        </div>
      ) : null}

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-body-sm text-ink-muted"><Loader2 size={16} className="animate-spin" /> Memuat peringkat…</div>
        ) : error ? (
          <p className="rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p>
        ) : !data || data.top.length === 0 ? (
          <p className="rounded-lg bg-muted p-4 text-center text-body-sm text-ink-muted">Belum ada peserta yang menyelesaikan try out ini.</p>
        ) : (
          <div className="divide-y">
            {data.top.map((r) => (
              <div key={`${r.rank}-${r.nama}`} className={cn("flex items-center gap-3 py-2.5", r.is_me && "-mx-2 rounded-lg bg-brand-100/50 px-2")}>
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption font-bold", !MEDAL[r.rank] && "bg-muted text-ink-body")}
                  style={MEDAL[r.rank] ? { backgroundColor: MEDAL[r.rank], color: "#fff" } : undefined}>
                  {r.rank}
                </span>
                <span className="flex-1 truncate text-body-sm font-semibold text-ink">{r.nama}{r.is_me ? <span className="ml-1 text-caption font-normal text-brand">(kamu)</span> : null}</span>
                <span className="text-body-lg font-bold text-ink">{r.skor}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
