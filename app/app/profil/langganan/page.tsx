import Link from "next/link";
import { ArrowLeft, Check, Gem, Receipt } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { UpgradeProButton } from "@/components/portal/upgrade-pro-button";

export const metadata = { title: "Langganan — Albirru" };

const FITUR_PRO = [
  "Akses semua try out & soal tanpa batas",
  "Analisis Academic Intelligence lengkap",
  "Smart Revision & rekomendasi personal",
  "Prediksi peluang lolos & simulator",
  "Unduh hasil & pembahasan (PDF)",
];

export default async function LanggananPage() {
  const { profile } = await getPortalProfile();
  const isPro = (profile?.plan ?? "free") !== "free";

  return (
    <>
      <PortalTopbar eyebrow="Profil  ›  Langganan" title="Langganan" subtitle="Kelola paket Albirru-mu." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/profil" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-7">
        <div className="space-y-5">
          {/* PAKET SAAT INI */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-caption text-ink-muted">Paket Saat Ini</div>
                <div className="flex items-center gap-2 text-h-md text-ink">{isPro ? "Albirru Pro" : "Free"} {isPro ? <Gem size={20} className="text-brand" /> : null}</div>
              </div>
              <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${isPro ? "bg-brand-100 text-brand" : "bg-muted text-ink-muted"}`}>{isPro ? "Aktif" : "Gratis"}</span>
            </div>
            <p className="mt-2 text-body-sm text-ink-body">{isPro ? "Kamu menikmati seluruh fitur premium Albirru." : "Tingkatkan ke Pro untuk membuka semua fitur."}</p>
            {!isPro ? <UpgradeProButton className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-label text-white transition-colors hover:bg-brand-600"><Gem size={16} /> Upgrade ke Pro</UpgradeProButton> : null}
          </div>

          {/* RIWAYAT */}
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="flex items-center gap-2 text-h-sm text-ink"><Receipt size={18} className="text-brand" /> Riwayat Pembayaran</h3>
            {isPro ? (
              <div className="mt-3 flex items-center justify-between rounded-xl border p-3 text-body-sm">
                <div><div className="font-semibold text-ink">Albirru Pro · 1 bulan</div><div className="text-caption text-ink-muted">Via QRIS</div></div>
                <span className="font-bold text-ink">Rp 49.000</span>
              </div>
            ) : <p className="mt-3 rounded-lg bg-muted p-4 text-center text-body-sm text-ink-muted">Belum ada transaksi.</p>}
          </div>
        </div>

        {/* BENEFIT PRO */}
        <div className="rounded-2xl border border-brand/30 bg-brand-100/50 p-5">
          <div className="flex items-center gap-2 text-ink"><Gem size={18} className="text-brand" /><span className="text-body-lg font-bold">Albirru Pro</span></div>
          <div className="mt-1 text-h-md text-ink">Rp 49.000<span className="text-body-sm font-normal text-ink-muted">/bulan</span></div>
          <ul className="mt-4 space-y-2.5">
            {FITUR_PRO.map((f) => (
              <li key={f} className="flex items-start gap-2 text-body-sm text-ink-body"><Check size={16} className="mt-0.5 shrink-0 text-success" /> {f}</li>
            ))}
          </ul>
          {!isPro ? <UpgradeProButton className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-label text-white transition-colors hover:bg-brand-600">Upgrade Sekarang</UpgradeProButton> : <div className="mt-4 rounded-lg bg-white p-3 text-center text-body-sm font-semibold text-success-strong">✓ Sudah aktif</div>}
        </div>
      </div>
    </>
  );
}
