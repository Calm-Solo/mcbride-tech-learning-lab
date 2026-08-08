# McBride Tech Learning Lab – Project scope and progress (AI agent guide)

This file tracks the scope and current state of the project so AI agents can stay aligned with the codebase and avoid redoing or conflicting work.

**Last reviewed:** August 2026

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

- Hero with CTA buttons: **See Games** (primary gradient style) and an **Instructions** button (`components/InstructionsButton.tsx`) that plays `welcome.mp3` on demand. No autoplay on page load.
- Hero image (`images/mtll-hero.png`) in a larger container (`max-w-5xl` within `max-w-6xl` section).
- Games section with two large, tappable image tiles (`images/training-vids.png`, `images/play-now.png`) that link to **Spelling Bee Training Mode** (`/training`) and **Spelling Bee Mode** (`/games/spelling-bee`). Minimal text (“Tap a picture to start.”).
- **Progress section:** If signed in, shows real Spelling Bee stats from Neon (accuracy, day streak placeholder, time spent, rounds played). If signed out, shows “Sign in to track your progress” and placeholders.
- Hero, features, progress, and footer sections still contain substantial on-screen text (see Future scope).

### Spelling Bee Training Mode (YouTube)

- **app/training/page.tsx** – Lists YouTube videos from **lib/training-videos.ts** (title + link; opens in new tab). Glowing **Instructions** button plays `training.mp3` on click (no autoplay). No DB tracking.
- **lib/training-videos.ts** – Currently 8 entries: Introduction, Lesson 1–6, Spelling Test. Add or edit entries in that file as new videos are created.

### Spelling Bee game

- **app/games/spelling-bee/page.tsx** – Game page with Header and Section.
- **components/SpellingBeeGame.tsx** – Client component: level selection (Easy, Medium, Hard, Parent Mode), shuffled word pool, then a random subset per round (`ROUND_SIZE`: 5 for Easy/Medium/Hard, 10 for Parent). Per-level timer (Parent Mode = no timer). Word is not displayed—player hears prompt from `public/sounds/{word}.mp3` and “Play again” replays it. Bold, urgent timer (color + pulse when low). Per-question feedback: `perfect.mp3` (correct), `incorrect.mp3` (wrong answer), `failure.mp3` (timeout); advance happens only after the sound ends. Round end: `success.mp3` or `failure.mp3`. Saves via `saveSpellingBeeProgress` with optional `displayName` from Clerk `useUser()` (`firstName` or `username`); “Round complete” with links to play again / view progress. Game logic uses refs and guard flags to avoid stale state and double-advance bugs (fixes applied in the current component).
- **lib/words/spelling-bee.ts** – Word lists per level (`WORDS_BY_LEVEL`) and level config (seconds per word; Parent = no timer). Uses a **separated tier** model:

| Level | Word array | Timer | Current words |
| ----- | ---------- | ----- | ------------- |
| Easy | `EASY_WORDS` | 30s / word | cat, dog, run, sun, hat (5) |
| Medium | `MEDIUM_WORDS` | 20s / word | school, learn, computer, hospital, education, diploma (6) |
| Hard | `HARD_WORDS` | 12s / word | california, cincinatti, mississippi, pennsylvania, philadelphia, intelligence (6) |
| Parent Mode | `PARENT_WORDS` = Easy + Medium + Hard | No timer | All 17 words |

`PARENT_WORDS` is `[...EASY_WORDS, ...MEDIUM_WORDS, ...HARD_WORDS]` so new tier words are included automatically.

### Audio assets (`public/sounds/`)

**Word prompts (in word lists):** cat, dog, run, sun, hat, school, learn, computer, hospital, education, diploma, california, cincinatti, mississippi, pennsylvania, philadelphia, intelligence.

**Feedback / helper (not word prompts):** perfect.mp3, incorrect.mp3, failure.mp3, success.mp3, welcome.mp3, training.mp3.

**MP3 on disk but not yet in a word list:** dendrites.mp3 — add `"dendrites"` to the appropriate tier in `lib/words/spelling-bee.ts` when ready.

### Weekly leaderboard (Spelling Bee)

- **app/leaderboard/page.tsx** – Async Server Component: `auth()` from `@clerk/nextjs/server`; redirects signed-out users to `/auth`. Navigation is the shared **Header** only (no extra back link — the menu bar is sufficient). Loads rows via `getWeeklyLeaderboard()` and passes them to `Leaderboard`. Subtitle shows the current week’s Monday–Sunday range in Pacific time; the week start is read from Neon with the same `DATE_TRUNC` / `America/Los_Angeles` expression as the leaderboard query so UI and DB stay aligned.
- **components/Leaderboard.tsx** – Client component: ranked list (up to 10), display name with “Anonymous” fallback, correct/attempts, score; highlights first place and the signed-in user’s row (`useUser()`).

