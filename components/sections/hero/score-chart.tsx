"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { SCORE_SERIES } from "@/lib/content";

// albirru-design-system.md §12.1
export function ScoreChart() {
  return (
    <div style={{ height: 52 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={SCORE_SERIES} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f5bff" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#2f5bff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke="#2f5bff" strokeWidth={2} fill="url(#scoreGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
