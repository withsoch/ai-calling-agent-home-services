#!/usr/bin/env node
//
// Render every line of the hero's sample call to an audio file, so the demo
// actually speaks.
//
//   node scripts/render-voices.mjs --dry-run     # cost + plan, no API calls
//   node scripts/render-voices.mjs               # reads .env.local
//
// Put the key in .env.local (gitignored) rather than passing it inline, so it
// never lands in a shell history or a chat transcript:
//
//   ELEVENLABS_API_KEY=sk_...        # or
//   OPENAI_API_KEY=sk-...
//
// PROVIDER
//
// Whichever key is present, in this order: ElevenLabs, OpenAI, Gemini.
//
//   ElevenLabs  best voice quality. $6/mo Starter for the commercial licence.
//   OpenAI      ~2 cents, commercially licensed on any paid account, and
//               takes a style `instructions` string, which is why the two
//               characters can be directed separately.
//   Gemini      cheapest. Returns raw PCM which this script wraps into WAV.
//               The TTS models are PREVIEW and the endpoint shape has already
//               changed once, so if this path 4xxs, check the current docs at
//               ai.google.dev/gemini-api/docs/speech-generation - the error
//               body is printed in full to make that quick.
//
// Retell and Vapi keys do NOT work here. They are call-orchestration
// platforms that consume a TTS engine inside a live pipeline; neither renders
// text to a file. A Retell key is the right key for wiring a genuinely live
// agent, which is a different job. Anthropic has no TTS API at all.
//
// WHY THIS EXISTS
//
// The hero originally spoke its lines with the browser's speechSynthesis.
// Those are screen-reader voices - flat, wrongly stressed, and different on
// every platform. For a product selling "it will not sound like a robot to
// your customer", that demo disproved the pitch. It was removed.
//
// This script is the replacement path: real voices, rendered once, shipped as
// static files. No runtime API key, no per-visitor cost, works offline, and
// the orb switches from simulated movement to a genuine FFT of the waveform
// the moment the files exist.
//
// AFTER RUNNING IT
//
// The script prints the `audioSrc` line to add to each entry in
// lib/call-scripts.ts, and writes the files to public/audio/<scenario>/<n>.mp3.
// Nothing else needs to change.

import { mkdir, writeFile, access, readdir, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_ROOT = join(ROOT, "public", "audio");

const DRY = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");
const COMPRESS_ONLY = process.argv.includes("--compress-only");

// Gemini's free tier allows only 10 requests a day, so auditioning a voice
// change has to be possible without spending all of them. --limit renders the
// first N lines, --scenario narrows to one.
const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
};
const LIMIT = Number(arg("--limit") ?? 0) || 0;
const ONLY_SCENARIO = arg("--scenario");

// Node 24 reads dotenv files natively. Both locations are optional - the key
// may be exported in the shell instead. The parent folder is checked because
// that is where the shared workspace .env lives.
for (const file of [join(ROOT, ".env.local"), join(ROOT, "..", ".env")]) {
  try {
    process.loadEnvFile(file);
  } catch {
    /* not present, or not readable - try the next one */
  }
}

const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
// Several spellings, because the workspace .env uses Google_Key and nobody
// should have to rename a variable to run a script.
const GEMINI_KEY =
  process.env.GEMINI_API_KEY ??
  process.env.GOOGLE_API_KEY ??
  process.env.GOOGLE_KEY ??
  process.env.Google_Key ??
  process.env.GEMINI_KEY;
const PROVIDER = ELEVEN_KEY
  ? "elevenlabs"
  : OPENAI_KEY
    ? "openai"
    : GEMINI_KEY
      ? "gemini"
      : null;

// Gemini returns PCM, everything else returns MP3.
const EXT = PROVIDER === "gemini" ? "wav" : "mp3";

