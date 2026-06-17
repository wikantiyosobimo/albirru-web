import Link from "next/link";
import { ArrowLeft, Shield, Trophy, ClipboardList, Mail } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { getAdminUserDetail } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, EmptyState, Pill } from "@/components/console/ui";
import { RoleSelect } from "@/components/admin/role-select";

export const metadata = { title: "Detail Pengguna — Admin Albirru" };

export default async function AdminUserDetail({ params }: { params: { id: string } }) {
  const { profile } = await requireAdmin();
  const data = await getAdminUserDetail(params.id);
  const p = data.profile as Record<string, string | number | boolean | null> | null;
  const nama = (p?.nama as string) ?? "Pengguna";
  const tryout = data.tryout ?? [];

  return (
    <>
      <ConsoleTopbar eyebrow="Pengguna  ›  Detail" title={nama} subtitle="Profil & manajemen role." nama={profile?.nama ?? "Admin"} roleLabel="Admin"
        right={<Link href="/admin/pengguna" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-5 p-5 lg:p-7">
        {!p ? (
          <EmptyState icon={ClipboardList} title="Pengguna tidak ditemukan" />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-3">
              <StatCard label="Level" value={data.level} sub={`${data.xp} XP`} icon={Trophy} accent="warning" />
              <StatCard label="Total Try Out" value={tryout.length} icon={ClipboardList} accent="success" />
              <StatCard label="Plan" value={(p.plan as string) ?? "free"} icon={Shield} />
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
              <ConsoleCard title="Identitas">
                <dl className="space-y-3 text-body-sm">
                  {[
                    ["Jenjang", p.jenjang], ["Jurusan", p.jurusan], ["Sekolah", p.asal_sekolah],
                    ["Jalur", (p.segment as string)?.toUpperCase()], ["Target Kampus", p.target_kampus],
                    ["Target Prodi", p.target_prodi], ["Onboarding", p.onboarding_done ? "Selesai" : "Belum"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-3"><dt className="text-ink-muted">{k}</dt><dd className="text-right font-semibold text-ink">{(v as string) || "—"}</dd></div>
                  ))}
                </dl>
              </ConsoleCard>

              <div className="space-y-5">
                <ConsoleCard title="Role & Akses">
                  <p className="mb-3 text-body-sm text-ink-body">Ubah role pengguna. Aksi tercatat di audit log.</p>
                  <RoleSelect userId={params.id} current={(p.role as string) ?? "siswa"} />
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#FEF3C7] p-3 text-caption text-[#92400E]">
                    <Shield size={15} className="mt-0.5 shrink-0" /> Menaikkan ke admin memberi akses penuh ke seluruh data.
                  </div>
                </ConsoleCard>
                <ConsoleCard title="Aksi">
                  <button className="flex w-full items-center gap-2 rounded-lg border px-4 py-2.5 text-body-sm font-semibold text-ink hover:bg-muted"><Mail size={15} /> Kirim Email Reset Password</button>
                </ConsoleCard>
              </div>
            </div>

            <ConsoleCard title="Riwayat Try Out">
              {tryout.length === 0 ? (
                <p className="py-6 text-center text-body-sm text-ink-muted">Belum ada try out.</p>
              ) : (
                <div className="divide-y">
                  {tryout.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-ink-body"><ClipboardList size={16} /></span>
                      <div className="min-w-0 flex-1"><div className="truncate text-body-sm font-semibold text-ink">{t.tryout_id}</div><div className="text-caption text-ink-muted">{new Date(t.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div></div>
                      <span className="flex gap-1.5"><Pill tone="success">{t.benar}</Pill><Pill tone="danger">{t.salah}</Pill><Pill>{t.kosong}</Pill></span>
                      <span className="ml-1 w-12 text-right text-body-lg font-bold text-ink">{t.skor}</span>
                    </div>
                  ))}
                </div>
              )}
            </ConsoleCard>
          </>
        )}
      </div>
    </>
  );
}
