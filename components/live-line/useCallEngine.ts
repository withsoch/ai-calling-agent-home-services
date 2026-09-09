"use client";

// components/live-line/useCallEngine.ts
//
// The state machine behind the hero's sample call.
//
//   idle ──Call──▶ ringing ──(one ring)──▶ connected ──(lines)──▶ ended
//     ▲                                                             │
//     └──────────────── reset / switch scenario ◀───────────────────┘
//
// It rings exactly once. That is not a timing accident - the product is
// called First Ring and the demo has to demonstrate the claim in the first
// two seconds or the name is just a word.
//
// Written as an async run loop with a cancellation token rather than a
// reducer plus a pile of timeouts: the sequence is genuinely linear (show a
// line, hold, reveal what it captured, next) and expressing that as `await`
// keeps it readable. Every await is followed by a cancellation check, so
// unmounting or hitting Replay mid-line stops everything rather than leaving
// stray timers writing into dead state.
//
// The engine no longer speaks. See the header of lib/live-line.ts for why the
// browser's speech synthesis was removed, and what to drop in to give the
// demo a real voice.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "motion/react";
import { SCENARIOS, DEFAULT_SCENARIO_ID, type Scenario } from "@/lib/call-scripts";
import {
  audioFor,
  lineDurationMs,
  loadAudioManifest,
  playBooked,
  playHangup,
  playLine,
  playPickup,
  playRingback,
  playTick,
  type VoiceHandle,
} from "@/lib/live-line";

export type Phase = "idle" | "ringing" | "connected" | "ended";

const RING_MS = 1150;
const MUTE_KEY = "firstring:muted";

type Token = { cancelled: boolean };

export function useCallEngine() {
  const reduceMotion = useReducedMotion();

  const [scenarioId, setScenarioId] = useState<string>(DEFAULT_SCENARIO_ID);
  const [phase, setPhase] = useState<Phase>("idle");
  /** Index of the line currently on screen. -1 before the call connects. */
  const [index, setIndex] = useState(-1);
  const [capturedIds, setCapturedIds] = useState<string[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  // Mute lives in localStorage rather than in component state that an effect
  // then back-fills. Reading it through useSyncExternalStore means the stored
  // preference is honoured on the first paint after hydration instead of one
  // render later, and two tabs stay in step.
  const muted = useSyncExternalStore(subscribeToMute, readMuted, readMutedOnServer);

  const scenario: Scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId],
  );

  const tokenRef = useRef<Token>({ cancelled: true });
  const stopRingRef = useRef<(() => void) | null>(null);
  const voiceRef = useRef<VoiceHandle | null>(null);
  const mutedRef = useRef(false);
  // Held in a ref, not state: the orb samples it every frame, and re-rendering
  // the whole panel at 60fps just to hand over a function would be absurd.
  const levelRef = useRef<(() => number) | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    writeMuted(next);
    if (next) voiceRef.current?.cancel();
  }, []);

  const stopEverything = useCallback(() => {
    // cancelToken flips the flag AND fires every pending hook, so an in-flight
    // wait clears its timeout and any playing line is cut off, instead of the
    // run loop discovering the cancellation only when it next comes up for air.
    cancelToken(tokenRef.current);
    stopRingRef.current?.();
    stopRingRef.current = null;
    voiceRef.current?.cancel();
    voiceRef.current = null;
    levelRef.current = null;
  }, []);

  useEffect(() => stopEverything, [stopEverything]);

  /** Tick the call timer while connected. */
  useEffect(() => {
    if (phase !== "connected") return;
    const started = performance.now() - elapsedMs;
    const id = window.setInterval(() => setElapsedMs(performance.now() - started), 250);
    return () => window.clearInterval(id);
    // elapsedMs is deliberately not a dependency - including it would restart
    // the interval on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const reset = useCallback(() => {
    stopEverything();
    setPhase("idle");
    setIndex(-1);
    setCapturedIds([]);
    setElapsedMs(0);
  }, [stopEverything]);

  const selectScenario = useCallback(
    (id: string) => {
      reset();
      setScenarioId(id);
    },
    [reset],
  );

  const run = useCallback(async () => {
    stopEverything();

    const token: Token = { cancelled: false };
    tokenRef.current = token;
    const cancelled = () => token.cancelled;

    setHasRun(true);
    setIndex(-1);
    setCapturedIds([]);
    setElapsedMs(0);
    setPhase("ringing");

    // One ring. Then it picks up.
    if (!mutedRef.current) stopRingRef.current = playRingback();
    await wait(RING_MS, token);
    stopRingRef.current?.();
    stopRingRef.current = null;
    if (cancelled()) return;

    // Cached after the first call, so this is free on every replay.
    const manifest = await loadAudioManifest();
    if (cancelled()) return;

    if (!mutedRef.current) playPickup();
    setPhase("connected");

    for (let i = 0; i < scenario.lines.length; i++) {
      if (cancelled()) return;
      const line = scenario.lines[i];
      setIndex(i);

      // Real audio if this line was rendered - an explicit audioSrc wins,
      // otherwise the manifest says. With no file, hold for a duration paced
      // off the text instead. Either way the caption is the source of truth.
      const src = line.audioSrc ?? audioFor(manifest, scenario.id, i);
      const voice = playLine(src, mutedRef.current);
      voiceRef.current = voice;
      levelRef.current = voice?.level ?? null;

      if (voice) {
        const onCancel = () => voice.cancel();
        cancelHooks.add(token, onCancel);
        await voice.done;
        cancelHooks.remove(token, onCancel);
      } else {
        await wait(lineDurationMs(line.text), token);
      }

      voiceRef.current = null;
      levelRef.current = null;
      if (cancelled()) return;

      if (line.captures?.length) {
        setCapturedIds((prev) => [...prev, ...line.captures!.filter((c) => !prev.includes(c))]);
        if (!mutedRef.current) playTick();
      }

      // `beat` was tuned against silent captions, where the whole pause has
      // to be manufactured. A real recording already carries its own lead-in
      // and tail, so the scripted beat lands on top of one that exists and the
      // call drags. Half it when audio is doing the talking.
      await wait((line.beat ?? 420) * (voice ? 0.5 : 1), token);
    }

    if (cancelled()) return;
    if (!mutedRef.current) {
      playHangup();
      window.setTimeout(() => {
        if (!token.cancelled) playBooked();
      }, 420);
    }
    setPhase("ended");
  }, [scenario, stopEverything]);

  /** Jump straight to the finished state: every capture, the outcome card. */
  const skip = useCallback(() => {
    stopEverything();
    tokenRef.current = { cancelled: false };

    setHasRun(true);
    setIndex(scenario.lines.length - 1);
    setCapturedIds(scenario.captures.map((c) => c.id));
    // A plausible call length rather than however far the timer happened to
    // get - the closing line quotes this and the two must agree.
    setElapsedMs(
      scenario.lines.reduce(
        (total, l) => total + lineDurationMs(l.text) + (l.beat ?? 420),
        RING_MS,
      ),
    );
    setPhase("ended");
  }, [scenario, stopEverything]);

  const line = index >= 0 ? scenario.lines[index] : null;
  const previous = index > 0 ? scenario.lines[index - 1] : null;

  return {
    scenario,
    scenarios: SCENARIOS,
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
    start: run,
    replay: run,
    skip,
    reset,
    reduceMotion: !!reduceMotion,
  };
}

