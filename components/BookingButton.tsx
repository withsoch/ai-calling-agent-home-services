"use client";

import { useState } from "react";
import { BookingModal } from "@/components/BookingModal";
import { Button } from "@/components/ui/Button";

/**
 * Opens the cal.com dialog. A client island so the pages that use it can stay
 * server components.
 */
export function BookingButton({
  label = "Book a 15-minute call",
  variant = "primary",
  size = "lg",
  className,
}: {
  label?: string;
  variant?: "primary" | "secondary" | "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} size={size} arrow className={className} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  );
}
