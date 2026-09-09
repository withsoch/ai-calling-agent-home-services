import Link from "next/link";
import { AGENTS } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The five agents.
 *
 * Two columns rather than a three-up grid grid-cols-1 with an orphan: five items in a
 * three-column layout leaves a two-item widow row that reads as a mistake.
 * The first card spans both columns instead, which also happens to be
 * correct hierarchy - Front Desk is the flagship and Overflow is the one
 * most people actually start on.
 */
export function AgentsGrid({
  showIntro = true,
  className,
}: {
  showIntro?: boolean;
  className?: string;
}) {
  return (
    <Section className={cn("bg-white", className)} divider={showIntro}>
      {showIntro && (
        <SectionHeading
          eyebrow="The agents"
          title="Five jobs on the phone. Pick the ones that hurt."
          intro="Sold individually or as a stack. Most companies start with Overflow, prove it on their own transcripts, then widen."
        />
      )}

      <RevealGroup className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {AGENTS.map((agent, i) => (
          <RevealItem
            key={agent.slug}
            className={cn(i === 0 && "md:col-span-2")}
          >
            <Link
              href={`/services#${agent.slug}`}
              className={cn(
                "group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card",
                i === 0 && "bg-cream md:flex-row md:items-start md:gap-10 md:p-8",
              )}
            >
              <div className={cn(i === 0 && "md:flex-1")}>
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[11px] tracking-[0.07em] uppercase",
                      agent.direction === "Inbound"
                        ? "bg-signal/10 text-signal-deep"
                        : "bg-brand/10 text-brand-deep",
                    )}
                  >
                    {agent.direction === "Inbound" ? <IconIn /> : <IconOut />}
                    {agent.direction}
                  </span>
                </div>

                <h3 className="mt-3.5 text-h3">{agent.name}</h3>
                <p className="mt-1.5 text-18 font-medium text-brand-dark">{agent.tagline}</p>
                <p className="mt-3 text-16 leading-[1.6] text-slate">{agent.summary}</p>
              </div>

              <div
                className={cn(
                  "mt-5 flex items-center justify-between gap-4 border-t border-line pt-4",
                  i === 0 && "md:mt-0 md:w-56 md:shrink-0 md:flex-col md:items-start md:border-t-0 md:border-l md:pt-0 md:pl-8",
                )}
              >
                <div>
                  <p className="font-mono text-[11px] tracking-[0.07em] text-muted uppercase">
                    {agent.proofLabel}
                  </p>
                  <p className="mt-0.5 text-24 font-medium text-ink">{agent.proofValue}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-15 font-semibold text-ink">
                  How it works
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function IconIn() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-3 w-3">
      <path
        d="M9.5 2.5 3.2 8.8M3.2 8.8H7.4M3.2 8.8V4.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconOut() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-3 w-3">
      <path
        d="M2.5 9.5 8.8 3.2M8.8 3.2H4.6M8.8 3.2V7.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
