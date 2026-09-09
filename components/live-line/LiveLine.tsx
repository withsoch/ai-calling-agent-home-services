"use client";

// components/live-line/LiveLine.tsx
//
// The hero's sample call. State machine lives in useCallEngine; this file is
// the surface.
//
// WHAT CHANGED AND WHY
//
// The first version was a dark console: mono uppercase labels, a bar-graph
// waveform, a scrolling AGENT/CALLER transcript, a "CAPTURED" chip rail and a
// controls bar. It read as a log viewer. For a product whose promise is "this
// will not sound like a robot to your customer", presenting it as machine
// telemetry undercuts the pitch before a single word is spoken.
//
// This version follows what the serious voice products do: a calm light
// surface, one soft orb standing in for the agent, and exactly one line of
// speech at a time in type big enough to actually read. Everything else is
// either quiet or absent until the call ends.
//
// Accessibility:
//   - The full conversation is mirrored into a visually-hidden log with an
//     aria-live region, so a screen reader follows the whole call rather than
//     hearing one bubble replace another.
//   - Captions are the primary channel, not a fallback. There is no audio
//     path that carries information the text does not.
//   - Every control is a real button with a visible label.
//   - Under prefers-reduced-motion the orb holds still and lines cross-fade
//     rather than rising.

import { useState } from "react";
import { Orb, type OrbState } from "@/components/live-line/Orb";
import { useCallEngine, type Phase } from "@/components/live-line/useCallEngine";
import { BookingModal } from "@/components/BookingModal";
import { cn, formatClock } from "@/lib/utils";

export function LiveLine() {
  const {
    scenario,
    scenarios,
    selectScenario,
    phase,
    line,
    previous,
    index,
    capturedIds,
    elapsedMs,
    muted,
    toggleMute,
    hasRun,
    levelRef,
    start,
    replay,
    skip,
    reduceMotion,
  } = useCallEngine();

  const [booking, setBooking] = useState(false);

  const ended = phase === "ended";
  const speaker = line?.speaker ?? null;

  const orbState: OrbState =
    phase === "idle"
      ? "idle"
      : phase === "ringing"
        ? "ringing"
        : ended
          ? "ended"
          : speaker === "agent"
            ? "agent"
            : "caller";

  const captured = scenario.captures.filter((c) => capturedIds.includes(c.id));

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-cream shadow-card">
        {/* Warm wash behind the orb. One soft gradient, no dot grid - the
            panel should feel like a room, not a dashboard. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 55% at 50% 22%, rgba(255,214,190,0.55) 0%, rgba(255,214,190,0) 70%)",
          }}
        />

        <Header
          phase={phase}
          business={scenario.business}
          meta={scenario.meta}
          elapsedMs={elapsedMs}
          muted={muted}
          onToggleMute={toggleMute}
        />

        {/* min-height holds the panel steady across states. Without it the
            outcome card makes the ended state ~400px taller than the call
            itself, and the whole hero column jumps as the call finishes. */}
        <div className="relative flex min-h-[26.5rem] flex-col items-center px-5 pt-6 pb-5 sm:px-8">
          <Orb
            state={orbState}
            levelRef={levelRef}
            reduceMotion={reduceMotion}
            className="w-[8.5rem] sm:w-[9.5rem]"
          />

          <Caption
            phase={phase}
            agentName={scenario.agentName}
            callerLabel={scenario.callerLabel}
            greeting={scenario.greeting}
            premise={scenario.premise}
            line={line}
            previous={previous}
            index={index}
            closer={scenario.closer}
            elapsedMs={elapsedMs}
            reduceMotion={reduceMotion}
          />

          {ended ? (
            <Outcome outcome={scenario.outcome} onBook={() => setBooking(true)} />
          ) : (
            <CapturedRow captured={captured} />
          )}

          <Controls
            phase={phase}
            hasRun={hasRun}
            onCall={start}
            onReplay={replay}
            onSkip={skip}
          />
        </div>

        {/* The whole conversation, for screen readers. One bubble replacing
            another in an aria-live region announces fragments out of context;
            an append-only log reads as the call it is. */}
        <div className="sr-only" aria-live="polite" aria-atomic="false">
          {scenario.lines.slice(0, Math.max(0, index + 1)).map((l, i) => (
            <p key={i}>
              {l.speaker === "agent" ? scenario.agentName : scenario.callerLabel}: {l.text}
            </p>
          ))}
        </div>
      </div>

      <ScenarioChips
        scenarios={scenarios}
        activeId={scenario.id}
        onSelect={selectScenario}
        disabled={phase === "ringing"}
      />

      {booking && <BookingModal onClose={() => setBooking(false)} />}
    </div>
  );
}

/* ----------------------------------------------------------------- header */

