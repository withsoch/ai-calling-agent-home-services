// components/ui/Section.tsx
//
// Canonical section shell plus the heading recipe. Surfaces are flat and set
// by the caller (bg-white / bg-mist / bg-forest); the page files group
// sections into a few zones that share a surface, so there are a handful of
// crisp boundaries down a page rather than a flip on every band.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  className?: string;
  tight?: boolean;
  loose?: boolean;
  /** Hairline at the top edge, for two sections sharing one surface. */
  divider?: boolean;
  children: ReactNode;
};

function padding(tight: boolean, loose: boolean) {
  return loose ? "section-y-loose" : tight ? "section-y-tight" : "section-y";
}

export function Section({
  id,
  className,
  tight = false,
  loose = false,
  divider = false,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(padding(tight, loose), divider && "border-t border-line", className)}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

/** Same rhythm, no container - for sections that manage their own width. */
export function BareSection({
  id,
  className,
  tight = false,
  loose = false,
  bare = false,
  divider = false,
  children,
}: SectionProps & { bare?: boolean }) {
  return (
    <section
      id={id}
      className={cn(!bare && padding(tight, loose), divider && "border-t border-line", className)}
    >
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
  maxWidthClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  dark = false,
  className,
  maxWidthClassName = "max-w-2xl",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        maxWidthClassName,
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && <span className={cn("eyebrow", dark && "eyebrow-dark")}>{eyebrow}</span>}
      <h2 className={cn("text-h2", dark && "text-white")}>{title}</h2>
      {intro && <p className={cn("text-lead", dark && "text-white/70")}>{intro}</p>}
    </div>
  );
}
