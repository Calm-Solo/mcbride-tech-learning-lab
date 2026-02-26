"use client";

import { useState, useRef, useEffect } from "react";
import { saveSpellingBeeProgress } from "@/lib/actions/spelling-bee";
import Link from "next/link";

const WORDS = ["cat", "dog", "run", "sun", "hat"];

export default function SpellingBeeGame() {
  const [startTime] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const word = WORDS[index];
  const isLast = index === WORDS.length - 1;

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();
    const isCorrect = trimmed === word;
    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    const totalSoFar = index + 1;

    if (isLast) {
      setCorrectCount(newCorrect);
      setFinished(true);
      setSaving(true);
      setSaveError(null);
      const timeSeconds = Math.round((Date.now() - startTime) / 1000);
      const result = await saveSpellingBeeProgress({
        correct: newCorrect,
        total: totalSoFar,
        timeSeconds,
      });
      setSaving(false);
      if (!result.ok) setSaveError(result.error ?? "Failed to save.");
    } else {
      setCorrectCount(newCorrect);
      setIndex((i) => i + 1);
      setInput("");
    }
  }

  if (finished) {
    const total = WORDS.length;
    return (
      <div className="text-center max-w-md mx-auto">
        <h3 className="text-2xl font-display font-semibold text-white mb-4">
          Round complete
        </h3>
        <p className="text-cyan-300 text-xl mb-2">
          {correctCount} / {total} correct
        </p>
        {saving && <p className="text-slate-400 text-sm">Saving progress…</p>}
        {saveError && (
          <p className="text-amber-300 text-sm mt-2">{saveError}</p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/games/spelling-bee"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 px-6 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors"
          >
            Play again
          </Link>
          <Link
            href="/#progress"
            className="bg-white/5 text-cyan-200 px-6 py-3 rounded-lg font-semibold border border-cyan-300/40 hover:bg-white/10 transition-colors"
          >
            View progress
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <p className="text-slate-400 text-sm mb-2">
        Word {index + 1} of {WORDS.length}
      </p>
      <p className="text-3xl font-display font-semibold text-white mb-6">
        Spell: <span className="text-cyan-300">{word}</span>
      </p>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type the word"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          autoComplete="off"
          autoCapitalize="off"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors"
        >
          {isLast ? "Finish round" : "Next"}
        </button>
      </form>
    </div>
  );
}
