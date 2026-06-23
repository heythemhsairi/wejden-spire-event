"use client";

import { useEffect, useState } from "react";
import type { TrendPoint } from "@/lib/domain/mood-trends";

interface TrendChartProps {
  points: TrendPoint[];
  interventionThreshold: number;
  height?: number;
}

const PAD = { top: 16, right: 16, bottom: 28, left: 34 };
const POS = "#4AAA83"; // Spire Green — positive affect
const NEG = "#9A8BD6"; // Calm Purple — negative affect
const RISK = "#E06A5C"; // soft red — intervention zone

/** Company mood trend: positive vs negative affect lines + intervention zone, animated build-in. */
export function TrendChart({ points, interventionThreshold, height = 300 }: TrendChartProps) {
  const [w, setW] = useState(720);
  const [progress, setProgress] = useState(0);

  // Animate the reveal left-to-right.
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setProgress(1); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points]);

  const innerW = w - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const n = points.length;
  const x = (i: number) => PAD.left + (i / (n - 1)) * innerW;
  const y = (v: number) => PAD.top + (1 - v / 100) * innerH;

  const visible = Math.max(2, Math.round(n * progress));
  const slice = points.slice(0, visible);

  const linePath = (key: "positive" | "negative") =>
    slice.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p[key])}`).join(" ");
  const wellbeingArea =
    slice.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.wellbeing)}`).join(" ") +
    ` L${x(visible - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  const lastReal = points[n - 1];
  const yThresh = y(interventionThreshold);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        ref={(el) => { if (el && el.clientWidth && Math.abs(el.clientWidth - w) > 4) setW(el.clientWidth); }}
      >
        <defs>
          <linearGradient id="wb-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={POS} stopOpacity="0.18" />
            <stop offset="100%" stopColor={POS} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Intervention zone (below threshold) */}
        <rect x={PAD.left} y={yThresh} width={innerW} height={y(0) - yThresh} fill={RISK} opacity="0.07" />
        <line x1={PAD.left} y1={yThresh} x2={w - PAD.right} y2={yThresh} stroke={RISK} strokeOpacity="0.4" strokeDasharray="4 4" strokeWidth="1" />
        <text x={PAD.left + 4} y={yThresh + 14} fontSize="10" fill={RISK} opacity="0.8">Intervention zone</text>

        {/* Y gridlines */}
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line x1={PAD.left} y1={y(g)} x2={w - PAD.right} y2={y(g)} stroke="#E2E6E4" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(g) + 3} fontSize="9" fill="#9AA6A8" textAnchor="end">{g}</text>
          </g>
        ))}

        {/* Wellbeing area */}
        <path d={wellbeingArea} fill="url(#wb-area)" />

        {/* Negative affect line */}
        <path d={linePath("negative")} fill="none" stroke={NEG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Positive affect line */}
        <path d={linePath("positive")} fill="none" stroke={POS} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* X labels */}
        {points.map((p, i) => (
          (i % 2 === 0 || i === n - 1) && (
            <text key={i} x={x(i)} y={height - 8} fontSize="9" fill="#9AA6A8" textAnchor="middle">{p.label}</text>
          )
        ))}

        {/* The live "now" point — pulsing if real */}
        {progress >= 1 && (
          <g>
            <circle cx={x(n - 1)} cy={y(lastReal.positive)} r="5" fill={POS} stroke="#fff" strokeWidth="2" />
            <circle cx={x(n - 1)} cy={y(lastReal.negative)} r="5" fill={NEG} stroke="#fff" strokeWidth="2" />
            {lastReal.live && (
              <circle cx={x(n - 1)} cy={y(lastReal.positive)} r="9" fill="none" stroke={POS} strokeOpacity="0.5">
                <animate attributeName="r" values="6;13;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-5 text-xs">
        <Legend color={POS} label="Positive affect" />
        <Legend color={NEG} label="Negative affect" />
        <Legend color={RISK} label="Intervention zone" dashed />
      </div>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ws-sage">
      <span className="inline-block h-2.5 w-5 rounded-full" style={{ backgroundColor: dashed ? "transparent" : color, border: dashed ? `1.5px dashed ${color}` : "none" }} />
      {label}
    </span>
  );
}
