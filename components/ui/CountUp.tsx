// components/ui/CountUp.tsx
//
// Counts to a value when it scrolls into view, once. Under reduced motion it
// renders the final value immediately - a number ticking up is decoration,
// but the number itself is content.
//
// The safety net below is not paranoia. requestAnimationFrame is suspended
// while a tab is backgrounded or its window is occluded, so a visitor who
// scrolls a stat into view and immediately switches tabs comes back to a
// counter frozen part-way - "2%" where the real figure is 27%. A decorative
// animation failing is fine; a statistic silently rendering the wrong number
// is not, and this component exists mostly to show statistics.

"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { formatNumber } from "@/lib/utils";

type CountUpProps = {
  to: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Comma-group the number. Off for years, ratings, small counts. */
  group?: boolean;
};

export function CountUp({
  to,
  durationMs = 1400,
  prefix = "",
  suffix = "",
  className,
  group = true,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [animated, setAnimated] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    // Nothing to run under reduced motion - the final value is derived at
    // render time below rather than pushed into state from here, which would
    // cascade an extra render for no reason.
    if (reduce) return;

    const el = ref.current;
    if (!el || started.current) return;

    let raf = 0;
    let safety = 0;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          // easeOutCubic - quick off the mark, settles rather than stops.
          setAnimated(to * (1 - Math.pow(1 - t, 3)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        // If rAF never delivers the final frame - backgrounded tab, occluded
        // window, throttled device - land on the real number anyway. Timers
        // are clamped in background tabs but they do still fire.
        safety = window.setTimeout(() => setAnimated(to), durationMs + 400);
      },
      { threshold: 0.4 },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [to, durationMs, reduce]);

  // `reduce` is null on the first render and a boolean immediately after, so
  // this reads as "not reduced" until it resolves - which is the right
  // fallback either way.
  const value = reduce ? to : animated;
  const shown = group ? formatNumber(value) : String(Math.round(value));

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
