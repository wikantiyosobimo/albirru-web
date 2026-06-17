import { Sparkles } from "lucide-react";

export function ComingSoon({ note }: { note?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="max-w-md rounded-2xl border bg-white p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand"><Sparkles size={26} /></span>
        <h2 className="mt-4 text-h-md text-ink">Sedang Disiapkan</h2>
        <p className="mt-2 text-body-sm text-ink-body">{note ?? "Halaman ini sedang dalam pengembangan dan akan segera hadir dengan gaya yang sama."}</p>
      </div>
    </div>
  );
}
