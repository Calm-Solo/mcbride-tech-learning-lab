import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Leaderboard from "@/components/Leaderboard";
import { getWeeklyLeaderboard } from "@/lib/actions/spelling-bee";
import { sql } from "@/lib/db";

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function formatIsoDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return `${MONTH_SHORT[m - 1] ?? "Jan"} ${d}`;
}

function addDaysIso(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d + days);
  return new Date(t).toISOString().slice(0, 10);
}

async function getPacificWeekRangeLabel(): Promise<string> {
  const rows = await sql`
    SELECT DATE_TRUNC('week', (NOW() AT TIME ZONE 'America/Los_Angeles'))::DATE AS week_start
  `;
  const row = Array.isArray(rows) ? rows[0] : rows;
  const raw = (row as { week_start?: unknown } | undefined)?.week_start;
  const weekStart =
    typeof raw === "string"
      ? raw.slice(0, 10)
      : raw instanceof Date
        ? raw.toISOString().slice(0, 10)
        : null;

  if (!weekStart) {
    return "";
  }

  const weekEnd = addDaysIso(weekStart, 6);
  return `${formatIsoDateLabel(weekStart)} – ${formatIsoDateLabel(weekEnd)} (PT)`;
}

export default async function LeaderboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/auth");
  }

  const rows = await getWeeklyLeaderboard();
  const label = await getPacificWeekRangeLabel();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
            This Week&apos;s Top Spellers
          </h1>
          <p className="text-slate-400 mt-2">{label}</p>
        </div>

        <Leaderboard rows={rows} />
      </div>
    </main>
  );
}

