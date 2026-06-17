import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Simulasi pembayaran upgrade Pro (QRIS) berhasil.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const { data, error } = await supabase.rpc("upgrade_pro");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
