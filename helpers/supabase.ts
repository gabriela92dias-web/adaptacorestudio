import { createClient } from '@supabase/supabase-js';

// Supabase REST client - works via HTTPS, no IPv6 issues
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

if (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) {
  SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
} else {
  // @ts-ignore - Necessário para o Vite fazer o replacement estático no build
  SUPABASE_URL = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
  // @ts-ignore
  SUPABASE_ANON_KEY = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
