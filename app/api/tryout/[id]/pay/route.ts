import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Simulasi pembayaran QRIS berhasil → tandai 'paid'.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const { data, error } = await supabase.rpc("pay_tryout", { p_tryout_id: params.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
