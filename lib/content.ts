// lib/content.ts
//
// Single source of truth for every word on the site. Components import from
// here rather than hard-coding copy, so a positioning change is one edit in
// one file instead of a grep across twenty components.

/* ---------------------------------------------------------------------------
   PLACEHOLDER_PROOF
   ---------------------------------------------------------------------------
   First Ring has no customers yet. Every testimonial, logo, case result and
   named number below is invented to show the design working.

   While this flag is true, each of those items renders with a visible
   "SAMPLE - replace before launch" ribbon and the proof sections carry a
   banner saying the same. That is deliberate: it makes it impossible to
   publish fabricated social proof by accident, which is the single easiest
   way for a new agency to destroy its credibility on day one.

   Flip to false only once every item in TESTIMONIALS, CASE_RESULTS and
   CLIENT_LOGOS is a real, attributable quote from a real customer who has
   agreed to be named.
--------------------------------------------------------------------------- */
export const PLACEHOLDER_PROOF = true;

export const SITE = {
  name: "First Ring",
  domain: "onfirstring.com",
  tagline: "Answered on the first ring.",
  category: "The AI front desk for home services.",
  metaDescription:
    "First Ring builds and runs an AI calling agent for home services companies. Every inbound call answered, every outbound call made, booked straight into ServiceTitan, Housecall Pro, GoHighLevel or Zoho.",
  email: "hello@onfirstring.com",
  // Placeholder until a real line is provisioned. Rendered with the sample
  // ribbon while PLACEHOLDER_PROOF is true.
  demoPhone: "+1 (555) 014-7727",
  bookingUrl: "https://cal.com/consult-with-riz/sochwork?layout=month_view&embed=true",
};

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Integrations", href: "/integrations" },
  { label: "Results", href: "/testimonials" },
  { label: "About", href: "/about" },
];

/* ------------------------------------------------------------------ HERO */

export const HERO = {
  eyebrow: "AI calling agents for home services",
  headline: "Every call answered.",
  headlineEmphasis: "On the first ring.",
  lead: "The average home services company misses 27% of its inbound calls. Every one of those is a job somebody else booked. First Ring picks up all of them, qualifies the work, and books it into your dispatch calendar.",
  primaryCta: { label: "Book a 15-minute call", href: "/contact" },
  secondaryCta: { label: "See what it costs", href: "/packages" },
  // Sits under the CTAs. Concrete, checkable claims only.
  trustLine: [
    "Live in 14 days",
    "Works with your existing phone number",
    "30-day paid pilot",
  ],
};

/* --------------------------------------------------------------- PROBLEM */

export const PROBLEM = {
  eyebrow: "The leak",
  title: "You already know the phone is the problem.",
  intro:
    "You just don't have a number on it. Nobody bills you for the call that rang out at 6:40pm, so it never shows up anywhere you look.",
  stats: [
    {
      value: 27,
      suffix: "%",
      label: "of inbound calls missed",
      note: "Industry benchmark across home services. Invoca platform data.",
      cited: true,
    },
    {
      value: 80,
      suffix: "%",
      label: "of missed callers never call back",
      note: "They call the next company on the search results instead.",
      cited: false,
    },
    {
      value: 391,
      prefix: "",
      suffix: "x",
      label: "better conversion inside 60 seconds",
      note: "Speed-to-lead research, consistent across a decade of studies.",
      cited: false,
    },
  ],
  // The argument, four beats. Rendered as a stepped list, not bullet soup.
  beats: [
    {
      title: "It never rings at a convenient time",
      body: "Peak call volume is 8–10am and 4–6pm — exactly when your CSR is dispatching and your techs are calling in. The calls you miss are the ones that arrive when you are busiest, which means they are the ones with the most urgency behind them.",
    },
    {
      title: "Voicemail is a losing bet",
      body: "A homeowner with no heat is not leaving a message. They are on the next result down the page before your greeting finishes playing. Voicemail is not a safety net, it is a way of losing quietly.",
    },
    {
      title: "Hiring more CSRs doesn't scale down",
      body: "A person who covers your 7pm Friday is idle at 2pm Tuesday. You end up either overstaffed against your average or understaffed against your peak, and both cost you money in different directions.",
    },
    {
      title: "The list you never work is worth more than the leads you buy",
      body: "Dormant customers, lapsed maintenance plans, unsold estimates over thirty days old. Everybody knows it should be called. Nobody has the hours. That list sits there earning nothing.",
    },
  ],
};

