"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm() {
  const [state, formAction] = useFormState(login, { error: undefined });
  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error ? (
        <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{state.error}</p>
      ) : null}
      <Field
        label="Email atau Nomor HP"
        name="email"
        type="text"
        icon={Mail}
        placeholder="Masukkan email atau nomor HP"
        autoComplete="username"
        required
      />
      <PasswordField label="Kata Sandi" name="password" placeholder="Masukkan kata sandi" autoComplete="current-password" />
      <div className="-mt-1 text-right">
        <Link href="/lupa-sandi" className="text-body-sm text-brand hover:underline">
          Lupa kata sandi?
        </Link>
      </div>
      <SubmitButton leadingIcon={ArrowRight}>Masuk Sekarang</SubmitButton>
    </form>
  );
}