function Header({
  phase,
  business,
  meta,
  elapsedMs,
  muted,
  onToggleMute,
}: {
  phase: Phase;
  business: string;
  meta: string;
  elapsedMs: number;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const active = phase === "connected" || phase === "ringing";

  return (
    <div className="relative flex items-center gap-3 border-b border-line/70 px-5 py-3.5 sm:px-6">
      <span className="relative flex h-2 w-2 shrink-0">
        {active && (
          <span className="absolute inset-0 rounded-full bg-brand motion-safe:animate-signal-pulse" />
        )}
        <span
          className={cn(
            "relative h-2 w-2 rounded-full transition-colors",
            active ? "bg-brand" : "bg-muted/40",
          )}
        />
      </span>

      <p className="min-w-0 truncate text-15 font-medium text-ink">{business}</p>
      <span className="hidden text-14 text-muted sm:inline">· {meta}</span>
      {/* Delta Heating is invented. Say so rather than letting the header
          imply this is a recording of a real customer call. */}
      <span className="rounded-full border border-line bg-white/70 px-2 py-0.5 text-[11px] font-medium tracking-[0.04em] text-muted uppercase">
        Sample
      </span>

      <span className="ml-auto flex items-center gap-2.5">
        {phase !== "idle" && (
          <span
            className="text-14 tabular-nums text-muted"
            aria-label={`Call duration ${formatClock(elapsedMs / 1000)}`}
          >
            {formatClock(elapsedMs / 1000)}
          </span>
        )}
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Turn call sounds on" : "Turn call sounds off"}
          title={muted ? "Sound off" : "Sound on"}
          className={cn(
            "rounded-full p-1.5 transition-colors",
            muted ? "text-muted hover:text-ink" : "text-ink-soft hover:bg-white/70",
          )}
        >
          {muted ? <IconMuted /> : <IconSound />}
        </button>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- caption */

/**
 * One line at a time, big enough to read from across a desk.
 *
 * A fixed min-height reserves the space three lines of speech would need, so
 * the orb and the buttons never jump as turns of different lengths replace
 * each other - the single most distracting thing a caption area can do.
 */
function Caption({
  phase,
  agentName,
  callerLabel,
  greeting,
  premise,
  line,
  previous,
  index,
  closer,
  elapsedMs,
  reduceMotion,
}: {
  phase: Phase;
  agentName: string;
  callerLabel: string;
  greeting: string;
  premise: string;
  line: { speaker: "agent" | "caller"; text: string } | null;
  previous: { speaker: "agent" | "caller"; text: string } | null;
  index: number;
  closer: string;
  elapsedMs: number;
  reduceMotion: boolean;
}) {
  if (phase === "idle") {
    return (
      <div className="mt-6 flex min-h-[6.5rem] w-full flex-col items-center justify-start text-center">
        <p className="max-w-sm text-20 leading-[1.4] font-medium text-ink">“{greeting}”</p>
        <p className="mt-3 max-w-xs text-15 leading-[1.5] text-muted">{premise}</p>
      </div>
    );
  }

  if (phase === "ringing") {
    return (
      <div className="mt-6 flex min-h-[6.5rem] w-full items-start justify-center">
        <p className="text-18 text-muted">Ringing…</p>
      </div>
    );
  }

  if (phase === "ended") {
    // Floor, not round: the header clock floors, and a closing line claiming
    // "52 seconds" beside a timer reading 0:51 is exactly the kind of small
    // inconsistency that makes a demo look fake.
    const seconds = Math.floor(elapsedMs / 1000);
    const spoken =
      seconds < 60
        ? `${seconds} seconds`
        : `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
    return (
      <div className="mt-6 flex w-full flex-col items-center justify-start text-center">
        <p className="max-w-md text-20 leading-[1.4] font-medium text-ink">
          {closer.replace("{time}", spoken)}
        </p>
      </div>
    );
  }

  const name = line?.speaker === "agent" ? agentName : callerLabel;
  const isAgent = line?.speaker === "agent";

  return (
    <div className="mt-6 flex min-h-[6.5rem] w-full flex-col items-stretch">
      {/* The line before, small and receding - enough context to follow the
          thread without turning this back into a transcript. */}
      <p
        className={cn(
          "truncate text-14 text-muted/70 transition-opacity duration-300",
          previous ? "opacity-100" : "opacity-0",
          previous?.speaker === "agent" ? "text-left" : "text-right",
        )}
      >
        {previous?.text}
      </p>

      <div className={cn("mt-2 flex", isAgent ? "justify-start" : "justify-end")}>
        <div
          // Keyed on the line index so React remounts it and the entry
          // animation replays on every turn.
          key={index}
          className={cn(
            "max-w-[85%] rounded-2xl px-4 py-3 text-left shadow-soft",
            isAgent
              ? "rounded-bl-sm border border-line bg-white"
              : "rounded-br-sm border border-line/70 bg-white/55",
            !reduceMotion && "motion-safe:animate-bubble-in",
          )}
        >
          <p className={cn("text-13 font-medium", isAgent ? "text-brand-dark" : "text-muted")}>
            {name}
          </p>
          <p
            className={cn(
              "mt-0.5 text-[1.0625rem] leading-[1.45]",
              isAgent ? "text-ink" : "text-slate",
            )}
          >
            {line?.text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- captured */

function CapturedRow({
  captured,
}: {
  captured: { id: string; label: string; value: string }[];
}) {
  return (
    <div className="mt-5 flex min-h-[2.75rem] w-full flex-wrap items-start justify-center gap-1.5">
      {captured.map((c, i) => (
        <span
          key={c.id}
          style={{ animationDelay: `${i * 25}ms` }}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-2.5 py-1 text-13 text-slate motion-safe:animate-chip-in"
        >
          <IconCheck className="h-3 w-3 shrink-0 text-leaf" />
          <span className="font-medium text-ink">{c.value}</span>
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- outcome */

function Outcome({
  outcome,
  onBook,
}: {
  outcome: {
    system: string;
    title: string;
    rows: { label: string; value: string }[];
    side: string[];
  };
  onBook: () => void;
}) {
  return (
    <div className="mt-5 w-full motion-safe:animate-card-in">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-13 font-semibold text-leaf">
            <IconBolt className="h-3 w-3" />
            {outcome.system}
          </span>
          <span className="text-15 font-semibold text-ink">{outcome.title}</span>
        </div>

        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {outcome.rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-13 text-muted">{row.label}</dt>
              <dd className="truncate text-14 font-medium text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3">
          {outcome.side.map((s) => (
            <li key={s} className="flex items-center gap-1.5 text-13 text-slate">
              <IconCheck className="h-3 w-3 text-leaf" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onBook}
        className="group mt-3 inline-flex items-center gap-1.5 text-16 font-semibold text-brand-dark transition-colors hover:text-ink"
      >
        Book fifteen minutes
        <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

/* --------------------------------------------------------------- controls */

/**
 * Circular icon buttons with the label underneath, the pattern every voice
 * product converges on - it keeps the primary action large and tappable
 * without a wide pill dominating a narrow panel.
 */
function Controls({
  phase,
  hasRun,
  onCall,
  onReplay,
  onSkip,
}: {
  phase: Phase;
  hasRun: boolean;
  onCall: () => void;
  onReplay: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="mt-4 flex items-start justify-center gap-7">
      {phase === "idle" && (
        <CircleButton
          onClick={onCall}
          label={hasRun ? "Call again" : "Play the call"}
          variant="primary"
        >
          <IconHandset className="h-5 w-5" />
        </CircleButton>
      )}

      {phase === "ringing" && (
        <CircleButton label="Connecting" variant="primary" disabled>
          <IconHandset className="h-5 w-5 motion-safe:animate-ring-shake" />
        </CircleButton>
      )}

      {phase === "connected" && (
        <CircleButton onClick={onSkip} label="Skip to the end" variant="ghost">
          <IconSkip className="h-4 w-4" />
        </CircleButton>
      )}

      {phase === "ended" && (
        <CircleButton onClick={onReplay} label="Play again" variant="ghost">
          <IconReplay className="h-4 w-4" />
        </CircleButton>
      )}
    </div>
  );
}

function CircleButton({
  children,
  label,
  onClick,
  variant,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant: "primary" | "ghost";
  disabled?: boolean;
}) {
  return (
    <div className="flex w-24 flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full transition-all duration-200",
          disabled && "cursor-default opacity-60",
          variant === "primary"
            ? "bg-brand text-white hover:bg-brand-dark hover:shadow-[0_0_0_6px_rgba(255,92,53,0.13)]"
            : "border border-line bg-white text-ink-soft hover:border-ink/25 hover:text-ink",
        )}
      >
        {children}
      </button>
      <span className="text-center text-13 leading-tight text-muted">{label}</span>
    </div>
  );
}

/* --------------------------------------------------------- scenario chips */

function ScenarioChips({
  scenarios,
  activeId,
  onSelect,
  disabled,
}: {
  scenarios: { id: string; chip: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <div
      className="mt-3 flex flex-wrap items-center justify-center gap-1.5"
      role="group"
      aria-label="Choose a call scenario"
    >
      {scenarios.map((s) => {
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            disabled={disabled}
            aria-pressed={active}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-14 font-medium transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-45",
              active
                ? "bg-ink text-white"
                : "border border-line bg-white text-slate hover:border-ink/25 hover:text-ink",
            )}
          >
            {s.chip}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ icons */

function IconHandset({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5.2 2.3 6.6 5 5.3 6.4a8.4 8.4 0 0 0 4.3 4.3L11 9.4l2.7 1.4-.4 2.2c-.1.5-.6.9-1.1.8A11.6 11.6 0 0 1 2.2 3.8c-.1-.5.3-1 .8-1.1l2.2-.4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSound() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.8 4.9 5.4H2.6v5.2h2.3L8 13.2V2.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M10.8 5.6a3.4 3.4 0 0 1 0 4.8M12.7 3.6a6 6 0 0 1 0 8.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMuted() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.8 4.9 5.4H2.6v5.2h2.3L8 13.2V2.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M10.9 6.2l3.2 3.6M14.1 6.2l-3.2 3.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2.2 6.3 4.6 8.7 9.8 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path d="M6.8 1 2.6 6.6h2.7L5.2 11l4.2-5.6H6.7L6.8 1Z" fill="currentColor" />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconReplay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2.2 7a4.8 4.8 0 1 0 1.5-3.5M2 1.8v2.9h2.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSkip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 3.2 8 7l-5 3.8V3.2ZM10.6 3v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
