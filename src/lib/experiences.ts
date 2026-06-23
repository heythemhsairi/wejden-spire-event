export interface ExperienceMeta {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  href: string;
  hero?: boolean;
  preview: string;
}

export const EXPERIENCES: ExperienceMeta[] = [
  {
    slug: "cost-calculator",
    number: 1,
    title: "Calculateur de coût caché",
    tagline: "L'impact financier du risque psychosocial — dans vos chiffres.",
    href: "/experience/cost-calculator",
    preview: "1,84 M DT de coût caché",
  },
  {
    slug: "risk-scanner",
    number: 2,
    title: "Scanner de risque des effectifs",
    tagline: "Un diagnostic exécutif en 10 questions. Votre score de risque.",
    href: "/experience/risk-scanner",
    preview: "Score de risque 0–100",
  },
  {
    slug: "dashboard",
    number: 3,
    title: "Tableau de bord du futur",
    tagline: "Un terminal PDG simulé pour votre secteur. La visibilité quotidienne.",
    href: "/experience/dashboard",
    hero: true,
    preview: "6 indices de risque en direct",
  },
  {
    slug: "advisor",
    number: 4,
    title: "Conseiller IA des effectifs",
    tagline: "Des réponses de niveau conseil sur le risque, le coût et l'action.",
    href: "/experience/advisor",
    preview: "Posez n'importe quelle question",
  },
  {
    slug: "pulse",
    number: 5,
    title: "Signal humain en direct",
    tagline: "30 secondes. 5 signaux. Le pouls des effectifs de la salle.",
    href: "/experience/pulse",
    preview: "247 participants en direct",
  },
  {
    slug: "mood-trends",
    number: 6,
    title: "Tendances d'humeur",
    tagline: "10 semaines d'affect des effectifs — l'alerte précoce avant l'attrition.",
    href: "/experience/mood-trends",
    preview: "Affect négatif ▲ en hausse",
  },
  {
    slug: "roi-calculator",
    number: 7,
    title: "Calculateur de ROI",
    tagline: "Combien rapporte l'investissement dans le bien-être ? Le retour, chiffré.",
    href: "/experience/roi-calculator",
    preview: "ROI 700 % · retour 1,5 mois",
  },
];
