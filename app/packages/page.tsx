import type { Metadata } from "next";
import { PACKAGES, PILOT, PRICING_NOTES, CALCULATOR, FAQS } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Calculator } from "@/components/Calculator";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Three packages from $1,500 build plus $450/month, a 30-day paid pilot credited against the build, and per-minute rates shown at cost-plus rather than hidden.",
};

// Rows for the comparison table. Kept as data so the table and the cards
// cannot drift apart - both read PACKAGES for the numbers.
const ROWS: { label: string; get: (p: (typeof PACKAGES)[number]) => string }[] = [
  { label: "Best for", get: (p) => p.forWho },
  { label: "One-time build", get: (p) => p.build },
  { label: "Monthly", get: (p) => p.monthly },
  { label: "Minutes included", get: (p) => p.minutes },
  { label: "Overage", get: (p) => p.overage },
];

export default function PackagesPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow="Packages"
        title={
          <>
            Build it once. <span className="text-brand italic">Then somebody owns it.</span>
          </>
        }
        lead="A one-time build fee for the part that makes the agent yours, then a monthly that covers the minutes, the hosting and the person who tunes it against your real transcripts."
      >
        <div className="mt-2 flex flex-wrap gap-3">
          <Button href="/contact" variant="primary" size="lg" arrow>
            Start with the pilot
          </Button>
          <Button href="#calculator" variant="secondary" size="lg">
            {"Work out what you're losing"}
          </Button>
        </div>
      </PageHero>

      {/* Three tiers */}
      <Section className="bg-white">
        <RevealGroup className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <RevealItem key={p.slug}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-6 sm:p-7",
                  p.featured
                    ? "border-ink/25 bg-cream shadow-card"
                    : "border-line bg-white shadow-soft",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-h3">{p.name}</h2>
                  {p.featured && (
                    <span className="rounded-md bg-brand px-2 py-0.5 font-mono text-[11px] tracking-[0.07em] text-white uppercase">
                      Most take this
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-[11px] tracking-[0.07em] text-muted uppercase">
                  {p.forWho}
                </p>

                <p className="mt-5 text-16 leading-[1.6] text-slate">{p.blurb}</p>

                <div className="mt-6 flex items-end gap-2 border-t border-line pt-5">
                  <span className="text-[2.5rem] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                    {p.monthly}
                  </span>
                  <span className="pb-1 text-16 text-muted">/month</span>
                </div>
                <p className="mt-1.5 text-15 text-slate">
                  plus a <strong className="font-semibold text-ink">{p.build}</strong> one-time
                  build
                </p>
                <p className="mt-1 text-14 text-muted">
                  {p.minutes} included · {p.overage} after
                </p>

                <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-5">
                  {p.includes.map((inc) => (
                    <li key={inc} className="flex gap-2.5">
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
                      <span className="text-15 leading-[1.5] text-slate">{inc}</span>
                    </li>
                  ))}
                </ul>

                {/* mt-auto on the wrapper, not the button: the three cards
                    have different numbers of bullets, and without it each CTA
                    floats directly under its own list at a different height
                    down the row. */}
                <div className="mt-auto pt-7">
                  <Button
                    href="/contact"
                    variant={p.featured ? "primary" : "secondary"}
                    size="md"
                    arrow
                    className="w-full"
                  >
                    Talk about {p.name}
                  </Button>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Comparison table */}
      <Section className="bg-mist" divider tight>
        <SectionHeading title="Side by side" maxWidthClassName="max-w-lg" />
        <Reveal className="cmp-table mt-8">
          <table>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Feature</span>
                </th>
                {PACKAGES.map((p) => (
                  <th key={p.slug} scope="col">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {PACKAGES.map((p) => (
                    <td key={p.slug} data-tier={p.name}>
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row">{"What's included"}</th>
                {PACKAGES.map((p) => (
                  <td key={p.slug} data-tier={p.name}>
                    <ul className="flex flex-col gap-1">
                      {p.includes.map((inc) => (
                        <li key={inc}>{inc}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>
      </Section>

      {/* Pilot */}
      <Section className="on-dark bg-forest">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
          <Reveal>
            <span className="eyebrow eyebrow-dark">Lowest-risk way in</span>
            <h2 className="text-h2 mt-4 text-white">{PILOT.name}</h2>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="text-[3rem] leading-none font-medium tracking-[-0.02em] text-white tabular-nums">
                {PILOT.price}
              </span>
              <span className="text-18 text-white/60">{PILOT.lead}</span>
            </p>
            <p className="mt-5 text-16 leading-[1.65] text-white/70">{PILOT.body}</p>
            <Button href="/contact" variant="primary" size="lg" arrow className="mt-7">
              Start a pilot
            </Button>
          </Reveal>

          <Reveal delay={0.08} className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 sm:p-7">
            <p className="label text-white/45">What you get</p>
            <ul className="mt-4 flex flex-col gap-3">
              {PILOT.includes.map((inc) => (
                <li key={inc} className="flex gap-3">
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className="mt-1.5 h-3 w-3 shrink-0 text-signal-bright"
                  >
                    <path
                      d="M2.2 6.3 4.6 8.7 9.8 3.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-16 leading-[1.55] text-white/80">{inc}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* How the money works */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow="No small print"
          title={PRICING_NOTES.title}
          maxWidthClassName="max-w-xl"
        />
        <RevealGroup className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {PRICING_NOTES.notes.map((n) => (
            <RevealItem key={n.title}>
              <h3 className="text-h4">{n.title}</h3>
              <p className="mt-2 text-16 leading-[1.6] text-slate">{n.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Calculator */}
      <Section className="bg-mist" divider id="calculator">
        <SectionHeading
          eyebrow={CALCULATOR.eyebrow}
          title={CALCULATOR.title}
          intro={CALCULATOR.lead}
        />
        <Reveal className="mt-10">
          <Calculator />
        </Reveal>
      </Section>

      <Faq
        items={FAQS.filter((f) =>
          /cost|pay|different|start|own/i.test(f.q),
        )}
        title="Money questions."
        intro="The rest are on the homepage."
      />

      <CtaBand />
    </main>
  );
}
