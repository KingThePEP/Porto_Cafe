import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readSupabaseEnv } from "@/lib/supabase/env";

let cached: SupabaseClient | null = null;

export function createPublicClient(): SupabaseClient {
  const env = readSupabaseEnv();

  if (!env) {
    throw new Error("Supabase environment variables are not configured.");
  }

  cached ??= createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return cached;
}
