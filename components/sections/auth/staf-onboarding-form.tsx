"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { ArrowRight, School, BookOpen } from "lucide-react";
import { completeStafOnboarding } from "@/lib/actions/onboarding";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";

const MATA_PELAJARAN = [
  { value: "matematika", label: "Matematika" },
  { value: "fisika", label: "Fisika" },
  { value: "kimia", label: "Kimia" },
  { value: "biologi", label: "Biologi" },
  { value: "bahasa-indonesia", label: "Bahasa Indonesia" },
  { value: "bahasa-inggris", label: "Bahasa Inggris" },
  { value: "penalaran-umum", label: "Penalaran Umum" },
  { value: "lainnya", label: "Lainnya" },
];

export function StafOnboardingForm() {
  const [state, formAction] = useFormState(completeStafOnboarding, {} as { error?: string });

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error ? <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{state.error}</p> : null}

      <div>
        <div className="text-label text-ink">1. Institusi</div>
        <div className="mt-3 grid gap-4">
          <Field label="Nama Institusi / Sekolah" name="asal_sekolah" icon={School} placeholder="cth. SMAN 1 Yogyakarta" required />
        </div>
      </div>

      <div>
        <div className="text-label text-ink">2. Bidang Pengajaran</div>
        <div className="mt-3 grid gap-4">
          <SelectField label="Mata Pelajaran Utama" name="mata_pelajaran" placeholder="Pilih bidang" options={MATA_PELAJARAN} />
          <Field label="Jabatan" name="jabatan" icon={BookOpen} placeholder="cth. Guru Matematika / Kepala Jurusan" />
        </div>
      </div>

      <SubmitButton trailingIcon={ArrowRight}>Masuk ke Konsol Staf</SubmitButton>
      <p className="text-center text-caption text-ink-muted">Bisa kamu ubah kapan saja di pengaturan profil.</p>
    </form>
  );
}
