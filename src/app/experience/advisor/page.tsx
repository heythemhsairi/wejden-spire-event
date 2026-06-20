import type { Metadata } from "next";
import { Advisor } from "./advisor";

export const metadata: Metadata = {
  title: "AI Workforce Advisor — WejdenSpire",
  description: "Consulting-grade answers on workforce risk, cost, and action.",
};

export default function AdvisorPage() {
  return <Advisor />;
}
