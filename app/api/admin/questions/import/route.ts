import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Parser CSV minimal yang mendukung field ber-kutip ("...") dan koma di dalamnya.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* abaikan */ }
    else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "staf") {
    return NextResponse.json({ error: "Tidak berwenang." }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File CSV tidak ditemukan." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File melebihi 5MB." }, { status: 400 });

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length < 2) return NextResponse.json({ error: "CSV kosong atau tanpa baris data." }, { status: 400 });

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const col = {
    kode: idx("kode"), mapel: idx("mapel"), topic_slug: idx("topic_slug"),
    level: idx("level_kesulitan"), tipe: idx("tipe"), skill: idx("cognitive_skill"),
    soal: idx("soal"), a: idx("opsi_a"), b: idx("opsi_b"), c: idx("opsi_c"),
    d: idx("opsi_d"), e: idx("opsi_e"), key: idx("answer_key"), pembahasan: idx("pembahasan"),
  };
  if (col.soal === -1 || col.key === -1) {
    return NextResponse.json({ error: "Kolom wajib 'soal' dan 'answer_key' tidak ada di header." }, { status: 400 });
  }

  // Susun baris untuk RPC. Validasi final & insert dilakukan server-side (SECURITY DEFINER),
  // sehingga answer_key tak pernah lewat kolom yang ter-grant ke klien.
  const payload = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const get = (i: number) => (i >= 0 && i < cells.length ? cells[i].trim() : "");
    const opsiRaw = [get(col.a), get(col.b), get(col.c), get(col.d), get(col.e)];
    let lastFilled = -1;
    opsiRaw.forEach((v, i) => { if (v) lastFilled = i; });
    payload.push({
      baris: r + 1,
      kode: get(col.kode),
      mapel: get(col.mapel),
      topic_slug: get(col.topic_slug),
      level: Number(get(col.level)) || 1,
      tipe: get(col.tipe),
      skill: get(col.skill),
      soal: get(col.soal),
      opsi: opsiRaw.slice(0, lastFilled + 1),
      answer_key: get(col.key).toUpperCase(),
      pembahasan: get(col.pembahasan),
    });
  }

  const { data, error } = await supabase.rpc("admin_import_questions", { p_rows: payload });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result = (data ?? { inserted: 0, ditolak: 0, errors: [] }) as { inserted: number; ditolak: number; errors: { baris: number; alasan: string }[] };
  return NextResponse.json({ inserted: result.inserted, ditolak: result.ditolak, errors: (result.errors ?? []).slice(0, 20) });
}
