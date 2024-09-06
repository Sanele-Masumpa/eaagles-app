import { createClient } from '@supabase/supabase-js';

// Ensure you have these environment variables set up in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
