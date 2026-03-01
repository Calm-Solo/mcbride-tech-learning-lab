/**
 * Spelling Bee word lists and level config.
 * Edit word arrays per level; secondsPerWord is null for "no timer" (Parent Mode).
 */
export type SpellingBeeLevel = "easy" | "medium" | "hard" | "parent";

export const LEVEL_CONFIG: Record<
  SpellingBeeLevel,
  { label: string; secondsPerWord: number | null }
> = {
  easy: { label: "Easy", secondsPerWord: 30 },
  medium: { label: "Medium", secondsPerWord: 20 },
  hard: { label: "Hard", secondsPerWord: 12 },
  parent: { label: "Parent Mode", secondsPerWord: null },
};

const DEFAULT_WORDS = ["cat", "dog", "run", "sun", "hat"];

export const WORDS_BY_LEVEL: Record<SpellingBeeLevel, string[]> = {
  easy: [...DEFAULT_WORDS],
  medium: [...DEFAULT_WORDS],
  hard: [...DEFAULT_WORDS],
  parent: [...DEFAULT_WORDS],
};

export function getWordsForLevel(level: SpellingBeeLevel): string[] {
  return [...WORDS_BY_LEVEL[level]];
}

export function getSecondsPerWord(level: SpellingBeeLevel): number | null {
  return LEVEL_CONFIG[level].secondsPerWord;
}