### Store (merch)

- **app/store/page.tsx** – Public Server Component (no auth gate) at `/store`; glowing gradient “Store” heading, “Tap a shirt to see it up close.” hint, and a “More merch coming soon!” note. No prices, cart, or checkout yet.
- **components/MerchViewer.tsx** – Client component: renders each shirt's front and back as buttons; tapping one opens a full-screen close-up with a large labelled **Close** button. Backdrop click and Escape also close it, and page scroll is locked while open.
- **lib/merch.ts** – `MERCH_ITEMS` catalog (`MerchItem`: id, name, front, back) using static imports from `images/`: Light Pink (`front-light-pink.png` / `back-light-pink.png`), Lime (`front-lime.png` / `back-lime.png`), Black (`front-black.png` / `black-back.png`). Note the black back file is named `black-back.png`, not `back-black.png`.
- Reachable from **Store** in both `Header` and `MobileMenu` nav.

### Other UI

- **components/AuthPanel.tsx** – Clerk-aware (SignedIn/SignedOut, UserButton). Used where a short auth prompt is needed.
- **components/InstructionsButton.tsx** – On-demand spoken guidance for non-readers (`src` defaults to `welcome.mp3`; optional `glow` for training page / `training.mp3`). No page-load autoplay.
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
| **app/page.tsx**                                     | Home; async server component; auth() + getSpellingBeeProgress; image-based games entry; on-demand Instructions.                     |
| **app/auth/page.tsx**                                | Clerk SignIn/SignUp tabs; redirect when signed in.                                                                                   |
| **app/games/spelling-bee/page.tsx**                  | Spelling Bee game wrapper.                                                                                                           |
| **app/training/page.tsx**                            | Spelling Bee Training Mode; lists videos from lib/training-videos.ts; glowing Instructions (training.mp3).                           |
| **lib/training-videos.ts**                           | YouTube video list (title, url); edit to add links.                                                                                  |
| **lib/words/spelling-bee.ts**                        | Word lists per level, ROUND_SIZE, and timer config; edit word arrays here.                                                           |
| **lib/db.ts**                                        | Neon client only; server-side only.                                                                                                  |
| **lib/actions/spelling-bee.ts**                      | Server Actions for Spelling Bee progress and weekly leaderboard; auth() on save; getWeeklyLeaderboard(); parameterized sql.          |
| **components/SpellingBeeGame.tsx**                   | Client component; level select, shuffle + subset rounds, timer, MP3 prompts/feedback, saveSpellingBeeProgress (+ displayName).     |
| **components/InstructionsButton.tsx**                | On-demand helper audio (`src`, optional `glow`); home uses welcome.mp3, training uses training.mp3.                                  |
| **scripts/migrations/001_spelling_bee_progress.sql** | DDL for spelling_bee_progress; run once in Neon.                                                                                     |
| **scripts/migrations/002_leaderboard.sql**           | DDL for weekly leaderboard (`spelling_bee_weekly`) + optional display_name on progress; run once in Neon after 001.                  |
| **app/leaderboard/page.tsx**                         | Protected leaderboard page; Header only for nav; auth redirect; loads top weekly rows.                                               |
| **components/Leaderboard.tsx**                       | Client UI for weekly top spellers list.                                                                                              |
| **app/store/page.tsx**                               | Public merch page; glowing heading; renders MerchViewer; no checkout yet.                                                             |
| **components/MerchViewer.tsx**                       | Client component; front/back shirt buttons plus close-up overlay with Close button, backdrop click, and Escape.                       |
| **lib/merch.ts**                                     | MERCH_ITEMS catalog with static image imports; replace with Printify data when the API is wired.                                     |
| **docs/AUDIO.md**                                    | Spelling Bee audio: word prompts, feedback sounds, on-demand welcome/training helper audio.                                          |
| **debug.md**                                         | Current UX task notes from the owner (not historical SpellingBeeGame bug write-ups).                                                 |

---

## Out of scope / removed

- **Supabase** – Removed (auth and DB). Auth is Clerk; DB is Neon.
- **Email/password auth** – Not used; Clerk handles sign-in/sign-up (e.g. Google OAuth, Clerk-hosted UI).
- **Local-only auth** – Not used; rely on Clerk (and optionally OAuth).
- **Word Builder, Letter Match, Sentence Builder** – Removed from the app; only Spelling Bee (game) and Spelling Bee Training Mode (videos) remain.

---

## Completed work (recent)

