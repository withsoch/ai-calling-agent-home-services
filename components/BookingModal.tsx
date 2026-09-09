"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/content";

/**
 * Booking dialog.
 *
 * Embeds cal.com in a plain iframe rather than pulling in
 * @calcom/embed-react: cal.com sends neither X-Frame-Options nor a CSP
 * frame-ancestors directive, so a bare iframe is allowed, and skipping the
 * dependency keeps the chrome ours.
 */
export function BookingModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Escape closes; Tab is kept inside the dialog while it is open.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Lock background scroll, compensating for the scrollbar so the page behind
  // does not shift sideways as the dialog opens.
  useEffect(() => {
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const onBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <div
      onMouseDown={onBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm motion-safe:animate-fade-up"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Book a call with First Ring"
        className="relative flex h-[min(40rem,90vh)] w-full max-w-[1120px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
          <p className="text-16 font-semibold text-ink">Book a 15-minute call</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="-mr-1.5 rounded-lg p-1.5 text-muted transition-colors hover:bg-mist hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="relative flex-1">
          {!loaded && (
            <div className="absolute inset-0 grid place-items-center">
              <p className="text-14 text-muted">Loading the calendar…</p>
            </div>
          )}
          <iframe
            src={SITE.bookingUrl}
            title="Book a call with First Ring"
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
