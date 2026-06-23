/**
 * HR interpretation grid (client-provided). A piloting reference — NOT a medical
 * or regulatory norm. Green / Amber / Red thresholds and the recommended action.
 */
export interface GridRow {
  indicator: string;
  green: string;
  amber: string;
  red: string;
  action: string;
}

export const INTERPRETATION_GRID: GridRow[] = [
  { indicator: "Turnover annuel", green: "< 8 %", amber: "8–10 %", red: "> 10–15 %", action: "Diagnostic rétention" },
  { indicator: "Absence moyenne", green: "< 4 j/an", amber: "4–7 j/an", red: "> 7 j/an", action: "Analyse SST / médecine du travail" },
  { indicator: "Présentéisme estimé", green: "< 2 % masse salariale", amber: "2–5 %", red: "> 5 %", action: "Analyse charge, stress, fatigue" },
  { indicator: "Participation enquête", green: "> 70 %", amber: "50–70 %", red: "< 50 %", action: "Renforcer confiance / communication" },
  { indicator: "Score stress collectif", green: "Faible", amber: "Modéré", red: "Élevé", action: "Plan RPS collectif" },
  { indicator: "Score soutien managérial", green: "Bon", amber: "Moyen", red: "Faible", action: "Formation managers" },
  { indicator: "Charge de travail perçue", green: "Équilibrée", amber: "Tension", red: "Surcharge", action: "Revue organisationnelle" },
];

/** What each hidden-cost component covers (client-provided). */
export const COST_COMPONENTS: { component: string; covers: string }[] = [
  { component: "Turnover", covers: "recrutement, remplacement, onboarding, formation, perte d'expérience, surcharge des équipes" },
  { component: "Absentéisme", covers: "jours non travaillés, désorganisation, remplacement, retard, surcharge managériale" },
  { component: "Présentéisme", covers: "salarié présent mais moins productif à cause du stress, de la fatigue, de l'anxiété, de la surcharge cognitive ou du désengagement" },
];

/** Recommended actions when turnover exceeds the 10 % vigilance signal (client-provided). */
export const TURNOVER_ACTIONS: string[] = [
  "Segmenter les départs : volontaires / involontaires / fin de contrat / période d'essai.",
  "Identifier les zones : site, service, métier, manager, ancienneté.",
  "Croiser avec : absentéisme, charge de travail, score RPS, engagement, climat social.",
  "Mettre en place des stay interviews, pas seulement des exit interviews.",
  "Vérifier les irritants : horaires, surcharge, reconnaissance, évolution.",
  "Plan d'action : formation des managers, revue de charge, parcours d'intégration, communication, soutien psychologique, amélioration des conditions de travail (micro-pauses, espace de repos, cellule d'écoute).",
];
