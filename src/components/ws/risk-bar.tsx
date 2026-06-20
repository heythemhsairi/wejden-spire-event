import { cn, riskColor } from "@/lib/utils";

interface RiskBarProps {
  label: string;
  value: number; // 0–100
  /** If true, value is a maturity score (higher = better → green). */
  maturity?: boolean;
  className?: string;
}

export function RiskBar({ label, value, maturity = false, className }: RiskBarProps) {
  const color = riskColor(maturity ? 100 - value : value);
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ws-text-lo">{label}</span>
        <span className="tnum font-semibold" style={{ color }}>
          {Math.round(value)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ws-cloud">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color, transition: "width 0.8s ease-out, background-color 0.4s" }}
        />
      </div>
    </div>
  );
}