/* ------------------------------------------------------------ HOW IT WORKS */

export const HOW_IT_WORKS = {
  eyebrow: "How it works",
  title: "Three steps. Fourteen days.",
  intro:
    "You are not configuring a platform. We build the agent around how your business actually answers the phone, then we keep tuning it against real calls.",
  steps: [
    {
      n: "01",
      title: "We listen to your calls",
      body: "Two weeks of recordings, your price bands, your service area, your on-call rota, the questions your best CSR asks that nobody wrote down. The build starts from how you already do it, not from a template.",
      duration: "Days 1–4",
    },
    {
      n: "02",
      title: "We build and you break it",
      body: "We stand the agent up on a test line and you call it. Your dispatcher calls it. Your worst-tempered customer scenario calls it. We tune until you cannot make it say anything you would be embarrassed by.",
      duration: "Days 5–11",
    },
    {
      n: "03",
      title: "It goes live behind your team",
      body: "Overflow first — it only picks up what your team drops. You watch the transcripts for a week. When you trust it, we widen the gate. Every call recorded, tagged and written back to your CRM from day one.",
      duration: "Days 12–14",
    },
  ],
};

/* ---------------------------------------------------------------- AGENTS */

export type Agent = {
  slug: string;
  name: string;
  direction: "Inbound" | "Outbound";
  tagline: string;
  summary: string;
  detail: string;
  does: string[];
  proofLabel: string;
  proofValue: string;
};

