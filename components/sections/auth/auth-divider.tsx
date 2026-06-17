export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-hair" />
      <span className="text-caption text-ink-muted">{label}</span>
      <span className="h-px flex-1 bg-hair" />
    </div>
  );
}
