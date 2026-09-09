# First Ring — Brand, Offering & Build Plan

**Status:** plan, pending approval
**Date:** 9 September 2026
**Domain:** `onfirstring.com` (available, $11.25/yr — `.co` $29.99, `.ai` $160/2yr also free)
**Repo:** `/Users/riz/Claude Code/firstring-web`
**Relationship to Soch:** fully standalone. No Soch mark, no Anthropic Partner badge, no shared footer.

---

## 1. Research findings that shaped this

Everything below is sourced, not assumed. Where a number is a market range rather than a
verified fact about a specific vendor, it says so.

### The problem is measurable

Home services businesses miss roughly **27% of inbound calls** (Invoca platform data, cited via
Housecall Pro's own 2026 resource pages). For a trade where the average ticket runs $300–$800 and
an emergency call runs past $1,000, a quarter of the phone ringing out is the single largest
unmeasured leak in the business. Nobody has a dashboard for revenue that never called back.

### The incumbents are bundled, generic, and locked to one platform

- **ServiceTitan** ships an AI Voice Agent, plus Dispatch Pro for tech assignment.
- **Housecall Pro** ships CSR AI, Marketing AI and Analyst AI inside the existing plan.
- **Jobber** ships an AI Receptionist.
- Standalone players: Avoca, Smith.ai, Goodcall, ServiceAgent, Numa, Slang.ai.

This is the competitive reality and the site should not pretend otherwise. The wedge is not
"we have voice AI and they don't" — that claim is already false. The wedge is:

1. **Built around one business, not one platform.** Their actual scripts, price bands, service
   area, on-call rota, dispatch rules, brand voice. The bundled agents are configured, not built.
2. **Works across a real stack.** Most contractors run an FSM *and* a CRM *and* a separate phone
   system *and* three lead sources. The bundled agent only sees inside its own walls.
3. **Outbound, which the bundled ones barely touch.** Speed-to-lead, reactivation, unsold
   estimates, confirmations. This is where the money actually is.
4. **Somebody owns it.** Tuned weekly against real transcripts, not left to rot in a settings tab.

### Platform economics (our cost floor)

Per-minute rates across the platforms we would build on:

| Platform | Rate | Note |
|---|---|---|
| Retell AI | $0.07–$0.18/min | ~600ms latency, strongest calendar/booking integration |
| Bland AI | $0.09/min | LLM costs included |
| Vapi | $0.05/min platform fee | plus STT + LLM + TTS + telephony on top; $1,000/mo HIPAA add-on |
| Synthflow | $0.07–$0.31/min | most no-code friendly |
| GoHighLevel Voice AI | $0.06–$0.215/min | $0.045 voice engine + TTS on top (ElevenLabs V3 adds $0.17) |

All-in industry norm including telephony and tokens: **$0.10–$0.30/min**.

### Agency pricing norms (our ceiling)

- One-time setup/build: **$500–$3,000**
- Monthly retainer: **$300–$1,500** typical, up to $3,000 for larger scope
- Agencies reselling minutes bill clients **$1–$3/min** and keep the spread
- All-in annual for a well-deployed SMB agent: **$4,800–$12,000**

Our packages sit deliberately at the top of the build-fee range and the middle of the retainer
range, with **transparent** per-minute overage rather than a hidden $1–$3 markup. That
transparency is itself a positioning choice and gets said out loud on the Packages page.

### What good looks like on the page

From the landing-page research: the best AI product sites put **the product doing its job above
the fold** — not a description of it, not a hero illustration of it. VoiceAI Connect runs an
interactive demo phone line. ai-receptionist.com runs real call recordings with synced
transcripts. Both beat a headline plus a stock photo of a headset.

That directly justifies the hero we're building.

**Sources:**
[Housecall Pro — AI for home service business](https://www.housecallpro.com/resources/ai-for-home-service-business/) ·
[Thoughtly — voice AI for home service contractors 2026](https://thoughtly.com/blog/best-voice-ai-solutions-for-home-service-contractors-in-2026) ·
[Retell — best voice AI providers](https://www.retellai.com/blog/best-voice-ai-providers) ·
[tested.media — Retell vs Vapi vs Bland vs Synthflow](https://tested.media/retell-vs-vapi-vs-bland-vs-synthflow/) ·
[netpartners — GHL Voice AI per-minute breakdown](https://netpartners.marketing/gohighlevel-voice-ai-conversation-ai-pricing-2026/) ·
[Trillet — voice agent pricing strategy for agencies](https://trillet.ai/blogs/voice-agent-pricing-strategy-guide) ·
[agxntsix — AI voice agent pricing guide](https://agxntsix.ai/guides/ai-voice-agent-pricing-guide-per-minute-costs-telephony-overhead-setup-fees) ·
[Khod — AI website examples](https://www.khod.io/resource-center/articles/ai-website-examples) ·
[VoiceAI Connect](https://www.myvoiceaiconnect.com/)

---

## 2. Brand

**Name:** First Ring
**Wordmark:** always two words, "First Ring", so `onfirstring.com` reads correctly
**Mark:** a single filled dot with one concentric ring — a phone ring and a soundwave's first
crest. Animates outward once on page load, then rests.
**Tagline:** *Answered on the first ring.*
**Category line:** The AI front desk for home services.

**Positioning statement**
> For home services companies drowning in calls they can't answer, First Ring builds and runs an
> AI calling agent that picks up every inbound call and makes every outbound one — booked
> straight into the software you already use. Not a platform you configure. A front desk we build
> for your business and tune every week.

**Voice:** plain, concrete, contractor-literate. Numbers over adjectives. No "revolutionise",
no "seamless", no "unlock". Short sentences. The reader is a 42-year-old who owns eleven trucks
and answers his own phone at 7pm — write for him.

**One deliberate honesty move:** a *"What we won't do"* block on the Services page. We won't run
complex diagnostics, we won't argue about a bill, we won't pretend to be human if asked directly,
and we won't take a call we can't book — those warm-transfer to a person. This converts better
than a feature list and it's the tenet you already apply to Soch scoping.

---

## 3. The offering

Five agents, sold individually or as a stack. Named as jobs, not features.

| # | Agent | Direction | What it does |
|---|---|---|---|
| 1 | **Front Desk** | Inbound | Answers 24/7. Qualifies the job, captures address and issue, quotes the price band, books into the dispatch calendar, escalates true emergencies to the on-call tech. |
| 2 | **Overflow** | Inbound | Only picks up when your team doesn't — after three rings, on busy, or outside hours. The lowest-risk way in: nothing changes for your CSR, they just stop losing the ones they drop. |
| 3 | **Speed-to-Lead** | Outbound | Calls every web form, Angi, Thumbtack and Google LSA lead inside 60 seconds, while they're still on your site comparing you to two other companies. |
| 4 | **Reactivation** | Outbound | Works the list you never work: dormant customers, lapsed maintenance plans, unsold estimates over 30 days. The highest-ROI outbound play in the trade and the one nobody has time for. |
| 5 | **Confirm & Collect** | Outbound | Appointment confirmations and reschedules, post-job review asks, overdue invoice nudges. Kills no-shows and shortens the cash cycle. |

**The Handoff** — the layer under all five. Warm transfer to a human with full context already
spoken aloud to them, every call recorded, transcribed, tagged, scored and written back to the
CRM. Sold as the reason to trust the other five.

---

## 4. Packages

Three tiers plus a pilot. Priced from the research above: build fee at the top of the $500–$3,000
band because the build is genuinely bespoke, retainer mid-band, and minutes shown at cost-plus
rather than the $1–$3/min the market quietly charges.

| | **Line One** | **Full Crew** | **Dispatch** |
|---|---|---|---|
| For | 1–3 trucks | 4–15 trucks | 15+ / multi-location |
| Build | $1,500 | $3,500 | $7,500 |
| Monthly | $450 | $1,200 | $2,800 |
| Minutes included | 750 | 2,500 | 8,000 |
| Overage | $0.55/min | $0.45/min | $0.35/min |
| Agents | Front Desk *or* Overflow | Inbound + one outbound play | All five |
| Numbers | 1 | up to 3 | unlimited |
| Integrations | 1 | 3 | unlimited + custom |
| Tuning | monthly | monthly + transcript review | weekly + QA scorecards |
| Support | email, 2 business days | shared Slack | dedicated Slack, 4h SLA |

**Pilot — $1,000, 30 days.** One agent, one number, live on your real calls. Credited in full
against the build fee if you continue. This exists to kill the only objection that matters:
*"what if it sounds like a robot and embarrasses us in front of customers."*

**Add-ons:** bilingual line (Spanish) · additional outbound play · custom integration ·
call QA scorecards · white-label for GoHighLevel agencies reselling to their own book.

---

## 5. Integrations

The four you named lead and get real depth — a named payload, not just a logo.

| Platform | What First Ring actually does with it |
|---|---|
| **ServiceTitan** | Creates the job, assigns the business unit and job type, honours capacity and arrival windows, writes call tags and the transcript to the customer record. |
| **Housecall Pro** | Books the job to the right segment and calendar, creates the customer if new, attaches the recording, triggers your existing automations. |
| **GoHighLevel** | Writes the contact and opportunity, moves the pipeline stage, fires the workflow, logs the call in the conversation thread. Sub-account safe for agencies. |
| **Zoho** | CRM leads and deals, Bigin pipelines, Desk tickets for service issues, Bookings for slotting. |

Second row, grouped, logo wall with hover payloads:

- **Field service:** Jobber, Workiz, Service Fusion, FieldEdge, ServiceM8, Simpro
- **CRM:** HubSpot, Salesforce, Pipedrive
- **Phone:** Twilio, RingCentral, OpenPhone, Aircall, CallRail, Dialpad
- **Calendar:** Google Calendar, Microsoft 365, Cal.com, Calendly, Acuity
- **Lead sources:** Angi, Thumbtack, Google Local Services Ads, Yelp
- **Messaging & reviews:** Slack, SMS, Podium, Google Business Profile, Birdeye
- **Money:** Stripe, QuickBooks
- **Glue:** n8n, Zapier, Make, webhooks, REST API

---

## 6. Pages

| Route | Purpose |
|---|---|
| `/` | The Live Line hero, the 27% problem, how it works in 3 steps, the five agents, integration wall, proof strip, calculator teaser, FAQ, close |
| `/services` | The five agents in depth, The Handoff layer, **What we won't do** |
| `/packages` | Three tiers, full comparison table, add-ons, the pilot, the full Missed Call Calculator |
| `/integrations` | The four in depth + the full wall (added — you asked for integrations to be highlighted and one row on the homepage undersells it) |
| `/testimonials` | Results-led case cards. **See §9 — these ship as visibly-marked placeholders.** |
| `/about` | Why an operator built this. Your Careem/Bolt/Motive/Wise ops background is the credibility here, not a founder-story-shaped essay |
| `/contact` | Form + cal.com booking + the demo line number slot |

---

## 7. The design delight — "The Live Line"

The hero *is* the product. A working phone-call simulation, entirely in-browser, no API keys,
works offline.

```
┌────────────────────────────────────────────────────────┐
│  ● live                    00:14        ⏸   🔇         │
│                                                        │
│   ╭───╮    ▁▃▅█▇▅▃▁▂▄▆█▅▃▁▂▅▇█▆▄▂                     │
│   │ ◉ │    First Ring · Front Desk                     │
│   ╰───╯                                                │
│                                                        │
│  AGENT   "Delta Heating, this is Robin. What's going   │
│           on with the system?"                         │
│  CALLER  "We've got no heat at all. Since last night." │
│  AGENT   "That's an emergency slot. I have 8:15 am     │
│           tomorrow or a tech on the way tonight▊"      │
│                                                        │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │ CAPTURED         │  │ ⚡ ServiceTitan            │  │
│  │ ✓ Name           │  │   Job created              │  │
│  │ ✓ Address        │  │   No-heat · Tue 8:15am     │  │
│  │ ✓ No heat        │  │   Tech: M. Alvarez         │  │
│  │ ✓ Emergency      │  │ ✓ SMS sent  ✓ Slack posted │  │
│  │ ✓ Tue 8:15am     │  └────────────────────────────┘  │
│  └──────────────────┘                                  │
└────────────────────────────────────────────────────────┘
   ▸ After-hours no-heat   ▸ Speed-to-lead   ▸ Overflow
```

**Mechanics**

- Three scenario chips. Big coral **Call** button.
- Click → WebAudio-synthesised US ringback (440 + 480 Hz). It **answers on the first ring** —
  the product demonstrates its own name in the first two seconds. That's the whole idea.
- Transcript types out line by line at realistic cadence, alternating agent and caller.
- Agent lines spoken via the browser's `speechSynthesis`. The Call click is the user gesture, so
  autoplay policy is satisfied. Prominent mute toggle; sound state persists in `localStorage`.
- Live waveform on canvas, driven by an `AnalyserNode` while speaking, deterministic fallback
  otherwise. Call timer ticks.
- "Captured" rail fills in as the conversation surfaces each field — this is the bit that sells
  it, because it shows the agent *working*, not just talking.
- On hang-up the CRM card slides in: job created, SMS sent, Slack posted. Then one soft line —
  *"That call took 38 seconds. Yours went to voicemail."* — and a booking CTA.
- Controls: replay, skip, mute, switch scenario.
- `prefers-reduced-motion`: no waveform, no typing, lines appear complete, no auto-advance.
- Accessibility: transcript is real DOM text in an `aria-live` region, captions always on,
  Call is a real `<button>`, full keyboard path.

**Upgrade path, designed in from the start**

- `lib/call-scripts.ts` — every line carries an optional `audioSrc`. Drop ElevenLabs MP3s into
  `/public/audio/` and it plays those instead of browser TTS. No code change.
- `lib/live-line.ts` — exports `startCall()` behind an interface. Swap the simulated driver for a
  Vapi or Retell web-call driver and the same UI becomes a real live demo.
- `/contact` reserves the slot for a real inbound demo number when you provision one.

**Second delight — the Missed Call Calculator.** Trucks, average ticket, calls per week, percent
missed → an animated counter of revenue leaking per year, with the 27% benchmark pre-loaded as
the default so the first number they see is their own. Teaser on the homepage, full version on
Packages. This is also the best lead magnet on the site.

**Third, small — the integration wall.** Each logo flips on hover to its one-line payload from
the table in §5. Turns a trust-badge row into something worth reading.

---

## 8. Design system

Soch's palette and type system, as you asked — same tokens, different composition, so it reads
as a sibling in taste rather than a clone.

**Carried over unchanged:** `brand #ff5c35` · `ink #1c2b26` · `slate #4c534f` · `muted #636a66` ·
`mist #f6f2ea` · `cream #fbf8f2` · `peach #ffe8dd` · `line #e7e2d7` · `forest #103129` ·
`charcoal #171814` · `teal #1f7a8c`. Wix Madefor Text throughout, 500 headings / 400 body. The
numeric type scale, the fluid section rhythm, `container-x`, `bg-dot-grid`, the `Reveal` /
`Section` / `Button` primitives, flat surfaces and hairlines over heavy shadows.

**What's new, and why:** `teal` gets promoted from a rarely-used accent to the **live/active
signal** — the pulsing dot, the waveform, the "on air" states. A calling product needs a colour
that means *happening right now*, and coral is already doing CTA duty. One new token,
`--color-signal`, aliased to teal so it can be retuned in one place.

**Structural difference from Soch:** Soch's homepage opens with a wide diagram band above the
headline. First Ring opens with a true two-column hero — argument left, live product right —
because the product demo has to be the first thing in the eye, not a texture above the fold.

**Stack:** Next 16.2 · React 19.2 · TypeScript · Tailwind 4 · motion 12. Identical to
`withsoch-web`, so anything you build there ports directly. Dev server on **port 3100** to avoid
colliding with your other projects.

---

## 9. Honesty flags — read this one

**You have no clients for this product yet.** So:

- Every testimonial, logo, case study and result number ships behind a single flag in
  `lib/content.ts`: `PLACEHOLDER_PROOF = true`. While it's true, each of those items renders with
  a visible amber "SAMPLE — replace before launch" ribbon, and the homepage proof strip carries a
  banner saying the same. Nothing can accidentally go live pretending to be real.
- Flip the flag to `false` when real quotes land and the ribbons disappear.
- The 27% benchmark is real and cited on the page. Any number attributed to a named customer is
  not, and is marked.

Everything else — the pricing, the integration payloads, the agent scope — is real and
deliverable, or scoped as "on the roadmap" where it isn't.

---

## 10. Build order

1. Scaffold Next 16 + Tailwind 4, port design tokens, `Section` / `Button` / `Reveal` / `CountUp`
2. `lib/content.ts` — every word on the site as data, single source of truth
3. Nav, Footer, logo mark
4. **The Live Line** — the hard part, built and tested first
5. Homepage sections
6. Services · Packages + Calculator · Integrations · Testimonials · About · Contact
7. Polish: reduced motion, keyboard paths, contrast checks on dark bands, 320px→2560px responsive
8. `npm run dev` on :3100, walk it in the browser, fix what's wrong, hand you the URL

---

## 11. Open items for you

- Buy `onfirstring.com` ($11.25) — or don't yet; nothing in the build depends on it
- A real demo phone number, when you want the hero to make actual calls
- Real quotes and results, to flip `PLACEHOLDER_PROOF`
- Optional: ElevenLabs voice lines to replace browser TTS in the hero — a file drop, no code
