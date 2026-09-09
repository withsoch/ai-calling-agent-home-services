# First Ring

Marketing site for **First Ring** — an AI calling agent service for home services
companies. *Answered on the first ring.*

Domain (available, not yet bought): `onfirstring.com`
Strategy, research and pricing rationale: [`PLAN.md`](./PLAN.md)

```bash
npm install
npm run dev      # http://localhost:3210
```

Port 3210 rather than 3000 or 3100 — 3100 is already the `riz-web-new` dev server.

---

## Before this goes live

1. **`PLACEHOLDER_PROOF`** in `lib/content.ts` is `true`. Every testimonial, customer
   name and result figure on the site is invented, and each one currently renders with
   a visible amber "Sample" marker plus a banner on the sections that use them. Replace
   them with real, attributable quotes and set the flag to `false`. Do not delete the
   markers — flip the flag.
2. **The contact form is not wired to a backend.** It composes a `mailto:` with every
   field filled in, which is honest and works with no server, but it is not a CRM entry.
   `components/ContactForm.tsx` has the swap instructions; the field names are already
   the payload shape for an n8n webhook.
3. **`SITE.demoPhone`** is a placeholder `555` number. Provision a real line or remove
   the card from `/contact`.
4. **`SITE.bookingUrl`** currently points at the existing `consult-with-riz` cal.com
   link. Point it at a First Ring event type.
5. **The 53 audio files in `public/audio/` are committed as static assets.** They cost
   nothing at runtime. Re-render only if the script changes — see below.

---

## Structure

```
app/                 one file per route, all statically prerendered
components/
  live-line/         the hero call: Orb, LiveLine panel, useCallEngine
  sections/          page sections, mostly presentational
  ui/                Section, Button, Reveal, CountUp, Mark, PageHero, SampleRibbon
scripts/
  render-voices.mjs  renders the call to real audio (see below)
lib/
  content.ts         EVERY word on the site, as data
  call-scripts.ts    the three hero call scenarios
  live-line.ts       WebAudio telephony tones + the voice-file player
  utils.ts           cn() — note the tailwind-merge config comment
```

Copy lives in `lib/content.ts`, not in components. A positioning change is one edit in
one file.

---

## The hero: "The Live Line"

A sample call, played out in the browser. Calm light panel, a soft orb standing in for
the agent, and one line of speech at a time — the pattern ElevenLabs, Retell and Vapi
all converge on.

- Click **Play the call** → synthesised North American ringback → it answers **during
  the first ring**, because the product is called First Ring and the demo has to prove
  the claim in the first two seconds.
- One turn on screen at a time, with the previous line receding above it. The orb
  brightens and swells while the agent talks and goes quiet with a listening ring while
  the caller does, so it is always obvious who holds the floor.
- Captured fields appear as the conversation surfaces them; on hang-up the CRM card
  resolves and the closing line quotes **the duration the timer actually reached**.
- Three scenarios: after hours (ServiceTitan), speed to lead (GoHighLevel), overflow
  (Housecall Pro).
- Runs ~55 seconds. "Skip to the end" is always available.

### The voices

Rendered with Gemini TTS and shipped as 53 static AAC files in `public/audio/`
(~1.4MB total). No runtime API key, no per-visitor cost, works offline. The orb is
driven by a real FFT of the waveform, and caption timing follows the audio rather than
an estimate.

Cast per character in `lib/call-scripts.ts` — the agent keeps one voice across all
three scenarios, the caller is cast to match the name:

| Character | Voice | |
|---|---|---|
| Robin (agent) | **Erinome** | Clear, female |
| Karen — after hours | **Gacrux** | Mature, female |
| Anthony — speed to lead | **Iapetus** | Clear, male |
| Simone — overflow | **Callirrhoe** | Easy-going, female |

Two things learned the hard way, both worth preserving:

- **No style cue.** The first pass prefixed every line with "Say warmly and calmly:" /
  "Say with mild worry:" and the takes came back over-acted — unsurprisingly, since
  those cues ask for emotion. A phone call is a transaction. `FR_STYLE` adds direction
  back if a scenario ever needs it.
- **Voices labelled Warm / Friendly / Gentle / Breathy / Lively / Excitable are the
  wrong end of the list.** The flat end is Erinome, Iapetus, Charon, Schedar, Alnilam,
  Umbriel, Zubenelgenubi, Gacrux. Check gender before casting — it is not in the main
  docs, and Schedar (Even) is male.

To re-render after a change: `node scripts/render-voices.mjs --force`, or
`--force --limit 4 --scenario after-hours` to audition four lines first.

### How it was silent before, and the fallback that remains

The first version spoke the lines with the browser's `speechSynthesis`. That was a
mistake and it was removed. Those are screen-reader engines: flat, wrongly stressed,
and different on every platform. For a product whose entire pitch is *"it will not
embarrass you in front of a customer"*, demonstrating it with an obviously robotic
voice does not undersell the product — it disproves it. There is no synthesised
fallback and there should not be one.

