import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Set up the configuration for the Supabase client
const supabaseUrl = Deno.env.get("LOCAL_SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("LOCAL_SUPABASE_ANON_KEY") ?? "";
const options = {
  //this prevent test leaks error
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: { Authorization: `Bearer ${supabaseKey}` },
  },
};

export const getTestSupabaseClient = () => {
  const supabaseClient = createClient(supabaseUrl, supabaseKey, options);
  return supabaseClient;
};
