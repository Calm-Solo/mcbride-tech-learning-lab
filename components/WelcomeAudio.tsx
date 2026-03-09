"use client";

import { useEffect } from "react";

export default function WelcomeAudio() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storageKey = "mtll_welcome_played";
    if (window.sessionStorage.getItem(storageKey)) return;

    const audio = new Audio("/sounds/welcome.mp3");
    audio
      .play()
      .then(() => {
        window.sessionStorage.setItem(storageKey, "1");
      })
      .catch(() => {
        // Autoplay may be blocked; do not set the flag so it can try again on reload.
      });
  }, []);

  return null;
}

