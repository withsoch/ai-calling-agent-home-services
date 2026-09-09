// components/ui/Mark.tsx
//
// The First Ring mark: a solid core with one ring propagating out of it. Reads
// as a phone ring and as the first crest of a waveform, which is the whole
// brand in one glyph.
//
// The ring animates outward once on mount and once per hover. It does not
// loop - a permanently pulsing logo is noise, and the site already has a live
// dot in the hero doing exactly that job where it means something.

import { cn } from "@/lib/utils";

export function Mark({
  className,
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <circle cx="12" cy="12" r="3.4" fill="currentColor" />
      <circle
        cx="12"
        cy="12"
        r="8.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        // 0.62 of the circumference drawn, rotated so the gap sits on the
        // left - an arc reads as a ring propagating, a full circle reads as
        // a target.
        strokeDasharray="32 20"
        transform="rotate(-58 12 12)"
        opacity="0.9"
        className={cn(animate && "motion-safe:animate-mark-ring origin-center")}
      />
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
  animate = true,
}: {
  className?: string;
  markClassName?: string;
  animate?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold", className)}>
      <Mark className={cn("h-[1.35em] w-[1.35em] text-brand", markClassName)} animate={animate} />
      <span className="tracking-[-0.015em]">First Ring</span>
    </span>
  );
}
