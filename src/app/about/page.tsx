import { SiteNav, SiteFooter } from "@/components/ws/site-nav";
import { Button, Card } from "@/components/ws/ui";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ws-hero">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-4xl font-bold text-ws-ink">
          L&apos;intelligence des effectifs, pas le bien-être cosmétique.
        </h1>
        <p className="mt-5 text-lg text-ws-sage">
          WejdenSpire est une plateforme d&apos;intelligence du bien-être des effectifs. Notre raison
          d&apos;être : rendre mesurable l&apos;invisible — les signaux psychosociaux et émotionnels qui
          alimentent l&apos;épuisement, l&apos;attrition et la perte de productivité, bien avant qu&apos;ils
          n&apos;apparaissent dans votre compte de résultat.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Mesurer", d: "Des signaux précurseurs en continu — énergie, surcharge, sécurité psychologique, soutien, stress." },
            { t: "Analyser", d: "Des indices de risque normalisés, comparés, restitués à hauteur de direction." },
            { t: "Agir", d: "Où intervenir, par ordre de priorité — avant que le risque ne devienne un coût." },
          ].map((s) => (
            <Card key={s.t} className="p-5">
              <h3 className="font-display text-lg font-semibold text-ws-primary">{s.t}</h3>
              <p className="mt-1.5 text-sm text-ws-sage">{s.d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 space-y-4 text-ws-sage">
          <h2 className="font-display text-2xl font-semibold text-ws-ink">Ce qu&apos;est WejdenSpire</h2>
          <p>Intelligence des effectifs · Intelligence du risque psychosocial · Analytique RH · Intelligence de la performance organisationnelle · Surveillance prédictive des effectifs · Aide à la décision fondée sur les données.</p>
          <h2 className="font-display text-2xl font-semibold text-ws-ink">Ce que ce n&apos;est pas</h2>
          <p>Pas une entreprise de bien-être. Pas une application de méditation. Pas une plateforme de coaching. Pas une initiative de bonheur au travail.</p>
        </div>

        <div className="mt-10">
          <Button href="/briefing" variant="primary">Réserver un briefing</Button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
