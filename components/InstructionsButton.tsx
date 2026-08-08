"use client";

import { useCallback } from "react";

type InstructionsButtonProps = {
  src?: string;
  glow?: boolean;
};

export default function InstructionsButton({
  src = "/sounds/welcome.mp3",
  glow = false,
}: InstructionsButtonProps) {
  const handleClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio(src);
    audio.play().catch(() => {
      // Playback may be blocked; ignore failure.
    });
  }, [src]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        glow
          ? "bg-white/5 text-cyan-200 px-8 py-4 rounded-lg text-lg font-semibold border border-cyan-300/60 hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.45)] ring-2 ring-cyan-400/50 animate-pulse"
          : "bg-white/5 text-cyan-200 px-8 py-4 rounded-lg text-lg font-semibold border border-cyan-300/40 hover:bg-white/10 transition-colors"
      }
      aria-label="Hear spoken instructions for this page"
    >
      Instructions
    </button>
  );
}
