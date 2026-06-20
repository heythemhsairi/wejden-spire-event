import type { Metadata } from "next";
import { RiskScanner } from "./risk-scanner";

export const metadata: Metadata = {
  title: "Workforce Risk Scanner — WejdenSpire",
  description: "A 10-question executive diagnostic. Your Workforce Risk Score, 0–100.",
};

export default function RiskScannerPage() {
  return <RiskScanner />;
}
