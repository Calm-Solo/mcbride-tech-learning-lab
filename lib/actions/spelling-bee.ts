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
};

export async function saveSpellingBeeProgress(
  input: SaveSpellingBeeProgressInput
): Promise<{ ok: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "Sign in to save progress." };
  }

  const { correct, total, timeSeconds } = input;
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
    return { ok: true };
  } catch (err) {
    console.error("saveSpellingBeeProgress error:", err);
    return { ok: false, error: "Failed to save progress." };
  }
}