- **SpellingBeeGame stability** – Ref-based advancement, `advancingRef` guard, single `advanceQuestion` / `playThenAdvance` path (applied in component).
- **Separated difficulty tiers** – Easy / Medium / Hard use distinct word pools; Parent Mode uses the union. Difficulty scales by word length/complexity and shorter timers on higher tiers.
- **Medium tier MP3s** – school, learn, computer, hospital, education wired and live.
- **Hard tier MP3s** – california, cincinatti, mississippi, pennsylvania, philadelphia wired and live.
- **New words (May 2026)** – diploma (Medium), intelligence (Hard); MP3s in `public/sounds/`.
- **Non-reader audio (on-demand)** – `welcome.mp3` via homepage Instructions; `training.mp3` via glowing Instructions on `/training`. Page-load autoplay removed (WelcomeAudio / TrainingIntroAudio deleted) to prevent overlapping sounds.
- **Homepage hero UX** – Removed non-functional Start Free; See Games is primary CTA; larger hero image.
- **Leaderboard navigation** – Shared Header provides the way out of `/leaderboard`; the extra Back to home link was removed as redundant.
- **Homepage games UX** – `play-now.png` and `training-vids.png` as primary tappable entry points with minimal text.
- **Training videos** – 8 YouTube links in lib/training-videos.ts.
- **Store page (view-only)** – `/store` with pink, lime, and black shirts (front and back), linked from Header and MobileMenu.

---

## Future scope (not yet implemented)

- **Clerk production:** Switch to production keys and add production domain in Clerk Dashboard when going live.
- **More words and videos:** Owner will add MP3s to `public/sounds/` and entries to word lists / training-videos.ts over time. Wire orphan files (e.g. dendrites.mp3) when ready.
- **Homepage simplification for non-readers:** Games section is image-first; hero, features, progress, and footer still have a lot of text. Goal is to reduce further so pre-readers can focus on training and playing.
- **Progress for other games:** Schema and actions only exist for Spelling Bee; extend pattern if more games are added later.
- **Day streak / mastery badges:** Progress section shows hardcoded placeholder `7` for day streak. Real streak logic requires storing `last_played_at` per day in Neon and computing consecutive days in `getSpellingBeeProgress`.
- **Per-word extra seconds:** Optional `perWordExtraSeconds: Record<string, number>` on level config for very long words (e.g. +5s for encyclopedia). Not implemented.
- **Audio validation script:** Node script to cross-check `WORDS_BY_LEVEL` against `public/sounds/` and report missing MP3s; useful as a pre-deploy check as word lists grow.
- **Printify product sync:** `/store` currently renders the hardcoded `MERCH_ITEMS` in `lib/merch.ts`. Replace with Printify product data (personal access token → `PRINTIFY_API_TOKEN`, server-side only) once the shop is set up. See https://developers.printify.com/#create-a-personal-access-token.
- **Store checkout (Stripe):** No prices, cart, or payment flow yet. Blocked on the owner's Mercury bank and Stripe setup; add product prices, variants/sizes, and checkout after that is complete.
- **Additional route protection:** Beyond `/leaderboard` (gated in the page with `auth()` + `redirect("/auth")`; no middleware changes), optional patterns for other routes include `auth().protect()` or `clerkMiddleware()` + `createRouteMatcher` if needed.

---

## Conventions for agents

1. **DB access:** Only in Server Components, Route Handlers, or Server Actions. Never import `lib/db` or Neon in Client Components.
2. **Queries:** Use parameterized queries (e.g. `` sql`... WHERE id = ${id}` ``). No string concatenation of user input into SQL.
3. **Secrets:** Never commit real keys; document env vars in SETUP_CLERK.md or README with placeholders.
4. **Clerk:** Use `clerkMiddleware()` (not `authMiddleware()`). Imports from `@clerk/nextjs` or `@clerk/nextjs/server`.
5. **Neon:** Use the shared `sql` from `lib/db.ts`; validate DATABASE_URL format in that file only.
6. **Adding a spelling word:** (1) Add `{word}.mp3` to `public/sounds/`, (2) add the lowercase word string to the correct array in `lib/words/spelling-bee.ts`. Parent Mode picks it up automatically via `PARENT_WORDS`.
7. **SpellingBeeGame.tsx** is a Client Component (`'use client'`). Keep all server logic in `lib/actions/spelling-bee.ts`.

---

## Word-list design notes (for agents)

**Why separated tiers (not cumulative Easy ⊂ Medium ⊂ Hard):**

- Cumulative rounds mix 3-letter words with multi-syllable words, creating jarring difficulty spikes within a single round for child learners.
- Parent Mode already provides the cumulative full-vocabulary experience.
- Each level has consistent difficulty that matches its timer setting.

**Round sampling:** Each round shuffles the level’s pool and takes `ROUND_SIZE[level]` words (capped by pool length). As lists grow past ~10 words, subset sampling keeps rounds short without code changes beyond `ROUND_SIZE`.
