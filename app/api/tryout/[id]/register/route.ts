import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Daftar try out. Server menolak jika user free belum membayar try out berbayar.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const { data, error } = await supabase.rpc("register_tryout", { p_tryout_id: params.id });
  if (error) {
    const msg = error.message.includes("payment_required") ? "Selesaikan pembayaran dulu." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json(data);
}
