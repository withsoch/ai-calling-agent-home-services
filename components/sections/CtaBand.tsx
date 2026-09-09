import { CTA_BAND } from "@/lib/content";
import { BareSection } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function CtaBand() {
  return (
    <BareSection className="on-dark relative overflow-hidden bg-charcoal">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid-light" aria-hidden="true" />
      <div className="container-x relative">
        <Reveal className="flex max-w-3xl flex-col items-start gap-5">
          <h2 className="text-h2 text-white">{CTA_BAND.title}</h2>
          <p className="text-lead text-white/70">{CTA_BAND.lead}</p>
          <div className="mt-1 flex flex-wrap gap-3">
            <Button href={CTA_BAND.primary.href} variant="primary" size="lg" arrow>
              {CTA_BAND.primary.label}
            </Button>
            <Button href={CTA_BAND.secondary.href} variant="light" size="lg">
              {CTA_BAND.secondary.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </BareSection>
  );
}
