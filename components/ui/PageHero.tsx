import type { ReactNode } from "react";
import { BareSection } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/** Shared inner-page header. One place to change every page's top band. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <BareSection
      className={cn("relative overflow-hidden bg-mist pt-12 pb-14 lg:pt-16 lg:pb-18", className)}
      bare
    >
      <div className="pointer-events-none absolute inset-0 bg-dot-grid" aria-hidden="true" />
      <div className="container-x relative flex max-w-3xl flex-col items-start gap-5">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="text-h1-page">{title}</h1>
        {lead && <p className="text-lead">{lead}</p>}
        {children}
      </div>
    </BareSection>
  );
}
