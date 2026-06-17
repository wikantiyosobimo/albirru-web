const MONTHS = ["Feb '24", "Mar '24", "Apr '24", "Mei '24"];

export function MiniTrend({ title, values, compare, color = "#2F5BFF" }: { title: string; values: number[]; compare: number[]; color?: string }) {
  const w = 240;
  const h = 92;
  const all = [...values, ...compare];
  const min = Math.min(...all) - 6;
  const max = Math.max(...all) + 6;
  const xAt = (i: number) => 12 + i * ((w - 24) / (values.length - 1));
  const yAt = (v: number) => h - 22 - ((v - min) / (max - min)) * (h - 40);
  const path = (arr: number[]) => arr.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");

  return (
    <div>
      <div className="text-caption font-semibold text-ink">{title}</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-1 w-full">
        <polyline points={path(compare)} fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3" />
        <polyline points={path(values)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, i) => (
          <g key={i}>
            <circle cx={xAt(i)} cy={yAt(v)} r="3" fill={color} />
            <text x={xAt(i)} y={yAt(v) - 7} textAnchor="middle" className="fill-ink text-[9px] font-semibold">{v}</text>
          </g>
        ))}
        {MONTHS.map((m, i) => (
          <text key={m} x={xAt(i)} y={h - 4} textAnchor="middle" className="fill-current text-[8px] text-ink-muted">{m}</text>
        ))}
      </svg>
    </div>
  );
}
