/**
 * WejdenSpire line-icon set.
 * Brand spec: consistent 1.5px stroke weight, round caps, currentColor.
 * Use across product, marketing, and communications.
 */
import { cn } from "@/lib/utils";

type IconProps = { size?: number; className?: string };

function Svg({ size = 24, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Mood / sun-cloud — daily check-in. */
export function IconMood(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="8" cy="9" r="3.2" />
      <path d="M8 2.5v1.4M3.2 4.2l1 1M2 9h1.4M13.3 4.2l-1 1" />
      <path d="M9 16.5h9a3 3 0 0 0 0-6 4 4 0 0 0-7.6-1.3" />
    </Svg>
  );
}

/** Wellbeing / growth — sprout. */
export function IconWellbeing(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3 2.2-5.5 5.5-5.5C17.5 11 15 13 12 13Z" />
      <path d="M12 13c0-2.6-2-4.8-5-4.8C7 11.2 9 13 12 13Z" />
    </Svg>
  );
}

/** Talk / support — chat bubble with heart. */
export function IconTalk(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M21 11.5a7.5 7.5 0 0 1-10.7 6.8L4 20l1.3-4.2A7.5 7.5 0 1 1 21 11.5Z" />
      <path d="M12.4 8.6a1.8 1.8 0 0 1 2.6 2.5L12.4 14l-2.6-2.9a1.8 1.8 0 0 1 2.6-2.5Z" />
    </Svg>
  );
}

/** Energy — bolt. */
export function IconEnergy(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8Z" />
    </Svg>
  );
}

/** Calm / wave — soft horizontal lines. */
export function IconCalm(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </Svg>
  );
}

/** Hand wave — greeting. */
export function IconWave(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 11V6.5a1.3 1.3 0 0 1 2.6 0V10" />
      <path d="M9.6 9.5V5.2a1.3 1.3 0 0 1 2.6 0V10" />
      <path d="M12.2 9.8V6.4a1.3 1.3 0 0 1 2.6 0V12" />
      <path d="M14.8 10.5V8a1.3 1.3 0 0 1 2.6 0v5a6 6 0 0 1-6 6 6 6 0 0 1-5.2-3l-1.8-3.1a1.3 1.3 0 0 1 2.2-1.3L7 11.5" />
    </Svg>
  );
}

/** Check — confirmation. */
export function IconCheck(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.2 11 14.7l4.5-5" />
    </Svg>
  );
}

/** Arrow right. */
export function IconArrowRight(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </Svg>
  );
}

/** Heart with pulse line — wellbeing check. */
export function IconHeartPulse(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20.4 5.6a4.5 4.5 0 0 0-6.4 0l-2 2-2-2a4.5 4.5 0 0 0-6.4 6.4l8.4 8.4 8.4-8.4a4.5 4.5 0 0 0 0-6.4Z" />
      <path d="M3.5 12.5h4l1.5-2.5 2 4 1.5-3h4" />
    </Svg>
  );
}

/* ── Emotion icons (PANAS weekly check) — same 1.5px line spec ── */

const EMOTION_PATHS: Record<string, React.ReactNode> = {
  // positive
  interested: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>, // magnifier = curiosity
  enthusiastic: <><path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M18.4 5.6l-2.1 2.1" /><circle cx="12" cy="14" r="4.5" /></>, // spark/sun
  strong: <><path d="M5 11V8a2 2 0 0 1 4 0v3" /><path d="M9 11V6.5a2 2 0 0 1 4 0V11" /><path d="M13 11V8a2 2 0 0 1 4 0v5a6 6 0 0 1-6 6H9a5 5 0 0 1-4.3-2.5L4 14.5" /></>, // flexed arm
  inspired: <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.4 1 2.5h6c0-1.1.3-1.8 1-2.5A6 6 0 0 0 12 3Z" /></>, // lightbulb
  determined: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></>, // target
  // negative
  stressed: <><path d="M4 7c2.5-2 5-2 7.5 0M12.5 7c2.5-2 5-2 7.5 0" /><path d="M4 13c2.5-2 5-2 7.5 0M12.5 13c2.5-2 5-2 7.5 0" /><path d="M7 19h10" /></>, // tension lines
  anxious: <><path d="M12 3v18" /><path d="M8 7l4-3 4 3M8 12l4-3 4 3M8 17l4-3 4 3" /></>, // jagged
  irritable: <><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></>, // bolt
  exhausted: <><circle cx="12" cy="12" r="9" /><path d="M8 9.5h3M13 9.5h3" /><path d="M9 15.5c1.5-1.2 4.5-1.2 6 0" /></>, // tired face (flat)
  discouraged: <><circle cx="12" cy="12" r="9" /><path d="M8.5 10h.01M15.5 10h.01" /><path d="M8.5 15.5c1.8-1.5 5.2-1.5 7 0" /></>, // downturned
};

export function EmotionIcon({ name, size = 28, className }: { name: string; size?: number; className?: string }) {
  return <Svg size={size} className={className}>{EMOTION_PATHS[name] ?? <circle cx="12" cy="12" r="8" />}</Svg>;
}
