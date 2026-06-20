export interface ExperienceMeta {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  href: string;
  hero?: boolean;
  preview: string; // tiny data hint shown on hover
}

export const EXPERIENCES: ExperienceMeta[] = [
  {
    slug: "cost-calculator",
    number: 1,
    title: "Hidden Cost Calculator",
    tagline: "The financial impact of psychosocial risk — in your numbers.",
    href: "/experience/cost-calculator",
    preview: "€1.84M hidden annual cost",
  },
  {
    slug: "risk-scanner",
    number: 2,
    title: "Workforce Risk Scanner",
    tagline: "A 10-question executive diagnostic. Your Workforce Risk Score.",
    href: "/experience/risk-scanner",
    preview: "Risk score 0–100",
  },
  {
    slug: "dashboard",
    number: 3,
    title: "Future Workforce Dashboard",
    tagline: "A simulated CEO terminal for your industry. This is what daily visibility looks like.",
    href: "/experience/dashboard",
    hero: true,
    preview: "6 live risk indices",
  },
  {
    slug: "advisor",
    number: 4,
    title: "AI Workforce Advisor",
    tagline: "Consulting-grade answers on workforce risk, cost, and action.",
    href: "/experience/advisor",
    preview: "Ask anything",
  },
  {
    slug: "pulse",
    number: 5,
    title: "Live Human Signal",
    tagline: "30 seconds. 5 signals. A live workforce pulse of the room.",
    href: "/experience/pulse",
    preview: "247 live participants",
  },
];
