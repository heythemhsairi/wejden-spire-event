import Link from "next/link";
import { Button } from "./ui";
import { BrandLogo, BrandMark } from "./brand-logo";

const LINKS = [
  { href: "/experience/cost-calculator", label: "Hidden Cost" },
  { href: "/experience/risk-scanner", label: "Risk Scanner" },
  { href: "/experience/dashboard", label: "Dashboard" },
  { href: "/experience/advisor", label: "AI Advisor" },
  { href: "/experience/pulse", label: "Live Pulse" },
];

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
        <Button href="/briefing" variant="primary" className="px-4 py-2 text-sm">Book a briefing</Button>
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
        </div>
      </div>
    </footer>
  );
}