/* -------------------------------------------------------------- mute store */

/**
 * The visitor's sound preference, stored in localStorage and exposed as an
 * external store.
 *
 * Every accessor is wrapped: Safari in private mode throws on localStorage
 * access rather than returning null, and a mute toggle must never be the
 * thing that breaks the hero.
 */
const muteListeners = new Set<() => void>();

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Server render has no storage; sound-on is the default. */
function readMutedOnServer(): boolean {
  return false;
}

function writeMuted(next: boolean) {
  try {
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    /* preference just will not persist */
  }
  // `storage` only fires in OTHER tabs, so same-tab subscribers are notified
  // directly.
  for (const listener of muteListeners) listener();
}

function subscribeToMute(onChange: () => void) {
  muteListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    muteListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/* ------------------------------------------------------------------ helpers */

function wait(ms: number, token: Token): Promise<void> {
  return new Promise((resolve) => {
    const id = window.setTimeout(resolve, ms);
    cancelHooks.add(token, () => {
      window.clearTimeout(id);
      resolve();
    });
  });
}

/**
 * Cancellation callbacks, keyed by token.
 *
 * A pending wait is sitting on a setTimeout and a pending line is sitting in
 * an <audio> element; neither notices a boolean changing. So each registers an
 * undo here, and cancelToken flips the flag and fires the lot in one go.
 *
 * A WeakMap rather than a Map so tokens from completed calls are collectable -
 * the hero can be replayed indefinitely and each run mints a new token.
 */
const cancelHooks = (() => {
  const map = new WeakMap<Token, Set<() => void>>();
  return {
    add(token: Token, fn: () => void) {
      // Registering against an already-cancelled token has to fire straight
      // away, otherwise a hook added in the window between cancellation and
      // the loop noticing would never run.
      if (token.cancelled) {
        fn();
        return;
      }
      let set = map.get(token);
      if (!set) {
        set = new Set();
        map.set(token, set);
      }
      set.add(fn);
    },
    remove(token: Token, fn: () => void) {
      map.get(token)?.delete(fn);
    },
    fire(token: Token) {
      const set = map.get(token);
      if (!set) return;
      for (const fn of set) fn();
      set.clear();
    },
  };
})();

function cancelToken(token: Token) {
  token.cancelled = true;
  cancelHooks.fire(token);
}
