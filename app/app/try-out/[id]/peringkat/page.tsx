import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { PortalTopbar } from "@/components/portal/topbar";
import { Leaderboard } from "@/components/portal/leaderboard";

export const metadata = { title: "Peringkat Try Out — Albirru" };

export default async function PeringkatPage({ params }: { params: { id: string } }) {
  const { profile } = await getPortalProfile();
  let title: string | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tryouts").select("title").eq("id", params.id).maybeSingle();
    title = data?.title;
  } catch { /* abaikan */ }

  return (
    <>
      <PortalTopbar eyebrow="Try Out  ›  Peringkat" title="Papan Peringkat" subtitle={title ?? "Peringkat realtime peserta."} nama={profile?.nama ?? "Farhan"}
        right={<Link href={`/app/try-out/${params.id}/hasil`} className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Ke Hasil</Link>} />

      <div className="mx-auto max-w-2xl space-y-5 p-5 lg:p-7">
        <Leaderboard tryoutId={params.id} />
        <p className="text-center text-caption text-ink-muted">Peringkat diperbarui otomatis saat peserta lain menyelesaikan try out (Supabase Realtime).</p>
      </div>
    </>
  );
}
