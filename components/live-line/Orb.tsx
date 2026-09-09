"use client";

// components/live-line/Orb.tsx
//
// The agent, as a soft gradient sphere. This replaces the bar-graph waveform
// the panel used to have.
//
// The waveform was the wrong metaphor: bars bouncing next to a mono-type
// status line read as audio-engineering telemetry, which is exactly the cold,
// technical register the product is trying to avoid. Every serious voice
// product - ElevenLabs, Retell, Vapi - represents its agent as an organic
// blob for the same reason. It reads as a presence rather than a process.
//
// HOW IT MOVES
//
// Energy (0..1) drives scale, inner brightness and blob drift. It comes from
// one of two places:
//
//   - A real FFT, when the line has pre-rendered audio. `level` is sampled
//     each frame and the orb genuinely follows the voice.
//   - A simulated envelope otherwise: a random walk on a setInterval, shaped
//     to look like speech rather than like a sine wave. This is deliberately
//     driven by a timer rather than requestAnimationFrame, because rAF is
//     suspended in backgrounded and occluded tabs while timers keep firing -
//     an orb frozen mid-pulse looks broken, a slightly coarser one does not.
//     CSS transitions smooth the 90ms steps into continuous motion.

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

export type OrbState = "idle" | "ringing" | "agent" | "caller" | "ended";

type OrbProps = {
  state: OrbState;
  /**
   * Live output level, 0..1, when the current line has real audio.
   *
   * Passed as a ref rather than a value because it changes per line while the
   * orb samples it per frame - reading `.current` in the parent's render just
   * to hand it down would both re-render the panel constantly and read a ref
   * during render, which React rightly objects to.
   */
  levelRef?: RefObject<(() => number) | null>;
  reduceMotion?: boolean;
  className?: string;
};

/** Resting energy per state, before any speech modulation. */
const BASE: Record<OrbState, number> = {
  idle: 0.16,
  ringing: 0.34,
  agent: 0.62,
  caller: 0.1,
  ended: 0.08,
};

export function Orb({ state, levelRef, reduceMotion = false, className }: OrbProps) {
  const [animated, setAnimated] = useState(BASE.idle);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    // Nothing to animate; the resting value is derived at render time below.
    if (reduceMotion) return;

    let raf = 0;
    let current = BASE[stateRef.current];

    // Real audio: follow the waveform every frame.
    const followAudio = () => {
      const read = levelRef?.current;
      if (read) {
        const target = 0.18 + read() * 0.85;
        current += (target - current) * 0.35;
        setAnimated(current);
      }
      raf = requestAnimationFrame(followAudio);
    };

    // No audio: a shaped random walk. Speech is bursty - loud syllables with
    // short troughs between - so the target jumps rather than eases, and only
    // the approach is smoothed.
    const id = window.setInterval(() => {
      if (levelRef?.current) return; // audio path owns the value
      const s = stateRef.current;
      const base = BASE[s];
      const swing = s === "agent" ? 0.42 : s === "ringing" ? 0.14 : 0.05;
      const target = base + (Math.random() ** 1.6) * swing;
      current += (target - current) * (s === "agent" ? 0.55 : 0.25);
      setAnimated(current);
    }, 90);

    raf = requestAnimationFrame(followAudio);

    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, state, levelRef]);

  // Under reduced motion the orb holds a still, state-appropriate value
  // rather than breathing.
  const energy = reduceMotion ? BASE[state] : animated;
  const listening = state === "caller";

  return (
    <div
      className={cn("relative aspect-square", className)}
      style={{ ["--energy" as string]: energy.toFixed(3) }}
      aria-hidden="true"
    >
      {/* Halo. Widest when the agent speaks, gone when it is listening. */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-2xl transition-opacity duration-500",
          state === "agent" ? "opacity-70" : state === "ringing" ? "opacity-45" : "opacity-25",
        )}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,122,89,0.55), rgba(255,232,221,0) 68%)",
          transform: "scale(calc(1.02 + var(--energy) * 0.14))",
          transition: "transform 140ms linear, opacity 500ms ease",
        }}
      />

      {/* The sphere. */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          transform: "scale(calc(0.965 + var(--energy) * 0.055))",
          transition: "transform 140ms linear",
          background:
            "radial-gradient(circle at 32% 28%, #fff6ee 0%, #ffd9c4 34%, #ff8f66 68%, #ef5a2e 100%)",
          boxShadow:
            "inset 0 -18px 40px rgba(180,60,20,0.28), inset 0 12px 30px rgba(255,255,255,0.5)",
        }}
      >
        {/* Drifting internal colour. Two blobs on different periods so the
            surface never resolves into a repeating loop. */}
        <div
          className="absolute -inset-1/4 rounded-full blur-2xl motion-safe:animate-orb-a"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,214,190,0.95), rgba(255,214,190,0) 60%)",
            opacity: "calc(0.35 + var(--energy) * 0.5)",
          }}
        />
        <div
          className="absolute -inset-1/4 rounded-full blur-2xl motion-safe:animate-orb-b"
          style={{
            background:
              "radial-gradient(circle at 70% 65%, rgba(228,86,40,0.85), rgba(228,86,40,0) 62%)",
            opacity: "calc(0.4 + var(--energy) * 0.35)",
          }}
        />

        {/* Specular highlight - what stops it reading as a flat circle. */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 34% 24%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 38%)",
          }}
        />

        {/* Grain. Keeps large flat gradients from banding on cheap panels. */}
        <div className="absolute inset-0 rounded-full bg-orb-grain opacity-[0.13] mix-blend-overlay" />
      </div>

      {/* Listening ring. When the caller is talking the orb goes quiet and
          this expands instead, so it is always obvious who holds the floor. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full border-2 border-signal/45 transition-all duration-500",
          listening ? "scale-110 opacity-100" : "scale-95 opacity-0",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full border border-signal/25 transition-all duration-700",
          listening ? "scale-[1.22] opacity-100" : "scale-95 opacity-0",
        )}
      />
    </div>
  );
}
