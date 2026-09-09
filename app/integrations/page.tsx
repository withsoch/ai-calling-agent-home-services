import type { Metadata } from "next";
import { FEATURED_INTEGRATIONS } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { IntegrationGroups } from "@/components/sections/IntegrationWall";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "First Ring writes into ServiceTitan, Housecall Pro, GoHighLevel and Zoho — plus Jobber, HubSpot, Twilio, Angi, Google LSA, Slack, Stripe, n8n and the rest of your stack.",
};

export default function IntegrationsPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow="Integrations"
        title={
          <>
            It books into the software{" "}
            <span className="text-brand italic">you already run.</span>
          </>
        }
        lead="No new dashboard for your team to ignore, and no CSV to reconcile on a Friday. The job appears where your dispatcher is already looking, with the call attached to it."
      />

      {/* The four named platforms, in depth. */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Built and tested"
          title="The four we get asked about most."
          intro="These are not a logo on a page. Each one has a specific payload we write, and we will show you the field mapping on the call."
        />

        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {FEATURED_INTEGRATIONS.map((item) => (
            <RevealItem
              key={item.name}
              className="flex flex-col rounded-2xl border border-line bg-cream p-6 sm:p-7"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-h3">{item.name}</h2>
                <span className="font-mono text-[11px] tracking-[0.07em] text-muted uppercase">
                  {item.category}
                </span>
              </div>
              <p className="mt-4 text-16 leading-[1.65] text-slate">{item.payload}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Everything else. */}
      <Section className="bg-mist" divider>
        <SectionHeading
          eyebrow="The rest of the stack"
          title="Everything else, and exactly what it writes."
          intro="Grouped by what it does rather than alphabetically, because you are looking for the thing you already own."
        />
        <Reveal className="mt-8">
          <IntegrationGroups />
        </Reveal>
      </Section>

      {/* The honest bit about custom work. */}
      <Section className="bg-white" tight>
        <Reveal className="max-w-2xl">
          <h2 className="text-h3">Not on the list?</h2>
          <p className="mt-3 text-16 leading-[1.65] text-slate">
            If it has an API or a webhook, it is a build rather than a blocker — we glue it with
            n8n and it is usually a day or two of work, quoted before we start. If it has neither,
            we will tell you that on the first call instead of discovering it in week three. The
            genuinely hard ones are old on-premise systems with no outside connection at all, and
            those we do not take on.
          </p>
        </Reveal>
      </Section>

      <CtaBand />
    </main>
  );
}
