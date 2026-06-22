import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "@/components/ws/site-nav";
import { ForTeams } from "./for-teams";

export const metadata: Metadata = {
  title: "Give your team a wellbeing space — WejdenSpire",
  description: "Generate a private wellbeing space for your employees in seconds, and share the link.",
};

export default function ForTeamsPage() {
  return (
    <div className="min-h-screen bg-ws-hero">
      <SiteNav />
      <ForTeams />
      <SiteFooter />
    </div>
  );
}
