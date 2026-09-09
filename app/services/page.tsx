import type { Metadata } from "next";
import { AGENTS, HANDOFF, WONT_DO } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Five AI calling agents for home services: Front Desk, Overflow, Speed-to-Lead, Reactivation and Confirm & Collect — plus what they deliberately will not do.",
};

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow="Services"
        title={
          <>
            Five jobs on the phone.{" "}
            <span className="text-brand italic">Pick the ones that hurt.</span>
          </>
        }
        lead="Sold individually or as a stack. Most companies start with Overflow because nothing changes for their team, prove it on their own transcripts, then widen the gate."
      />

      {/* Each agent gets a full band, alternating white and mist so the five
          read as five rather than as one long scroll. */}
      {AGENTS.map((agent, i) => (
        <Section
          key={agent.slug}
          id={agent.slug}
          className={cn(i % 2 === 0 ? "bg-white" : "bg-mist")}
          divider={i > 0}
          tight
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal className="flex flex-col items-start">
              <div className="flex items-center gap-3">
                <span className="font-mono text-14 tabular-nums text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 font-mono text-[11px] tracking-[0.07em] uppercase",
                    agent.direction === "Inbound"
                      ? "bg-signal/10 text-signal-deep"
                      : "bg-brand/10 text-brand-deep",
                  )}
                >
                  {agent.direction}
                </span>
              </div>

              <h2 className="text-h2 mt-4">{agent.name}</h2>
              <p className="mt-2 text-20 font-medium text-brand-dark">{agent.tagline}</p>
              <p className="text-lead mt-4">{agent.summary}</p>
              <p className="mt-4 text-16 leading-[1.65] text-slate">{agent.detail}</p>
            </Reveal>

            <Reveal
              delay={0.08}
              className={cn(
                "rounded-2xl border border-line p-6 sm:p-7",
                i % 2 === 0 ? "bg-cream" : "bg-white",
              )}
            >
              <p className="label">What it does</p>
              <ul className="mt-4 flex flex-col gap-3">
                {agent.does.map((d) => (
                  <li key={d} className="flex gap-3">
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                      className="mt-1.5 h-3 w-3 shrink-0 text-leaf"
                    >
                      <path
                        d="M2.2 6.3 4.6 8.7 9.8 3.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-16 leading-[1.55] text-slate">{d}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Section>
      ))}

      {/* The Handoff */}
      <Section className="on-dark bg-forest">
        <Reveal className="max-w-2xl">
          <span className="eyebrow eyebrow-dark">{HANDOFF.eyebrow}</span>
          <h2 className="text-h2 mt-4 text-white">{HANDOFF.title}</h2>
          <p className="text-lead mt-4 text-white/70">{HANDOFF.lead}</p>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {HANDOFF.points.map((p) => (
            <RevealItem key={p.title}>
              <h3 className="text-h4 text-white">{p.title}</h3>
              <p className="mt-2 text-16 leading-[1.6] text-white/65">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* What it won't do */}
      <Section className="bg-white">
        <SectionHeading eyebrow={WONT_DO.eyebrow} title={WONT_DO.title} intro={WONT_DO.lead} />

        {/* Separate bordered cards rather than the gap-px-over-a-tinted-
            background trick used elsewhere on the site. That technique needs
            the item count to divide exactly into the column count, and there
            are five of these - in a three-up or two-up grid grid-cols-1 it leaves a bare
            beige cell that reads as a rendering fault. */}
        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {WONT_DO.items.map((item) => (
            <RevealItem
              key={item.title}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-6 shadow-soft"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4 text-brand"
              >
                <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3.8 12.2 12.2 3.8" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <h3 className="text-h4">{item.title}</h3>
              <p className="text-16 leading-[1.6] text-slate">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand />
    </main>
  );
}