// Two clearly different voices. The agent should sound competent and
// unhurried; the caller like a member of the public who is mildly stressed.
// Browse ElevenLabs voices at elevenlabs.io/app/voice-library.
const VOICES = {
  elevenlabs: {
    agent: process.env.FR_AGENT_VOICE ?? "21m00Tcm4TlvDq8ikWAM", // Rachel
    caller: process.env.FR_CALLER_VOICE ?? "pNInz6obpgDQGcFmaJgB", // Adam
  },
  openai: {
    agent: process.env.FR_AGENT_VOICE ?? "shimmer",
    caller: process.env.FR_CALLER_VOICE ?? "onyx",
  },
  // Picked for flatness. The first pass used Algieba (Smooth) and Enceladus
  // (Breathy) and the result was over-acted - a receptionist who sounds moved
  // by your furnace is less believable, not more. "Even" and "Casual" are the
  // two least performed voices on the list.
  //
  // Full set: Zephyr(Bright) Puck(Upbeat) Charon(Informative) Kore(Firm)
  // Fenrir(Excitable) Leda(Youthful) Orus(Firm) Aoede(Breezy)
  // Callirrhoe(Easy-going) Autonoe(Bright) Enceladus(Breathy) Iapetus(Clear)
  // Umbriel(Easy-going) Algieba(Smooth) Despina(Smooth) Erinome(Clear)
  // Algenib(Gravelly) Rasalgethi(Informative) Laomedeia(Upbeat)
  // Achernar(Soft) Alnilam(Firm) Schedar(Even) Gacrux(Mature)
  // Pulcherrima(Forward) Achird(Friendly) Zubenelgenubi(Casual)
  // Vindemiatrix(Gentle) Sadachbia(Lively) Sadaltager(Knowledgeable)
  // Sulafat(Warm)
  // Fallbacks only. Real casting is per scenario in lib/call-scripts.ts, so
  // Anthony does not answer in the same voice as Karen.
  gemini: {
    agent: process.env.FR_AGENT_VOICE ?? "Erinome", // clear, female
    caller: process.env.FR_CALLER_VOICE ?? "Gacrux", // mature, female
  },
};

const MODELS = {
  elevenlabs: process.env.FR_TTS_MODEL ?? "eleven_turbo_v2_5",
  openai: process.env.FR_TTS_MODEL ?? "gpt-4o-mini-tts",
  gemini: process.env.FR_TTS_MODEL ?? "gemini-3.1-flash-tts-preview",
};

const { SCENARIOS } = await import(join(ROOT, "lib", "call-scripts.ts"));

const allJobs = SCENARIOS.flatMap((s) =>
  s.lines.map((line, i) => ({
    scenario: s.id,
    index: i,
    speaker: line.speaker,
    text: line.text,
    voice: s.voices?.[line.speaker],
    out: join(OUT_ROOT, s.id, `${i}.${EXT}`),
    rel: `/audio/${s.id}/${i}.${EXT}`,
  })),
);

const jobs = (ONLY_SCENARIO ? allJobs.filter((j) => j.scenario === ONLY_SCENARIO) : allJobs).slice(
  0,
  LIMIT || undefined,
);

const chars = jobs.reduce((n, j) => n + j.text.length, 0);
if (LIMIT || ONLY_SCENARIO) {
  console.log(`Subset: ${jobs.length} of ${allJobs.length} lines.`);
}

console.log(`${jobs.length} lines across ${SCENARIOS.length} scenarios`);
console.log(`${chars.toLocaleString()} characters total`);
console.log(
  `≈ $${((chars / 1000) * 0.15).toFixed(2)} of ElevenLabs credit, ` +
    `~$${((chars / 1_000_000) * 12).toFixed(2)} on OpenAI, or a fraction of a cent on Gemini.`,
);
console.log(
  "Volume fits ElevenLabs' free tier, but a commercial site needs the $6 " +
    "Starter plan for the commercial licence.\n",
);

if (COMPRESS_ONLY) {
  await compressExisting();
  process.exit(0);
}

if (DRY) {
  for (const s of SCENARIOS) {
    console.log(`  ${s.id}: ${s.lines.length} lines`);
  }
  console.log("\nDry run. Put a key in .env.local and run again to render.");
  process.exit(0);
}

if (!PROVIDER) {
  console.error("No TTS key found.\n");
  console.error("Add one to firstring-web/.env.local (gitignored):\n");
  console.error("  ELEVENLABS_API_KEY=sk_...     best voice quality ($6/mo Starter)");
  console.error("  OPENAI_API_KEY=sk-...         ~2 cents, commercial on any paid account");
  console.error("  GEMINI_API_KEY=...            cheapest, but the TTS models are preview\n");
  console.error("A Retell or Vapi key will NOT work - they orchestrate live calls,");
  console.error("they do not render text to an audio file. Anthropic has no TTS API.");
  process.exit(1);
}

console.log(`Rendering with ${PROVIDER}.\n`);

