// lib/call-scripts.ts
//
// Dialogue for the hero's sample call.
//
// HOW THESE ARE WRITTEN, AND WHY IT MATTERS MORE THAN THE UI:
//
// The first version of this file was a diagnostic interrogation - the agent
// asked a question, the caller answered it, repeat, book. Technically it
// covered the same ground and it was unwatchable, because that is not how
// people talk on the phone. Real calls have short turns, interruptions,
// backchannels, someone trailing off, and one party being warm at the other.
//
// Rules for editing:
//   - Most turns are five to twelve words. If a line runs past twenty, split
//     it or cut it.
//   - The agent acknowledges before it asks. "Oh no. Since when?" not
//     "Please describe the nature of the fault."
//   - Contractions everywhere. Nobody says "do not" on the phone.
//   - The agent is allowed a joke, an apology and a bit of warmth. It is not
//     allowed to be clever at the caller's expense.
//   - The caller is allowed to be surprised, sceptical and interrupt.
//   - No line explains the product. The call sells it by being good.
//
// `beat` is the pause AFTER the line, in ms, and it is doing real work:
// varying it is most of what makes the rhythm feel human. Short beats stack
// turns on top of each other the way people actually overlap; a long beat is
// someone thinking.

export type Speaker = "agent" | "caller";

export type Line = {
  speaker: Speaker;
  text: string;
  /**
   * Pre-rendered audio for this line. When present the player uses it and
   * drives the orb from a real FFT of the waveform. See the note in
   * lib/live-line.ts about why there is no synthesised fallback.
   */
  audioSrc?: string;
  /** Capture ids revealed once this line lands. */
  captures?: string[];
  /** Pause after the line, ms. Defaults to 420. */
  beat?: number;
};

export type Capture = { id: string; label: string; value: string };

export type Outcome = {
  system: string;
  title: string;
  rows: { label: string; value: string }[];
  side: string[];
};

