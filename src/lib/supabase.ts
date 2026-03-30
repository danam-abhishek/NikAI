import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Whether Supabase is properly configured.
 * When false, the app falls back to localStorage only.
 */
export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('YOUR_PROJECT_ID');

if (!isSupabaseConfigured) {
  console.warn(
    '[NikAI] Supabase credentials missing or placeholder. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env for database persistence.'
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
