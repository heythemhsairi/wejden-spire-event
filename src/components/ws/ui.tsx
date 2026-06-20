import Link from "next/link";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  className,
  href,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: "bg-ws-primary text-white hover:bg-ws-primary-dark shadow-ws-glow",
    secondary: "bg-ws-purple text-white hover:bg-ws-purple-dark",
    ghost: "border border-ws-border bg-white text-ws-ink hover:border-ws-primary/50 hover:bg-ws-cloud",
  };
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none",
    styles[variant],
    className,
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-ws-border bg-white shadow-ws-card", className)}>{children}</div>
  );
}

export function Badge({ children, color = "primary", className }: { children: React.ReactNode; color?: "primary" | "blue" | "purple" | "red"; className?: string }) {
  const map = {
    primary: "border-ws-primary/30 bg-ws-primary/10 text-ws-primary-dark",
    blue: "border-ws-blue/30 bg-ws-blue/10 text-ws-blue-dark",
    purple: "border-ws-purple/30 bg-ws-purple/10 text-ws-purple-dark",
    red: "border-ws-red/30 bg-ws-red/10 text-ws-red",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider", map[color], className)}>
      {children}
    </span>
  );
}

export function LiveDot({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ws-primary">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ws-primary opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-ws-primary" />
      </span>
      {label ?? "Live"}
    </span>
  );
}

/** The "imagine measuring the real signals" conversion bridge — reused at every result. */
export function ConversionBridge({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-ws-purple/25 bg-ws-soft-purple px-5 py-4 text-center", className)}>
      <p className="text-sm text-ws-ink">
        {text ?? (
          <>
            These are estimates.{" "}
            <span className="font-bold text-ws-purple-dark">Imagine measuring the real signals</span> — every day, across your whole organization.
          </>
        )}
      </p>
    </div>
  );
}