/** One POST, one MP3, whichever provider is configured. */
async function synthesise(job, bare = false) {
  if (PROVIDER === "elevenlabs") {
    return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICES.elevenlabs[job.speaker]}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: job.text,
        model_id: MODELS.elevenlabs,
        // Lower stability gives more variation between takes, which is what
        // stops eighteen consecutive lines sounding like one block.
        voice_settings: { stability: 0.4, similarity_boost: 0.75, style: 0.25 },
      }),
    });
  }

  if (PROVIDER === "gemini") {
    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/interactions?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODELS.gemini,
          input: bare ? job.text : `${geminiCue(job.speaker)} ${job.text}`.trim(),
          response_format: { type: "audio" },
          generation_config: {
            speech_config: [{ voice: job.voice ?? VOICES.gemini[job.speaker] }],
          },
        }),
      },
    );
  }

  return fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODELS.openai,
      voice: VOICES.openai[job.speaker],
      input: job.text,
      response_format: "mp3",
      instructions: directionFor(job.speaker),
    }),
  });
}

/** Direction given to whichever model supports style steering. */
function directionFor(speaker) {
  // Deliberately flat. An earlier version asked for warmth and worry and the
  // takes came back over-acted; real phone calls are transactional.
  return speaker === "agent"
    ? "Matter-of-fact and even. A working receptionist, not a performance. No warmth, no lilt."
    : "Plain and undramatic. An ordinary person reporting a problem, not acting one.";
}

/**
 * Gemini takes its style cue inline, as in the documented "Say cheerfully: ..."
 * pattern. It is EMPTY by default, and that is the point.
 *
 * The first pass used "Say warmly and calmly:" and "Say with mild worry:", and
 * the result was too emotional - unsurprisingly, since those cues explicitly
 * ask for emotion. A phone call between a receptionist and a customer is a
 * transaction, not a performance; both parties are matter-of-fact. Removing
 * the cue leaves the model reading the line straight, which is what a real
 * call sounds like.
 *
 * Set FR_STYLE to add direction back if a scenario ever needs it. Note that a
 * long persona paragraph gets rejected as prohibited_content, so keep it to a
 * few words.
 */
function geminiCue(speaker) {
  const style = process.env.FR_STYLE?.trim();
  if (!style) return "";
  return speaker === "agent" ? `${style}:` : `${style}:`;
}

/**
 * Gemini hands back raw signed 16-bit little-endian PCM at 24kHz. Browsers
 * will not play that on its own, so it gets a 44-byte RIFF header. Cheaper and
 * more predictable than shelling out to ffmpeg, which may not be installed.
 */
function pcmToWav(pcm, sampleRate = 24000, channels = 1, bits = 16) {
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * channels * bits) / 8;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // format: PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE((channels * bits) / 8, 32); // block align
  header.writeUInt16LE(bits, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/** Pull the audio bytes out of whatever shape the provider returned. */
async function bytesFrom(res) {
  if (PROVIDER !== "gemini") return Buffer.from(await res.arrayBuffer());

  const json = await res.json();
  // Verified against a live response: the audio arrives as base64 PCM at
  // steps[].content[], tagged "audio/l16; rate=24000; channels=1".
  const part = json.steps
    ?.flatMap((step) => step.content ?? [])
    .find((c) => c?.type === "audio" && typeof c.data === "string");

  if (!part) {
    throw new Error(
      `No audio in the Gemini response. Got: ${JSON.stringify(json).slice(0, 400)}`,
    );
  }
  return pcmToWav(Buffer.from(part.data, "base64"), part.sample_rate ?? 24000, part.channels ?? 1);
}

/**
 * Gemini's PCM is enormous - a two-second line is ~117KB of WAV. AAC at 48kbps
 * takes that to ~20KB with no audible difference on a voice clip, which turns
 * a 8.5MB hero into a 1.4MB one. Uses macOS's built-in afconvert; if it is not
 * on the box the WAV is simply kept and the manifest points at it.
 */
async function compress(wavPath) {
  const outPath = wavPath.replace(/\.wav$/, ".m4a");
  try {
    await run("afconvert", ["-f", "m4af", "-d", "aac", "-b", "48000", wavPath, outPath]);
    await rm(wavPath);
    return outPath;
  } catch {
    return wavPath;
  }
}

/** Convert every .wav already on disk, then refresh the manifest. */
async function compressExisting() {
  let done = 0;
  for (const scenario of SCENARIOS) {
    const dir = join(OUT_ROOT, scenario.id);
    let entries;
    try {
      entries = await readdir(dir);
    } catch {
      continue;
    }
    for (const name of entries.filter((n) => n.endsWith(".wav"))) {
      const out = await compress(join(dir, name));
      if (out.endsWith(".m4a")) done++;
    }
  }
  await writeManifest();
  console.log(`Compressed ${done} files to AAC and refreshed the manifest.`);
}

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

let rendered = 0;
let skipped = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let quotaReported = false;

/**
 * One line, with the two failure modes this API actually exhibits handled:
 *
 *   429  free-tier TTS rate limits are low, so back off and try again rather
 *        than throwing away a half-finished render.
 *   400 prohibited_content  the style cue was refused; retry the bare line,
 *        which has never been refused.
 */
async function renderOne(job) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await synthesise(job, attempt > 0 && attempt % 2 === 0);
    if (res.ok) return bytesFrom(res);

    const body = await res.text();

    if (res.status === 429) {
      // Print the quota detail once: "per minute" is worth waiting out,
      // "per day" is not, and the two are indistinguishable from the status
      // code alone.
      if (!quotaReported) {
        quotaReported = true;
        console.log(`\n\nRate limit detail: ${body.slice(0, 600)}\n`);
      }
      const backoff = 15000 * (attempt + 1);
      process.stdout.write(`\r  rate limited, waiting ${backoff / 1000}s…                    `);
      await sleep(backoff);
      continue;
    }

    if (res.status === 400 && body.includes("prohibited_content")) {
      // Next attempt goes through bare (see the `bare` argument above).
      continue;
    }

    throw new Error(`${job.scenario}/${job.index}: ${res.status} ${body.slice(0, 300)}`);
  }
  throw new Error(`${job.scenario}/${job.index}: gave up after 6 attempts`);
}

