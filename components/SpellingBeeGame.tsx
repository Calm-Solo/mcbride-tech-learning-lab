"use client";

import { useState, useRef, useEffect } from "react";
import { saveSpellingBeeProgress } from "@/lib/actions/spelling-bee";
import Link from "next/link";
import {
  type SpellingBeeLevel,
  getWordsForLevel,
  getSecondsPerWord,
  LEVEL_CONFIG,
} from "@/lib/words/spelling-bee";

export default function SpellingBeeGame() {
  const [level, setLevel] = useState<SpellingBeeLevel | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [secondsPerWord, setSecondsPerWord] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutHandledRef = useRef(false);
  const correctCountRef = useRef(0);
  correctCountRef.current = correctCount;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const roundEndSoundPlayedRef = useRef(false);

  const word = words[index];
  const audioSrc = word ? `/sounds/${word}.mp3` : null;
  const isLast = index === words.length - 1;
  const hasTimer = secondsPerWord !== null;

  function startRound(selectedLevel: SpellingBeeLevel) {
    roundEndSoundPlayedRef.current = false;
    setLevel(selectedLevel);
    setWords(getWordsForLevel(selectedLevel));
    setSecondsPerWord(getSecondsPerWord(selectedLevel));
    setStartTime(Date.now());
    setIndex(0);
    setInput("");
    setCorrectCount(0);
    setFinished(false);
    setTimeLeft(getSecondsPerWord(selectedLevel));
  }

  function resetToLevelSelect() {
    timeoutHandledRef.current = false;
    roundEndSoundPlayedRef.current = false;
    setLevel(null);
    setWords([]);
    setSecondsPerWord(null);
    setStartTime(0);
    setIndex(0);
    setInput("");
    setCorrectCount(0);
    setFinished(false);
    setSaving(false);
    setSaveError(null);
    setTimeLeft(null);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [index, level]);

  useEffect(() => {
    if (!audioSrc || !word) return;
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSrc, word]);

  useEffect(() => {
    if (!finished || words.length === 0 || roundEndSoundPlayedRef.current) return;
    roundEndSoundPlayedRef.current = true;
    const total = words.length;
    const passed = correctCount >= total / 2;
    const src = passed ? "/sounds/success.mp3" : "/sounds/failure.mp3";
    const snd = new Audio(src);
    snd.play().catch(() => {});
  }, [finished, correctCount, words.length]);

  useEffect(() => {
    timeoutHandledRef.current = false;
  }, [index]);

  useEffect(() => {
    if (!word || secondsPerWord === null) return;
    setTimeLeft(secondsPerWord);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [index, word, secondsPerWord]);

  useEffect(() => {
    if (timeLeft !== 0 || !word || timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;
    const totalSoFar = index + 1;
    const currentCorrect = correctCountRef.current;
    const audio = new Audio("/sounds/failure.mp3");
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      if (isLast) {
        setFinished(true);
        setSaving(true);
        setSaveError(null);
        const timeSeconds = Math.round((Date.now() - startTime) / 1000);
        saveSpellingBeeProgress({
          correct: currentCorrect,
          total: totalSoFar,
          timeSeconds,
        }).then((result) => {
          setSaving(false);
          if (!result.ok) setSaveError(result.error ?? "Failed to save.");
        });
      } else {
        setIndex((i) => i + 1);
        setInput("");
      }
    };

    audio.play().catch(() => advance());
    audio.addEventListener("ended", advance, { once: true });
    audio.addEventListener("error", () => advance(), { once: true });
  }, [timeLeft, word, isLast, index, startTime]);


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();
    const isCorrect = trimmed === word;
    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    const totalSoFar = index + 1;

    const feedbackSrc = isCorrect ? "/sounds/perfect.mp3" : "/sounds/incorrect.mp3";
    const audio = new Audio(feedbackSrc);
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      if (isLast) {
        setCorrectCount(newCorrect);
        setFinished(true);
        setSaving(true);
        setSaveError(null);
        const timeSeconds = Math.round((Date.now() - startTime) / 1000);
        saveSpellingBeeProgress({
          correct: newCorrect,
          total: totalSoFar,
          timeSeconds,
        }).then((result) => {
          setSaving(false);
          if (!result.ok) setSaveError(result.error ?? "Failed to save.");
        });
      } else {
        setCorrectCount(newCorrect);
        setIndex((i) => i + 1);
        setInput("");
      }
    };

    audio.play().catch(() => advance());
    audio.addEventListener("ended", advance, { once: true });
    audio.addEventListener("error", () => advance(), { once: true });
  }

  if (level === null) {
    return (
      <div className="max-w-md mx-auto">
        <p className="text-slate-300 mb-6">Choose a skill level. Timer per word varies by level; Parent Mode has no timer.</p>
        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(LEVEL_CONFIG) as [SpellingBeeLevel, { label: string; secondsPerWord: number | null }][]).map(
            ([key, { label, secondsPerWord }]) => (
              <button
                key={key}
                type="button"
                onClick={() => startRound(key)}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:bg-white/10 transition-all"
              >
                <span className="text-xl font-display font-semibold text-white block mb-1">{label}</span>
                <span className="text-slate-400 text-sm">
                  {secondsPerWord === null ? "No timer" : `${secondsPerWord}s per word`}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  if (finished) {
    const total = words.length;
    return (
      <div className="text-center max-w-md mx-auto">
        <h3 className="text-2xl font-display font-semibold text-white mb-4">
          Round complete
        </h3>
        <p className="text-slate-400 text-sm mb-2">{LEVEL_CONFIG[level].label}</p>
        <p className="text-cyan-300 text-xl mb-2">
          {correctCount} / {total} correct
        </p>
        {saving && <p className="text-slate-400 text-sm">Saving progress…</p>}
        {saveError && (
          <p className="text-amber-300 text-sm mt-2">{saveError}</p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={resetToLevelSelect}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 px-6 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors"
          >
            Play again
          </button>
          <Link
            href="/#progress"
            className="bg-white/5 text-cyan-200 px-6 py-3 rounded-lg font-semibold border border-cyan-300/40 hover:bg-white/10 transition-colors text-center"
          >
            View progress
          </Link>
          <Link
            href="/"
            className="bg-white/5 text-cyan-200 px-6 py-3 rounded-lg font-semibold border border-cyan-300/40 hover:bg-white/10 transition-colors text-center"
          >
            Exit game
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <p className="text-slate-400 text-sm">
          Word {index + 1} of {words.length} · {LEVEL_CONFIG[level].label}
        </p>
        {hasTimer && timeLeft !== null && (
          <p
            className={`text-2xl font-bold font-mono tabular-nums ${
              timeLeft <= 5
                ? "text-red-400 animate-pulse"
                : timeLeft <= 10
                  ? "text-amber-300"
                  : "text-cyan-300"
            }`}
          >
            {timeLeft}s
          </p>
        )}
      </div>
      <p className="text-3xl font-display font-semibold text-white mb-4">
        Spell the word you hear.
      </p>
      <button
        type="button"
        onClick={() => {
          const audio = audioRef.current;
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
          } else if (audioSrc) {
            const a = new Audio(audioSrc);
            audioRef.current = a;
            a.play().catch(() => {});
          }
        }}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-300 text-sm transition-colors"
        aria-label="Play word again"
      >
        <span aria-hidden>▶</span>
        Play again
      </button>
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
