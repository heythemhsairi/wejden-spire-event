"use client";

import { riskColor } from "@/lib/utils";

interface SignalSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  /** When true, high values are bad (stress, workload) → red at top. */
  higherIsWorse?: boolean;
  leftLabel?: string;
  rightLabel?: string;
}

/** Accessible 0–100 slider with numeric fallback and risk-colored fill. */
export function SignalSlider({ label, value, onChange, higherIsWorse = false, leftLabel = "Low", rightLabel = "High" }: SignalSliderProps) {
  const color = riskColor(higherIsWorse ? value : 100 - value);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ws-text-hi">{label}</label>
        <span className="tnum text-sm font-semibold" style={{ color }}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #E2E6E4 ${value}%, #E2E6E4 100%)`,
          height: 8,
          borderRadius: 8,
        }}
      />
      <div className="flex justify-between text-[11px] text-ws-text-dim">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