export const AGENTS: Agent[] = [
  {
    slug: "front-desk",
    name: "Front Desk",
    direction: "Inbound",
    tagline: "Answers everything, 24/7.",
    summary:
      "Picks up on the first ring, every hour of every day. Qualifies the job, captures the address, quotes the price band and books it into your dispatch calendar.",
    detail:
      "This is the full replacement for the calls nobody is picking up. It knows your service area down to the postcode, your price bands by job type, your capacity by day, and which situations are a true emergency versus a Tuesday-morning appointment. It talks like your best CSR on their best day, because that is who we built it from.",
    does: [
      "Answers on the first ring, 24/7/365 — no hold, no queue, no menu tree",
      "Qualifies the job: system type, symptom, age, urgency, property access",
      "Quotes your published price band and diagnostic fee, never invents a number",
      "Checks live capacity and books into the right arrival window",
      "Escalates genuine emergencies to the on-call tech by phone, not by email",
      "Confirms by SMS before the call ends",
    ],
    proofLabel: "Typical answer rate",
    proofValue: "100%",
  },
  {
    slug: "overflow",
    name: "Overflow",
    direction: "Inbound",
    tagline: "Only picks up what your team drops.",
    summary:
      "Sits behind your existing team. Answers after three rings, on busy, or outside hours. Nothing changes for your CSR — they just stop losing the ones they can't get to.",
    detail:
      "The lowest-risk way to start, and the one we recommend for almost everybody. Your phone system already knows how to forward on no-answer and on busy. We take that overflow. Your CSR keeps every call they can handle and the agent catches the tail: the second and third simultaneous caller, the 7pm Friday, the whole of Sunday.",
    does: [
      "Rings through to your team first — always",
      "Catches no-answer after a ring count you set",
      "Catches busy when every line is already engaged",
      "Covers nights, weekends and holidays on your schedule",
      "Hands back to a human the moment one is free, mid-call, with context",
      "Reports weekly on exactly what it caught that would otherwise have gone",
    ],
    proofLabel: "Setup risk",
    proofValue: "Lowest",
  },
  {
    slug: "speed-to-lead",
    name: "Speed-to-Lead",
    direction: "Outbound",
    tagline: "Calls the form fill in 60 seconds.",
    summary:
      "Every web form, Angi, Thumbtack and Google LSA lead gets a live call inside a minute — while they are still on your site with two competitor tabs open.",
    detail:
      "The economics of lead response are not subtle. Contact inside a minute converts multiples better than contact inside an hour, and most contractors are measuring their response in hours because a human has to notice the notification first. The agent does not need to notice. The form submits, the phone rings, the conversation happens while your company is still the one they were thinking about.",
    does: [
      "Fires on webhook from your forms, Angi, Thumbtack, Google LSA and Yelp",
      "Calls within 60 seconds of submission, around the clock",
      "Retries on a cadence you set, then hands to SMS if voice fails twice",
      "Books straight into the calendar on the same call",
      "Marks the lead source so you can see which channel actually pays",
      "Stops the moment the lead is booked or opts out",
    ],
    proofLabel: "Median response",
    proofValue: "< 60s",
  },
  {
    slug: "reactivation",
    name: "Reactivation",
    direction: "Outbound",
    tagline: "Works the list nobody has time for.",
    summary:
      "Dormant customers, lapsed maintenance plans, unsold estimates over thirty days. The highest-return list in your business and the one that never gets called.",
    detail:
      "You already paid to acquire these people. They already let you into their home. The only reason they are not booked right now is that nobody has picked up the phone, and nobody has picked up the phone because there is always something more urgent. The agent has nothing more urgent. It works the list on a schedule, politely, at a volume you set, and it stops when someone says stop.",
    does: [
      "Segments from your CRM: last service date, plan status, estimate age",
      "Calls at the hours your customers actually answer, in their timezone",
      "Offers the specific thing that fits — tune-up, plan renewal, revisit on the quote",
      "Honours do-not-call and opt-out on the first request, permanently",
      "Caps daily volume so it never reads as a call centre",
      "Reports revenue booked against list worked, per segment",
    ],
    proofLabel: "Cost per contact",
    proofValue: "Cents",
  },
  {
    slug: "confirm-collect",
    name: "Confirm & Collect",
    direction: "Outbound",
    tagline: "Kills no-shows. Shortens the cash cycle.",
    summary:
      "Appointment confirmations and reschedules the day before, review asks the day after, and a polite nudge on the invoice that is three weeks late.",
    detail:
      "Unglamorous and the fastest payback on the list. A no-show costs you a truck roll, two hours and the job you turned away for that slot. An unpaid invoice costs you the float. Neither needs a skilled human — they need somebody to reliably make the call, every time, which is exactly the thing humans are worst at and this is best at.",
    does: [
      "Confirms tomorrow's appointments and offers a reschedule if it is wrong",
      "Refills the slot from the waitlist when somebody cancels",
      "Asks for the review the day after the job, while it is still fresh",
      "Nudges overdue invoices on your schedule, with your wording",
      "Takes payment by handing to your existing payment link, never over voice",
      "Logs every outcome to the job record",
    ],
    proofLabel: "Fastest payback",
    proofValue: "Week 1",
  },
];

export const HANDOFF = {
  eyebrow: "Under all five",
  title: "The Handoff",
  lead: "The reason you can trust the other five. Every call ends somewhere accountable.",
  points: [
    {
      title: "Warm transfer, with the context already spoken",
      body: "When a call needs a person, the agent does not dump the caller into a queue. It rings your on-call, tells them who is holding and what the situation is, then bridges the call. Your tech picks up already knowing.",
    },
    {
      title: "It will not pretend to be human",
      body: "Asked directly, it says what it is. This is not a compliance checkbox, it is the thing that stops a caller feeling tricked — and a caller who feels tricked does not become a customer.",
    },
    {
      title: "Every call recorded, transcribed and tagged",
      body: "Full transcript, outcome tag, sentiment, and the reason it did what it did — written to the customer record in your CRM. You can read exactly what was said on any call, any time, without asking anyone.",
    },
    {
      title: "Scored weekly against real transcripts",
      body: "We pull the calls that went badly, find the pattern, and fix the agent. That is the part a platform subscription does not include and the reason the agent gets better instead of staying the same.",
    },
  ],
};

