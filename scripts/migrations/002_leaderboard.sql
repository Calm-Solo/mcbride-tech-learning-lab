-- Run once in Neon SQL Editor after 001_spelling_bee_progress.sql

ALTER TABLE spelling_bee_progress
  ADD COLUMN IF NOT EXISTS display_name TEXT;

CREATE TABLE IF NOT EXISTS spelling_bee_weekly (
  clerk_user_id  TEXT        NOT NULL,
  week_start     DATE        NOT NULL,
  display_name   TEXT,
  total_correct  INTEGER     NOT NULL DEFAULT 0,
  total_attempts INTEGER     NOT NULL DEFAULT 0,
  PRIMARY KEY (clerk_user_id, week_start)
);

-- week_start is computed as the Monday of the current week in Pacific time:
-- DATE_TRUNC('week', (NOW() AT TIME ZONE 'America/Los_Angeles'))::DATE
