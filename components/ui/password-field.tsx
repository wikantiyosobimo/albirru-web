"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export function PasswordField({
  label,
  name,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-label text-ink">
        {label}
      </label>
      <div className="relative">
        <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="h-12 w-full rounded-md border bg-white pl-11 pr-11 text-body text-ink placeholder:text-ink-muted transition-colors focus:border-brand"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
