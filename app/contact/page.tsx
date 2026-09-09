import type { Metadata } from "next";
import { CONTACT, SITE, FAQS } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { BookingButton } from "@/components/BookingButton";
import { SampleTag } from "@/components/ui/SampleRibbon";
import { Faq } from "@/components/sections/Faq";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book fifteen minutes, or tell us what your phone is doing and we will tell you honestly whether we can help.",
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <PageHero eyebrow={CONTACT.eyebrow} title={CONTACT.title} lead={CONTACT.lead} />

      <Section className="bg-white">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <Reveal>
            <h2 className="text-h3">Tell us what the phone is doing</h2>
            <p className="mt-2 text-16 text-slate">
              Rough numbers are fine. We will come back with a straight answer on whether this is
              worth doing for you, including if it is not.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col gap-5">
            <div className="rounded-2xl border border-line bg-cream p-6">
              <p className="label">Faster</p>
              <h3 className="text-h4 mt-2">Book fifteen minutes</h3>
              <p className="mt-2 text-16 leading-[1.6] text-slate">
                Bring your call volume and what you run on. We will tell you which agent to start
                with and roughly what it costs, on the call.
              </p>
              <BookingButton className="mt-5 w-full" />
            </div>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <p className="label">Hear it live</p>
                <SampleTag />
              </div>
              <h3 className="text-h4 mt-2">Call the demo line</h3>
              <p className="mt-2 text-16 leading-[1.6] text-slate">
                A real agent on a real number, answering as a fictional HVAC company. Try to catch
                it out — that is what it is there for.
              </p>
              <p className="mt-4 font-mono text-22 tracking-[-0.01em] text-ink tabular-nums">
                {SITE.demoPhone}
              </p>
              <p className="mt-2 text-14 text-muted">
                Placeholder number. Live once the demo line is provisioned — until then the
                simulated call on the homepage is the closest thing.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
              <p className="label">Or just email</p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2 inline-block text-18 font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
              >
                {SITE.email}
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      <Faq
        items={FAQS.filter((f) => /start|number|robot|own/i.test(f.q))}
        title="Before you write."
        intro="The four that come up on nearly every first call."
      />
    </main>
  );
}
