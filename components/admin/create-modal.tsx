"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Plus, CheckCircle2, type LucideIcon } from "lucide-react";

type ConsoleAction = (fd: FormData) => Promise<{ ok: boolean; error?: string }>;

const inputCls = "h-11 w-full rounded-lg border bg-white px-3.5 text-body-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none";
const labelCls = "mb-1.5 block text-body-sm font-semibold text-ink";

// Field helpers — dipakai oleh form di dalam modal.
export function MField({ label, name, placeholder, required, type = "text", defaultValue }: {
  label: string; name: string; placeholder?: string; required?: boolean; type?: string; defaultValue?: string | number;
}) {
  return (
    <div>
      <label className={labelCls} htmlFor={`f-${name}`}>{label}{required ? <span className="text-[#E5484D]"> *</span> : null}</label>
      <input id={`f-${name}`} name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className={inputCls} />
    </div>
  );
}

export function MTextarea({ label, name, placeholder, required, rows = 3 }: {
  label: string; name: string; placeholder?: string; required?: boolean; rows?: number;
}) {
  return (
    <div>
      <label className={labelCls} htmlFor={`f-${name}`}>{label}{required ? <span className="text-[#E5484D]"> *</span> : null}</label>
      <textarea id={`f-${name}`} name={name} rows={rows} required={required} placeholder={placeholder} className={`${inputCls} h-auto py-2.5`} />
    </div>
  );
}

export function MSelect({ label, name, options, defaultValue }: {
  label: string; name: string; options: { value: string; label: string }[]; defaultValue?: string;
}) {
  return (
    <div>
      <label className={labelCls} htmlFor={`f-${name}`}>{label}</label>
      <select id={`f-${name}`} name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function CreateModal({
  label, icon: Icon = Plus, title, subtitle, action, children, buttonClassName,
}: {
  label: string;
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action: ConsoleAction;
  children: ReactNode;
  buttonClassName?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await action(fd);
    setBusy(false);
    if (!res.ok) { setError(res.error ?? "Gagal menyimpan."); return; }
    setDone(true);
    setTimeout(() => { setOpen(false); setDone(false); router.refresh(); }, 1000);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setError(null); setDone(false); }}
        className={buttonClassName ?? "inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"}
      >
        <Icon size={15} /> {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup dialog" className="absolute inset-0 bg-black/40" onClick={() => !busy && setOpen(false)} disabled={busy} />
          <div role="dialog" aria-modal="true" className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-lg">
            <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
              <div className="min-w-0">
                <h2 className="text-h-sm text-ink">{title}</h2>
                {subtitle ? <p className="mt-0.5 text-caption text-ink-muted">{subtitle}</p> : null}
              </div>
              <button onClick={() => setOpen(false)} disabled={busy} aria-label="Tutup" className="shrink-0 text-ink-muted hover:text-ink disabled:opacity-40"><X size={18} /></button>
            </div>

            {done ? (
              <div className="py-14 text-center">
                <CheckCircle2 size={40} className="mx-auto text-[#16B47A]" />
                <p className="mt-3 text-body-sm font-semibold text-ink">Berhasil disimpan!</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  {error ? <p className="rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}
                  {children}
                </div>
                <div className="flex justify-end gap-2 border-t px-5 py-3.5">
                  <button type="button" onClick={() => setOpen(false)} disabled={busy} className="h-10 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted disabled:opacity-60">Batal</button>
                  <button type="submit" disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-body-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
                    {busy ? <><Loader2 size={16} className="animate-spin" /> Menyimpan…</> : "Simpan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
