import { createServerSupabaseClient } from "./server";

export async function fetchSingleRow<T>(
  table: string,
  match: Record<string, string | number>
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from(table).select("*").match(match).single();

  if (error) {
    throw error;
  }

  return data as T;
}