export const WONT_DO = {
  eyebrow: "Straight answer",
  title: "What it won't do",
  lead: "Every vendor in this category will tell you their agent handles everything. Ours does not, and you should be suspicious of anyone whose does.",
  items: [
    {
      title: "Diagnose a fault over the phone",
      body: "It captures the symptom precisely and gets a tech there. It does not guess at a diagnosis, because a wrong guess on the phone becomes an argument on the doorstep.",
    },
    {
      title: "Quote a price it hasn't been given",
      body: "It quotes your published bands and your diagnostic fee. If a job falls outside them, it says a human will confirm the number rather than inventing one that you then have to honour.",
    },
    {
      title: "Argue about a bill",
      body: "Billing disputes, complaints and anything with heat in it go straight to a human. There is no version of an AI winning that conversation.",
    },
    {
      title: "Take a card number by voice",
      body: "It sends your payment link. Card details are never spoken to, captured by, or stored in the agent.",
    },
    {
      title: "Replace your CSR",
      body: "It replaces the voicemail box. Your CSR is the reason your good calls go well — the agent exists so they stop drowning in the volume and stop losing the overflow.",
    },
  ],
};

/* ---------------------------------------------------------- INTEGRATIONS */

export type Integration = {
  name: string;
  category: string;
  payload: string;
  featured?: boolean;
};

export const FEATURED_INTEGRATIONS: Integration[] = [
  {
    name: "ServiceTitan",
    category: "Field service",
    featured: true,
    payload:
      "Creates the job with the right business unit and job type, honours capacity and arrival windows, books the slot, and writes call tags plus the full transcript to the customer record.",
  },
  {
    name: "Housecall Pro",
    category: "Field service",
    featured: true,
    payload:
      "Creates the customer if they are new, books the job to the correct segment and calendar, attaches the recording to the job, and triggers the automations you already run.",
  },
  {
    name: "GoHighLevel",
    category: "CRM / agency",
    featured: true,
    payload:
      "Writes the contact and opportunity, moves the pipeline stage, fires your workflow, and logs the call in the conversation thread. Sub-account safe, so agencies can run it across a whole book.",
  },
  {
    name: "Zoho",
    category: "CRM / suite",
    featured: true,
    payload:
      "Leads and deals into Zoho CRM, pipelines into Bigin, service issues into Desk as tickets, and appointments slotted through Zoho Bookings.",
  },
];

