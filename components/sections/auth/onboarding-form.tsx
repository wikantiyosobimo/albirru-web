"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { ArrowRight, School, Building2, BookOpen, Landmark, Briefcase, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils";
import { SEGMENTS, getSegment, targetLists, estimateTarget } from "@/lib/data/targets";

const JENJANG = [
  { value: "10", label: "Kelas 10" },
  { value: "11", label: "Kelas 11" },
  { value: "12", label: "Kelas 12" },
  { value: "alumni", label: "Gap Year / Alumni" },
];
const JURUSAN = [
  { value: "ipa", label: "IPA / MIPA" },
  { value: "ips", label: "IPS" },
  { value: "bahasa", label: "Bahasa" },
  { value: "smk", label: "SMK" },
  { value: "lainnya", label: "Lainnya" },
];
const SEGMENT_OPTS = SEGMENTS.map((s) => ({ value: s.value, label: s.label }));

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

export function OnboardingForm() {
  const [state, formAction] = useFormState(completeOnboarding, {} as { error?: string });
  const [segment, setSegment] = useState("utbk");
  const [target, setTarget] = useState("");
  const [sub, setSub] = useState("");

  const seg = getSegment(segment);
  const lists = targetLists(segment);
  const isInstansi = seg.target === "instansi";
  const est = estimateTarget(segment, target, sub);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error ? <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{state.error}</p> : null}

      <div>
        <div className="text-label text-ink">1. Tentang Kamu</div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <SelectField label="Jenjang / Kelas" name="jenjang" placeholder="Pilih jenjang" options={JENJANG} required />
          <SelectField label="Jurusan" name="jurusan" placeholder="Pilih jurusan" options={JURUSAN} />
        </div>
        <div className="mt-4">
          <Field label="Asal Sekolah" name="asal_sekolah" icon={School} placeholder="cth. SMAN 1 Yogyakarta" />
        </div>
      </div>

      <div>
        <div className="text-label text-ink">2. Jenis Tes & Target</div>
        <div className="mt-3 grid gap-4">
          <SelectField label="Persiapan Ujian" name="segment" value={segment}
            onChange={(e) => { setSegment(e.target.value); setTarget(""); setSub(""); }} options={SEGMENT_OPTS} />

          <div className="grid gap-4 sm:grid-cols-2">
            {isInstansi ? (
              <>
                <ComboField label={`Target ${seg.targetNoun}`} name="target_instansi" icon={Landmark} placeholder="cth. Kementerian Keuangan" listId="ob-instansi" options={lists.target} value={target} onChange={setTarget} />
                <ComboField label={`Target ${seg.subNoun}`} name="target_jabatan" icon={Briefcase} placeholder="cth. Analis Keuangan" listId="ob-jabatan" options={lists.sub} value={sub} onChange={setSub} />
              </>
            ) : (
              <>
                <ComboField label={`Target ${seg.targetNoun}`} name="target_kampus" icon={Building2} placeholder={seg.value === "kedinasan" ? "cth. PKN STAN" : "cth. Universitas Gadjah Mada"} listId="ob-kampus" options={lists.target} value={target} onChange={setTarget} />
                <ComboField label={`Target ${seg.subNoun}`} name="target_prodi" icon={BookOpen} placeholder="cth. Teknik Informatika" listId="ob-prodi" options={lists.sub} value={sub} onChange={setSub} />
              </>
            )}
          </div>

          <input type="hidden" name="target_skor" value={est?.value ?? ""} />
          {!est ? (
            <div className="flex items-center gap-3 rounded-xl border bg-muted p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-xs"><Gauge size={18} /></span>
              <div className="text-body-sm text-ink-muted">Isi target di atas untuk melihat <b className="text-ink-body">perkiraan nilai</b> yang dibutuhkan agar lolos.</div>
            </div>
          ) : est.kind === "utbk" ? (
            <div className="rounded-xl border border-brand/30 bg-brand-100/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-label text-ink"><Gauge size={16} className="text-brand" /> Perkiraan Nilai</div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-caption font-semibold text-brand">{est.keketatan}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-3"><div className="text-caption text-ink-muted">Historis diterima</div><div className="text-h-sm leading-none text-ink">{est.historis} <span className="text-body-sm font-normal text-ink-muted">/ 1000</span></div></div>
                <div className="rounded-lg bg-white p-3"><div className="text-caption text-ink-muted">Target nilai aman</div><div className="text-h-sm leading-none text-success-strong">{est.targetAman} <span className="text-body-sm font-normal text-ink-muted">/ 1000</span></div></div>
              </div>
              <p className="mt-2.5 text-caption text-ink-muted">Estimasi berdasarkan keketatan prodi & tier kampus. Bukan janji lolos.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-brand/30 bg-brand-100/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-label text-ink"><Gauge size={16} className="text-brand" /> Ambang Batas SKD</div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-caption font-semibold text-brand">{est.keketatan}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[["TWK", est.twk], ["TIU", est.tiu], ["TKP", est.tkp]].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-white p-2.5 text-center"><div className="text-caption text-ink-muted">{k}</div><div className="text-h-sm leading-none text-ink">≥{v}</div></div>
                ))}
              </div>
              <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white px-3 py-2"><span className="text-caption text-ink-muted">Target total aman</span><span className="text-body-sm font-bold text-success-strong">{est.totalAman} <span className="font-normal text-ink-muted">/ {est.totalMax}</span></span></div>
              <p className="mt-2.5 text-caption text-ink-muted">{est.skbNote}</p>
            </div>
          )}
        </div>
      </div>

      <SubmitButton trailingIcon={ArrowRight}>Mulai Belajar</SubmitButton>
      <p className="text-center text-caption text-ink-muted">Bisa kamu ubah kapan saja di pengaturan profil.</p>
    </form>
  );
}
