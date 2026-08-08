"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import type { MerchItem } from "@/lib/merch";

type CloseUp = {
  image: StaticImageData;
  label: string;
};

export default function MerchViewer({ items }: { items: MerchItem[] }) {
  const [closeUp, setCloseUp] = useState<CloseUp | null>(null);

  // Escape closes the close-up view; page scroll is locked while it is open.
  useEffect(() => {
    if (!closeUp) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setCloseUp(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeUp]);

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-violet-200 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)] mb-6 text-center">
              {item.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { image: item.front, side: "Front" },
                { image: item.back, side: "Back" },
              ].map(({ image, side }) => (
                <figure key={side}>
                  <button
                    type="button"
                    onClick={() =>
                      setCloseUp({
                        image,
                        label: `${item.name} ${side.toLowerCase()}`,
                      })
                    }
                    aria-label={`See ${item.name} ${side.toLowerCase()} up close`}
                    className="group relative block w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
                  >
                    <Image
                      src={image}
                      alt={`${item.name} ${side.toLowerCase()}`}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="block w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-slate-950/75 py-2 text-center text-sm font-semibold text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      Tap to see up close
                    </span>
                  </button>
                  <figcaption className="text-center text-slate-400 text-sm mt-2">
                    {side}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>

      {closeUp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={closeUp.label}
          onClick={() => setCloseUp(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setCloseUp(null)}
            aria-label="Close the close-up view"
            className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/10 border border-cyan-300/60 px-5 py-3 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-base font-semibold">Close</span>
          </button>

          <figure onClick={(event) => event.stopPropagation()}>
            <Image
              src={closeUp.image}
              alt={closeUp.label}
              sizes="100vw"
              priority
              className="mx-auto h-auto w-auto max-h-[75vh] max-w-full rounded-xl"
            />
            <figcaption className="mt-4 text-center text-lg font-semibold capitalize text-slate-200">
              {closeUp.label}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
