import Link from "next/link";
import { Users, Search, ChevronRight } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { getAdminUsers } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Pengguna — Admin Albirru" };

const roleTone = (r: string) => (r === "admin" ? "danger" : r === "staf" ? "warning" : "muted") as "danger" | "warning" | "muted";

export default async function AdminPenggunaPage({ searchParams }: { searchParams: { q?: string; role?: string } }) {
  const { profile } = await requireAdmin();
  const q = searchParams.q?.trim() || undefined;
  const role = searchParams.role || undefined;
  const users = await getAdminUsers(q, role);

  const filters = [
    { label: "Semua", val: undefined }, { label: "Siswa", val: "siswa" },
    { label: "Staf", val: "staf" }, { label: "Admin", val: "admin" },
  ];

  return (
    <>
      <ConsoleTopbar eyebrow="Pengguna & Bisnis" title="Manajemen Pengguna" subtitle={`${users.length} pengguna.`} nama={profile?.nama ?? "Admin"} roleLabel="Admin" />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form className="relative max-w-md flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input name="q" aria-label="Cari nama pengguna" defaultValue={q} placeholder="Cari nama…" className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-body-sm text-ink placeholder:text-ink-muted" />
            {role ? <input type="hidden" name="role" value={role} /> : null}
          </form>
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <Link key={f.label} href={{ pathname: "/admin/pengguna", query: { ...(q ? { q } : {}), ...(f.val ? { role: f.val } : {}) } }}
                className={`rounded-lg px-3 py-2 text-body-sm font-semibold transition-colors ${role === f.val || (!role && !f.val) ? "bg-brand text-white" : "border bg-white text-ink hover:bg-muted"}`}>{f.label}</Link>
            ))}
          </div>
        </div>

        {users.length === 0 ? (
          <EmptyState icon={Users} title="Tidak ada pengguna" note={q ? `Tidak ada hasil untuk "${q}".` : "Belum ada pengguna terdaftar."} />
        ) : (
          <>
            {/* Mobile: kartu (semua data tetap terlihat, tak ada kolom disembunyikan) */}
            <div className="grid gap-3 sm:hidden">
              {users.map((u) => (
                <Link key={u.id} href={`/admin/pengguna/${u.id}`} className="flex items-center gap-3 rounded-2xl border bg-white p-4 active:bg-muted/40">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-body-sm font-bold text-brand">{(u.nama?.[0] ?? "U").toUpperCase()}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-ink">{u.nama ?? "Tanpa nama"}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Pill tone={roleTone(u.role)}>{u.role}</Pill>
                      {u.plan !== "free" ? <Pill tone="warning">{u.plan}</Pill> : <Pill>free</Pill>}
                      <span className="text-caption text-ink-muted">{new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-ink-muted" />
                </Link>
              ))}
            </div>

            {/* Desktop: tabel */}
            <div className="hidden overflow-hidden rounded-2xl border bg-white sm:block">
              <table className="w-full text-left text-body-sm">
                <thead className="border-b bg-muted/50 text-caption uppercase tracking-wide text-ink-muted">
                  <tr><th className="px-5 py-3 font-semibold">Nama</th><th className="px-5 py-3 font-semibold">Role</th><th className="px-5 py-3 font-semibold">Plan</th><th className="hidden px-5 py-3 font-semibold md:table-cell">Daftar</th><th className="px-5 py-3" /></tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/40">
                      <td className="px-5 py-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-caption font-bold text-brand">{(u.nama?.[0] ?? "U").toUpperCase()}</span><span className="font-semibold text-ink">{u.nama ?? "Tanpa nama"}</span></div></td>
                      <td className="px-5 py-3"><Pill tone={roleTone(u.role)}>{u.role}</Pill></td>
                      <td className="px-5 py-3">{u.plan !== "free" ? <Pill tone="warning">{u.plan}</Pill> : <Pill>free</Pill>}</td>
                      <td className="hidden px-5 py-3 text-ink-body md:table-cell">{new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-5 py-3 text-right"><Link href={`/admin/pengguna/${u.id}`} className="inline-flex items-center gap-1 text-body-sm font-semibold text-brand hover:underline">Detail <ChevronRight size={14} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
