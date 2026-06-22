import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function waitForProfile(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const { data } = await supabase.from("profiles").select("role, onboarding_done, nama").eq("id", userId).single();
    if (data) return data;
    await new Promise((r) => setTimeout(r, 300));
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const peran = searchParams.get("peran");

  if (!code) return NextResponse.redirect(`${origin}/masuk?error=oauth`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/masuk?error=oauth`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/masuk?error=oauth`);

  const profile = await waitForProfile(supabase, user.id);

  if (!profile) {
    await supabase.from("profiles").upsert({
      id: user.id,
      role: peran === "staf" ? "staf" : "siswa",
      nama: user.user_metadata?.full_name ?? user.user_metadata?.nama ?? user.email?.split("@")[0] ?? "",
      onboarding_done: false,
    }, { onConflict: "id" });
  }

  const targetRole = peran === "staf" ? "staf" : (profile?.role ?? "siswa");

  if (peran === "staf" && profile?.role !== "staf" && profile?.role !== "admin") {
    await supabase.from("profiles").update({ role: "staf" }).eq("id", user.id);
  }

  if (next) return NextResponse.redirect(`${origin}${next}`);

  const onboardingDone = profile?.onboarding_done ?? false;
  if (!onboardingDone) return NextResponse.redirect(`${origin}/onboarding`);

  if (targetRole === "admin") return NextResponse.redirect(`${origin}/admin`);
  if (targetRole === "staf") return NextResponse.redirect(`${origin}/staf`);
  return NextResponse.redirect(`${origin}/app`);
}
