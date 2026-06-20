import Link from "next/link";
import { Button } from "./ui";
import { BrandLogo, BrandMark } from "./brand-logo";
import { FullscreenButton } from "./fullscreen-button";

const LINKS = [
  { href: "/experience/cost-calculator", label: "Hidden Cost" },
  { href: "/experience/risk-scanner", label: "Risk Scanner" },
  { href: "/experience/dashboard", label: "Dashboard" },
  { href: "/experience/advisor", label: "AI Advisor" },
  { href: "/experience/pulse", label: "Live Pulse" },
];

export const WEJDENSPIRE_SITE = "https://wejdenspire.com/";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ws-border/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" aria-label="WejdenSpire home">
          <BrandLogo markSize={30} showTagline />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ws-sage transition-colors hover:bg-ws-cloud hover:text-ws-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <FullscreenButton className="hidden sm:inline-flex" />
          <a
            href={WEJDENSPIRE_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-ws-border bg-white px-4 py-2 text-sm font-medium text-ws-ink transition-colors hover:border-ws-primary/50 hover:bg-ws-cloud sm:inline-flex"
          >
            wejdenspire.com
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 17 17 7" /><path d="M7 7h10v10" />
            </svg>
          </a>
          <Button href="/briefing" variant="primary" className="px-4 py-2 text-sm">Book a briefing</Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ws-border bg-ws-cloud">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-ws-text-dim sm:flex-row">
        <span className="flex items-center gap-2">
          <BrandMark size={18} />© {new Date().getFullYear()} WejdenSpire — Workforce Wellbeing Intelligence.
        </span>
        <span className="text-center">Figures shown are illustrative estimates, not measurements or clinical assessments.</span>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-ws-sage">About</Link>
          <Link href="/briefing" className="hover:text-ws-sage">Briefing</Link>
          <a href={WEJDENSPIRE_SITE} target="_blank" rel="noopener noreferrer" className="font-medium text-ws-primary hover:text-ws-primary-dark">wejdenspire.com ↗</a>
        </div>
      </div>
    </footer>
  );
}