export const INTEGRATION_GROUPS: { group: string; items: Integration[] }[] = [
  {
    group: "Field service management",
    items: [
      { name: "Jobber", category: "FSM", payload: "Client, request and visit created; assigned to the right team." },
      { name: "Workiz", category: "FSM", payload: "Job booked with source attribution and dispatch tags." },
      { name: "Service Fusion", category: "FSM", payload: "Customer, job and estimate records written on call end." },
      { name: "FieldEdge", category: "FSM", payload: "Work order raised and matched to the service agreement." },
      { name: "ServiceM8", category: "FSM", payload: "Job card created with the call recording attached." },
      { name: "Simpro", category: "FSM", payload: "Lead or job logged against the correct cost centre." },
    ],
  },
  {
    group: "CRM",
    items: [
      { name: "HubSpot", category: "CRM", payload: "Contact, deal and a logged call engagement with transcript." },
      { name: "Salesforce", category: "CRM", payload: "Lead or case created, routed by your assignment rules." },
      { name: "Pipedrive", category: "CRM", payload: "Deal created in the right pipeline stage with call notes." },
    ],
  },
  {
    group: "Phone systems",
    items: [
      { name: "Twilio", category: "Telephony", payload: "Numbers, routing and recording — our default carrier layer." },
      { name: "RingCentral", category: "Telephony", payload: "Overflow and after-hours forwarding from your existing tree." },
      { name: "OpenPhone", category: "Telephony", payload: "Shared inbox stays the source of truth; agent handles the tail." },
      { name: "Aircall", category: "Telephony", payload: "Rings your team first, agent catches no-answer and busy." },
      { name: "CallRail", category: "Tracking", payload: "Keeps your call tracking and attribution intact end to end." },
      { name: "Dialpad", category: "Telephony", payload: "Forward-on-condition into the agent, transfer back to a human." },
    ],
  },
  {
    group: "Calendars",
    items: [
      { name: "Google Calendar", category: "Calendar", payload: "Live availability read, appointment written, invite sent." },
      { name: "Microsoft 365", category: "Calendar", payload: "Outlook calendars read and booked, per technician." },
      { name: "Cal.com", category: "Booking", payload: "Booking links honoured with your buffers and limits." },
      { name: "Calendly", category: "Booking", payload: "Slots checked and held during the call, not after it." },
      { name: "Acuity", category: "Booking", payload: "Appointment types and durations respected on booking." },
    ],
  },
  {
    group: "Lead sources",
    items: [
      { name: "Angi", category: "Leads", payload: "New lead triggers an outbound call inside 60 seconds." },
      { name: "Thumbtack", category: "Leads", payload: "Instant callback the moment the request lands." },
      { name: "Google LSA", category: "Leads", payload: "Local Services lead called before the competing pro does." },
      { name: "Yelp", category: "Leads", payload: "Request-a-quote converted to a live conversation." },
    ],
  },
  {
    group: "Messaging & reviews",
    items: [
      { name: "Slack", category: "Messaging", payload: "Booked jobs and escalations posted to your dispatch channel." },
      { name: "SMS", category: "Messaging", payload: "Confirmation sent before the call ends, from your number." },
      { name: "Podium", category: "Messaging", payload: "Conversation continues in the inbox your team already watches." },
      { name: "Google Business", category: "Reviews", payload: "Review ask sent the day after the job completes." },
      { name: "Birdeye", category: "Reviews", payload: "Review requests fired into your existing sequence." },
    ],
  },
  {
    group: "Money",
    items: [
      { name: "Stripe", category: "Payments", payload: "Payment link sent by SMS — card details never spoken." },
      { name: "QuickBooks", category: "Accounting", payload: "Overdue invoice list drives the collections call queue." },
    ],
  },
  {
    group: "Anything else",
    items: [
      { name: "n8n", category: "Automation", payload: "Our default glue. Any step you want, wired exactly your way." },
      { name: "Zapier", category: "Automation", payload: "6,000+ apps if you already live there." },
      { name: "Make", category: "Automation", payload: "Scenario triggers on every call event." },
      { name: "Webhooks", category: "API", payload: "Every call event pushed to your endpoint in real time." },
      { name: "REST API", category: "API", payload: "Read transcripts, outcomes and bookings into your own stack." },
    ],
  },
];

/* -------------------------------------------------------------- PACKAGES */

export type Package = {
  slug: string;
  name: string;
  forWho: string;
  build: string;
  monthly: string;
  minutes: string;
  overage: string;
  blurb: string;
  includes: string[];
  featured?: boolean;
};

