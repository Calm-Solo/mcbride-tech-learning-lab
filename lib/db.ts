import { neon } from "@neondatabase/serverless";

const raw = process.env.DATABASE_URL?.trim();
if (!raw || (!raw.startsWith("postgresql://") && !raw.startsWith("postgres://"))) {
  throw new Error(
    "DATABASE_URL must be set and must be a PostgreSQL connection string (e.g. postgresql://user:pass@host/db?sslmode=require). Check .env.local and Vercel environment variables."
  );
}

export const sql = neon(raw);
