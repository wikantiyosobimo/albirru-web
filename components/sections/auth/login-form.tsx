"use client";

import { useFormState } from "react-dom";
import { useRef } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm() {
  const [state, formAction] = useFormState(login, { error: undefined });
  const formRef = useRef<HTMLFormElement>(null);

  function fillDemo(email: string) {
    const form = formRef.current;
    if (!form) return;
    const emailInput = form.querySelector<HTMLInputElement>('[name="email"]');
    const pwInput = form.querySelector<HTMLInputElement>('[name="password"]');
    if (emailInput) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (pwInput) {
      pwInput.value = "demo1234";
      pwInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
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

      <DemoAccounts onSelect={fillDemo} />
    </form>
  );
}

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "demo-admin@albirru.com", color: "bg-brand-100 text-brand-700 border-brand-200" },
  { label: "Tenaga Akademik", email: "demo-staf@albirru.com", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Siswa", email: "demo-siswa@albirru.com", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
] as const;

function DemoAccounts({ onSelect }: { onSelect: (email: string) => void }) {
  return (
    <div className="mt-2 rounded-xl border border-dashed border-ink-muted/30 bg-muted/50 p-4">
      <p className="mb-3 text-center text-caption font-medium uppercase tracking-wider text-ink-muted">
        Akun Demo — klik untuk mengisi
      </p>
      <div className="flex flex-col gap-2">
        {DEMO_ACCOUNTS.map((acc) => (
          <button
            key={acc.email}
            type="button"
            onClick={() => onSelect(acc.email)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-body-sm transition-shadow hover:shadow-sm ${acc.color}`}
          >
            <span className="font-semibold">{acc.label}</span>
            <span className="font-mono text-caption opacity-80">{acc.email}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-caption text-ink-muted">
        Password: <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-ink">demo1234</code>
      </p>
    </div>
  );
}
