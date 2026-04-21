# McBride Tech Learning Lab – Project scope and progress (AI agent guide)

This file tracks the scope and current state of the project so AI agents can stay aligned with the codebase and avoid redoing or conflicting work.

---

## Project purpose

**McBride Tech Learning Lab** is a multisensory learning platform that helps children build reading skills through:

- **Spelling Bee Training Mode** – YouTube videos (M.T-5 teaches how to spell); links are configurable in code; no DB tracking.
- **Spelling Bee Mode** – The only game: timed spelling by skill level (Easy, Medium, Hard, Parent Mode). No hints; the word is not shown—players spell from audio only. Optional word prompts and per-question/round-end sounds in `public/sounds/` (see docs/AUDIO.md).
- Immediate feedback and progress tracking for Spelling Bee; progress is stored per user (Neon) and shown on the home page.
- **Weekly leaderboard (Spelling Bee)** – Top players for the current calendar week (Pacific: `America/Los_Angeles`) on `/leaderboard`; display names are stored at save time so leaderboard reads do not call Clerk’s backend user API.
- Accessibility-focused design (dyslexia-friendly fonts, audio feedback, high contrast, mobile-first).

Word lists, MP3 audio files, and YouTube video links are provided by you and configured in the repo (see lib/words/spelling-bee.ts, lib/training-videos.ts, and docs/AUDIO.md).

---

## Tech stack

- **Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Auth:** Clerk (`@clerk/nextjs`) – sign-in, sign-up, session, UserButton. No Supabase auth (removed after persistent OAuth issues).
- **Database:** Neon Serverless Postgres (`@neondatabase/serverless`) – server-side only. Used for game progress (e.g. Spelling Bee).
- **Hosting:** Vercel (env vars set in project settings)

---

## What is implemented

### Authentication (Clerk)

- **middleware.ts** – `clerkMiddleware()` with explicit `publishableKey` and `secretKey` from env. Requires `CLERK_ENCRYPTION_KEY` when using dynamic keys (generate with `openssl rand -hex 32`).
- **app/layout.tsx** – `ClerkProvider` with `publishableKey` from env.
- **components/Header.tsx** – SignedOut: SignInButton, SignUpButton (modal); SignedIn: UserButton. Nav includes **Leaderboard** → `/leaderboard` (page redirects signed-out users to `/auth`).
- **components/MobileMenu.tsx** – Sign In / Sign Up link to `/auth` (and `/auth?tab=signup`); SignedIn: UserButton. Nav includes **Leaderboard** → `/leaderboard`.
- **app/auth/page.tsx** – Dedicated `/auth` with tabbed SignIn/SignUp; redirects signed-in users to `/`.

### Database and progress (Neon)

- **lib/db.ts** – Single Neon client export `sql`; validates `DATABASE_URL` (must be `postgresql://` or `postgres://`). Server-side only.
- **scripts/migrations/001_spelling_bee_progress.sql** – Table `spelling_bee_progress` (clerk_user_id, total_rounds, total_correct, total_attempts, total_time_seconds, last_played_at). Run once in Neon SQL Editor.
- **scripts/migrations/002_leaderboard.sql** – Adds optional `display_name` on `spelling_bee_progress` and creates `spelling_bee_weekly` (one row per user per week): `week_start` (Monday in Pacific time), `display_name`, `total_correct`, `total_attempts`. Week boundary in SQL matches `DATE_TRUNC('week', (NOW() AT TIME ZONE 'America/Los_Angeles'))::DATE`. Run once in Neon SQL Editor after `001_spelling_bee_progress.sql`.
- **lib/actions/spelling-bee.ts** – Server Actions: `getSpellingBeeProgress(clerkUserId)`, `saveSpellingBeeProgress({ correct, total, timeSeconds, displayName? })`, `getWeeklyLeaderboard()`. Saving still upserts cumulative `spelling_bee_progress` as before; when `displayName` is present on the input (including `null`), it also upserts into `spelling_bee_weekly` for the current Pacific week, adding correct/attempts on conflict. `getWeeklyLeaderboard()` returns the top 10 rows for the current week ordered by a combined score (accuracy × volume). Uses `auth()` on save; parameterized queries only.

### Home page (app/page.tsx)

- Hero with CTA buttons: **Start Free**, **See Games**, and an **Instructions** button that plays `welcome.mp3` so non-readers can hear spoken guidance.
- Games section with two large, tappable image tiles (`images/training-vids.png`, `images/play-now.png`) that link to **Spelling Bee Training Mode** (`/training`) and **Spelling Bee Mode** (`/games/spelling-bee`).
- **Progress section:** If signed in, shows real Spelling Bee stats from Neon (accuracy, day streak placeholder, time spent, rounds played). If signed out, shows “Sign in to track your progress” and placeholders.

