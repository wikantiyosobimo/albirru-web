import Link from "next/link";
import { Target, TrendingUp, ArrowRight, CheckCircle2, Circle, GraduationCap, Flag } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { PortalTopbar } from "@/components/portal/topbar";
import { Ring } from "@/components/portal/ring";
import { getSegment } from "@/lib/data/targets";
import { peluangLolos, warnaPeluang } from "@/lib/portal/peluang";

export const metadata = { title: "Target Kampus — Albirru" };

export default async function TargetPage() {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";
  const seg = getSegment(profile?.segment);
  const isInstansi = seg.target === "instansi";
  const kampus = (isInstansi ? profile?.target_instansi : profile?.target_kampus) || (isInstansi ? "Kementerian Keuangan" : seg.value === "kedinasan" ? "PKN STAN" : "Universitas Gadjah Mada");
  const prodi = (isInstansi ? profile?.target_jabatan : profile?.target_prodi) || (isInstansi ? "Analis Keuangan" : seg.value === "kedinasan" ? "Akuntansi Sektor Publik" : "Teknik Informatika");
  const targetSkor = profile?.target_skor ?? (seg.model === "akademik" ? 850 : 420);

  // Skor terbaru dari attempt.
  const supabase = await createClient();
  const { data: attempt } = await supabase.from("tryout_attempts")
    .select("skor").eq("status", "selesai").order("submitted_at", { ascending: false }).limit(1).maybeSingle();
  const skor = attempt?.skor ?? (seg.model === "akademik" ? 712 : 385);
  const gap = Math.max(0, targetSkor - skor);
  const readiness = Math.min(100, Math.round((skor / targetSkor) * 100));
  const peluang = peluangLolos(skor, targetSkor);
  const pColor = warnaPeluang(peluang);

  const milestones = [
    { t: "Tentukan kampus & prodi impian", done: true },
    { t: "Kerjakan minimal 5 try out", done: skor > 0 },
    { t: `Capai skor ${Math.round(targetSkor * 0.85)}`, done: skor >= targetSkor * 0.85 },
    { t: `Capai target aman ${targetSkor}`, done: skor >= targetSkor },
    { t: "Lengkapi dokumen pendaftaran SNBT", done: false },
  ];

  return (
    <>
      <PortalTopbar title="Target Kampus" subtitle="Pantau progres menuju kampus impianmu." nama={nama} />

      <div className="space-y-5 p-5 lg:p-7">
        {/* HERO TARGET */}
        <div className="grid items-center gap-6 rounded-2xl border grad-photo p-6 text-white md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-2 text-eyebrow text-white/80"><Target size={14} /> TARGET {seg.targetNoun.toUpperCase()} IMPIAN</div>
            <h2 className="mt-2 text-h-xl">{kampus}</h2>
            <p className="text-body-lg text-white/90">{prodi}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-body-sm">
              <span className="rounded-lg bg-white/15 px-3 py-1.5">Target Aman: <b>{targetSkor}</b></span>
              <span className="rounded-lg bg-white/15 px-3 py-1.5">Skor Saat Ini: <b>{skor}</b></span>
              <span className="rounded-lg bg-white/15 px-3 py-1.5">Gap: <b>{gap} poin</b></span>
            </div>
          </div>
          <Ring value={peluang} size={140} stroke={12} color="#FFFFFF" track="rgba(255,255,255,0.25)">
            <span className="text-[1.9rem] font-extrabold leading-none">{peluang}%</span>
            <span className="text-caption text-white/90">Peluang Lolos</span>
          </Ring>
        </div>

        {/* STATS */}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 text-ink-muted"><GraduationCap size={16} /> <span className="text-body-sm">Kesiapan Akademik</span></div>
            <div className="mt-3 flex items-center gap-4">
              <Ring value={readiness} size={84} stroke={9}><span className="text-h-sm text-ink">{readiness}%</span></Ring>
              <div className="text-body-sm text-ink-body">Skor {skor} dari target {targetSkor}. Tinggal <b className="text-ink">{gap} poin</b> lagi.</div>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 text-ink-muted"><TrendingUp size={16} /> <span className="text-body-sm">Peluang Lolos</span></div>
            <div className="mt-2 text-stat" style={{ color: pColor }}>{peluang}%</div>
            <p className="text-caption text-ink-muted">Estimasi berdasarkan skor terhadap target.</p>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 text-ink-muted"><Flag size={16} /> <span className="text-body-sm">Gap Menuju Aman</span></div>
            <div className="mt-2 text-stat text-ink">{gap}<span className="text-body-sm font-normal text-ink-muted"> poin</span></div>
            <Link href="/app/intelligence/smart-revision" className="mt-1 inline-flex items-center gap-1 text-body-sm font-semibold text-brand hover:underline">Mulai Smart Revision <ArrowRight size={13} /></Link>
          </div>
        </div>

        {/* AKSI TARGET */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { t: "Simulator Peluang", d: "Geser skor, lihat dampaknya", href: "/app/target/simulator" },
            { t: "Bandingkan Target", d: "Peluang di beberapa pilihan", href: "/app/target/compare" },
            { t: "Edit Target", d: "Ubah jenis tes & tujuan", href: "/app/target/edit" },
          ].map((a) => (
            <Link key={a.t} href={a.href} className="flex items-center gap-3 rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm">
              <div className="min-w-0 flex-1"><div className="text-body-sm font-bold text-ink">{a.t}</div><div className="text-caption text-ink-muted">{a.d}</div></div>
              <ArrowRight size={16} className="shrink-0 text-brand" />
            </Link>
          ))}
        </div>

        {/* MILESTONES */}
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-h-sm text-ink">Roadmap Menuju Target</h3>
          <div className="mt-4 space-y-2.5">
            {milestones.map((m) => (
              <div key={m.t} className="flex items-center gap-3 rounded-xl border p-3">
                {m.done ? <CheckCircle2 size={20} className="shrink-0 text-success" /> : <Circle size={20} className="shrink-0 text-ink-muted" />}
                <span className={m.done ? "text-body-sm font-medium text-ink" : "text-body-sm text-ink-body"}>{m.t}</span>
                {m.done ? <span className="ml-auto rounded-md bg-success-subtle px-2 py-0.5 text-[11px] font-semibold text-success-strong">Selesai</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
