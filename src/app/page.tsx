import { SiteNav, SiteFooter } from "@/components/ws/site-nav";
import { ExperienceCard } from "@/components/ws/experience-card";
import { LiveTicker } from "@/components/ws/live-ticker";
import { Button, Badge } from "@/components/ws/ui";
import { EXPERIENCES } from "@/lib/experiences";
import { getActiveSessionId } from "@/lib/session";

export default async function HomePage() {
  const sessionId = await getActiveSessionId();

  return (
    <div className="min-h-screen bg-ws-hero">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="ws-dots pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 animate-ws-float rounded-full bg-ws-soft-blue blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-64 w-64 animate-ws-float rounded-full bg-ws-soft-purple blur-3xl" style={{ animationDelay: "2s" }} />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:pt-24">
          <Badge color="primary">Workforce Wellbeing Intelligence</Badge>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ws-ink sm:text-6xl">
            The signals your workforce is{" "}
            <span className="text-ws-primary">already sending.</span>
            <br />
            You&apos;re just not measuring them — <span className="text-ws-purple-dark">yet.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ws-sage">
            WejdenSpire turns invisible psychosocial and emotional workforce signals into measurable
            business intelligence. Measure → Analyze → Act.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/experience/cost-calculator" variant="primary">Calculate your hidden cost →</Button>
            <Button href="/experience/dashboard" variant="ghost">See a live dashboard</Button>
          </div>

          <div className="mt-10 max-w-3xl">
            <LiveTicker sessionId={sessionId} />
          </div>
        </div>
      </section>

      {/* Experience grid */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ws-ink">Five experiences. One thesis.</h2>
            <p className="mt-1 text-sm text-ws-sage">Pick any. Each one ends in a number you&apos;ll want to act on.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((exp) => (
            <ExperienceCard key={exp.slug} exp={exp} className={exp.hero ? "lg:col-span-1" : ""} />
          ))}
        </div>
      </section>

      {/* Measure → Analyze → Act band */}
      <section className="border-y border-ws-border bg-ws-cloud">
        <div className="mx-auto grid max-w-7xl gap-px px-5 py-12 sm:grid-cols-3">
          {[
            { step: "01", title: "Measure", body: "Capture leading psychosocial & emotional signals continuously — not annual surveys." },
            { step: "02", title: "Analyze", body: "Turn signals into normalized risk indices the executive team can read at a glance." },
            { step: "03", title: "Act", body: "Surface where to intervene before burnout becomes attrition, and attrition becomes cost." },
          ].map((s) => (
            <div key={s.step} className="px-2">
              <span className="tnum font-display text-sm font-bold text-ws-primary">{s.step}</span>
              <h3 className="mt-2 font-display text-xl font-semibold text-ws-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm text-ws-sage">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust row */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="max-w-2xl text-sm text-ws-sage">
            Built for CEOs, Managing Directors and General Managers who run on data. Figures in these
            experiences are illustrative estimates — the point is what becomes possible when the real
            signals are measured.
          </p>
          <Button href="/briefing" variant="primary">Book an intelligence briefing</Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
