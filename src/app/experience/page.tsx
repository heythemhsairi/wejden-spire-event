import { SiteFooter } from "@/components/ws/site-nav";
import { ExperienceCard } from "@/components/ws/experience-card";
import { EXPERIENCES } from "@/lib/experiences";

export default function ExperienceHubPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-5 py-12">
        <h1 className="font-display text-3xl font-bold text-ws-ink">The experiences</h1>
        <p className="mt-2 max-w-2xl text-ws-sage">
          Five ways to see workforce risk. Start anywhere — the more you run, the clearer the picture.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((exp) => (
            <ExperienceCard key={exp.slug} exp={exp} />
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
