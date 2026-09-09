// components/ui/SampleRibbon.tsx
//
// Marks invented proof. See PLACEHOLDER_PROOF in lib/content.ts.
//
// First Ring has no customers yet, so every testimonial, logo and result
// number on the site is made up to show the layout working. Rather than trust
// ourselves to remember to strip them before launch, they are all gated on one
// boolean and each one wears a visible amber marker while it is true.
//
// Deleting these components is not the way to ship. Flipping the flag is.

import { PLACEHOLDER_PROOF } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Small inline pill. Sits on individual cards and logos. */
export function SampleTag({ className }: { className?: string }) {
  if (!PLACEHOLDER_PROOF) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-amber/30 bg-amber-soft px-1.5 py-0.5",
        "font-mono text-[11px] font-medium tracking-[0.07em] text-amber uppercase",
        className,
      )}
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
        <path
          d="M6 1.5 11 10H1L6 1.5Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path d="M6 5v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="6" cy="8.4" r="0.5" fill="currentColor" />
      </svg>
      Sample
    </span>
  );
}

/** Full-width banner. Sits at the top of any section built from fake proof. */
export function SampleBanner({
  what = "testimonials, logos and result figures",
  className,
}: {
  what?: string;
  className?: string;
}) {
  if (!PLACEHOLDER_PROOF) return null;
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-amber/25 bg-amber-soft px-4 py-3",
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className="mt-0.5 h-4 w-4 shrink-0 text-amber"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 2 15 13.5H1L8 2Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="8" cy="11.4" r="0.7" fill="currentColor" />
      </svg>
      <p className="text-14 text-ink-soft">
        <strong className="font-semibold text-ink">Placeholder content.</strong> The {what} in this
        section are invented to show the design working. Replace them with real, attributable
        quotes and set{" "}
        <code className="rounded border border-amber/30 bg-white/60 px-1 py-0.5 font-mono text-[12px]">
          PLACEHOLDER_PROOF = false
        </code>{" "}
        in <code className="font-mono text-[12px]">lib/content.ts</code> before this site goes
        live.
      </p>
    </div>
  );
}
