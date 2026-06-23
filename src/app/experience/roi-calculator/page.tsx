import type { Metadata } from "next";
import { RoiCalculator } from "./roi-calculator";

export const metadata: Metadata = {
  title: "Calculateur de ROI — WejdenSpire",
  description: "Le retour sur investissement de l'intelligence du bien-être au travail.",
};

export default function RoiCalculatorPage() {
  return <RoiCalculator />;
}
