import Link from "next/link";
import { FOOTER, SITE, PLACEHOLDER_PROOF } from "@/lib/content";
import { Wordmark } from "@/components/ui/Mark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark border-t border-white/10 bg-forest text-white/70">
      <div className="container-x section-y-tight">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-block rounded-md text-20 text-white"
              aria-label="First Ring — home"
            >
              <Wordmark animate={false} markClassName="text-signal-bright" />
            </Link>
            <p className="mt-4 text-16 text-white/65">{FOOTER.blurb}</p>
            <p className="mt-5 text-16">
              <a
                href={`mailto:${SITE.email}`}
                className="text-white/85 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
              >
                {SITE.email}
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {FOOTER.columns.map((col) => (
              <div key={col.title}>
                <p className="label text-white/45">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-16 text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-14 text-white/50">
            © {year} {SITE.name}. {SITE.tagline}
          </p>
          <p className="font-mono text-[12px] tracking-[0.06em] text-white/40 uppercase">
            {SITE.domain}
          </p>
        </div>

        {PLACEHOLDER_PROOF && (
          <p className="mt-6 rounded-lg border border-amber/25 bg-amber/10 px-3 py-2 text-13 text-amber-soft">
            <strong className="font-semibold">Pre-launch build.</strong> Customer names, quotes and
            result figures across this site are placeholders — see PLACEHOLDER_PROOF in
            lib/content.ts.
          </p>
        )}
      </div>
    </footer>
  );
}