### Spelling Bee Training Mode (YouTube)

- **app/training/page.tsx** – Lists YouTube videos from **lib/training-videos.ts** (title + link; opens in new tab). No DB tracking. Add or edit entries in that file.

### Spelling Bee game

- **app/games/spelling-bee/page.tsx** – Game page with Header and Section.
- **components/SpellingBeeGame.tsx** – Client component: level selection (Easy, Medium, Hard, Parent Mode), then per-level word list and per-word timer (Parent Mode = no timer). Word is not displayed—player hears prompt from `public/sounds/{word}.mp3` and “Play again” replays it. Bold, urgent timer (color + pulse when low). Per-question feedback: `perfect.mp3` (correct) and `failure.mp3` (wrong or timeout); advance happens only after the sound ends. Round end: `success.mp3` or `failure.mp3`. Saves via `saveSpellingBeeProgress` with optional `displayName` from Clerk `useUser()` (`firstName` or `username`); “Round complete” with links to play again / view progress. The game logic has been refactored to avoid stale state and double-advance bugs (see `debug.md` for details).
- **lib/words/spelling-bee.ts** – Word lists per level (`WORDS_BY_LEVEL`) and level config (seconds per word; Parent = no timer). Uses a **separated tier** model:
  - Easy: `EASY_WORDS` – short 3-letter starter words (e.g. `cat`, `dog`, `run`, `sun`, `hat`), 30s/word.
  - Medium: `MEDIUM_WORDS` – current longer words with MP3s (`school`, `learn`, `computer`, `hospital`, `education`), 20s/word.
  - Hard: `HARD_WORDS` – reserved for the most difficult future words (currently empty), 12s/word.
  - Parent Mode: `PARENT_WORDS` – union of Easy + Medium + Hard with no timer.

### Weekly leaderboard (Spelling Bee)

- **app/leaderboard/page.tsx** – Async Server Component: `auth()` from `@clerk/nextjs/server`; redirects signed-out users to `/auth`. Loads rows via `getWeeklyLeaderboard()` and passes them to `Leaderboard`. Subtitle shows the current week’s Monday–Sunday range in Pacific time; the week start is read from Neon with the same `DATE_TRUNC` / `America/Los_Angeles` expression as the leaderboard query so UI and DB stay aligned.
- **components/Leaderboard.tsx** – Client component: ranked list (up to 10), display name with “Anonymous” fallback, correct/attempts, score; highlights first place and the signed-in user’s row (`useUser()`).

### Other UI

- **components/AuthPanel.tsx** – Clerk-aware (SignedIn/SignedOut, UserButton). Used where a short auth prompt is needed.
- **components/AnimatedBackground.tsx**, **Section.tsx** – Layout and styling.
- Hero image: **images/mtll-hero.png**.

---

## Environment variables

Required for full functionality (document in SETUP_CLERK.md and/or README; never commit values):


