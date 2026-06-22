import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard } from "@/components/console/ui";
import { CsvImport } from "@/components/admin/csv-import";

export const metadata = { title: "Import Soal — Admin Albirru" };

export default async function AdminBankSoalImport() {
  const { profile } = await requireAdmin();

  const kolom = ["kode", "mapel", "topic_slug", "level_kesulitan", "tipe", "cognitive_skill", "soal", "opsi_a..e", "answer_key", "pembahasan"];

  return (
    <>
      <ConsoleTopbar eyebrow="Konten  ›  Bank Soal" title="Import Soal (CSV)" subtitle="Bulk import dengan validasi per-baris." nama={profile?.nama ?? "Admin"} roleLabel="Admin"
        right={<Link href="/admin/bank-soal" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-7">
        <ConsoleCard title="Unggah File">
          <CsvImport />
          <p className="mt-3 text-caption text-ink-muted">Divalidasi per-baris di server. Baris dengan <code className="rounded bg-muted px-1">answer_key</code> kosong/tidak valid ditolak; kunci jawaban tetap aman server-side.</p>
        </ConsoleCard>

        <ConsoleCard title="Format Kolom">
          <ul className="space-y-2 text-body-sm">
            {kolom.map((k) => <li key={k} className="flex items-center gap-2"><CheckCircle2 size={15} className="shrink-0 text-success" /> <code className="text-ink-body">{k}</code></li>)}
          </ul>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#FEF3C7] p-3 text-caption text-[#92400E]">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" /> Baris dengan <code>answer_key</code> kosong/ganda akan ditolak & dilaporkan.
          </div>
        </ConsoleCard>
      </div>
    </>
  );
}
