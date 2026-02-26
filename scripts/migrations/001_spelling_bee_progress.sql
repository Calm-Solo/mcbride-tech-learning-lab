-- Run once in Neon SQL Editor to create the Spelling Bee progress table.
-- One row per user (Clerk user id).

CREATE TABLE IF NOT EXISTS spelling_bee_progress (
  clerk_user_id TEXT PRIMARY KEY,
  total_rounds INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  total_time_seconds INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMPTZ
);
