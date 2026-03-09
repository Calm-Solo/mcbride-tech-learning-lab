# McBride Tech Learning Lab – Project scope and progress (AI agent guide)

This file tracks the scope and current state of the project so AI agents can stay aligned with the codebase and avoid redoing or conflicting work.

---

## Project purpose

**McBride Tech Learning Lab** is a multisensory learning platform that helps children build reading skills through:

- **Spelling Bee Training Mode** – YouTube videos (M.T-5 teaches how to spell); links are configurable in code; no DB tracking.
- **Spelling Bee Mode** – The only game: timed spelling by skill level (Easy, Medium, Hard, Parent Mode). No hints; the word is not shown—players spell from audio only. Optional word prompts and per-question/round-end sounds in `public/sounds/` (see docs/AUDIO.md).
- Immediate feedback and progress tracking for Spelling Bee; progress is stored per user (Neon) and shown on the home page.
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
- **components/Header.tsx** – SignedOut: SignInButton, SignUpButton (modal); SignedIn: UserButton.
- **components/MobileMenu.tsx** – Sign In / Sign Up link to `/auth` (and `/auth?tab=signup`); SignedIn: UserButton.
- **app/auth/page.tsx** – Dedicated `/auth` with tabbed SignIn/SignUp; redirects signed-in users to `/`.

### Database and progress (Neon)

- **lib/db.ts** – Single Neon client export `sql`; validates `DATABASE_URL` (must be `postgresql://` or `postgres://`). Server-side only.
- **scripts/migrations/001_spelling_bee_progress.sql** – Table `spelling_bee_progress` (clerk_user_id, total_rounds, total_correct, total_attempts, total_time_seconds, last_played_at). Run once in Neon SQL Editor.
- **lib/actions/spelling-bee.ts** – Server Actions: `getSpellingBeeProgress(clerkUserId)`, `saveSpellingBeeProgress({ correct, total, timeSeconds })`. Uses `auth()` for userId; parameterized queries only.

### Home page (app/page.tsx)

- Hero with CTA buttons: **Start Free**, **See Games**, and an **Instructions** button that plays `welcome.mp3` so non-readers can hear spoken guidance.
- Games section with two large, tappable image tiles (`images/training-vids.png`, `images/play-now.png`) that link to **Spelling Bee Training Mode** (`/training`) and **Spelling Bee Mode** (`/games/spelling-bee`).
- **Progress section:** If signed in, shows real Spelling Bee stats from Neon (accuracy, day streak placeholder, time spent, rounds played). If signed out, shows “Sign in to track your progress” and placeholders.

### Spelling Bee Training Mode (YouTube)

- **app/training/page.tsx** – Lists YouTube videos from **lib/training-videos.ts** (title + link; opens in new tab). No DB tracking. Add or edit entries in that file.

### Spelling Bee game

- **app/games/spelling-bee/page.tsx** – Game page with Header and Section.
- **components/SpellingBeeGame.tsx** – Client component: level selection (Easy, Medium, Hard, Parent Mode), then per-level word list and per-word timer (Parent Mode = no timer). Word is not displayed—player hears prompt from `public/sounds/{word}.mp3` and “Play again” replays it. Bold, urgent timer (color + pulse when low). Per-question feedback: `perfect.mp3` (correct) and `failure.mp3` (wrong or timeout); advance happens only after the sound ends. Round end: `success.mp3` or `failure.mp3`. Saves via `saveSpellingBeeProgress`; “Round complete” with links to play again / view progress. The game logic has been refactored to avoid stale state and double-advance bugs (see `debug.md` for details).
- **lib/words/spelling-bee.ts** – Word lists per level (`WORDS_BY_LEVEL`) and level config (seconds per word; Parent = no timer). Uses a **separated tier** model:
  - Easy: `EASY_WORDS` – short 3-letter starter words (e.g. `cat`, `dog`, `run`, `sun`, `hat`), 30s/word.
  - Medium: `MEDIUM_WORDS` – current longer words with MP3s (`school`, `learn`, `computer`, `hospital`, `education`), 20s/word.
  - Hard: `HARD_WORDS` – reserved for the most difficult future words (currently empty), 12s/word.
  - Parent Mode: `PARENT_WORDS` – union of Easy + Medium + Hard with no timer.

### Other UI

- **components/AuthPanel.tsx** – Clerk-aware (SignedIn/SignedOut, UserButton). Used where a short auth prompt is needed.
- **components/AnimatedBackground.tsx**, **Section.tsx** – Layout and styling.
- Hero image: **images/mtll-hero.png**.

---

## Environment variables

Required for full functionality (document in SETUP_CLERK.md and/or README; never commit values):

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend (pk_test_ or pk_live_) |
| `CLERK_SECRET_KEY` | Clerk backend (sk_test_ or sk_live_) |
| `CLERK_ENCRYPTION_KEY` | Required when passing secretKey to clerkMiddleware(); 32-byte hex, e.g. `openssl rand -hex 32` |
| `DATABASE_URL` | Neon Postgres connection string (postgresql://...?sslmode=require) |

---

## Key files (for agents)

| Path | Role |
| ---- | ---- |
| **middleware.ts** | Clerk auth; do not add Supabase or other auth here. |
| **app/layout.tsx** | ClerkProvider, fonts, metadata. |
| **app/page.tsx** | Home; async server component; auth() + getSpellingBeeProgress; Progress section and Spelling Bee link. |
| **app/auth/page.tsx** | Clerk SignIn/SignUp tabs; redirect when signed in. |
| **app/games/spelling-bee/page.tsx** | Spelling Bee game wrapper. |
| **app/training/page.tsx** | Spelling Bee Training Mode; lists videos from lib/training-videos.ts. |
| **lib/training-videos.ts** | YouTube video list (title, url); edit to add links. |
| **lib/words/spelling-bee.ts** | Word lists per level and timer config; edit word arrays here. |
| **lib/db.ts** | Neon client only; server-side only. |
| **lib/actions/spelling-bee.ts** | Server Actions for Spelling Bee progress; auth() and parameterized sql. |
| **components/SpellingBeeGame.tsx** | Client component; level select, timer, optional MP3, saveSpellingBeeProgress. |
| **scripts/migrations/001_spelling_bee_progress.sql** | DDL for spelling_bee_progress; run once in Neon. |
| **docs/AUDIO.md** | Spelling Bee audio: word prompts in `public/sounds/`, per-question (perfect.mp3, failure.mp3), round-end (success.mp3, failure.mp3). |

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
- **Protected routes:** Optional; use auth().protect() or clerkMiddleware() + createRouteMatcher if needed.

---

## Conventions for agents

1. **DB access:** Only in Server Components, Route Handlers, or Server Actions. Never import `lib/db` or Neon in Client Components.
2. **Queries:** Use parameterized queries (e.g. `sql\`... WHERE id = ${id}\``). No string concatenation of user input into SQL.
3. **Secrets:** Never commit real keys; document env vars in SETUP_CLERK.md or README with placeholders.
4. **Clerk:** Use `clerkMiddleware()` (not `authMiddleware()`). Imports from `@clerk/nextjs` or `@clerk/nextjs/server`.
5. **Neon:** Use the shared `sql` from `lib/db.ts`; validate DATABASE_URL format in that file only.
