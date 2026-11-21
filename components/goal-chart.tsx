"use client";

interface GoalChartProps {
  points: number[];
  target: number;
  format: (n: number) => string;
  monthLabel: string;
}

/** Bars of cumulative savings per month; the dashed line is the target. */
export function GoalChart({ points, target, format, monthLabel }: GoalChartProps) {
  return (
    <div>
      <div className="relative flex h-44 items-end gap-1.5 border-b border-border pt-4">
        <div className="absolute inset-x-0 top-4 border-t border-dashed border-primary/60" />
        {points.map((p, i) => {
          const height = target > 0 ? Math.max(2, (p / target) * 100) : 0;
          const reached = p >= target;
          return (
            <div key={`${i}-${p}`} className="flex h-full flex-1 items-end" title={format(p)}>
              <div
                className={`w-full origin-bottom animate-grow rounded-t-sm ${reached ? "bg-primary" : "bg-primary/45"}`}
                style={{ height: `${height}%`, animationDelay: `${i * 60}ms` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {points.map((_, i) => (
          <span key={i} className="flex-1 text-center text-[10px] text-muted-foreground">
            {monthLabel}
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
