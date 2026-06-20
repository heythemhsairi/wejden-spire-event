import type { Metadata } from "next";
import { CostCalculator } from "./cost-calculator";

export const metadata: Metadata = {
  title: "Hidden Cost Calculator — WejdenSpire",
  description: "The hidden financial impact of psychosocial risk in your workforce.",
};

export default function CostCalculatorPage() {
  return <CostCalculator />;
}
