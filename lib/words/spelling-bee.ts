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

// Separated tiers:
// - EASY_WORDS: 3-letter starter words
// - MEDIUM_WORDS: current longer words (new MP3 set)
// - HARD_WORDS: reserved for future hardest words (empty for now)
const EASY_WORDS = ["cat", "dog", "run", "sun", "hat"];
const MEDIUM_WORDS = ["school", "learn", "computer", "hospital", "education"];
const HARD_WORDS: string[] = [];

const PARENT_WORDS = [...EASY_WORDS, ...MEDIUM_WORDS, ...HARD_WORDS];

export const WORDS_BY_LEVEL: Record<SpellingBeeLevel, string[]> = {
  easy: [...EASY_WORDS],
  medium: [...MEDIUM_WORDS],
  hard: [...HARD_WORDS],
  parent: [...PARENT_WORDS],
};

export function getWordsForLevel(level: SpellingBeeLevel): string[] {
  return [...WORDS_BY_LEVEL[level]];
}

export function getSecondsPerWord(level: SpellingBeeLevel): number | null {
  return LEVEL_CONFIG[level].secondsPerWord;
}
