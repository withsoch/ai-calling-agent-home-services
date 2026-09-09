"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { NAV_LINKS } from "@/lib/content";
import { Wordmark } from "@/components/ui/Mark";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Scroll position as an external store.
 *
 * useSyncExternalStore rather than useState + an effect: the scroll offset is
 * browser state we are subscribing to, not React state we own, and reading it
 * this way avoids the initial-value setState-inside-an-effect that cascades a
 * second render on every page load. The server snapshot is `false`, which is
 * correct - every page starts at the top.
 */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const isScrolled = () => window.scrollY > 12;
const isScrolledOnServer = () => false;

export function Nav() {
  const pathname = usePathname();

  // The drawer's open state is stored as "the route it was opened on" rather
  // than a bare boolean. Navigating changes `pathname`, so the menu closes by
  // derivation - no effect watching the route, and no window where a tapped
  // link navigates behind a menu that is still covering the new page. Back
  // and forward buttons get the same behaviour for free.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (next: boolean) => setOpenPath(next ? pathname : null);

  // The bar is transparent over the hero's mist and gains a hairline plus a
  // blur once you leave it, so it never floats on nothing.
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, isScrolledOnServer);

  useEffect(() => {
    if (!open) return;
    // setOpenPath rather than the setOpen helper: the helper closes over
    // `pathname` and is rebuilt every render, so depending on it would tear
    // down and re-add this listener on each one.
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenPath(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-white/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link
          href="/"
          className="rounded-md text-18 text-ink transition-opacity hover:opacity-80"
          aria-label="First Ring — home"
        >
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-16 font-medium transition-colors",
                  active ? "text-ink" : "text-slate hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" variant="primary" size="md" arrow>
            Book a call
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 rounded-lg p-2 text-ink transition-colors hover:bg-mist lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M5 5l12 12M17 5L5 17"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6.5h16M3 11h16M3 15.5h16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-white lg:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-1 py-3 text-18 font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/contact" variant="primary" size="lg" arrow className="mt-3 w-full">
              Book a call
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
