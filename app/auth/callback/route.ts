import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const peran = searchParams.get("peran");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, onboarding_done")
          .eq("id", user.id)
          .single();

        if (peran === "staf" && profile?.role === "siswa") {
          await supabase.from("profiles").update({ role: "staf" }).eq("id", user.id);
        }

        const role = peran === "staf" ? "staf" : (profile?.role ?? "siswa");

        if (next) return NextResponse.redirect(`${origin}${next}`);
        if (!profile?.onboarding_done) return NextResponse.redirect(`${origin}/onboarding`);

        if (role === "admin") return NextResponse.redirect(`${origin}/admin`);
        if (role === "staf") return NextResponse.redirect(`${origin}/staf`);
        return NextResponse.redirect(`${origin}/app`);
      }
      return NextResponse.redirect(`${origin}${next ?? "/app"}`);
    }
  }
  return NextResponse.redirect(`${origin}/masuk?error=oauth`);
}
