"use client";

import { useCallback } from "react";

export default function InstructionsButton() {
  const handleClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio("/sounds/welcome.mp3");
    audio.play().catch(() => {
      // Autoplay may be blocked; ignore failure.
    });
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-white/5 text-cyan-200 px-8 py-4 rounded-lg text-lg font-semibold border border-cyan-300/40 hover:bg-white/10 transition-colors"
      aria-label="Hear spoken instructions for this page"
    >
      Instructions
    </button>
  );
}

