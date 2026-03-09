"use client";

import { useEffect } from "react";

export default function TrainingIntroAudio() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio("/sounds/training.mp3");
    audio.play().catch(() => {
      // Autoplay may be blocked; ignore.
    });
  }, []);

  return null;
}