With no audio files present the call still plays: paced captions plus real telephony
sound (ringback, pickup, capture ticks, hang-up, booking chime). Audio is
**all-or-nothing per scenario** — a partial render is suppressed rather than speaking
half a call and going silent. `?audio=partial` overrides that to audition a render in
progress.

**Re-rendering** needs a key. Put it in `firstring-web/.env.local` (gitignored), or
the workspace `.env` one level up:

```
ELEVENLABS_API_KEY=sk_...     # best quality — needs the $6 Starter plan for the
                              # commercial licence; the free tier's 10k credits cover
                              # the volume but are not licensed for commercial use
OPENAI_API_KEY=sk-...         # ~$0.02, commercially licensed on any paid account
GEMINI_API_KEY=...            # cheapest, but the TTS models are still preview
```

The script picks whichever it finds, in that order, and prints which one it used. It
also reads the workspace `.env` one level up, and accepts `Google_Key` as well as
`GEMINI_API_KEY`.

**Gemini specifics**, learned the hard way:

- The free tier allows **10 requests per minute** for the TTS models, so the script
  paces Gemini calls 6.5s apart (`FR_THROTTLE_MS` to override). A full render takes
  about six minutes. It backs off and retries on a 429 rather than dying.
- A long persona instruction in the prompt is rejected as `prohibited_content` —
  presumably an impersonation guard. Short cues ("Say warmly and calmly:") pass, and
  the script falls back to the bare line if one is ever refused.
- Gemini returns raw 16-bit PCM, which the script wraps into WAV and then transcodes to
  AAC with macOS `afconvert` — 117KB per line becomes about 20KB. Without `afconvert`
  it keeps the WAV.

Runs are **resumable**: existing files are skipped, so a run interrupted by a quota
picks up where it left off. `--force` re-renders everything.

**Retell, Vapi and Anthropic keys will not work here.** Retell and Vapi are
call-orchestration platforms that consume a TTS engine inside a live pipeline — neither
renders text to a file. Anthropic has no text-to-speech API at all. A Retell key *is*
the right key for the live-agent path below.

It renders all 53 lines (1,987 characters) with two distinct voices, writes them to
`public/audio/<scenario>/`, and writes `public/audio/manifest.json`.

**Nothing needs pasting into `lib/call-scripts.ts`.** The player fetches the manifest
once on the first call and resolves each line by convention, so re-rendering, adding a
scenario or a partial run all just work. With files present the orb switches from its
simulated envelope to a **real FFT of the waveform**, and caption timing is driven by
the audio rather than estimated from the text.

**For a genuinely live agent** (the visitor talks, it answers), `playLine` in
`lib/live-line.ts` is the seam. Point it at a Vapi or Retell web-call session and the
same panel becomes a real demo line. The scripts stay useful as the muted and
reduced-motion fallback.

---

## Things that are the way they are on purpose

**`cn()` is not plain `twMerge`.** Our font sizes are numeric tokens (`text-18`) and
component classes (`text-h2`); tailwind-merge knows neither and falls back to reading
`text-<anything>` as a colour — which made it silently delete `text-white` from every
primary button. `lib/utils.ts` registers the scale under `font-size`. Any new size token
added to `globals.css` must be added there too.

**`CountUp` has a `setTimeout` safety net.** `requestAnimationFrame` is suspended in
backgrounded or occluded tabs, which leaves a counter frozen part-way — "2%" where the
figure is 27%. A decorative animation failing is fine; a statistic rendering the wrong
number is not.

**Every grid declares `grid-cols-1` at the base breakpoint.** Columns declared only
behind a `md:`/`lg:` prefix leave the base layout on an implicit auto track, which does
not clamp to its container; cards were pushing the page sideways on mobile.

**`--color-signal`** is Soch's rarely-used teal, promoted to mean "the other party is
talking" — it draws the listening ring around the orb. Brand coral is already carrying
every CTA and the orb itself, so the far end of the call needed a colour of its own.

**The orb is not a waveform.** Bars bouncing beside a mono status line read as
audio-engineering telemetry — the exact cold register this product needs to avoid. The
orb reads as a presence instead. Its energy comes from a real FFT when audio exists and
a shaped random walk otherwise, driven by `setInterval` rather than
`requestAnimationFrame` so it keeps moving in a backgrounded tab.

**Native `<details>` for the FAQ.** Keyboard accessible, findable by in-page search,
crawlable, no client bundle. The only thing lost is an animated height.

---

## Checks

```bash
npx tsc --noEmit     # clean
npx eslint .         # clean
npx next build       # 8 routes, all static
```

Responsive and functional checks were run with Playwright across 320 / 390 / 768 / 1440
— zero horizontal overflow, no sub-11px text, and the call engine verified end to end
(full run, replay, scenario switch, skip, reduced motion, timer/closer agreement).
Those scripts live in the session scratchpad rather than the repo; they are worth
re-creating as a `tests/` folder if this site grows.

---

## Design system

Palette, type scale and vertical rhythm are ported from `withsoch-web` so the two sites
read as siblings. Same stack: Next 16, React 19, Tailwind 4, motion 12.
