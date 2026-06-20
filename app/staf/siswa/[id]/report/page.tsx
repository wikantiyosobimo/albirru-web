import Link from "next/link";
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus, Trophy, Target, ClipboardList,
  CheckCircle2, XCircle, AlertTriangle, BarChart3, Zap, BookOpen, Calendar,
  User, School, GraduationCap, Gauge,
} from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { getStudentReport } from "@/lib/console/student-report";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, StatCard, Pill } from "@/components/console/ui";
import { Ring } from "@/components/portal/ring";
import { cn } from "@/lib/utils";

export const metadata = { title: "Report Siswa — Staf Albirru" };

function TrendBadge({ tren, delta }: { tren: string | null; delta: number | null }) {
  if (!tren) return <Pill>Belum cukup data</Pill>;
  if (tren === "naik") return <Pill tone="success"><TrendingUp size={12} className="inline" /> +{delta} poin</Pill>;
  if (tren === "turun") return <Pill tone="danger"><TrendingDown size={12} className="inline" /> {delta} poin</Pill>;
  return <Pill><Minus size={12} className="inline" /> Stabil</Pill>;
}

function InfoRow({ icon: Icon, label, value, color }: { icon: typeof User; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", color ?? "bg-brand-100 text-brand")}><Icon size={15} /></span>
      <div className="min-w-0 flex-1 text-body-sm"><span className="text-ink-muted">{label}</span></div>
      <div className="text-body-sm font-semibold text-ink">{value || "—"}</div>
    </div>
  );
}

