import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Monogram } from "@/components/common/monogram";
import { ScoreChart } from "./score-chart";
import { SIDEBAR_ITEMS, SCHEDULE, PROGRESS, MOCKUP } from "@/lib/content";

function MockCard({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border bg-white p-3">{children}</div>;
}

// Hero "Academic Intelligence System" dashboard (UI spec, Appendix A).
export function DashboardMockup() {
  return (
    <div className="flex w-full overflow-hidden rounded-xl bg-white text-ink shadow-lg">
      <aside className="hidden w-[150px] flex-col gap-1 bg-navy-900 p-3 sm:flex">
        <div className="mb-3 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-brand text-[15px] font-extrabold text-white">
          A
        </div>
        {SIDEBAR_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] ${
                i === 0 ? "bg-brand font-semibold text-white" : "text-white/72"
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </aside>

      <div className="min-w-0 flex-1 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] font-bold text-ink">Halo, {MOCKUP.greeting.name} 👋</div>
            <div className="text-[11px] text-ink-muted">{MOCKUP.greeting.subtitle}</div>
          </div>
          <div className="flex items-center gap-2.5">
            <Bell size={16} className="text-ink-muted" />
            <Monogram label="A" size={28} />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <MockCard>
            <div className="text-[10px] text-ink-muted">Prediksi Lolos</div>
            <div className="text-[12px] font-semibold text-ink">{MOCKUP.prediction.program}</div>
            <div className="text-[24px] font-extrabold text-ink">{MOCKUP.prediction.percentage}%</div>
            <div className="mt-2">
              <Progress value={MOCKUP.prediction.percentage} />
            </div>
            <div className="mt-2 flex justify-between text-[9px]">
              <div>
                <div className="text-ink-muted">Target Skor</div>
                <div className="font-bold text-ink">{MOCKUP.prediction.target}</div>
              </div>
              <div className="text-right">
                <div className="text-ink-muted">Skor Saat Ini</div>
                <div className="font-bold text-ink">{MOCKUP.prediction.current}</div>
              </div>
            </div>
          </MockCard>

          <MockCard>
            <div className="text-[10px] text-ink-muted">Academic Score</div>
            <div className="flex items-end justify-between">
              <div className="text-[24px] font-extrabold text-ink">
                {MOCKUP.score.value}
                <span className="text-[12px] font-semibold text-ink-muted"> /{MOCKUP.score.max}</span>
              </div>
              <Badge variant="success" size="sm">
                Good
              </Badge>
            </div>
            <ScoreChart />
          </MockCard>

          <MockCard>
            <div className="text-[10px] text-ink-muted">Jadwal Hari Ini</div>
            <div className="mt-1.5 flex flex-col gap-2">
              {SCHEDULE.map((s) => (
                <div key={s.id} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                  <div className="text-[10px]">
                    <div className="font-semibold text-ink">{s.time}</div>
                    <div className="text-ink-muted">
                      {s.subject} · {s.topic}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] font-semibold text-brand">Lihat Kalender</div>
          </MockCard>

          <MockCard>
            <div className="text-[10px] text-ink-muted">Progress Belajar</div>
            <div className="mt-1.5 flex flex-col gap-2">
              {PROGRESS.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-[9px]">
                    <span className="text-ink-body">{p.label}</span>
                    <span className="font-semibold text-ink">{p.value}%</span>
                  </div>
                  <div className="mt-1">
                    <Progress value={p.value} height={4} />
                  </div>
                </div>
              ))}
            </div>
          </MockCard>
        </div>
      </div>
    </div>
  );
}
