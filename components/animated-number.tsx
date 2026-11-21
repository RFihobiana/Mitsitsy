"use client";

import { useEffect, useRef, useState } from "react";

/** Counts smoothly from the previous value to the new one. */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    const duration = 650;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = origin + (value - origin) * eased;
      from.current = v;
      setDisplay(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span>{format(display)}</span>;
}
