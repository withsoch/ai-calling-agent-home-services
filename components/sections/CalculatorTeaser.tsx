import { CALCULATOR } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Calculator } from "@/components/Calculator";

export function CalculatorTeaser() {
  return (
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
  );
}
