"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use refs for values needed inside async audio callbacks to avoid stale closures
  const indexRef = useRef(0);
  indexRef.current = index;
  const correctCountRef = useRef(0);
  correctCountRef.current = correctCount;
  const wordsRef = useRef<string[]>([]);
  wordsRef.current = words;
  const startTimeRef = useRef(0);
  startTimeRef.current = startTime;
  const secondsPerWordRef = useRef<number | null>(null);
  secondsPerWordRef.current = secondsPerWord;

  // Guard refs
  const timeoutHandledRef = useRef(false);
  const roundEndSoundPlayedRef = useRef(false);
  // Prevents double-advance if both "ended" and submit fire
  const advancingRef = useRef(false);

  const word = words[index];
  const audioSrc = word ? `/sounds/${word}.mp3` : null;
  const hasTimer = secondsPerWord !== null;

  // ─── Advance to next question or finish round ────────────────────────────
  // Uses refs so it's always fresh inside audio callbacks
  const advanceQuestion = useCallback(
    (overrideCorrect?: number) => {
      if (advancingRef.current) return;
      advancingRef.current = true;

      const currentIndex = indexRef.current;
      const currentWords = wordsRef.current;
      const currentCorrect = overrideCorrect ?? correctCountRef.current;
      const isLastWord = currentIndex === currentWords.length - 1;
      const totalSoFar = currentIndex + 1;

      if (isLastWord) {
        setCorrectCount(currentCorrect);
        setFinished(true);
        setSaving(true);
        setSaveError(null);
        const timeSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
        saveSpellingBeeProgress({
          correct: currentCorrect,
          total: totalSoFar,
          timeSeconds,
        }).then((result) => {
          setSaving(false);
          if (!result.ok) setSaveError(result.error ?? "Failed to save.");
        });
      } else {
        setCorrectCount(currentCorrect);
        setIndex(currentIndex + 1);
        setInput("");
        // Reset advance guard for next question
        advancingRef.current = false;
      }
    },
    [] // stable — reads everything from refs
  );

  // ─── Play a one-shot sound then call a callback ──────────────────────────
  const playThenAdvance = useCallback(
    (src: string, overrideCorrect?: number) => {
      // Stop any current word-prompt audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(src);
      audio.play().catch(() => advanceQuestion(overrideCorrect));
      audio.addEventListener("ended", () => advanceQuestion(overrideCorrect), { once: true });
      audio.addEventListener("error", () => advanceQuestion(overrideCorrect), { once: true });
    },
    [advanceQuestion]
  );

  // ─── Start / reset ───────────────────────────────────────────────────────
  function startRound(selectedLevel: SpellingBeeLevel) {
    roundEndSoundPlayedRef.current = false;
    advancingRef.current = false;
    timeoutHandledRef.current = false;
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    roundEndSoundPlayedRef.current = false;
    advancingRef.current = false;
    timeoutHandledRef.current = false;
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

  // ─── Focus input on question change ─────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
  }, [index, level]);

  // ─── Play word audio prompt ──────────────────────────────────────────────
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

  // ─── Round-end sound ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!finished || words.length === 0 || roundEndSoundPlayedRef.current) return;
    roundEndSoundPlayedRef.current = true;
    const passed = correctCount >= words.length / 2;
    const snd = new Audio(passed ? "/sounds/success.mp3" : "/sounds/failure.mp3");
    snd.play().catch(() => {});
  }, [finished, correctCount, words.length]);

  // ─── Reset per-question guards when index changes ────────────────────────
  useEffect(() => {
    timeoutHandledRef.current = false;
    // advancingRef is reset inside advanceQuestion for non-last words,
    // and by startRound/resetToLevelSelect for round boundaries.
  }, [index]);

  // ─── Countdown timer ─────────────────────────────────────────────────────
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

  // ─── Handle timeout (timeLeft === 0) ────────────────────────────────────
  useEffect(() => {
    if (timeLeft !== 0 || !word || timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;
    // correctCount is NOT incremented on timeout (wrong answer)
    playThenAdvance("/sounds/failure.mp3", correctCountRef.current);
  }, [timeLeft, word, playThenAdvance]);

  // ─── Submit handler ──────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (advancingRef.current) return; // already advancing (e.g. timeout fired)

    const trimmed = input.trim().toLowerCase();
    const isCorrect = trimmed === word;
    const newCorrect = correctCountRef.current + (isCorrect ? 1 : 0);
    const feedbackSrc = isCorrect ? "/sounds/perfect.mp3" : "/sounds/incorrect.mp3";
    playThenAdvance(feedbackSrc, newCorrect);
  }

  // ─── Render: level select ────────────────────────────────────────────────
  if (level === null) {
    return (
      <div className="max-w-md mx-auto">
        <p className="text-slate-300 mb-6">
          Choose a skill level. Timer per word varies by level; Parent Mode has no timer.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {(
            Object.entries(LEVEL_CONFIG) as [
              SpellingBeeLevel,
              { label: string; secondsPerWord: number | null },
            ][]
          ).map(([key, { label, secondsPerWord }]) => (
            <button
              key={key}
              type="button"
              onClick={() => startRound(key)}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:bg-white/10 transition-all"
            >
              <span className="text-xl font-display font-semibold text-white block mb-1">
                {label}
              </span>
              <span className="text-slate-400 text-sm">
                {secondsPerWord === null ? "No timer" : `${secondsPerWord}s per word`}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Render: round complete ──────────────────────────────────────────────
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
        {saveError && <p className="text-amber-300 text-sm mt-2">{saveError}</p>}
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

  // ─── Render: active question ─────────────────────────────────────────────
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
          {index === words.length - 1 ? "Finish round" : "Next"}
        </button>
      </form>
    </div>
  );
}