| Variable                            | Purpose                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend (pk_test_ or pk_live_)                                                          |
| `CLERK_SECRET_KEY`                  | Clerk backend (sk_test_ or sk_live_)                                                           |
| `CLERK_ENCRYPTION_KEY`              | Required when passing secretKey to clerkMiddleware(); 32-byte hex, e.g. `openssl rand -hex 32` |
| `DATABASE_URL`                      | Neon Postgres connection string (postgresql://...?sslmode=require)                             |


---

## Key files (for agents)


| Path                                                 | Role                                                                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **middleware.ts**                                    | Clerk auth; do not add Supabase or other auth here.                                                                                  |
| **app/layout.tsx**                                   | ClerkProvider, fonts, metadata.                                                                                                      |
| **app/page.tsx**                                     | Home; async server component; auth() + getSpellingBeeProgress; Progress section and Spelling Bee link.                               |
| **app/auth/page.tsx**                                | Clerk SignIn/SignUp tabs; redirect when signed in.                                                                                   |
| **app/games/spelling-bee/page.tsx**                  | Spelling Bee game wrapper.                                                                                                           |
| **app/training/page.tsx**                            | Spelling Bee Training Mode; lists videos from lib/training-videos.ts.                                                                |
| **lib/training-videos.ts**                           | YouTube video list (title, url); edit to add links.                                                                                  |
| **lib/words/spelling-bee.ts**                        | Word lists per level and timer config; edit word arrays here.                                                                        |
| **lib/db.ts**                                        | Neon client only; server-side only.                                                                                                  |
| **lib/actions/spelling-bee.ts**                      | Server Actions for Spelling Bee progress and weekly leaderboard; auth() on save; getWeeklyLeaderboard(); parameterized sql.          |
| **components/SpellingBeeGame.tsx**                   | Client component; level select, timer, optional MP3, saveSpellingBeeProgress (+ displayName from useUser).                           |
| **scripts/migrations/001_spelling_bee_progress.sql** | DDL for spelling_bee_progress; run once in Neon.                                                                                     |
| **scripts/migrations/002_leaderboard.sql**         | DDL for weekly leaderboard (`spelling_bee_weekly`) + optional display_name on progress; run once in Neon after 001.                  |
| **app/leaderboard/page.tsx**                         | Protected leaderboard page; auth redirect; loads top weekly rows.                                                                    |
| **components/Leaderboard.tsx**                       | Client UI for weekly top spellers list.                                                                                              |
| **docs/AUDIO.md**                                    | Spelling Bee audio: word prompts in `public/sounds/`, per-question (perfect.mp3, failure.mp3), round-end (success.mp3, failure.mp3). |


---

## Out of scope / removed

- **Supabase** – Removed (auth and DB). Auth is Clerk; DB is Neon.
- **Email/password auth** – Not used; Clerk handles sign-in/sign-up (e.g. Google OAuth, Clerk-hosted UI).
- **Local-only auth** – Not used; rely on Clerk (and optionally OAuth).

---

## Future scope (not yet implemented)

- **Clerk production:** Switch to production keys and add production domain in Clerk Dashboard when going live.
- **Word Builder, Letter Match, Sentence Builder:** Removed from the app; only Spelling Bee (game) and Spelling Bee Training Mode (videos) remain.
- **Progress for other games:** Schema and actions only exist for Spelling Bee; extend pattern if more games are added later.
- **Day streak / mastery badges:** Progress section shows placeholders; logic not implemented.
- **Additional route protection:** Beyond `/leaderboard` (gated in the page with `auth()` + `redirect("/auth")`; no middleware changes), optional patterns for other routes include `auth().protect()` or `clerkMiddleware()` + `createRouteMatcher` if needed.

---

## Conventions for agents

1. **DB access:** Only in Server Components, Route Handlers, or Server Actions. Never import `lib/db` or Neon in Client Components.
2. **Queries:** Use parameterized queries (e.g. `sql\`... WHERE id = ${id}`). No string concatenation of user input into SQL.
3. **Secrets:** Never commit real keys; document env vars in SETUP_CLERK.md or README with placeholders.
4. **Clerk:** Use `clerkMiddleware()` (not `authMiddleware()`). Imports from `@clerk/nextjs` or `@clerk/nextjs/server`.
5. **Neon:** Use the shared `sql` from `lib/db.ts`; validate DATABASE_URL format in that file only.

## Debug

1. Bug Fixes — SpellingBeeGame.tsx

Three compounding bugs caused the game to break on question 4 of 5. All three are fixed in the replacement file. Apply this file in full; do not patch incrementally.

Bug 1 — Stale correctCount in handleSubmit
Root cause
newCorrect was computed from the correctCount React state variable inside an async audio callback (advance()). By question 4, prior async callbacks may not have resolved yet, so correctCount reads an outdated value and the score is wrong.
Fix
Read from correctCountRef.current (a ref that mirrors state) inside all async callbacks. Refs are always current regardless of closure timing.
File / line
components/SpellingBeeGame.tsx — handleSubmit function

Bug 2 — No guard against double-advance
Root cause
Both the timeout handler (timeLeft === 0 effect) and handleSubmit could call advance() on the same question simultaneously — for example if the user submits at the exact moment the timer hits 0. This caused duplicate state updates and unpredictable skips.
Fix
Added a single advancingRef boolean flag. The first path to call advanceQuestion() sets it to true; all subsequent calls for the same question are no-ops. The flag is reset for the next question inside advanceQuestion (non-last words) and by startRound / resetToLevelSelect at round boundaries.
File / line
components/SpellingBeeGame.tsx — advancingRef, advanceQuestion()

Bug 3 — Duplicate advance logic with inconsistent state access
Root cause
The original component had two separate inline advance() closures: one inside the timeout useEffect and one inside handleSubmit. Each captured different combinations of stale state (isLast, index, correctCount, startTime), making them diverge by question 4.
Fix
Consolidated all advancement into a single advanceQuestion(overrideCorrect?) function backed entirely by refs (indexRef, wordsRef, startTimeRef, correctCountRef). A playThenAdvance(src, correct) helper wraps audio playback and calls advanceQuestion on ended/error. Both the timeout path and the submit path call playThenAdvance, so they always share the same logic and the same ref-based values.
File / line
components/SpellingBeeGame.tsx — advanceQuestion(), playThenAdvance()

Action required
Replace components/SpellingBeeGame.tsx with the fixed file. No other files need to change for this fix.
•	Do NOT partially merge — the fix is a full replacement of the component
•	The public API (props, exports) is unchanged; no callers need updating
•	The UI and all styling are pixel-identical to the original

1. Word-List Architecture — lib/words/spelling-bee.ts

The word list has been refactored to support separated difficulty tiers. This is a non-breaking change to the same file; the exported function signatures (getWordsForLevel, getSecondsPerWord, LEVEL_CONFIG, WORDS_BY_LEVEL) are identical.

Difficulty model — separated tiers
Level	Word array	Timer	Example words
Easy	EASY_WORDS only	30s / word	cat, dog, run, sun, hat
Medium	MEDIUM_WORDS only	20s / word	school, learn, computer, hospital, education
Hard	HARD_WORDS only	12s / word	(empty — add when MP3s are ready)
Parent Mode	EASY + MEDIUM + HARD	No timer	Full vocabulary

Why separated (not cumulative)
The original plan proposed cumulative tiers (Easy ⊂ Medium ⊂ Hard). Separated tiers were chosen instead because:
•	Cumulative rounds mix 3-letter words with multi-syllable words, creating jarring difficulty spikes within a single round for child learners
•	Parent Mode already provides the cumulative full-vocabulary experience
•	Each level now has a consistent, predictable difficulty that matches its timer setting

PARENT_WORDS stays in sync automatically
PARENT_WORDS is defined as [...EASY_WORDS, ...MEDIUM_WORDS, ...HARD_WORDS]. Any word added to any tier array is automatically included in Parent Mode with no additional changes required.

Action required before deploying
•	Ensure these MP3 files exist in public/sounds/ before enabling Medium:
◦	school.mp3
◦	learn.mp3
◦	computer.mp3
◦	hospital.mp3
◦	education.mp3
•	HARD_WORDS is intentionally empty. Add words and matching MP3s to expand Hard mode over time.
•	Replace lib/words/spelling-bee.ts with the new file. Exported function signatures are unchanged.

1. Future Scope (documented, not implemented)

Per-word extra seconds
If very long words need extra timer time (e.g. +5s for 'encyclopedia'), add an optional perWordExtraSeconds: Record<string, number> map to LEVEL_CONFIG and apply it in SpellingBeeGame.tsx. Not implemented yet; document in a comment when ready.

Round length
Currently all levels play the full word array each round (5 words). As word sets grow past ~10 words, consider randomizing a subset per round or adding a configurable WORDS_PER_ROUND constant to LEVEL_CONFIG. Easy to add without changing the component's public API.

Audio validation script
A Node.js script that cross-checks every word in WORDS_BY_LEVEL against files in public/sounds/ and reports any missing MP3s. Recommended to run as a pre-deploy check once Hard words are being added regularly.

Day streak / mastery badges
Progress section on the home page shows a hardcoded placeholder of 7 for day streak. Real streak logic requires storing last_played_at per day in Neon and computing the consecutive-day count in getSpellingBeeProgress. Not implemented; extend the server action and home page progress section when ready.

1. Recommended Deployment Order

Deploy in this order to avoid user-facing breakage:

Step	Action	Notes
1	Deploy SpellingBeeGame.tsx fix	Fixes the question-4 bug immediately. No word list or audio changes needed.
2	Add 5 Medium MP3s to public/sounds/	school, learn, computer, hospital, education. Required before step 3.
3	Deploy spelling-bee.ts update	Activates Medium tier. Verify each mode plays correct words and audio in staging first.
4	Smoke-test all 4 modes on live site	Easy (3-letter only), Medium (medium words only), Hard (empty = 0 words, handle gracefully), Parent (all words).
5	Add Hard words + MP3s over time	Append to HARD_WORDS array; no other changes needed.

1. Agent Conventions Reminder

These apply to all future work on this codebase per progress.md:
•	DB access only in Server Components, Route Handlers, or Server Actions. Never import lib/db in Client Components.
•	All SQL queries must use parameterized form (sql`... WHERE id = ${id}`). No string concatenation of user input.
•	Auth is Clerk only. Use clerkMiddleware() (not authMiddleware()). Imports from @clerk/nextjs or @clerk/nextjs/server.
•	Neon: use the shared sql export from lib/db.ts only. DATABASE_URL is validated there.
•	Never commit real keys. Document env vars with placeholders in SETUP_CLERK.md or README.
•	SpellingBeeGame.tsx is a Client Component ('use client'). Keep all server logic in lib/actions/spelling-bee.ts.