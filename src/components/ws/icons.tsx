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
