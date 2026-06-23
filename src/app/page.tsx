import { SiteNav, SiteFooter } from "@/components/ws/site-nav";
import { ExperienceCard } from "@/components/ws/experience-card";
import { LiveTicker } from "@/components/ws/live-ticker";
import { Button, Badge } from "@/components/ws/ui";
import { EXPERIENCES } from "@/lib/experiences";
import { getActiveSessionId } from "@/lib/session";
import { t } from "@/lib/i18n";

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
          <Badge color="primary">{t("home.badge")}</Badge>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ws-ink sm:text-6xl">
            {t("home.heroLine1")} <span className="text-ws-primary">{t("home.heroEmphasis1")}</span>
            <br />
            {t("home.heroLine2")}<span className="text-ws-purple-dark">{t("home.heroEmphasis2")}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ws-sage">{t("home.heroSub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/experience/cost-calculator" variant="primary">{t("home.ctaPrimary")}</Button>
            <Button href="/experience/dashboard" variant="ghost">{t("home.ctaGhost")}</Button>
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
            <h2 className="font-display text-2xl font-semibold text-ws-ink">{t("home.gridTitle")}</h2>
            <p className="mt-1 text-sm text-ws-sage">{t("home.gridSub")}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((exp) => (
            <ExperienceCard key={exp.slug} exp={exp} />
          ))}
        </div>
      </section>

      {/* Measure → Analyze → Act band */}
      <section className="border-y border-ws-border bg-ws-cloud">
        <div className="mx-auto grid max-w-7xl gap-px px-5 py-12 sm:grid-cols-3">
          {[
            { step: "01", title: t("home.step1Title"), body: t("home.step1Body") },
            { step: "02", title: t("home.step2Title"), body: t("home.step2Body") },
            { step: "03", title: t("home.step3Title"), body: t("home.step3Body") },
          ].map((s) => (
            <div key={s.step} className="px-2">
              <span className="tnum font-display text-sm font-bold text-ws-purple-dark">{s.step}</span>
              <h3 className="mt-2 font-display text-xl font-semibold text-ws-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm text-ws-sage">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For teams CTA */}
      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="overflow-hidden rounded-2xl border border-ws-primary/20 bg-ws-soft-green p-8 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-ws-ink">{t("home.teamsTitle")}</h2>
            <p className="mt-2 max-w-xl text-ws-sage">{t("home.teamsBody")}</p>
          </div>
          <div className="mt-5 shrink-0 sm:mt-0">
            <Button href="/for-teams" variant="primary">{t("home.teamsCta")}</Button>
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="max-w-2xl text-sm text-ws-sage">{t("home.trust")}</p>
          <Button href="/briefing" variant="primary">{t("common.bookBriefing")}</Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
