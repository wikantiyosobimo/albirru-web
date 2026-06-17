import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { ProfileEditForm } from "@/components/portal/profile-edit-form";

export const metadata = { title: "Edit Target — Albirru" };

export default async function TargetEditPage() {
  const { profile } = await getPortalProfile();
  const defaults = {
    nama: profile?.nama ?? "",
    jenjang: profile?.jenjang ?? "",
    jurusan: profile?.jurusan ?? "",
    asal_sekolah: profile?.asal_sekolah ?? "",
    segment: profile?.segment ?? "utbk",
    target_kampus: profile?.target_kampus ?? "",
    target_prodi: profile?.target_prodi ?? "",
    target_instansi: profile?.target_instansi ?? "",
    target_jabatan: profile?.target_jabatan ?? "",
  };

  return (
    <>
      <PortalTopbar eyebrow="Target  ›  Edit" title="Edit Target" subtitle="Perbarui jenis tes & target tujuanmu." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/target" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />
      <div className="p-5 lg:p-7">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 lg:p-8">
          <ProfileEditForm defaults={defaults} />
        </div>
      </div>
    </>
  );
}
