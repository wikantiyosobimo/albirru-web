"use client";

import { useFormState } from "react-dom";
import { Send, User, Mail, CheckCircle2, Lock } from "lucide-react";
import { submitContact } from "@/lib/actions/contact";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";

const TOPICS = [
  { value: "umum", label: "Pertanyaan Umum" },
  { value: "pro", label: "Albirru Pro" },
  { value: "sekolah", label: "Partnership Sekolah" },
  { value: "media", label: "Media & Kerja Sama" },
  { value: "teknis", label: "Bantuan Teknis" },
];

export function ContactForm() {
  const [state, formAction] = useFormState(submitContact, {} as { ok?: boolean; error?: string });

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <CheckCircle2 size={44} className="text-brand" />
        <h3 className="text-h-sm text-ink">Pesan terkirim!</h3>
        <p className="max-w-xs text-body-sm text-ink-muted">Terima kasih. Tim Albirru akan segera merespons pesanmu.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error ? <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{state.error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama Lengkap" name="nama" icon={User} placeholder="Nama Lengkap" required />
        <Field label="Email" name="email" type="email" icon={Mail} placeholder="Email" required />
      </div>
      <Field label="Nomor WhatsApp" name="whatsapp" type="tel" placeholder="Nomor WhatsApp" />
      <SelectField label="Saya ingin bertanya tentang" name="topik" placeholder="Pilih topik" options={TOPICS} />
      <div>
        <label htmlFor="pesan" className="mb-1.5 block text-label text-ink">Pesan</label>
        <textarea id="pesan" name="pesan" rows={4} required placeholder="Tuliskan pesan Anda di sini..." className="w-full rounded-md border bg-white p-3.5 text-body text-ink placeholder:text-ink-muted transition-colors focus:border-brand" />
      </div>
      <SubmitButton trailingIcon={Send}>Kirim Pesan</SubmitButton>
      <p className="flex items-center justify-center gap-1.5 text-caption text-ink-muted"><Lock size={13} /> Data Anda aman bersama kami.</p>
    </form>
  );
}
