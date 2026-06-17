"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onLogout() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/masuk");
    router.refresh();
  }

  return (
    <button onClick={onLogout} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5484D]/30 bg-white px-4 text-body-sm font-semibold text-[#E5484D] transition-colors hover:bg-[#FDECEC] disabled:opacity-60">
      {busy ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />} Keluar
    </button>
  );
}
