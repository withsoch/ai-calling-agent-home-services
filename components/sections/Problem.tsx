import { PROBLEM } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

export function Problem() {
  return (
    <Section className="bg-mist" divider>
      <SectionHeading
        eyebrow={PROBLEM.eyebrow}
        title={PROBLEM.title}
        intro={PROBLEM.intro}
        maxWidthClassName="max-w-2xl"
      />

      {/* The three numbers. Only the first is a citable benchmark and it says
          so - the other two are directional and labelled as such rather than
          dressed up with a fake source. */}
      <RevealGroup className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {PROBLEM.stats.map((stat) => (
          <RevealItem key={stat.label} className="flex flex-col gap-2 bg-white p-6">
            <p className="text-[clamp(2.4rem,1.8rem+2.2vw,3.2rem)] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
              <CountUp to={stat.value} suffix={stat.suffix} group={false} />
            </p>
            <p className="text-18 font-medium text-ink-soft">{stat.label}</p>
            <p className="text-14 text-muted">{stat.note}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
        {PROBLEM.beats.map((beat, i) => (
          <Reveal key={beat.title} delay={i * 0.06} className="flex gap-4">
            <span className="mt-1 font-mono text-13 tabular-nums text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-h4">{beat.title}</h3>
              <p className="mt-2 text-16 leading-[1.6] text-slate">{beat.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
