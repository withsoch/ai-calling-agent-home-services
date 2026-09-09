import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SampleBanner } from "@/components/ui/SampleRibbon";
import { TestimonialGrid } from "@/components/sections/TestimonialCards";

export function TestimonialsTeaser() {
  return (
    <Section className="bg-white" divider>
      <SectionHeading
        eyebrow="Results"
        title="What owners say once it has been running a month."
        intro="The pattern is always the same: they do not believe the missed-call number until they read the first week of transcripts."
      />

      <SampleBanner className="mt-8 max-w-3xl" />

      <TestimonialGrid limit={3} className="mt-10" />

      <Reveal className="mt-8">
        <Link
          href="/testimonials"
          className="group inline-flex items-center gap-1.5 text-16 font-semibold text-ink"
        >
          Read all of them
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
