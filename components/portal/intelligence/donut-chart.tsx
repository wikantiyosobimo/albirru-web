import type { ReactNode } from "react";

export function Donut({
  segments, size = 140, stroke = 18, children,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = c * frac;
          const offset = -acc;
          acc += dash;
          return (
            <circle
              key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color}
              strokeWidth={stroke} strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">{children}</div>
    </div>
  );
}
