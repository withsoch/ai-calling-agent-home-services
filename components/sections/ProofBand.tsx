import { CASE_RESULTS } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SampleBanner, SampleTag } from "@/components/ui/SampleRibbon";

export function ProofBand() {
  return (
    <Section className="on-dark bg-forest">
      <Reveal className="max-w-2xl">
        <span className="eyebrow eyebrow-dark">The numbers</span>
        <h2 className="text-h2 mt-4 text-white">
          What changes in the first ninety days.
        </h2>
        <p className="text-lead mt-4 text-white/70">
          The first figure is the industry benchmark and it is cited. The rest come from
          engagements, and the ones attached to a named company are marked while this site is
          pre-launch.
        </p>
      </Reveal>

      <SampleBanner what="figures attributed to a named customer" className="mt-8 max-w-2xl" />

      <RevealGroup className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {CASE_RESULTS.map((r, i) => (
          <RevealItem key={r.label} className="flex flex-col gap-1.5 bg-forest p-6">
            <p className="text-[clamp(2.2rem,1.7rem+1.8vw,2.9rem)] leading-none font-medium tracking-[-0.02em] text-white tabular-nums">
              {r.value}
            </p>
            <p className="text-16 font-medium text-white/85">{r.label}</p>
            <p className="text-14 text-white/45">{r.sub}</p>
            {/* Only the last figure names a specific customer. */}
            {i === 3 && <SampleTag className="mt-1 self-start" />}
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
