import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldAlert, Trash2, Smartphone } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { ChangePasswordForm } from "@/components/portal/change-password-form";

export const metadata = { title: "Keamanan — Albirru" };

export default async function KeamananPage() {
  const { user, profile } = await getPortalProfile();

  return (
    <>
      <PortalTopbar eyebrow="Profil  ›  Keamanan" title="Keamanan & Kata Sandi" subtitle="Jaga keamanan akunmu." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/profil" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-7">
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="flex items-center gap-2 text-h-sm text-ink"><KeyRound size={18} className="text-brand" /> Ganti Kata Sandi</h3>
          <p className="mt-1 text-body-sm text-ink-muted">Disarankan mengganti kata sandi secara berkala.</p>
          <div className="mt-5"><ChangePasswordForm email={user?.email ?? ""} /></div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="flex items-center gap-2 text-body-lg font-bold text-ink"><Smartphone size={17} className="text-brand" /> Verifikasi 2 Langkah</h3>
            <p className="mt-1 text-caption text-ink-muted">Tambahkan lapisan keamanan ekstra saat masuk.</p>
            <button className="mt-3 w-full rounded-lg border py-2.5 text-body-sm font-semibold text-ink-muted">Segera Hadir</button>
          </div>
          <div className="rounded-2xl border border-[#F3C9C9] bg-[#FDF3F3] p-5">
            <h3 className="flex items-center gap-2 text-body-lg font-bold text-[#B4282C]"><ShieldAlert size={17} /> Zona Berbahaya</h3>
            <p className="mt-1 text-caption text-ink-body">Menghapus akun bersifat permanen. Data pribadimu akan dihapus/dianonimkan sesuai UU PDP.</p>
            <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5484D] py-2.5 text-body-sm font-semibold text-[#E5484D] transition-colors hover:bg-[#FDECEC]"><Trash2 size={15} /> Hapus Akun</button>
          </div>
        </div>
      </div>
    </>
  );
}
