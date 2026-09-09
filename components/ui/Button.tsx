// components/ui/Button.tsx
//
// Flat, no gradients, no glow. Renders a <Link> when href is set, a plain
// <a target="_blank"> when href + external, else a <button>.

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "dark" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-white text-ink ring-1 ring-ink/20 hover:ring-ink/45",
  dark: "bg-ink text-white hover:bg-ink-soft",
  light: "bg-transparent text-white ring-1 ring-white/45 hover:bg-white/10",
  ghost: "bg-transparent text-ink hover:bg-mist",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-14",
  md: "px-5 py-2.5 text-16",
  lg: "px-6 py-3 text-18",
};

type ButtonProps = {
  href?: string;
  external?: boolean;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
};

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-[1.05em] w-[1.05em] transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Button({
  href,
  external = false,
  variant = "primary",
  size = "md",
  arrow = false,
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200",
    disabled && "pointer-events-none opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