export default async function StudentReportPage({ params }: { params: { id: string } }) {
  const { profile: stafProfile } = await requireStaff();
  const report = await getStudentReport(params.id);
  const p = report.profile;
  const s = report.stats;
  const nama = p?.nama ?? "Siswa";
  const aparatur = p?.segment === "cpns" || p?.segment === "pppk";
  const target = aparatur
    ? [p?.target_instansi, p?.target_jabatan].filter(Boolean).join(" — ")
    : [p?.target_kampus, p?.target_prodi].filter(Boolean).join(" — ");

  const readiness = s.skorRata && p?.target_skor ? Math.min(100, Math.round((s.skorRata / p.target_skor) * 100)) : null;

  return (
    <>
      <ConsoleTopbar
        eyebrow="Akademik  ›  Siswa  ›  Report"
        title={`Report: ${nama}`}
        subtitle="Analisis performa, kekuatan, kelemahan, dan kesiapan target."
        nama={stafProfile?.nama ?? "Tim"} roleLabel="Staf"
        right={<Link href={`/staf/siswa/${params.id}`} className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>}
      />

      <div className="space-y-5 p-5 lg:p-7">
        {!p ? (
          <ConsoleCard title="Error"><p className="text-body-sm text-ink-muted">Siswa tidak ditemukan.</p></ConsoleCard>
        ) : (
          <>
            {/* === PROFIL RINGKAS === */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center rounded-2xl border bg-white p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-[1.6rem] font-extrabold text-brand">
                {(nama[0] ?? "S").toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-h-md text-ink">{nama}</h2>
                <p className="text-body-sm text-ink-muted">{p.asal_sekolah ?? "—"} · {p.jenjang ? `Kelas ${p.jenjang}` : "—"} · {(p.segment ?? "utbk").toUpperCase()}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Pill tone={p.plan === "pro" ? "success" : undefined}>{p.plan === "pro" ? "Pro" : "Free"}</Pill>
                  {target ? <Pill tone="brand">{target}</Pill> : null}
                </div>
              </div>
              <div className="text-right">
                <div className="text-caption text-ink-muted">Tren Skor</div>
                <TrendBadge tren={s.tren} delta={s.skorDelta} />
              </div>
            </div>

            {/* === STATS UTAMA === */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard label="Skor Terbaru" value={s.skorTerbaru ?? "—"} icon={TrendingUp} accent="success" />
              <StatCard label="Skor Terbaik" value={s.skorTerbaik ?? "—"} icon={Trophy} accent="warning" />
              <StatCard label="Rata-rata" value={s.skorRata ?? "—"} icon={BarChart3} />
              <StatCard label="Akurasi Global" value={s.akurasiGlobal !== null ? `${s.akurasiGlobal}%` : "—"} icon={Target} accent="success" />
              <StatCard label="Total Try Out" value={s.totalAttempts} icon={ClipboardList} />
            </div>

            {/* === TARGET READINESS + DETAIL PROFIL === */}
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              {/* Target Readiness */}
              <ConsoleCard title="Kesiapan Target">
                {readiness !== null ? (
                  <div className="flex flex-col items-center gap-5 sm:flex-row">
                    <Ring value={readiness} size={120} stroke={12} color={readiness >= 80 ? "#16B47A" : readiness >= 50 ? "#E8910B" : "#E5484D"}>
                      <span className="text-[1.8rem] font-extrabold leading-none text-ink">{readiness}%</span>
                    </Ring>
                    <div className="flex-1">
                      <div className="text-h-sm text-ink">
                        {readiness >= 80 ? "Siap Menuju Target" : readiness >= 50 ? "Perlu Peningkatan" : "Masih Jauh dari Target"}
                      </div>
                      <p className="mt-1 text-body-sm text-ink-muted">
                        Target: <b className="text-ink">{target || "Belum diatur"}</b>
                        {p.target_skor ? <> · Skor target: <b className="text-ink">{p.target_skor}</b></> : null}
                      </p>
                      {s.skorRata && p.target_skor ? (
                        <div className="mt-3 rounded-lg bg-muted px-3 py-2 text-body-sm text-ink-body">
                          {s.skorRata >= p.target_skor
                            ? <span className="text-[#16B47A] font-semibold">Sudah melampaui target! Pertahankan dan tingkatkan.</span>
                            : <>Selisih <b className="text-ink">{p.target_skor - s.skorRata} poin</b> untuk mencapai target aman.</>
                          }
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="py-6 text-center text-body-sm text-ink-muted">Belum ada data untuk menghitung kesiapan target.</p>
                )}
              </ConsoleCard>

              {/* Detail Profil */}
              <ConsoleCard title="Identitas Siswa">
                <div className="divide-y">
                  <InfoRow icon={User} label="Nama" value={nama} />
                  <InfoRow icon={GraduationCap} label="Jenjang" value={p.jenjang ? `Kelas ${p.jenjang}` : "—"} />
                  <InfoRow icon={School} label="Sekolah" value={p.asal_sekolah ?? "—"} />
                  <InfoRow icon={Gauge} label="Jalur" value={(p.segment ?? "").toUpperCase()} />
                  <InfoRow icon={Target} label="Target" value={target || "—"} />
                  <InfoRow icon={Trophy} label="Level / XP" value={`Lv ${report.level} · ${report.xp} XP`} color="bg-[#FFF1DC] text-[#E8910B]" />
                </div>
              </ConsoleCard>
            </div>

            {/* === KEKUATAN & KELEMAHAN === */}
            <div className="grid gap-5 sm:grid-cols-2">
              <ConsoleCard title="Kekuatan (Akurasi ≥ 70%)">
                {report.strengths.length === 0 ? (
                  <p className="py-4 text-center text-body-sm text-ink-muted">Belum cukup data.</p>
                ) : (
                  <div className="space-y-3">
                    {report.strengths.map((s) => (
                      <div key={s} className="flex items-center gap-2.5">
                        <CheckCircle2 size={18} className="shrink-0 text-[#16B47A]" />
                        <span className="text-body-sm font-semibold text-ink">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ConsoleCard>

              <ConsoleCard title="Kelemahan (Akurasi < 60%)">
                {report.weaknesses.length === 0 ? (
                  <p className="py-4 text-center text-body-sm text-ink-muted">Belum cukup data.</p>
                ) : (
                  <div className="space-y-3">
                    {report.weaknesses.map((s) => (
                      <div key={s} className="flex items-center gap-2.5">
                        <AlertTriangle size={18} className="shrink-0 text-[#E8910B]" />
                        <span className="text-body-sm font-semibold text-ink">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ConsoleCard>
            </div>

            {/* === PERFORMA PER SUBTES === */}
            {report.subtes.length > 0 ? (
              <ConsoleCard title="Akurasi per Subtes">
                <div className="space-y-3">
                  {report.subtes.map((st) => (
                    <div key={st.subtes}>
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="font-semibold text-ink">{st.subtes}</span>
                        <span className={cn("font-bold", st.akurasi >= 70 ? "text-[#16B47A]" : st.akurasi >= 50 ? "text-[#E8910B]" : "text-[#E5484D]")}>{st.akurasi}%</span>
                      </div>
                      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full transition-all", st.akurasi >= 70 ? "bg-[#16B47A]" : st.akurasi >= 50 ? "bg-[#E8910B]" : "bg-[#E5484D]")}
                          style={{ width: `${st.akurasi}%` }}
                        />
                      </div>
                      <div className="mt-0.5 text-caption text-ink-muted">{st.benar} benar dari {st.total} soal</div>
                    </div>
                  ))}
                </div>
              </ConsoleCard>
            ) : null}

            {/* === JAWABAN GLOBAL === */}
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl border bg-white p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9F9F1] text-[#16B47A]"><CheckCircle2 size={24} /></span>
                <div><div className="text-h-md text-ink">{s.totalBenar}</div><div className="text-caption text-ink-muted">Total Benar</div></div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border bg-white p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDECEC] text-[#E5484D]"><XCircle size={24} /></span>
                <div><div className="text-h-md text-ink">{s.totalSalah}</div><div className="text-caption text-ink-muted">Total Salah</div></div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border bg-white p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-ink-muted"><Minus size={24} /></span>
                <div><div className="text-h-md text-ink">{s.totalKosong}</div><div className="text-caption text-ink-muted">Total Kosong</div></div>
              </div>
            </div>

            {/* === RIWAYAT TRY OUT === */}
            <ConsoleCard title="Riwayat Try Out">
              {report.attempts.length === 0 ? (
                <p className="py-6 text-center text-body-sm text-ink-muted">Belum ada try out yang diselesaikan.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead><tr className="border-b text-left text-caption text-ink-muted">
                      <th className="pb-2 pr-3">Try Out</th><th className="pb-2 pr-3">Skor</th><th className="pb-2 pr-3">B/S/K</th><th className="pb-2">Tanggal</th>
                    </tr></thead>
                    <tbody className="divide-y">
                      {report.attempts.map((a, i) => (
                        <tr key={i}>
                          <td className="py-2.5 pr-3 font-semibold text-ink">{a.tryout_judul}</td>
                          <td className="py-2.5 pr-3"><span className="text-body-lg font-bold text-ink">{a.skor}</span></td>
                          <td className="py-2.5 pr-3">
                            <span className="text-[#16B47A] font-semibold">{a.benar}</span> / <span className="text-[#E5484D] font-semibold">{a.salah}</span> / <span className="text-ink-muted">{a.kosong}</span>
                          </td>
                          <td className="py-2.5 text-ink-muted">{new Date(a.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ConsoleCard>

            {/* === REKOMENDASI === */}
            <ConsoleCard title="Rekomendasi untuk Siswa">
              <div className="space-y-3">
                {report.weaknesses.length > 0 ? (
                  <div className="flex items-start gap-2.5">
                    <Zap size={18} className="mt-0.5 shrink-0 text-brand" />
                    <div className="text-body-sm text-ink-body">
                      <b className="text-ink">Fokus perbaikan:</b> {report.weaknesses.slice(0, 3).join(", ")}. Latihan terarah di area ini bisa meningkatkan skor signifikan.
                    </div>
                  </div>
                ) : null}
                {report.strengths.length > 0 ? (
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#16B47A]" />
                    <div className="text-body-sm text-ink-body">
                      <b className="text-ink">Pertahankan:</b> {report.strengths.slice(0, 3).join(", ")}. Area ini sudah kuat.
                    </div>
                  </div>
                ) : null}
                {s.totalKosong > 0 ? (
                  <div className="flex items-start gap-2.5">
                    <BookOpen size={18} className="mt-0.5 shrink-0 text-[#E8910B]" />
                    <div className="text-body-sm text-ink-body">
                      <b className="text-ink">Kurangi soal kosong:</b> {s.totalKosong} soal tidak dijawab. Dorong siswa untuk menjawab semua soal meskipun tidak yakin.
                    </div>
                  </div>
                ) : null}
                {readiness !== null && readiness < 80 ? (
                  <div className="flex items-start gap-2.5">
                    <Calendar size={18} className="mt-0.5 shrink-0 text-[#6D49C9]" />
                    <div className="text-body-sm text-ink-body">
                      <b className="text-ink">Jadwal belajar:</b> Untuk mencapai target {p?.target_skor}, siswa perlu meningkatkan {p?.target_skor && s.skorRata ? p.target_skor - s.skorRata : "—"} poin. Frekuensi latihan yang konsisten sangat penting.
                    </div>
                  </div>
                ) : null}
                {s.totalAttempts === 0 ? (
                  <p className="py-4 text-center text-body-sm text-ink-muted">Belum ada data try out — dorong siswa untuk mengerjakan try out pertamanya.</p>
                ) : null}
              </div>
            </ConsoleCard>
          </>
        )}
      </div>
    </>
  );
}
