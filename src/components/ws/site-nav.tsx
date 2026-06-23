"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui";
import { BrandLogo, BrandMark } from "./brand-logo";
import { FullscreenButton } from "./fullscreen-button";

const EXPERIENCES = [
  { href: "/experience/cost-calculator", label: "Hidden Cost Calculator" },
  { href: "/experience/risk-scanner", label: "Workforce Risk Scanner" },
  { href: "/experience/dashboard", label: "Future Dashboard" },
  { href: "/experience/advisor", label: "AI Workforce Advisor" },
  { href: "/experience/pulse", label: "Live Human Signal" },
  { href: "/experience/mood-trends", label: "Mood Trends" },
];

export const WEJDENSPIRE_SITE = "https://wejdenspire.com/";

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ws-border/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="WejdenSpire home" className="shrink-0">
          <BrandLogo markSize={30} showTagline />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ws-sage transition-colors hover:bg-ws-cloud hover:text-ws-ink">
              Experiences
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-180" aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {/* Dropdown */}
            <div className="invisible absolute left-0 top-full w-60 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-ws-border bg-white p-2 shadow-ws-lift">
                {EXPERIENCES.map((e) => (
                  <Link key={e.href} href={e.href} className="block rounded-xl px-3 py-2 text-sm text-ws-sage transition-colors hover:bg-ws-cloud hover:text-ws-ink">
                    {e.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/for-teams" className="rounded-full px-3.5 py-2 text-sm font-medium text-ws-sage transition-colors hover:bg-ws-cloud hover:text-ws-ink">For teams</Link>
          <Link href="/about" className="rounded-full px-3.5 py-2 text-sm font-medium text-ws-sage transition-colors hover:bg-ws-cloud hover:text-ws-ink">About</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <FullscreenButton className="hidden lg:inline-flex" />
          <a
            href={WEJDENSPIRE_SITE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit wejdenspire.com"
            title="wejdenspire.com"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-ws-border bg-white text-ws-ink transition-colors hover:border-ws-primary/50 hover:bg-ws-cloud lg:inline-flex"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>
          </a>
          <Button href="/briefing" variant="primary" className="hidden px-4 py-2 text-sm sm:inline-flex">Book a briefing</Button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ws-border bg-white text-ws-ink md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {menuOpen ? <path d="M6 6 18 18M6 18 18 6" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-ws-border bg-white md:hidden">
          <nav className="mx-auto max-w-7xl px-5 py-3">
            <p className="px-1 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ws-text-dim">Experiences</p>
            {EXPERIENCES.map((e) => (
              <Link key={e.href} href={e.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-ws-ink hover:bg-ws-cloud">
                {e.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-ws-border" />
            <Link href="/for-teams" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ws-ink hover:bg-ws-cloud">For teams</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-ws-ink hover:bg-ws-cloud">About</Link>
            <a href={WEJDENSPIRE_SITE} target="_blank" rel="noopener noreferrer" className="block rounded-xl px-3 py-2.5 text-sm text-ws-ink hover:bg-ws-cloud">wejdenspire.com ↗</a>
            <Button href="/briefing" variant="primary" className="mt-3 w-full">Book a briefing</Button>
          </nav>
        </div>
      )}
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
