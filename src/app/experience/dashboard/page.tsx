import type { Metadata } from "next";
import { FutureDashboard } from "./future-dashboard";

export const metadata: Metadata = {
  title: "Future Workforce Dashboard — WejdenSpire",
  description: "A simulated CEO terminal. This is what daily workforce-risk visibility looks like.",
};

export default function DashboardPage() {
  return <FutureDashboard />;
}
