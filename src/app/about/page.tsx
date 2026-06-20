import { SiteNav, SiteFooter } from "@/components/ws/site-nav";
import { Button, Card } from "@/components/ws/ui";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ws-hero">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-4xl font-bold text-ws-ink">
          Workforce intelligence, not wellness.
        </h1>
        <p className="mt-5 text-lg text-ws-sage">
          WejdenSpire is a Workforce Wellbeing Intelligence platform. We exist to make the invisible
          measurable: the psychosocial and emotional signals that drive burnout, attrition and lost
          productivity — long before they show up in your P&amp;L.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Measure", d: "Continuous leading signals — energy, overload, psychological safety, support, stress." },
            { t: "Analyze", d: "Normalized risk indices, benchmarked, surfaced at executive altitude." },
            { t: "Act", d: "Where to intervene, ranked — before risk becomes cost." },
          ].map((s) => (
            <Card key={s.t} className="p-5">
              <h3 className="font-display text-lg font-semibold text-ws-primary">{s.t}</h3>
              <p className="mt-1.5 text-sm text-ws-sage">{s.d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 space-y-4 text-ws-sage">
          <h2 className="font-display text-2xl font-semibold text-ws-ink">What WejdenSpire is</h2>
          <p>Workforce Intelligence · Psychosocial Risk Intelligence · HR Analytics · Organizational Performance Intelligence · Predictive Workforce Monitoring · Data-Driven Decision Support.</p>
          <h2 className="font-display text-2xl font-semibold text-ws-ink">What it is not</h2>
          <p>Not a wellness company. Not a meditation app. Not a coaching platform. Not a happiness-at-work initiative.</p>
        </div>

        <div className="mt-10">
          <Button href="/briefing" variant="primary">Book an intelligence briefing</Button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
