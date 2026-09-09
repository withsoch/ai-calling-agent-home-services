// lib/live-line.ts
//
// Audio for the hero's sample call: telephony tones, and playback of
// pre-rendered voice lines when they exist.
//
// ---------------------------------------------------------------------------
// WHY THERE IS NO SPEECH SYNTHESIS HERE ANY MORE
// ---------------------------------------------------------------------------
// The first version spoke the lines with the browser's built-in
// speechSynthesis. It was a mistake and it had to come out.
//
// Those voices are screen-reader engines. They are flat, they land the stress
// on the wrong word, and they vary wildly by platform - a Mac visitor got
// Samantha, a Windows visitor got David, and neither sounded like a person on
// a phone. For a product whose entire claim is "it will not embarrass you in
// front of a customer", demonstrating it with an obviously robotic voice does
// not undersell the product, it actively disproves it. A silent, well-paced,
// captioned call is far better than a badly spoken one.
//
// So: this file plays real audio files if they are present, and telephony
// atmosphere either way. It never synthesises speech.
//
// ---------------------------------------------------------------------------
// TO GIVE THE DEMO A VOICE
// ---------------------------------------------------------------------------
// 1. Render each line in lib/call-scripts.ts with a real TTS model
//    (ElevenLabs, Cartesia, OpenAI). Two distinct voices - one for the agent,
//    one for the caller.
// 2. Save them as /public/audio/<scenario-id>/<line-index>.mp3
// 3. Add `audioSrc` to each line.
// Nothing else changes: the player prefers files, and the orb switches from
// its simulated energy to a real FFT of the waveform automatically.

/* ----------------------------------------------------------- audio context */

let ctx: AudioContext | null = null;

/**
 * One shared AudioContext. Constructing one per interaction leaks contexts and
 * browsers cap how many a page may hold. Created lazily because a context
 * created before a user gesture starts life suspended anyway.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx ??= new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------- ring & tones */

/**
 * North American ringback: 440 Hz and 480 Hz together. We only ever play a
 * single burst and cut it short, because the product is called First Ring and
 * the demo has to answer during the first one.
 *
 * Returns a stop function that ramps down over 40ms - cutting the oscillators
 * dead clicks audibly.
 */
export function playRingback(volume = 0.09): () => void {
  const ac = getAudioContext();
  if (!ac) return () => {};

  const t = ac.currentTime;
  const gain = ac.createGain();
  gain.connect(ac.destination);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.03);

  const oscs = [440, 480].map((f) => {
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    o.connect(gain);
    o.start(t);
    return o;
  });

  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    const now = ac.currentTime;
    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      oscs.forEach((o) => o.stop(now + 0.05));
    } catch {
      /* context already closed */
    }
  };
}

/** The soft click of a line being answered. */
export function playPickup() {
  blip(560, 210, 0.07, 0.05);
}

/** Two descending tones - the call ending. */
export function playHangup() {
  blip(440, 300, 0.09, 0.05);
  window.setTimeout(() => blip(290, 190, 0.14, 0.045), 95);
}

/** A quiet tick as each field is captured. */
export function playTick() {
  blip(1240, 1240, 0.03, 0.016);
}

/** Rising two-note chime when the job lands in the CRM. */
export function playBooked() {
  blip(660, 660, 0.09, 0.035);
  window.setTimeout(() => blip(880, 880, 0.16, 0.04), 110);
}

function blip(fromHz: number, toHz: number, durationS: number, volume: number) {
  const ac = getAudioContext();
  if (!ac) return;
  try {
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(fromHz, t);
    if (toHz !== fromHz) osc.frequency.exponentialRampToValueAtTime(toHz, t + durationS);

    // Exponential ramps can neither reach nor start from zero.
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + durationS);

    osc.start(t);
    osc.stop(t + durationS + 0.02);
  } catch {
    /* audio is decoration - never let it break the interaction */
  }
}

/* ---------------------------------------------------------------- pacing */

/**
 * How long a line should stay on screen, in ms.
 *
 * Two components, because a caption is not just read, it is *heard* in the
 * reader's head: time proportional to length, plus a fixed beat for the
 * cognitive cost of a new speaker taking over. 14.5 characters/second is
 * brisk conversational English - the first pass ran at 13 and the whole call
 * took over a minute, which is longer than anyone watches a hero.
 *
 * The floor matters more than it looks. Turns like "Yeah?" and "Oh. Good."
 * are three characters of pure rhythm; without a floor they flash past and
 * the conversation reads as glitching rather than as people talking.
 */
