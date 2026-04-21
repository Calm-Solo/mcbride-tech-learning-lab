"use client";

import { useUser } from "@clerk/nextjs";
import type { LeaderboardRow } from "@/lib/actions/spelling-bee";

export default function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  const { user } = useUser();
  const currentUserId = user?.id ?? null;

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 text-slate-200">
        <p className="text-slate-300">No games played this week yet — be the first!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden">
      <ol className="divide-y divide-white/10">
        {rows.map((row, idx) => {
          const rank = idx + 1;
          const isTop = rank === 1;
          const isMe = currentUserId !== null && row.clerk_user_id === currentUserId;

          return (
            <li
              key={`${row.clerk_user_id}-${rank}`}
              className={[
                "flex items-center gap-4 p-4 sm:p-5",
                isTop ? "bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent" : "",
                isMe ? "ring-1 ring-cyan-400/40" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className={[
                  "w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold",
                  isTop
                    ? "bg-amber-400/15 text-amber-200 border border-amber-300/30"
                    : "bg-white/5 text-slate-200 border border-white/10",
                ].join(" ")}
              >
                {rank}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold truncate">
                    {row.display_name ?? "Anonymous"}
                  </p>
                  {isMe && (
                    <span className="text-xs text-cyan-200 bg-cyan-500/10 border border-cyan-300/30 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">
                  {row.total_correct} / {row.total_attempts}
                </p>
              </div>

              <div className="text-right">
                <p className={isTop ? "text-amber-200 font-bold" : "text-cyan-300 font-semibold"}>
                  {row.score.toFixed(2)}
                </p>
                <p className="text-slate-500 text-xs">score</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