export type Scenario = {
  id: string;
  chip: string;
  /**
   * Gemini voice names for scripts/render-voices.mjs. The agent is the same
   * person across all three scenarios so it keeps one voice; the caller is a
   * different member of the public each time and is cast to match the name in
   * the script. Getting this wrong is worse than it sounds - a demo about
   * believability cannot have Anthony answering in a woman's voice.
   */
  voices?: { agent: string; caller: string };
  direction: "Inbound" | "Outbound";
  /** Sits under the orb before the call starts. */
  meta: string;
  business: string;
  agentName: string;
  callerLabel: string;
  /** The agent's resting line, shown in the bubble before anyone calls. */
  greeting: string;
  premise: string;
  lines: Line[];
  captures: Capture[];
  outcome: Outcome;
  closer: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "after-hours",
    chip: "After hours",
    voices: { agent: "Erinome", caller: "Gacrux" }, // clear / mature, both female
    direction: "Inbound",
    meta: "Friday, 9:47pm",
    business: "Delta Heating & Air",
    agentName: "Robin",
    callerLabel: "Karen",
    greeting: "Delta Heating, this is Robin. What's going on?",
    premise: "Friday night. Your office closed at five. A furnace just died.",
    captures: [
      { id: "issue", label: "Issue", value: "No heat — furnace" },
      { id: "urgency", label: "Urgency", value: "Emergency" },
      { id: "name", label: "Customer", value: "Karen Delacroix" },
      { id: "address", label: "Address", value: "48 Warren Ave" },
      { id: "member", label: "Plan", value: "Comfort member" },
      { id: "slot", label: "Booked", value: "Sat, 8:15am" },
    ],
    lines: [
      { speaker: "agent", text: "Delta Heating, this is Robin.", beat: 260 },
      {
        speaker: "caller",
        text: "Hi — our furnace has quit. There's no heat at all.",
        captures: ["issue"],
        beat: 240,
      },
      { speaker: "agent", text: "Oh no. Since when?", beat: 200 },
      { speaker: "caller", text: "About six this evening.", beat: 260 },
      { speaker: "agent", text: "And it's what, twenty-nine out tonight?", beat: 220 },
      { speaker: "caller", text: "Yeah. And we've got the kids here.", beat: 200 },
      {
        speaker: "agent",
        text: "Right. Then I'm calling this an emergency.",
        captures: ["urgency"],
        beat: 340,
      },
      { speaker: "agent", text: "Can I grab the address?", beat: 200 },
      { speaker: "caller", text: "Forty-eight Warren Avenue.", captures: ["address"], beat: 220 },
      { speaker: "agent", text: "Warren Ave. And you're Karen?", captures: ["name"], beat: 200 },
      { speaker: "caller", text: "That's me. How did you—", beat: 180 },
      {
        speaker: "agent",
        text: "You're on our Comfort plan. So there's no after-hours fee.",
        captures: ["member"],
        beat: 240,
      },
      { speaker: "caller", text: "Oh. Good.", beat: 300 },
      {
        speaker: "agent",
        text: "I can have Mateo there for eight fifteen, or page the on-call tonight.",
        beat: 280,
      },
      { speaker: "caller", text: "Morning's fine. We'll manage.", beat: 220 },
      {
        speaker: "agent",
        text: "Eight fifteen it is. He'll text when he's fifteen minutes out.",
        captures: ["slot"],
        beat: 320,
      },
      {
        speaker: "caller",
        text: "Thanks. Honestly, I didn't think anyone would pick up.",
        beat: 300,
      },
      { speaker: "agent", text: "That's rather the idea. Stay warm, Karen.", beat: 600 },
    ],
    outcome: {
      system: "ServiceTitan",
      title: "Job created",
      rows: [
        { label: "Job type", value: "No heat — diagnostic" },
        { label: "Priority", value: "Emergency" },
        { label: "Window", value: "Sat 8:15 – 10:15am" },
        { label: "Technician", value: "M. Alvarez" },
      ],
      side: ["Text sent to Karen", "Posted to #dispatch", "Recording on her record"],
    },
    closer: "That whole call took {time}. The other two companies she rang went to voicemail.",
  },

  {
    id: "speed-to-lead",
    chip: "Speed to lead",
    voices: { agent: "Erinome", caller: "Iapetus" }, // clear female / clear male
    direction: "Outbound",
    meta: "Tuesday, 2:02pm",
    business: "Cardinal Plumbing",
    agentName: "Robin",
    callerLabel: "Anthony",
    greeting: "A lead just came in. Watch how fast it gets called.",
    premise: "A Google lead landed 38 seconds ago. He's still on your website.",
    captures: [
      { id: "name", label: "Lead", value: "Anthony Vos" },
      { id: "source", label: "Source", value: "Google LSA" },
      { id: "issue", label: "Issue", value: "Water heater leak" },
      { id: "age", label: "Unit age", value: "~12 years" },
      { id: "band", label: "Quoted", value: "$1,850 – $2,400" },
      { id: "slot", label: "Booked", value: "Wed, 11:00am" },
    ],
    lines: [
      { speaker: "agent", text: "Hi, is this Anthony?", captures: ["name"], beat: 220 },
      { speaker: "caller", text: "Yeah?", beat: 180 },
      {
        speaker: "agent",
        text: "Robin, Cardinal Plumbing. You just sent us a note about a water heater.",
        captures: ["source"],
        beat: 240,
      },
      { speaker: "caller", text: "Whoa. I hit submit like ten seconds ago.", beat: 200 },
      { speaker: "agent", text: "I know. Sorry to be quick about it.", beat: 220 },
      { speaker: "caller", text: "No — no, this is great.", beat: 300 },
      {
        speaker: "agent",
        text: "So, is it dripping from the top, or pooling underneath?",
        beat: 220,
      },
      { speaker: "caller", text: "Pooling. There's a puddle.", captures: ["issue"], beat: 240 },
      { speaker: "agent", text: "Mm. That's the tank, not a fitting. How old?", beat: 240 },
      {
        speaker: "caller",
        text: "Came with the house. Twelve years, maybe?",
        captures: ["age"],
        beat: 260,
      },
      {
        speaker: "agent",
        text: "Yeah. Twelve years and a puddle — that's a replacement.",
        beat: 280,
      },
      { speaker: "caller", text: "Figured. What am I looking at?", beat: 220 },
      {
        speaker: "agent",
        text: "Eighteen fifty to twenty-four hundred, installed.",
        captures: ["band"],
        beat: 200,
      },
      { speaker: "agent", text: "And the tech confirms before he touches anything.", beat: 300 },
      { speaker: "caller", text: "Okay. That's fair.", beat: 260 },
      { speaker: "agent", text: "I've got eleven tomorrow.", beat: 200 },
      {
        speaker: "agent",
        text: "Shut the cold inlet on top of the tank tonight — stops it getting worse.",
        beat: 280,
      },
      {
        speaker: "caller",
        text: "Eleven works. And thanks, I wouldn't have known that.",
        captures: ["slot"],
        beat: 600,
      },
    ],
    outcome: {
      system: "GoHighLevel",
      title: "Opportunity created",
      rows: [
        { label: "Pipeline", value: "Water heater — replacement" },
        { label: "Stage", value: "Appointment set" },
        { label: "Value", value: "$1,850 – $2,400" },
        { label: "Appointment", value: "Wed 11:00am" },
      ],
      side: ["Workflow triggered", "Call logged to contact", "Added to Google Calendar"],
    },
    closer:
      "Thirty-eight seconds from form to phone, and {time} to a booked job. The industry median first response is forty-seven hours.",
  },

  {
    id: "overflow",
    chip: "Overflow",
    voices: { agent: "Erinome", caller: "Callirrhoe" }, // clear / easy-going, both female
    direction: "Inbound",
    meta: "Monday, 8:12am",
    business: "Northgate Electric",
    agentName: "Robin",
    callerLabel: "Simone",
    greeting: "Your team is on every line. This is caller number three.",
    premise: "Monday morning. Both your people are already on calls.",
    captures: [
      { id: "issue", label: "Issue", value: "Breaker tripping" },
      { id: "risk", label: "Safety", value: "Burning smell — flagged" },
      { id: "name", label: "Customer", value: "Simone Bakker" },
      { id: "address", label: "Address", value: "1120 Kestrel Way" },
      { id: "slot", label: "Booked", value: "Today, 1:30pm" },
    ],
    lines: [
      { speaker: "agent", text: "Northgate Electric, Robin speaking.", beat: 240 },
      {
        speaker: "caller",
        text: "Oh — a person. I've been cut off twice already.",
        beat: 220,
      },
      { speaker: "agent", text: "You've got me, and I'm not going anywhere.", beat: 260 },
      { speaker: "agent", text: "What's happening?", beat: 200 },
      {
        speaker: "caller",
        text: "The kitchen breaker keeps tripping. Third time this morning.",
        captures: ["issue"],
        beat: 240,
      },
      { speaker: "agent", text: "Third time. Is anything warm? Any smell?", beat: 420 },
      {
        speaker: "caller",
        text: "…Actually, yes. There's a burning smell near the panel.",
        captures: ["risk"],
        beat: 200,
      },
      { speaker: "agent", text: "Okay. Leave that breaker off.", beat: 180 },
      { speaker: "agent", text: "Don't reset it again.", beat: 280 },
      { speaker: "caller", text: "Should I be worried?", beat: 240 },
      {
        speaker: "agent",
        text: "I'd rather have someone look today than tell you not to worry.",
        beat: 260,
      },
      { speaker: "agent", text: "What's the address?", beat: 200 },
      {
        speaker: "caller",
        text: "Eleven twenty Kestrel Way. Simone Bakker.",
        captures: ["name", "address"],
        beat: 240,
      },
      { speaker: "agent", text: "Got it. One thirty this afternoon.", captures: ["slot"], beat: 240 },
      { speaker: "caller", text: "Today? I assumed next week.", beat: 220 },
      { speaker: "agent", text: "Not with a burning smell.", beat: 260 },
      { speaker: "agent", text: "Priya will call within the hour to confirm.", beat: 600 },
    ],
    outcome: {
      system: "Housecall Pro",
      title: "Job scheduled",
      rows: [
        { label: "Job type", value: "Panel — safety inspection" },
        { label: "Priority", value: "Same day" },
        { label: "Window", value: "Mon 1:30 – 3:30pm" },
        { label: "Flag", value: "Possible arc fault" },
      ],
      side: ["Customer created", "Recording attached", "Owner alerted"],
    },
    closer: "{time}, and your team never saw this call. Before First Ring, neither did you.",
  },
];

export const DEFAULT_SCENARIO_ID = SCENARIOS[0].id;
