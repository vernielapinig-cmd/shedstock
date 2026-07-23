import { createClient } from "@/lib/supabase/server";
import type { Item, HistoryEntry } from "@/types/database";

export async function getItems(): Promise<Item[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("items").select("*").order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getHistory(limit?: number): Promise<HistoryEntry[]> {
  const supabase = await createClient();
  let query = supabase.from("history").select("*").order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCurrentUserFirstName(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "there";

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (profile?.full_name || "there").split(" ")[0];
}