for (const job of jobs) {
  if (!FORCE && (await exists(job.out))) {
    skipped++;
    continue;
  }

  let bytes;
  try {
    bytes = await renderOne(job);
  } catch (err) {
    console.error(`\n\n${err.message}\n`);
    // Write the manifest for whatever did render, so a partial run still
    // gives the site the lines it has rather than nothing.
    await writeManifest();
    console.error(
      `Stopped after ${rendered} files. Already-rendered files are kept and ` +
        `the manifest covers them, so re-running resumes where it left off.`,
    );
    process.exit(1);
  }

  await mkdir(dirname(job.out), { recursive: true });
  await writeFile(job.out, bytes);
  if (job.out.endsWith(".wav")) await compress(job.out);
  rendered++;
  process.stdout.write(`\r  rendered ${rendered}/${jobs.length - skipped}                    `);

  // Gemini's free tier allows 10 requests per minute for the TTS models
  // (the 429 body states "limit: 10" and asks for a ~44s retry). Spacing
  // calls at 6.5s keeps us just under it, so a full render takes about six
  // minutes and never trips the limiter. Raise FR_THROTTLE_MS if the quota
  // tightens, or drop it to near zero on a paid key.
  if (PROVIDER === "gemini") await sleep(Number(process.env.FR_THROTTLE_MS ?? 6500));
}

await writeManifest();

console.log(`\n\nDone. ${rendered} rendered, ${skipped} already present.`);
console.log("Wrote public/audio/manifest.json — the player picks it up on its own.");
console.log("Nothing to paste into lib/call-scripts.ts.");

/**
 * Index whatever is actually on disk.
 *
 * A manifest rather than 53 hand-pasted `audioSrc` fields: the player reads it
 * once and resolves each line by convention, so re-rendering, adding a
 * scenario, or a partial run stopped by a quota all just work without anyone
 * editing lib/call-scripts.ts. Scanning the directory rather than trusting
 * this run's counters also means a partial render is described accurately.
 */
async function writeManifest() {
  const files = {};
  for (const scenario of SCENARIOS) {
    const dir = join(OUT_ROOT, scenario.id);
    let present;
    try {
      present = new Set(await readdir(dir));
    } catch {
      continue;
    }
    // Probe extensions rather than assuming one: a run may be part WAV and
    // part AAC if compression was added or afconvert was missing partway.
    const urls = scenario.lines.map((_, i) => {
      const ext = ["m4a", "mp3", "wav"].find((e) => present.has(`${i}.${e}`));
      return ext ? `/audio/${scenario.id}/${i}.${ext}` : null;
    });
    if (urls.some(Boolean)) files[scenario.id] = urls;
  }

  await mkdir(OUT_ROOT, { recursive: true });
  await writeFile(
    join(OUT_ROOT, "manifest.json"),
    JSON.stringify({ provider: PROVIDER, files }, null, 2),
  );
}
