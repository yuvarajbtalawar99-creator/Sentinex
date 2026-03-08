import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials missing! Check your .env file.');
} else if (!supabaseAnonKey.startsWith('eyJ') && !supabaseAnonKey.startsWith('sb_publishable_')) {
    console.error('❌ INVALID SUPABASE KEY FORMAT! Your key should start with "eyJ" or "sb_publishable_".');
}

export const supabase = createClient(
    supabaseUrl || 'https://swvtycdsirwpqoozcxfm.supabase.co',
    supabaseAnonKey || ''
);
