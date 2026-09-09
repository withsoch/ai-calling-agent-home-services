import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, taught about this project's type scale.
 *
 * WHY THIS IS NOT PLAIN `twMerge`:
 *
 * Our font sizes are numeric tokens - `text-16`, `text-18` - and our display
 * sizes are component classes - `text-h2`, `text-lead`. tailwind-merge knows
 * neither, so it falls back to reading `text-<anything>` as a TEXT COLOUR.
 * That makes `text-18` and `text-white` look like two colours in conflict,
 * and the later one wins: `cn("text-white", "text-18")` silently returns just
 * `text-18`.
 *
 * The symptom was every primary button on the site rendering slate text on
 * orange instead of white, with `text-white` simply absent from the DOM. It
 * is the kind of bug that is invisible in the source and obvious on screen.
 *
 * Registering the scale under `font-size` puts the two classes in different
 * groups, so they stop competing. Any new size token added to globals.css
 * must be added here too.
 */
const FONT_SIZES = [
  "12",
  "13",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24",
  "26",
  "32",
  "h1",
  "h1-page",
  "h2",
  "h3",
  "h4",
  "lead",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1234567 -> "1,234,567" */
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

/** 61234 -> "$61,234" */
export function formatCurrency(n: number): string {
  return `$${formatNumber(n)}`;
}

/** Seconds -> "0:47" */
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
