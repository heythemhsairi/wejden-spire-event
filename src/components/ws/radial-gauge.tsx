import { riskColor } from "@/lib/utils";

interface RadialGaugeProps {
  value: number; // 0–100
  max?: number;
  size?: number;
  label?: string;
  sublabel?: string;
  /** When true, color uses the risk scale on (100 - value) i.e. higher score = safer (green). */
  invertColor?: boolean;
}

/** SVG radial gauge for scores (risk scanner result, burnout exposure). */
export function RadialGauge({ value, max = 100, size = 180, label, sublabel, invertColor = false }: RadialGaugeProps) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value / max));
  const color = riskColor(invertColor ? 100 - value : value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E6E4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.4s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum font-display text-5xl font-bold" style={{ color }}>
          {Math.round(value)}
        </span>
        {label && <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-ws-text-lo">{label}</span>}
        {sublabel && <span className="mt-1 text-[11px] font-medium" style={{ color }}>{sublabel}</span>}
      </div>
    </div>
  );
}
