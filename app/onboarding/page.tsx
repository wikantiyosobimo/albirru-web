import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/common/logo";
import { OnboardingForm } from "@/components/sections/auth/onboarding-form";

export const metadata = { title: "Lengkapi Profil — Albirru" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/masuk");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama, onboarding_done")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_done) redirect("/app");
  const nama = profile?.nama ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-md">
        <Logo />
        <h1 className="mt-6 text-h-md text-ink">Selamat datang{nama ? `, ${nama}` : ""}! 👋</h1>
        <p className="mt-1 text-body-sm text-ink-body">Lengkapi profilmu agar Albirru bisa menyusun analisis dan rekomendasi belajar yang personal untukmu.</p>
        <div className="mt-7"><OnboardingForm /></div>
      </div>
    </main>
  );
}
