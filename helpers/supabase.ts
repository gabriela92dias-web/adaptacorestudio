import { createClient } from '@supabase/supabase-js';

// Supabase REST client - works via HTTPS, no IPv6 issues
const SUPABASE_URL = 'https://kshybgeyetkkufkmjugz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaHliZ2V5ZXRra3Vma21qdWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjU1OTQsImV4cCI6MjA4OTg0MTU5NH0.bs6pHfjKnPAACxz9fVPR3sGw-2IsjQc4DrrW584wXiY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
