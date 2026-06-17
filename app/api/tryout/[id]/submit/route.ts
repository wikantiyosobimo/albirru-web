import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Submit jawaban try out → penilaian dilakukan di server (RPC submit_tryout).
// Kunci jawaban tidak pernah dikirim ke klien; skoring murni server-side.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const answers = Array.isArray(body?.answers) ? body.answers : [];

  const { data, error } = await supabase.rpc("submit_tryout", {
    p_tryout_id: params.id,
    p_answers: answers,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
