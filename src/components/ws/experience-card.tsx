import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ExperienceMeta } from "@/lib/experiences";
import { Badge } from "./ui";

export function ExperienceCard({ exp, className }: { exp: ExperienceMeta; className?: string }) {
  return (
    <Link
      href={exp.href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 shadow-ws-card transition-all hover:-translate-y-1 hover:shadow-ws-lift",
        exp.hero ? "border-ws-purple/40 hover:border-ws-purple" : "border-ws-border hover:border-ws-primary/50",
        className,
      )}
    >
      <div className={cn("pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-100", exp.hero ? "bg-ws-purple/15" : "bg-ws-primary/10")} />
      <div className="relative flex items-start justify-between">
        <span className="tnum font-display text-sm font-extrabold text-ws-text-dim">0{exp.number}</span>
        {exp.hero && <Badge color="purple">Hero experience</Badge>}
      </div>
      <div className="relative mt-8">
        <h3 className="font-display text-lg font-bold text-ws-ink">{exp.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ws-sage">{exp.tagline}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="tnum text-xs font-semibold text-ws-primary opacity-0 transition-opacity group-hover:opacity-100">
            {exp.preview}
          </span>
          <span className="text-ws-primary transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