export const PACKAGES: Package[] = [
  {
    slug: "line-one",
    name: "Line One",
    forWho: "1–3 trucks",
    build: "$1,500",
    monthly: "$450",
    minutes: "750 min",
    overage: "$0.55/min",
    blurb:
      "One agent, one number, one calendar. The version that stops you losing the after-hours call.",
    includes: [
      "Front Desk or Overflow — your pick",
      "One phone number",
      "One integration",
      "One booking calendar",
      "Monthly tuning session",
      "Full transcripts and recordings",
      "Email support, two business days",
    ],
  },
  {
    slug: "full-crew",
    name: "Full Crew",
    forWho: "4–15 trucks",
    build: "$3,500",
    monthly: "$1,200",
    minutes: "2,500 min",
    overage: "$0.45/min",
    featured: true,
    blurb:
      "Inbound covered properly, plus the one outbound play that pays for the whole thing.",
    includes: [
      "Front Desk and Overflow",
      "One outbound agent of your choice",
      "Up to three phone numbers",
      "Three integrations",
      "Multi-technician dispatch rules and capacity logic",
      "Monthly tuning plus transcript review",
      "Shared Slack channel",
    ],
  },
  {
    slug: "dispatch",
    name: "Dispatch",
    forWho: "15+ trucks, multi-location",
    build: "$7,500",
    monthly: "$2,800",
    minutes: "8,000 min",
    overage: "$0.35/min",
    blurb:
      "All five agents across every location and brand, tuned weekly against your real call quality.",
    includes: [
      "All five agents",
      "Unlimited numbers, multi-location and multi-brand routing",
      "Unlimited integrations, including custom builds",
      "Weekly tuning and call-QA scorecards",
      "Custom routing and escalation logic per location",
      "Dedicated Slack channel, four-hour response SLA",
      "Quarterly business review with the numbers",
    ],
  },
];

export const PILOT = {
  name: "The 30-day pilot",
  price: "$1,000",
  lead: "Credited in full against your build fee if you continue.",
  body: "There is exactly one objection that matters in this category: what if it sounds like a robot and embarrasses us in front of a customer. You cannot answer that with a case study, so we do not try. One agent, one number, thirty days on your real calls. You read every transcript. If you do not like what you read, you walk away having spent a thousand dollars finding out.",
  includes: [
    "One agent, built on your real scripts and price bands",
    "One number, live on real calls for 30 days",
    "Every transcript, in a shared doc, from day one",
    "A written readout at the end: what it caught, what it cost, what it booked",
    "The full $1,000 credited if you go ahead",
  ],
};

export const PRICING_NOTES = {
  title: "How the money actually works",
  notes: [
    {
      title: "Minutes are billed at cost-plus, and we show you the cost",
      body: "The market standard in this category is to resell voice minutes at $1–$3 and never mention the underlying rate, which sits between $0.10 and $0.30 all-in. Our overage is $0.35–$0.55 depending on tier. That is a real margin and we are not pretending otherwise — it is just a fifth of what the quiet version charges.",
    },
    {
      title: "The build fee is not a deposit",
      body: "It pays for discovery, conversation design, integration work and the testing week. It is the part that makes the agent yours rather than a template with your company name in a variable.",
    },
    {
      title: "No annual lock-in",
      body: "Month to month after the build, thirty days' notice. If it stops earning, stop paying for it. An agency that needs a twelve-month contract to keep you is telling you something.",
    },
    {
      title: "What you'll actually spend",
      body: "A four-truck shop taking roughly 400 calls a month at three minutes each uses about 1,200 minutes. On Full Crew that is inside the bundle: $1,200 a month, all in, plus the one-time build.",
    },
  ],
};

/* ------------------------------------------------------------ CALCULATOR */

export const CALCULATOR = {
  eyebrow: "Do the arithmetic",
  title: "What is your phone costing you?",
  lead: "The default missed-call rate below is the home services industry benchmark. Move the sliders to your numbers.",
  defaults: {
    callsPerWeek: 120,
    missedPct: 27,
    avgTicket: 480,
    closeRate: 35,
  },
  footnote:
    "Booked revenue, not profit. Assumes a recovered call converts at the same rate as one your team answers, which is conservative — after-hours emergency calls typically convert higher.",
};

/* ----------------------------------------------------------------- PROOF */
// Everything in this block is INVENTED. See PLACEHOLDER_PROOF at the top.

