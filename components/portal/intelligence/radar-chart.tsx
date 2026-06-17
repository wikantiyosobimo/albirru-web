type Axis = { label: string; value: number };
type Series = { values: number[]; color: string; dashed?: boolean; fill?: boolean };

export function RadarChart({ axes, series, size = 280 }: { axes: Axis[]; series: Series[]; size?: number }) {
  const n = axes.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 46;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, r: number): [number, number] => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const ring = (r: number) => axes.map((_, i) => pt(i, maxR * r).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon key={r} points={ring(r)} fill="none" stroke="#E8EDF4" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = pt(i, maxR);
        return <line key={`a${i}`} x1={cx} y1={cy} x2={x} y2={y} stroke="#E8EDF4" strokeWidth="1" />;
      })}
      {series.map((s, si) => {
        const pts = axes.map((_, i) => pt(i, (maxR * s.values[i]) / 100));
        const path = pts.map((p) => p.join(",")).join(" ");
        return (
          <g key={si}>
            <polygon points={path} fill={s.fill ? `${s.color}1A` : "none"} stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? "4 4" : undefined} />
            {!s.dashed && pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={s.color} />)}
          </g>
        );
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, maxR + 28);
        const anchor = Math.abs(x - cx) < 4 ? "middle" : x > cx ? "start" : "end";
        return (
          <text key={`l${i}`} x={x} y={y} textAnchor={anchor} className="fill-ink text-[11px] font-semibold">
            <tspan x={x} dy="-2">{a.label}</tspan>
            <tspan x={x} dy="13" fontWeight={800} fill={series[0]?.color}>{a.value}</tspan>
          </text>
        );
      })}
    </svg>
  );
}
