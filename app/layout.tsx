import type { Metadata } from "next";
import { Wix_Madefor_Text } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/content";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

// One family site-wide, matching the Soch build: 400/500 carry body and
// headings, 600/700 cover font-semibold and font-bold. True italics are
// loaded because the family ships them - without the file the browser
// synthesises a slant, which reads noticeably cheaper at display sizes.
const wixMadeforText = Wix_Madefor_Text({
  variable: "--font-wix-madefor-text",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.category}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.metaDescription,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${wixMadeforText.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Nav />
        <div id="main" className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
