"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Save, User, School, Building2, BookOpen, Landmark, Briefcase, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils";
import { SEGMENTS, getSegment, targetLists, estimateTarget } from "@/lib/data/targets";

const JENJANG = [
  { value: "10", label: "Kelas 10" }, { value: "11", label: "Kelas 11" },
  { value: "12", label: "Kelas 12" }, { value: "alumni", label: "Gap Year / Alumni" },
];
const JURUSAN = [
  { value: "ipa", label: "IPA / MIPA" }, { value: "ips", label: "IPS" },
  { value: "bahasa", label: "Bahasa" }, { value: "smk", label: "SMK" }, { value: "lainnya", label: "Lainnya" },
];
const SEGMENT_OPTS = SEGMENTS.map((s) => ({ value: s.value, label: s.label }));

export type ProfileDefaults = {
  nama: string; jenjang: string; jurusan: string; asal_sekolah: string; segment: string;
  target_kampus: string; target_prodi: string; target_instansi: string; target_jabatan: string;
};

function ComboField({ label, name, icon: Icon, placeholder, listId, options, value, onChange }: {
  label: string; name: string; icon: LucideIcon; placeholder: string; listId: string;
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-label text-ink">{label}</label>
      <div className="relative">
        <Icon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input id={name} name={name} list={listId} autoComplete="off" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-md border bg-white pl-11 pr-4 text-body text-ink placeholder:text-ink-muted transition-colors focus:border-brand" />
        <datalist id={listId}>{options.map((o) => <option key={o} value={o} />)}</datalist>
      </div>
    </div>
  );
}

export function ProfileEditForm({ defaults }: { defaults: ProfileDefaults }) {
  const [state, formAction] = useFormState(updateProfile, {} as ProfileState);
  const [segment, setSegment] = useState(defaults.segment || "utbk");
  const seg = getSegment(segment);
  const isInstansi = seg.target === "instansi";
  const [target, setTarget] = useState(isInstansi ? defaults.target_instansi : defaults.target_kampus);
  const [sub, setSub] = useState(isInstansi ? defaults.target_jabatan : defaults.target_prodi);
  const lists = targetLists(segment);
  const est = estimateTarget(segment, target, sub);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error ? <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{state.error}</p> : null}

      <div>
        <div className="text-label text-ink">1. Tentang Kamu</div>
        <div className="mt-3"><Field label="Nama Lengkap" name="nama" icon={User} defaultValue={defaults.nama} placeholder="Nama kamu" required /></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SelectField label="Jenjang / Kelas" name="jenjang" placeholder="Pilih jenjang" defaultValue={defaults.jenjang} options={JENJANG} />
          <SelectField label="Jurusan" name="jurusan" placeholder="Pilih jurusan" defaultValue={defaults.jurusan} options={JURUSAN} />
        </div>
        <div className="mt-4"><Field label="Asal Sekolah" name="asal_sekolah" icon={School} defaultValue={defaults.asal_sekolah} placeholder="cth. SMAN 1 Yogyakarta" /></div>
      </div>

      <div>
        <div className="text-label text-ink">2. Jenis Tes & Target</div>
        <div className="mt-3 grid gap-4">
          <SelectField label="Persiapan Ujian" name="segment" value={segment}
            onChange={(e) => { setSegment(e.target.value); setTarget(""); setSub(""); }} options={SEGMENT_OPTS} />
          <div className="grid gap-4 sm:grid-cols-2">
            {isInstansi ? (
              <>
                <ComboField label={`Target ${seg.targetNoun}`} name="target_instansi" icon={Landmark} placeholder="cth. Kementerian Keuangan" listId="e-instansi" options={lists.target} value={target} onChange={setTarget} />
                <ComboField label={`Target ${seg.subNoun}`} name="target_jabatan" icon={Briefcase} placeholder="cth. Analis Keuangan" listId="e-jabatan" options={lists.sub} value={sub} onChange={setSub} />
              </>
            ) : (
              <>
                <ComboField label={`Target ${seg.targetNoun}`} name="target_kampus" icon={Building2} placeholder={seg.value === "kedinasan" ? "cth. PKN STAN" : "cth. Universitas Gadjah Mada"} listId="e-kampus" options={lists.target} value={target} onChange={setTarget} />
                <ComboField label={`Target ${seg.subNoun}`} name="target_prodi" icon={BookOpen} placeholder="cth. Teknik Informatika" listId="e-prodi" options={lists.sub} value={sub} onChange={setSub} />
              </>
            )}
          </div>

          <input type="hidden" name="target_skor" value={est?.value ?? ""} />
          <div className={cn("flex items-start gap-3 rounded-xl border p-4", est ? "border-brand/30 bg-brand-100/50" : "bg-muted")}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-xs"><Gauge size={18} /></span>
            {est ? (
              <div className="min-w-0">
                <div className="text-caption text-ink-muted">Perkiraan nilai aman ({seg.scoreUnit.replace("/ ", "")})</div>
                <div className="text-h-sm leading-none text-ink">{est.value}</div>
                <p className="mt-1 text-caption text-ink-muted">Diperbarui otomatis dari target di atas.</p>
              </div>
            ) : <div className="text-body-sm text-ink-muted">Isi target untuk melihat perkiraan nilai.</div>}
          </div>
        </div>
      </div>

      <SubmitButton leadingIcon={Save}>Simpan Perubahan</SubmitButton>
    </form>
  );
}
