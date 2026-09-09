"use client";

// components/ContactForm.tsx
//
// NOT WIRED TO A BACKEND YET, and deliberately so.
//
// Submitting composes a mailto: to SITE.email with everything the visitor
// typed already in the body. That is genuinely functional with no server, no
// third-party form service and no API key - and, more to the point, it cannot
// silently swallow an enquiry. A form that POSTs nowhere and shows a green
// tick is worse than no form at all.
//
// TO WIRE IT PROPERLY: replace the body of `submit` with a fetch to
// /app/api/contact/route.ts (Resend, Formspree, or an n8n webhook - the last
// being the obvious choice here). The field names below are already the
// payload shape.

import { useState } from "react";
import { CONTACT, SITE } from "@/lib/content";
import { Button } from "@/components/ui/Button";

const FIELD =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-16 text-ink " +
  "transition-colors placeholder:text-muted/70 hover:border-ink/25 focus:border-ink/40 focus:outline-none";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = [
      `Name: ${data.get("name")}`,
      `Company: ${data.get("company")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Trade: ${data.get("trade")}`,
      `Size: ${data.get("size")}`,
      `Runs on: ${data.get("stack")}`,
      "",
      "What the phone is doing:",
      String(data.get("message") ?? ""),
    ];
    const href =
      `mailto:${SITE.email}` +
      `?subject=${encodeURIComponent(`First Ring enquiry — ${data.get("company")}`)}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = href;
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Company" name="company" required autoComplete="organization" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Select label="Trade" name="trade" options={CONTACT.formFields.tradesOptions} />
        <Select label="Size" name="size" options={CONTACT.formFields.sizeOptions} />
        <Select label="Runs on" name="stack" options={CONTACT.formFields.stackOptions} />
      </div>

      <div>
        <label htmlFor="message" className="text-15 font-medium text-ink">
          What is your phone doing?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${FIELD} mt-1.5 resize-y`}
          placeholder="Roughly how many calls a week, when they go unanswered, and what happens to them now."
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" size="lg" arrow>
          Send it
        </Button>
        <p className="text-14 text-muted">
          Opens your email app with this filled in — nothing is sent until you press send there.
        </p>
      </div>

      {sent && (
        <p role="status" className="rounded-lg border border-leaf/30 bg-leaf/8 px-4 py-3 text-15 text-ink">
          Your email app should have opened with the details filled in. If it did not, write to{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold underline underline-offset-2">
            {SITE.email}
          </a>{" "}
          directly.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-15 font-medium text-ink">
        {label}
        {required && <span className="text-brand"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={`${FIELD} mt-1.5`}
      />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="text-15 font-medium text-ink">
        {label}
      </label>
      <select id={name} name={name} defaultValue="" className={`${FIELD} mt-1.5`}>
        <option value="" disabled>
          Choose…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
