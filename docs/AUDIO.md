# Spelling Bee audio (MP3)

Spelling Bee Mode can play an audio prompt for each word (e.g. “How do you spell cat?”). You provide one MP3 per word.

## Where to put files

Place MP3 files in:

```
public/sounds/
```

(If you already have files in `sounds/` at the project root, move them into `public/sounds/` so the app can serve them at `/sounds/{word}.mp3`.)

## Naming convention

Use the **word** as the filename (lowercase), with `.mp3`:

- Word: `cat` → file: `public/sounds/cat.mp3`
- Word: `sun` → file: `public/sounds/sun.mp3`

The game looks up `/sounds/{word}.mp3` for the current word. If the file is missing, the word is still shown as text and the “Play again” button will try to play (and no-op if the file doesn’t exist). You can add MP3s gradually; only words that have a file will have audio.

## Per-question feedback (optional)

- **perfect.mp3** – Played when the player spells a word correctly (before moving to the next question).
- **failure.mp3** – Played when the answer is wrong or when time runs out (before moving on).

Place in `public/sounds/`. If a file is missing, playback is skipped.

## Round end sounds (optional)

Add these to `public/sounds/` for feedback when a round finishes:

- **success.mp3** – Played when the player gets at least half the words correct.
- **failure.mp3** – Played when the player gets fewer than half correct (same file as per-question wrong).

If either file is missing, the game still works; playback is skipped.

## Word list

Word lists are defined in **lib/words/spelling-bee.ts** per level (easy, medium, hard, parent). Use the same word key in the filename as in the list (e.g. if the word is `"cat"` in the array, the file must be `cat.mp3`).
