import { HERO } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { LiveLine } from "@/components/live-line/LiveLine";
import { BareSection } from "@/components/ui/Section";

// Two-column hero: argument left, working product right.
//
// This is the one place the layout deliberately departs from the Soch build,
// which opens with a full-width diagram band above the headline. Here the
// demo has to be the first thing the eye lands on, not a texture above the
// fold - so it gets its own column at hero height rather than a strip.
//
// The order flips on mobile: headline first, then the panel. A visitor on a
// phone needs to know what the thing is before they are asked to press Call.
export function Hero() {
  return (
    <BareSection bare className="relative overflow-hidden bg-mist pt-10 pb-14 lg:pt-16 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid" aria-hidden="true" />

      <div className="container-x relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <span className="eyebrow">{HERO.eyebrow}</span>

          <h1 className="text-h1">
            {HERO.headline}{" "}
            <span className="text-brand italic">{HERO.headlineEmphasis}</span>
          </h1>

          <p className="text-lead">{HERO.lead}</p>

          <div className="flex flex-wrap items-center gap-3">
            <Button href={HERO.primaryCta.href} variant="primary" size="lg" arrow>
              {HERO.primaryCta.label}
            </Button>
            <Button href={HERO.secondaryCta.href} variant="secondary" size="lg">
              {HERO.secondaryCta.label}
            </Button>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {HERO.trustLine.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-14 text-muted">
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-3 w-3 text-leaf">
                  <path
                    d="M2.2 6.3 4.6 8.7 9.8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full min-w-0">
          <LiveLine />
        </div>
      </div>
    </BareSection>
  );
}
