import type { Metadata } from "next";
import { CASE_RESULTS, CLIENT_LOGOS } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SampleBanner, SampleTag } from "@/components/ui/SampleRibbon";
import { TestimonialGrid } from "@/components/sections/TestimonialCards";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Results",
  description:
    "What home services owners say after a month of First Ring answering their phone — and the numbers underneath.",
};

export default function TestimonialsPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow="Results"
        title={
          <>
            Nobody believes the missed-call number{" "}
            <span className="text-brand italic">until they read the transcripts.</span>
          </>
        }
        lead="Then it is the only number they talk about. Here is what owners say once the agent has been running long enough to have a week of evidence behind it."
      >
        <SampleBanner className="mt-4" />
      </PageHero>

      <Section className="bg-white">
        <TestimonialGrid />
      </Section>

      <Section className="on-dark bg-forest">
        <Reveal className="max-w-2xl">
          <span className="eyebrow eyebrow-dark">The numbers</span>
          <h2 className="text-h2 mt-4 text-white">Across the engagements.</h2>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {CASE_RESULTS.map((r, i) => (
            <RevealItem key={r.label} className="flex flex-col gap-1.5 bg-forest p-6">
              <p className="text-[clamp(2.2rem,1.7rem+1.8vw,2.9rem)] leading-none font-medium tracking-[-0.02em] text-white tabular-nums">
                {r.value}
              </p>
              <p className="text-16 font-medium text-white/85">{r.label}</p>
              <p className="text-14 text-white/45">{r.sub}</p>
              {i === 3 && <SampleTag className="mt-1 self-start" />}
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section className="bg-mist">
        <SectionHeading
          eyebrow="Who we work with"
          title="Trades where the phone is the business."
          intro="If a missed call means an emergency job went to whoever picked up second, you are in the right place."
        />
        <SampleBanner what="company names" className="mt-8 max-w-3xl" />
        <RevealGroup className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {CLIENT_LOGOS.map((name) => (
            <RevealItem
              key={name}
              className="flex h-20 items-center justify-center rounded-xl border border-line bg-white px-4 text-center"
            >
              <span className="text-16 font-semibold tracking-[-0.01em] text-ink">{name}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand />
    </main>
  );
}
