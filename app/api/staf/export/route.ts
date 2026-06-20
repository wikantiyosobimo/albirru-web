import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function csv(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "staf" && profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const report = searchParams.get("report");

  let content = "";
  let filename = "laporan.csv";

  if (report === "performa") {
    const { data } = await supabase.from("profiles").select("nama, asal_sekolah, segment, plan").eq("role", "siswa").limit(500);
    const rows = (data ?? []).map((p) => [p.nama ?? "", p.asal_sekolah ?? "", p.segment ?? "", p.plan ?? "free"]);
    content = csv(["Nama", "Sekolah", "Segment", "Plan"], rows);
    filename = "rekap-performa-siswa.csv";
  } else if (report === "tryout") {
    const { data } = await supabase.from("tryout_attempts").select("tryout_id, skor, benar, salah, kosong, created_at, profiles!inner(nama)").order("created_at", { ascending: false }).limit(500);
    const rows = (data ?? []).map((a: Record<string, unknown>) => {
      const p = a.profiles as Record<string, unknown> | null;
      return [String(p?.nama ?? ""), String(a.tryout_id ?? ""), String(a.skor ?? 0), String(a.benar ?? 0), String(a.salah ?? 0), String(a.kosong ?? 0), String(a.created_at ?? "")];
    });
    content = csv(["Nama", "Try Out ID", "Skor", "Benar", "Salah", "Kosong", "Tanggal"], rows);
    filename = "hasil-tryout.csv";
  } else if (report === "topik") {
    const { data } = await supabase.from("topics").select("nama, parent_id").order("nama");
    const rows = (data ?? []).map((t) => [t.nama ?? "", t.parent_id ? "Sub-topik" : "Topik utama"]);
    content = csv(["Topik", "Level"], rows);
    filename = "analisis-topik.csv";
  } else if (report === "progres") {
    const { data } = await supabase.from("learning_progress").select("user_id, material_id, progress, completed, updated_at").order("updated_at", { ascending: false }).limit(500);
    const rows = (data ?? []).map((p) => [String(p.user_id ?? ""), String(p.material_id ?? ""), String(p.progress ?? 0), p.completed ? "Ya" : "Tidak", String(p.updated_at ?? "")]);
    content = csv(["User ID", "Material ID", "Progress %", "Selesai", "Terakhir"], rows);
    filename = "progres-pembelajaran.csv";
  } else {
    return NextResponse.json({ error: "Report tidak dikenal." }, { status: 400 });
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
