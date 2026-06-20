"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Toggles browser fullscreen — ideal for the booth kiosk / projector wall.
 * Falls back gracefully where the Fullscreen API is unavailable.
 */
export function FullscreenButton({ className, label = false }: { className?: string; label?: boolean }) {
  const [isFs, setIsFs] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(typeof document !== "undefined" && !!document.documentElement.requestFullscreen);
    const onChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function toggle() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // ignore — some browsers block fullscreen without a user gesture / on iOS
    }
  }

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      aria-label={isFs ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFs ? "Exit fullscreen" : "Enter fullscreen"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ws-border bg-white px-3 py-2 text-sm font-medium text-ws-ink transition-colors hover:border-ws-primary/50 hover:bg-ws-cloud",
        className,
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {isFs ? (
          <>
            <path d="M8 3v3a2 2 0 0 1-2 2H3" />
            <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
            <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
          </>
        ) : (
          <>
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </>
        )}
      </svg>
      {label && <span>{isFs ? "Exit fullscreen" : "Fullscreen"}</span>}
    </button>
  );
}
