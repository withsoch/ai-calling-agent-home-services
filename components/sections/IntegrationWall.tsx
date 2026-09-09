import Link from "next/link";
import { FEATURED_INTEGRATIONS, INTEGRATION_GROUPS, type Integration } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Integration tile.
 *
 * The payload text is always in the DOM - it crossfades in on hover and on
 * keyboard focus, and it is announced to screen readers regardless. Hover is
 * an enhancement on top of content that exists anyway, never the only route
 * to it: the full payload for every platform is also written out as plain
 * body text on /integrations, so a touch user misses nothing.
 */
function Tile({ item, className }: { item: Integration; className?: string }) {
  return (
    <div
      tabIndex={0}
      className={cn(
        "group relative flex h-[5.5rem] items-center justify-center overflow-hidden rounded-xl",
        "border border-line bg-white px-3 text-center transition-colors duration-200",
        "hover:border-ink/20 focus-visible:border-ink/20",
        className,
      )}
    >
      <span
        className={cn(
          "text-16 font-semibold tracking-[-0.01em] text-ink transition-all duration-200",
          "group-hover:-translate-y-1 group-hover:opacity-0",
          "group-focus-visible:-translate-y-1 group-focus-visible:opacity-0",
        )}
      >
        {item.name}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex items-center justify-center px-3 text-[12px] leading-[1.4] text-slate",
          "translate-y-1 opacity-0 transition-all duration-200",
          "group-hover:translate-y-0 group-hover:opacity-100",
          "group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
        )}
      >
        {item.payload}
      </span>
      {/* Read by assistive tech; the visual copy above is aria-hidden so the
          payload is not announced twice. */}
      <span className="sr-only">: {item.payload}</span>
    </div>
  );
}

/** Homepage version: the four named platforms, then a compact wall. */
export function IntegrationWall() {
  const rest = INTEGRATION_GROUPS.flatMap((g) => g.items).slice(0, 18);

  return (
    <Section className="bg-white" divider>
      <SectionHeading
        eyebrow="Integrations"
        title="It books into the software you already run."
        intro="No new dashboard for your team to ignore. The job appears where your dispatcher is already looking."
      />

      <RevealGroup className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {FEATURED_INTEGRATIONS.map((item) => (
          <RevealItem
            key={item.name}
            className="flex flex-col rounded-2xl border border-line bg-cream p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-h4">{item.name}</h3>
              <span className="font-mono text-[11px] tracking-[0.07em] text-muted uppercase">
                {item.category}
              </span>
            </div>
            <p className="mt-3 text-16 leading-[1.6] text-slate">{item.payload}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10">
        <p className="label">And the rest of the stack</p>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {rest.map((item) => (
            <Tile key={item.name} item={item} />
          ))}
        </div>
        <Link
          href="/integrations"
          className="group mt-6 inline-flex items-center gap-1.5 text-16 font-semibold text-ink"
        >
          Every integration, and exactly what it writes
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
        </Link>
      </Reveal>
    </Section>
  );
}

/** Full page version: every group, payloads written out as body text. */
export function IntegrationGroups() {
  return (
    <>
      {INTEGRATION_GROUPS.map((group) => (
        <div key={group.group} className="border-t border-line py-8 first:border-t-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
            <h3 className="text-h4">{group.group}</h3>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.name}>
                  <p className="text-16 font-semibold text-ink">{item.name}</p>
                  <p className="mt-0.5 text-15 leading-[1.55] text-slate">{item.payload}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
}
