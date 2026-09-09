import { TESTIMONIALS, type Testimonial } from "@/lib/content";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SampleTag } from "@/components/ui/SampleRibbon";
import { cn } from "@/lib/utils";

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft">
      <SampleTag className="mb-4 self-start" />

      <blockquote className="text-18 leading-[1.55] text-ink">
        <span aria-hidden="true" className="text-brand">
          “
        </span>
        {t.quote}
        <span aria-hidden="true" className="text-brand">
          ”
        </span>
      </blockquote>

      {t.metric && (
        <div className="mt-5 rounded-xl bg-mist px-4 py-3">
          <p className="text-24 font-medium text-ink tabular-nums">{t.metric.value}</p>
          <p className="text-14 text-slate">{t.metric.label}</p>
        </div>
      )}

      <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-5">
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-peach text-14 font-semibold text-brand-deep"
        >
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-15 font-semibold text-ink">{t.name}</p>
          <p className="truncate text-14 text-muted">
            {t.role}, {t.company}
          </p>
          <p className="truncate font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
            {t.trade}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialGrid({
  limit,
  className,
}: {
  limit?: number;
  className?: string;
}) {
  const items = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;
  return (
    <RevealGroup className={cn("grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((t) => (
        <RevealItem key={t.name}>
          <TestimonialCard t={t} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}
