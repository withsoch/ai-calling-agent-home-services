"use client";

// components/Calculator.tsx
//
// The missed-call calculator. Second interactive piece on the site after the
// hero, and the better lead magnet of the two: the hero makes them feel
// something, this makes them work out a number about their own business.
//
// It opens pre-loaded with the 27% industry benchmark, so the first figure a
// visitor sees is already a plausible estimate of their own leak before they
// have touched a control. That framing is the whole point - a calculator that
// starts at zero gets ignored.

import { useMemo, useState } from "react";
import { CALCULATOR } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

type Field = {
  key: "callsPerWeek" | "missedPct" | "avgTicket" | "closeRate";
  label: string;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  hint?: string;
};

const FIELDS: Field[] = [
  {
    key: "callsPerWeek",
    label: "Inbound calls a week",
    min: 20,
    max: 800,
    step: 10,
    format: (n) => formatNumber(n),
  },
  {
    key: "missedPct",
    label: "Percentage you miss",
    min: 0,
    max: 60,
    step: 1,
    format: (n) => `${n}%`,
    hint: "27% is the home services benchmark",
  },
  {
    key: "avgTicket",
    label: "Average ticket",
    min: 100,
    max: 3000,
    step: 20,
    format: (n) => formatCurrency(n),
  },
  {
    key: "closeRate",
    label: "Calls that become a job",
    min: 10,
    max: 90,
    step: 1,
    format: (n) => `${n}%`,
  },
];

export function Calculator({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [values, setValues] = useState(CALCULATOR.defaults);

  const result = useMemo(() => {
    const missedPerWeek = (values.callsPerWeek * values.missedPct) / 100;
    const missedPerYear = missedPerWeek * 52;
    const jobsLost = (missedPerYear * values.closeRate) / 100;
    return {
      missedPerWeek,
      missedPerYear,
      jobsLost,
      revenue: jobsLost * values.avgTicket,
    };
  }, [values]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 rounded-2xl border border-line bg-white p-6 sm:p-8",
        !compact && "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`calc-${f.key}`} className="text-16 font-medium text-ink">
                {f.label}
              </label>
              <output
                htmlFor={`calc-${f.key}`}
                className="font-mono text-16 font-semibold tabular-nums text-brand-dark"
              >
                {f.format(values[f.key])}
              </output>
            </div>
            <input
              id={`calc-${f.key}`}
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={values[f.key]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))
              }
              className="mt-2.5 w-full accent-brand"
            />
            {f.hint && <p className="mt-1 text-13 text-muted">{f.hint}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-center rounded-xl bg-forest p-6 text-white sm:p-7">
        <p className="font-mono text-[11px] tracking-[0.09em] text-white/45 uppercase">
          Booked revenue you never see
        </p>
        <p className="mt-2 text-[clamp(2.4rem,1.6rem+3vw,3.6rem)] leading-[1.02] font-medium tracking-[-0.02em] tabular-nums">
          {formatCurrency(result.revenue)}
        </p>
        <p className="mt-1 text-16 text-white/60">a year</p>

        <dl className="mt-6 flex flex-col gap-2 border-t border-white/12 pt-5">
          <Row label="Calls missed a week" value={formatNumber(result.missedPerWeek)} />
          <Row label="Calls missed a year" value={formatNumber(result.missedPerYear)} />
          <Row label="Jobs that never happened" value={formatNumber(result.jobsLost)} />
        </dl>

        <p className="mt-5 text-13 leading-[1.55] text-white/45">{CALCULATOR.footnote}</p>

        {!compact && (
          <Button href="/contact" variant="primary" size="md" arrow className="mt-6 w-full">
            Get this number properly measured
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-15 text-white/55">{label}</dt>
      <dd className="font-mono text-15 tabular-nums text-white/90">{value}</dd>
    </div>
  );
}
