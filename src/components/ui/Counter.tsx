import { useEffect, useRef, useState } from "react";

interface CounterProps {
  /** target number to count up to */
  to: number;
  /** number of decimals to show (e.g. 1 for 6.5) */
  decimals?: number;
  /** animation duration in ms */
  duration?: number;
  /** delay before counting starts, ms */
  delay?: number;
}

/** Eases out cubic — fast start, gentle finish. */
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Animates from 0 → `to` once when scrolled into view. */
export default function Counter({
  to,
  decimals = 0,
  duration = 1500,
  delay = 0,
}: CounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const startTime = performance.now() + delay;
      let raf = 0;
      const tick = (now: number) => {
        const t = Math.max(0, Math.min(1, (now - startTime) / duration));
        const eased = easeOutCubic(t);
        setValue(to * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration, delay]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}
