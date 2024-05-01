import { createClient } from "supabase";

export const getSupabaseClient = (req: Request) => {
  const isDevelopment = Deno.env.get("NODE_ENV") === "development";

  // Supabase API URL - env var exported by default.
  let supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  // Supabase API ANON KEY - env var exported by default.
  let supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  let Authorization = req.headers.get("Authorization")!;

  if (isDevelopment) {
    supabaseUrl = Deno.env.get("LOCAL_SUPABASE_URL") ?? "";
    supabaseAnonKey = Deno.env.get("LOCAL_SUPABASE_ANON_KEY") ?? "";
    Authorization = `Bearer ${supabaseAnonKey}`;
  }

  const supabaseClient = createClient(
    supabaseUrl,
    supabaseAnonKey,
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: {
        headers: { Authorization },
      },
    },
  );

  return supabaseClient;
};