export const CLIENT_LOGOS = [
  "Delta Heating & Air",
  "Cardinal Plumbing",
  "Northgate Electric",
  "Ridgeline Roofing",
  "BluePeak HVAC",
  "Old Mill Pest",
  "Summit Garage Doors",
  "Harbour Mechanical",
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  trade: string;
  metric?: { value: string; label: string };
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I was the after-hours line. My phone, my evenings, for eleven years. The first Saturday I did not think about it once, my wife noticed before I did.",
    name: "Marcus Ellery",
    role: "Owner",
    company: "Delta Heating & Air",
    trade: "HVAC · 9 trucks",
    metric: { value: "41", label: "after-hours jobs booked in month one" },
  },
  {
    quote:
      "We did not believe the missed-call number until we saw the first week of transcripts. Eighty-three calls we never knew existed. Nineteen of them booked.",
    name: "Priya Raman",
    role: "General Manager",
    company: "Cardinal Plumbing",
    trade: "Plumbing · 14 trucks",
    metric: { value: "$61k", label: "recovered in the first quarter" },
  },
  {
    quote:
      "The reactivation list had eleven hundred names on it. It had been sitting there for two years because calling it was always next week's job.",
    name: "Dan Whitlock",
    role: "Owner",
    company: "Northgate Electric",
    trade: "Electrical · 6 trucks",
    metric: { value: "137", label: "dormant customers rebooked" },
  },
  {
    quote:
      "My CSR was the one who asked to widen it. She said she would rather handle forty good calls than seventy where she is apologising for the hold.",
    name: "Rosa Bierman",
    role: "Operations Lead",
    company: "Ridgeline Roofing",
    trade: "Roofing · 11 crews",
  },
  {
    quote:
      "The thing that sold me was it saying it was an AI when my brother-in-law asked. He was trying to catch it out. It just told him.",
    name: "Tomas Feld",
    role: "Co-owner",
    company: "BluePeak HVAC",
    trade: "HVAC · 5 trucks",
  },
  {
    quote:
      "No-shows went from about one in six to one in twenty. That is a truck that does not drive across town for nothing, twice a week.",
    name: "Aileen Marsh",
    role: "Dispatch Manager",
    company: "Summit Garage Doors",
    trade: "Garage doors · 8 trucks",
    metric: { value: "68%", label: "fewer no-shows" },
  },
];

export const CASE_RESULTS = [
  { value: "27%", label: "of calls were being missed", sub: "before First Ring, measured over 30 days" },
  { value: "100%", label: "answered after go-live", sub: "first ring, every hour" },
  { value: "14", label: "days to live", sub: "discovery to first real call" },
  { value: "$61k", label: "recovered in a quarter", sub: "one 14-truck plumbing company" },
];

/* ------------------------------------------------------------------- FAQ */

export const FAQS = [
  {
    q: "Will it sound like a robot?",
    a: "Call the demo on this page and decide for yourself — that is why it is there rather than a paragraph claiming otherwise. The honest answer: it sounds like a competent person on a phone line, and about one caller in ten works out it is an AI. When they ask directly, it tells them.",
  },
  {
    q: "Do I have to change my phone number?",
    a: "No. In almost every setup we keep your number exactly as it is and change the forwarding rules — no answer after N rings, on busy, or outside hours goes to the agent. Your printed vans and your Google listing stay correct.",
  },
  {
    q: "What happens when it doesn't know something?",
    a: "It says so, and it does one of two things: warm-transfers to a human with the context already explained, or takes a callback and books the follow-up. It does not guess. Guessing is how you end up honouring a price you never quoted.",
  },
  {
    q: "How is this different from the AI already in ServiceTitan or Housecall Pro?",
    a: "Those are good products and if the bundled version covers you, use it. The difference is scope and ownership. Theirs is configured inside one platform. Ours is built around your scripts, your price bands, your rota and your whole stack — and somebody tunes it every week against your actual transcripts instead of leaving it in a settings tab.",
  },
  {
    q: "What if it books a job we can't do?",
    a: "It reads live capacity before it offers a slot, and it knows your service area, your job types and what you do not take. If it is outside those bounds it does not book — it captures the detail and flags it to a human.",
  },
  {
    q: "Who owns the recordings and transcripts?",
    a: "You do. They live in your CRM and you can export the lot at any time. If you leave, you take them with you and we delete our copy.",
  },
  {
    q: "How long until it pays for itself?",
    a: "For most shops it is the first month, and the maths is not clever — one recovered emergency job at a $700 ticket covers Line One's monthly outright. Use the calculator on the packages page with your own numbers rather than taking that on faith.",
  },
  {
    q: "What do you need from us to start?",
    a: "Two weeks of call recordings, your price bands, your service area, your on-call rota, and one person who can answer questions for about three hours total across the fortnight. That is genuinely it.",
  },
];

