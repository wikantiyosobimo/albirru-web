"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, FileText, ArrowRight, BookmarkX } from "lucide-react";

type Item = { id: string; href: string; label: string };

function parse(id: string): Item {
  // format soal: "<tryoutId>-soal-<n>"
  const m = id.match(/^(.+)-soal-(\d+)$/);
  if (m) return { id, href: `/app/try-out/${m[1]}/hasil/detail?soal=${m[2]}`, label: `Soal ${m[2]} — ${m[1]}` };
  return { id, href: "#", label: id };
}

export function BookmarkList() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    try {
      const raw = JSON.parse(sessionStorage.getItem("to-bookmark") ?? "[]") as string[];
      setItems(raw.map(parse));
    } catch {
      setItems([]);
    }
  }, []);

  function remove(id: string) {
    const next = (items ?? []).filter((i) => i.id !== id);
    setItems(next);
    try { sessionStorage.setItem("to-bookmark", JSON.stringify(next.map((i) => i.id))); } catch { /* abaikan */ }
  }

  if (items === null) return <div className="rounded-2xl border bg-white p-10 text-center text-body-sm text-ink-muted">Memuat…</div>;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <BookmarkX className="mx-auto text-ink-muted" size={36} />
        <h2 className="mt-3 text-h-sm text-ink">Belum ada bookmark</h2>
        <p className="mt-1 text-body-sm text-ink-body">Tandai soal atau materi dengan ikon bookmark untuk menyimpannya di sini.</p>
        <Link href="/app/try-out" className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-body-sm font-semibold text-white">Jelajahi Try Out</Link>
      </div>
    );
  }

  return (
    <div className="divide-y rounded-2xl border bg-white">
      {items.map((it) => (
        <div key={it.id} className="flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><FileText size={18} /></span>
          <Link href={it.href} className="min-w-0 flex-1 text-body-sm font-semibold text-ink hover:text-brand">{it.label}</Link>
          <Link href={it.href} className="hidden shrink-0 items-center gap-1 text-body-sm font-semibold text-brand sm:inline-flex">Buka <ArrowRight size={13} /></Link>
          <button onClick={() => remove(it.id)} title="Hapus bookmark" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-muted hover:text-[#E5484D]"><Bookmark size={16} className="fill-current" /></button>
        </div>
      ))}
    </div>
  );
}
