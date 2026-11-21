"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface Segment {
  label: string;
  value: number;
  color: string;
}

const R = 70;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function DonutChart({ segments, center }: { segments: Segment[]; center: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const total = segments.reduce((a, s) => a + Math.max(0, s.value), 0);
  let offset = 0;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[220px]">
      <svg viewBox="0 0 180 180" className="h-full w-full" role="img">
        <circle cx={90} cy={90} r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth={18} />
        {segments.map((s) => {
          const len = total > 0 ? (Math.max(0, s.value) / total) * CIRCUMFERENCE : 0;
          const dash = ready ? len : 0;
          const circle = (
            <circle
              key={s.label}
              cx={90}
              cy={90}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={18}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 90 90)"
              style={{ transition: "stroke-dasharray 0.9s cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
          );
          offset += len;
          return circle;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{center}</div>
    </div>
  );
}
