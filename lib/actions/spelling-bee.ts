"use server";

import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

export type SpellingBeeProgressRow = {
  clerk_user_id: string;
  total_rounds: number;
  total_correct: number;
  total_attempts: number;
  total_time_seconds: number;
  last_played_at: string | null;
};

export async function getSpellingBeeProgress(
  clerkUserId: string
): Promise<SpellingBeeProgressRow | null> {
  try {
    const rows = await sql`
      SELECT clerk_user_id, total_rounds, total_correct, total_attempts, total_time_seconds, last_played_at
      FROM spelling_bee_progress
      WHERE clerk_user_id = ${clerkUserId}
      LIMIT 1
    `;
    const row = Array.isArray(rows) ? rows[0] : rows;
    return (row as SpellingBeeProgressRow) ?? null;
  } catch (err) {
    console.error("getSpellingBeeProgress error:", err);
    return null;
  }
}

export type SaveSpellingBeeProgressInput = {
  correct: number;
  total: number;
  timeSeconds: number;
  displayName?: string | null;
};

export type LeaderboardRow = {
  clerk_user_id: string;
  display_name: string | null;
  total_correct: number;
  total_attempts: number;
  score: number;
};

export async function saveSpellingBeeProgress(
  input: SaveSpellingBeeProgressInput
): Promise<{ ok: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "Sign in to save progress." };
  }

  const { correct, total, timeSeconds, displayName } = input;
  if (total < 0 || correct < 0 || correct > total || timeSeconds < 0) {
    return { ok: false, error: "Invalid progress data." };
  }

  try {
    await sql`
      INSERT INTO spelling_bee_progress (clerk_user_id, total_rounds, total_correct, total_attempts, total_time_seconds, last_played_at)
      VALUES (${userId}, 1, ${correct}, ${total}, ${timeSeconds}, NOW())
      ON CONFLICT (clerk_user_id) DO UPDATE SET
        total_rounds = spelling_bee_progress.total_rounds + 1,
        total_correct = spelling_bee_progress.total_correct + ${correct},
        total_attempts = spelling_bee_progress.total_attempts + ${total},
        total_time_seconds = spelling_bee_progress.total_time_seconds + ${timeSeconds},
        last_played_at = NOW()
    `;

    if (typeof displayName !== "undefined") {
      await sql`
        INSERT INTO spelling_bee_weekly (clerk_user_id, week_start, display_name, total_correct, total_attempts)
        VALUES (
          ${userId},
          DATE_TRUNC('week', (NOW() AT TIME ZONE 'America/Los_Angeles'))::DATE,
          ${displayName ?? null},
          ${correct},
          ${total}
        )
        ON CONFLICT (clerk_user_id, week_start) DO UPDATE SET
          display_name   = EXCLUDED.display_name,
          total_correct  = spelling_bee_weekly.total_correct  + EXCLUDED.total_correct,
          total_attempts = spelling_bee_weekly.total_attempts + EXCLUDED.total_attempts
      `;
    }

    return { ok: true };
  } catch (err) {
    console.error("saveSpellingBeeProgress error:", err);
    return { ok: false, error: "Failed to save progress." };
  }
}

export async function getWeeklyLeaderboard(): Promise<LeaderboardRow[]> {
  try {
    const rows = await sql`
      SELECT
        clerk_user_id,
        display_name,
        total_correct,
        total_attempts,
        ROUND(
          ((total_correct::float / NULLIF(total_attempts, 0)) * LN(total_correct + 1))::numeric,
          2
        )::float8 AS score
      FROM spelling_bee_weekly
      WHERE week_start = DATE_TRUNC('week', (NOW() AT TIME ZONE 'America/Los_Angeles'))::DATE
      ORDER BY score DESC
      LIMIT 10
    `;

    const resultRows = (Array.isArray(rows) ? rows : [rows]) as unknown as Array<{
      clerk_user_id: string;
      display_name: string | null;
      total_correct: number;
      total_attempts: number;
      score: number;
    }>;

    return resultRows
      .filter((r) => r && typeof r.clerk_user_id === "string")
      .map((r) => ({
        clerk_user_id: r.clerk_user_id,
        display_name: r.display_name ?? null,
        total_correct: Number(r.total_correct ?? 0),
        total_attempts: Number(r.total_attempts ?? 0),
        score: Number(r.score ?? 0),
      }));
  } catch (err) {
    console.error("getWeeklyLeaderboard error:", err);
    return [];
  }
}
