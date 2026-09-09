import type { Metadata } from "next";
import { ABOUT, HOW_IT_WORKS } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description:
    "First Ring is built by operators, not by a voice AI startup. A decade of operations leadership across Careem, Bolt, Motive and Wise, pointed at the phone.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow={ABOUT.eyebrow}
        title={
          <>
            Built by operators,{" "}
            <span className="text-brand italic">not by a voice AI startup.</span>
          </>
        }
        lead={ABOUT.lead}
      />

      <Section className="bg-white">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <Reveal className="flex max-w-2xl flex-col gap-5">
            {ABOUT.body.map((para) => (
              <p key={para.slice(0, 32)} className="text-18 leading-[1.68] text-slate">
                {para}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.08} className="lg:pt-2">
            <div className="rounded-2xl border border-line bg-cream p-6 sm:p-7">
              <p className="label">Where the experience comes from</p>
              <ul className="mt-4 flex flex-col divide-y divide-line">
                {[
                  { org: "Careem", note: "Ride-hailing operations at regional scale" },
                  { org: "Bolt", note: "Marketplace operations across multiple markets" },
                  { org: "Motive", note: "Fleet operations and support systems" },
                  { org: "Wise", note: "Operational process and compliance at volume" },
                ].map((row) => (
                  <li key={row.org} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                    <span className="text-16 font-semibold text-ink">{row.org}</span>
                    <span className="text-15 text-slate">{row.note}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-15 leading-[1.55] text-muted">
                Ten years of being measured on answer rates, cost per contact and dispatch
                efficiency. The phone was always the leakiest part of every operation, and it is
                the one nobody was allowed enough headcount to fix.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-mist" divider>
        <SectionHeading
          eyebrow="How we work"
          title="Three principles, and they are all about after the launch."
        />
        <RevealGroup className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {ABOUT.principles.map((p, i) => (
            <RevealItem key={p.title}>
              <span className="font-mono text-14 tabular-nums text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h4 mt-3">{p.title}</h3>
              <p className="mt-2 text-16 leading-[1.6] text-slate">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section className="bg-white">
        <SectionHeading
          eyebrow={HOW_IT_WORKS.eyebrow}
          title={HOW_IT_WORKS.title}
          intro={HOW_IT_WORKS.intro}
        />
        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step) => (
            <RevealItem
              key={step.n}
              className="flex flex-col rounded-2xl border border-line bg-cream p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-14 tabular-nums text-brand">{step.n}</span>
                <span className="font-mono text-[11px] tracking-[0.07em] text-muted uppercase">
                  {step.duration}
                </span>
              </div>
              <h3 className="text-h4 mt-4">{step.title}</h3>
              <p className="mt-2.5 text-16 leading-[1.6] text-slate">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand />
    </main>
  );
}