export function lineDurationMs(text: string): number {
  return Math.max(950, 220 + (text.length / 14.5) * 1000);
}

/* --------------------------------------------------------------- manifest */

type AudioManifest = {
  provider: string;
  /**
   * scenario id -> per-line url, or null where no file was rendered. The url
   * carries its own extension, since a run can end up part AAC and part WAV.
   */
  files: Record<string, (string | null)[]>;
};

let manifestPromise: Promise<AudioManifest | null> | null = null;

/**
 * Which lines have real audio.
 *
 * Written by scripts/render-voices.mjs. Fetched once, lazily, on the first
 * call rather than at page load - a visitor who never presses play should not
 * pay for a request. A missing or malformed manifest resolves to null and the
 * call simply runs captioned, which is the state of the site until someone
 * renders the voices.
 */
export function loadAudioManifest(): Promise<AudioManifest | null> {
  manifestPromise ??= fetch("/audio/manifest.json")
    .then((r) => (r.ok ? (r.json() as Promise<AudioManifest>) : null))
    .catch(() => null);
  return manifestPromise;
}

/**
 * The url for one line, or undefined.
 *
 * All-or-nothing per scenario: audio is only used if EVERY line of that
 * scenario was rendered. A partial render - a quota running out halfway, a
 * failed request - would otherwise produce a call where the first seven turns
 * are spoken and the rest are silent, which reads as broken rather than as
 * captioned. Better to stay consistently captioned until the set is complete.
 *
 * `?audio=partial` opts out, so a render in progress can be auditioned in the
 * real UI - which is the only practical way to judge whether the chosen
 * voices are any good before paying to render all fifty-three lines.
 */
export function audioFor(
  manifest: AudioManifest | null,
  scenarioId: string,
  index: number,
): string | undefined {
  const urls = manifest?.files?.[scenarioId];
  if (!urls) return undefined;
  if (urls.some((u) => !u) && !allowPartialAudio()) return undefined;
  return urls[index] ?? undefined;
}

function allowPartialAudio(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("audio") === "partial";
}

/* ------------------------------------------------------------ voice player */

export type VoiceHandle = {
  /** Resolves when the line finishes, or immediately if there is no audio. */
  done: Promise<void>;
  cancel: () => void;
  /**
   * Live output level, 0..1, sampled from the real waveform. Returns null
   * when there is no audio to analyse - the orb then falls back to its own
   * simulated energy.
   */
  level: (() => number) | null;
};

/**
 * Plays a pre-rendered line, routed through the WebAudio graph so the orb can
 * react to the actual waveform.
 *
 * Returns `null` when the line has no audio, which is the current state of
 * the world - see the header. Callers pace the caption from lineDurationMs
 * instead.
 */
export function playLine(audioSrc: string | undefined, muted: boolean): VoiceHandle | null {
  if (!audioSrc) return null;

  const el = new Audio(audioSrc);
  el.crossOrigin = "anonymous";
  el.muted = muted;

  let level: (() => number) | null = null;
  const ac = getAudioContext();

  if (ac && !muted) {
    try {
      const source = ac.createMediaElementSource(el);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(ac.destination);

      const bins = new Uint8Array(analyser.frequencyBinCount);
      level = () => {
        analyser.getByteFrequencyData(bins);
        let sum = 0;
        // Voice energy lives low; the top of the spectrum is mostly hiss and
        // would flatten the reading toward a constant.
        const upTo = Math.floor(bins.length * 0.45);
        for (let i = 0; i < upTo; i++) sum += bins[i];
        return Math.min(1, sum / upTo / 165);
      };
    } catch {
      // createMediaElementSource throws if the element is already wired to a
      // graph. Playback still works; the orb just simulates instead.
      level = null;
    }
  }

  let settle: (() => void) | undefined;
  const done = new Promise<void>((resolve) => {
    settle = resolve;
    el.addEventListener("ended", () => resolve(), { once: true });
    // A missing or unplayable file must never stall the call.
    el.addEventListener("error", () => resolve(), { once: true });
  });
  void el.play().catch(() => settle?.());

  return {
    done,
    level,
    cancel: () => {
      el.pause();
      el.src = "";
      settle?.();
    },
  };
}