/* ----------------------------------------------------------------- ABOUT */

export const ABOUT = {
  eyebrow: "About",
  title: "Built by operators, not by a voice AI startup.",
  lead: "First Ring exists because the people who built it spent a decade watching good businesses lose money to operational gaps nobody had time to close.",
  body: [
    "Most of this category is built by engineers who found a fun API. That shows up in the product: impressive demos, generic scripts, and nobody on the other end when the agent starts telling your customers something it should not.",
    "This was built the other way round. A decade of operations leadership across Careem, Bolt, Motive and Wise — the kind of work where you are measured on answer rates, dispatch efficiency and cost per contact, and where you learn that the difference between a system that works and one that does not is almost never the technology. It is whether anyone owns it after launch.",
    "So the product is a build plus an owner. We construct the agent around how your business actually answers the phone, and then we sit with the transcripts every week and make it better. That second part is the whole thing. An AI calling agent that nobody tunes is a very expensive voicemail with opinions.",
  ],
  principles: [
    {
      title: "The stated reason is rarely the real one",
      body: "When a call goes wrong, the transcript tells you what happened but not why. We dig for the pattern underneath, because fixing the symptom just moves the failure somewhere you are not looking.",
    },
    {
      title: "Say the limits out loud",
      body: "There is a whole page on this site about what the agent will not do. Every honest scoping conversation gets shorter and every project goes better when the boundaries are stated before the contract instead of after the first bad call.",
    },
    {
      title: "Own it after launch",
      body: "Anyone can stand up a voice agent in a weekend now. The work is the ninety days afterwards. That is what the monthly fee buys, and if we are not earning it you should stop paying it.",
    },
  ],
};

/* --------------------------------------------------------------- CONTACT */

export const CONTACT = {
  eyebrow: "Contact",
  title: "Call it, or book fifteen minutes.",
  lead: "The fastest way to judge this is to hear it. Second fastest is to tell us what your phone is doing and let us tell you honestly whether we can help.",
  formFields: {
    tradesOptions: [
      "HVAC",
      "Plumbing",
      "Electrical",
      "Roofing",
      "Pest control",
      "Garage doors",
      "Landscaping",
      "Cleaning",
      "Multi-trade",
      "Other",
    ],
    sizeOptions: ["1–3 trucks", "4–15 trucks", "15+ trucks", "Multi-location"],
    stackOptions: [
      "ServiceTitan",
      "Housecall Pro",
      "GoHighLevel",
      "Zoho",
      "Jobber",
      "Something else",
      "Nothing yet",
    ],
  },
};

export const CTA_BAND = {
  title: "Your phone is ringing right now.",
  lead: "Somebody is deciding whether to wait for your voicemail or call the next company. Fifteen minutes, and we will tell you exactly what that is costing you.",
  primary: { label: "Book a 15-minute call", href: "/contact" },
  secondary: { label: "See the packages", href: "/packages" },
};

export const FOOTER = {
  blurb:
    "First Ring builds and runs AI calling agents for home services companies. Every inbound call answered, every outbound call made, booked into the software you already use.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Services", href: "/services" },
        { label: "Packages", href: "/packages" },
        { label: "Integrations", href: "/integrations" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Results", href: "/testimonials" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
};
