"use client";

import { useFormState } from "react-dom";
import { User, Mail, ArrowRight } from "lucide-react";
import { signup } from "@/lib/actions/auth";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";

export function SignupForm({ peran }: { peran: string }) {
  const [state, formAction] = useFormState(signup, { error: undefined });
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="peran" value={peran} />
      {state?.error ? (
        <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{state.error}</p>
      ) : null}
      <Field label="Nama Lengkap" name="nama" icon={User} placeholder="Masukkan nama lengkapmu" autoComplete="name" required />
      <Field label="Email" name="email" type="email" icon={Mail} placeholder="Masukkan email aktifmu" autoComplete="email" required />
      <PasswordField label="Password" name="password" placeholder="Buat password" autoComplete="new-password" />
      <PasswordField label="Konfirmasi Password" name="konfirmasi" placeholder="Ulangi password" autoComplete="new-password" />
      <SubmitButton trailingIcon={ArrowRight}>Mulai Perjalanan</SubmitButton>
    </form>
  );
}
