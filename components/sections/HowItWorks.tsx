import { HOW_IT_WORKS } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function HowItWorks() {
  return (
    <Section className="bg-white">
      <SectionHeading
        eyebrow={HOW_IT_WORKS.eyebrow}
        title={HOW_IT_WORKS.title}
        intro={HOW_IT_WORKS.intro}
      />

      <RevealGroup className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {HOW_IT_WORKS.steps.map((step) => (
          <RevealItem
            key={step.n}
            className="flex flex-col rounded-2xl border border-line bg-cream p-6 shadow-soft"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-14 font-medium tabular-nums text-brand">
                {step.n}
              </span>
              <span className="font-mono text-[11px] tracking-[0.07em] text-muted uppercase">
                {step.duration}
              </span>
            </div>
            <h3 className="mt-4 text-h4">{step.title}</h3>
            <p className="mt-2.5 text-16 leading-[1.6] text-slate">{step.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
