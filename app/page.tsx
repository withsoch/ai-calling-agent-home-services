import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { AgentsGrid } from "@/components/sections/AgentsGrid";
import { ProofBand } from "@/components/sections/ProofBand";
import { IntegrationWall } from "@/components/sections/IntegrationWall";
import { CalculatorTeaser } from "@/components/sections/CalculatorTeaser";
import { TestimonialsTeaser } from "@/components/sections/TestimonialsTeaser";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";

// Homepage zone map.
//
// Sections are grouped into chapters that share one flat surface, so the page
// has five crisp boundaries rather than a tint flip on every band - nine
// alternations down a long page reads as choppy without creating any
// hierarchy. Rhythm inside a zone comes from layout (alignment, column ratio,
// density), not from colour. Sections continuing a zone carry `divider`, a
// hairline at the top edge, so they still read as separate sections.
//
//   A  mist     Hero, Problem                      the leak
//   B  white    HowItWorks, AgentsGrid             the answer
//   C  forest   ProofBand                          proof
//   D  white    IntegrationWall                    where it lands
//   E  mist     CalculatorTeaser                   their own number
//   F  white    TestimonialsTeaser                 other people's numbers
//   G  mist     Faq                                objections
//   H  charcoal CtaBand                            close
//
// One constraint when editing: a section's surface must stay distinct from
// the cards sitting on it. HowItWorks uses cream cards on white, Problem
// white cards on mist, TestimonialsTeaser white cards on white separated by
// hairline plus shadow-soft rather than by tint.
export default function Home() {
  return (
    <main className="flex-1">
      {/* A - mist */}
      <Hero />
      <Problem />

      {/* B - white */}
      <HowItWorks />
      <AgentsGrid />

      {/* C - forest */}
      <ProofBand />

      {/* D - white */}
      <IntegrationWall />

      {/* E - mist */}
      <CalculatorTeaser />

      {/* F - white */}
      <TestimonialsTeaser />

      {/* G - mist */}
      <Faq />

      {/* H - charcoal */}
      <CtaBand />
    </main>
  );
}
