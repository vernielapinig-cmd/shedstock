"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ItemStatus } from "@/types/database";

async function getCurrentProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");
  return { supabase, userId: user.id, fullName: profile.full_name };
}

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/inventory");
  revalidatePath("/locations");
  revalidatePath("/history");
}

export interface ItemInput {
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: ItemStatus;
  notes: string;
}

export async function addItem(input: ItemInput) {
  const { supabase, userId, fullName } = await getCurrentProfile();

  if (!input.name.trim() || !input.location.trim()) {
    throw new Error("Please add a name and location.");
  }

  const { data: item, error } = await supabase
    .from("items")
    .insert({
      name: input.name.trim(),
      category: input.category,
      quantity: Math.max(1, input.quantity || 1),
      location: input.location.trim(),
      status: input.status,
      notes: input.notes.trim(),
      added_by: userId,
    })
    .select()
    .single();

  if (error || !item) throw new Error(error?.message || "Could not add item.");

  await supabase.from("history").insert({
    item_id: item.id,
    item_name: item.name,
    action: "Added",
    details: `Placed in ${item.location}`,
    by_user: userId,
    by_name: fullName,
  });

  revalidateAll();
  return item;
}

export async function updateItem(itemId: string, input: ItemInput) {
  const { supabase, userId, fullName } = await getCurrentProfile();

  if (!input.name.trim() || !input.location.trim()) {
    throw new Error("Please add a name and location.");
  }

  const { data: existing } = await supabase.from("items").select("*").eq("id", itemId).single();
  if (!existing) throw new Error("Item not found.");

  const changes: string[] = [];
  if (existing.name !== input.name.trim()) changes.push("name");
  if (existing.category !== input.category) changes.push("category");
  if (existing.location !== input.location.trim()) changes.push("location");
  if (existing.status !== input.status) changes.push(`status → ${input.status}`);
  if (existing.quantity !== input.quantity) changes.push("quantity");

  const { error } = await supabase
    .from("items")
    .update({
      name: input.name.trim(),
      category: input.category,
      quantity: Math.max(1, input.quantity || 1),
      location: input.location.trim(),
      status: input.status,
      notes: input.notes.trim(),
    })
    .eq("id", itemId);

  if (error) throw new Error(error.message);

  await supabase.from("history").insert({
    item_id: itemId,
    item_name: input.name.trim(),
    action: "Updated",
    details: changes.length ? `Changed: ${changes.join(", ")}` : "Details updated",
    by_user: userId,
    by_name: fullName,
  });

  revalidateAll();
}

export async function updateItemStatus(itemId: string, newStatus: ItemStatus) {
  const { supabase, userId, fullName } = await getCurrentProfile();

  const { data: existing } = await supabase
    .from("items")
    .select("name, status")
    .eq("id", itemId)
    .single();
  if (!existing) throw new Error("Item not found.");
  if (existing.status === newStatus) return;

  const { error } = await supabase.from("items").update({ status: newStatus }).eq("id", itemId);
  if (error) throw new Error(error.message);

  await supabase.from("history").insert({
    item_id: itemId,
    item_name: existing.name,
    action: "Status changed",
    details: `${existing.status} → ${newStatus}`,
    by_user: userId,
    by_name: fullName,
  });

  revalidateAll();
}

export async function deleteItem(itemId: string) {
  const { supabase, userId, fullName } = await getCurrentProfile();

  const { data: existing } = await supabase
    .from("items")
    .select("name, location")
    .eq("id", itemId)
    .single();
  if (!existing) throw new Error("Item not found.");

  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) throw new Error(error.message);

  await supabase.from("history").insert({
    item_id: null,
    item_name: existing.name,
    action: "Removed",
    details: `Removed from ${existing.location}`,
    by_user: userId,
    by_name: fullName,
  });

  revalidateAll();
}
