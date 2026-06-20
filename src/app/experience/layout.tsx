import { SiteNav } from "@/components/ws/site-nav";

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ws-hero">
      <SiteNav />
      {children}
    </div>
  );
}
