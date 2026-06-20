import { cn, riskColor } from "@/lib/utils";
import { CountUp } from "./count-up";
import { Sparkline } from "./sparkline";

interface MetricTileProps {
  label: string;
  value: number;
  unit?: "index" | "percent";
  delta?: number;
  spark?: number[];
  higherIsWorse?: boolean;
  className?: string;
}

/** Bloomberg-style KPI tile: big tabular number + delta arrow + sparkline. */
export function MetricTile({ label, value, unit = "index", delta = 0, spark, higherIsWorse = true, className }: MetricTileProps) {
  const color = higherIsWorse ? riskColor(unit === "percent" ? Math.abs(value) * 4 : value) : "#4AAA83";
  const deltaBad = higherIsWorse ? delta > 0 : delta < 0;
  const fmt = (n: number) => (unit === "percent" ? `${n > 0 ? "+" : ""}${n.toFixed(1)}%` : Math.round(n).toString());

  return (
    <div className={cn("rounded-2xl border border-ws-border bg-white p-4 shadow-ws-card", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ws-text-lo">{label}</p>
        {spark && <Sparkline data={spark} color={color} width={72} height={22} />}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="tnum font-display text-4xl font-semibold leading-none" style={{ color }}>
          <CountUp value={value} format={fmt} />
        </div>
        {delta !== 0 && (
          <span
            className={cn("tnum mb-1 text-xs font-semibold", deltaBad ? "text-ws-red" : "text-ws-green")}
          >
            {deltaBad ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
