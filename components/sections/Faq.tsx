import { FAQS } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Native <details>/<summary> rather than a JS accordion: it is keyboard
 * accessible and findable by in-page search for free, it needs no client
 * bundle, and the content is in the DOM for crawlers whether or not it is
 * open. The only thing lost is an animated height, which is not worth a
 * client component.
 */
export function Faq({
  items = FAQS,
  title = "The questions everybody asks.",
  intro = "Including the two nobody in this category likes answering.",
}: {
  items?: { q: string; a: string }[];
  title?: string;
  intro?: string;
}) {
  return (
    <Section className="bg-mist" divider>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16">
        <SectionHeading eyebrow="FAQ" title={title} intro={intro} maxWidthClassName="max-w-sm" />

        <Reveal className="flex flex-col">
          {items.map((f) => (
            <details
              key={f.q}
              className="group border-b border-line first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-18 font-medium text-ink transition-colors hover:text-brand-dark">
                {f.q}
                <span
                  aria-hidden="true"
                  className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-line text-muted transition-transform duration-200 group-open:rotate-45"
                >
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                    <path
                      d="M6 2.5v7M2.5 6h7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="pr-11 pb-5 text-16 leading-[1.65] text-slate">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
