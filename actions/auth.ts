// actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface AuthResult {
  error?: string;
}

export async function login(prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect("/dashboard");
}

export async function signup(prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const fullName = String(formData.get("fullName") || "").trim();
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const password2 = String(formData.get("password2") || "");

  if (!fullName || !username || !email || !password) {
    return { error: "Please fill in every field." };
  }
  if (password.length < 6) {
    return { error: "Password should be at least 6 characters." };
  }
  if (password !== password2) {
    return { error: "Passwords do not match." };
  }
  if (!/^[a-z0-9_.-]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, dots, dashes and underscores." };
  }

  const supabase = createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    return { error: "That username is already taken." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, username } },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=Could not authenticate with Google");
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}