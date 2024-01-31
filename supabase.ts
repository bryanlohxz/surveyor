import { createClient } from "@supabase/supabase-js";
import { Database } from "./database/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase environments are missing.");
  process.exit();
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
