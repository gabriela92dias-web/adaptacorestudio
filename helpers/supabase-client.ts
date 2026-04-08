/**
 * ═══════════════════════════════════════════════════════════════
 * SUPABASE CLIENT - Cliente Singleton
 * ═══════════════════════════════════════════════════════════════
 * 
 * Cliente único do Supabase para toda a aplicação
 * Usa variáveis de ambiente para configuração
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kshybgeyetkkufkmjugz.supabase.co";
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaHliZ2V5ZXRra3Vma21qdWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjU1OTQsImV4cCI6MjA4OTg0MTU5NH0.bs6pHfjKnPAACxz9fVPR3sGw-2IsjQc4DrrW584wXiY";

export const SUPABASE_CONFIGURED = true;

// Cria cliente real
export const supabase: SupabaseClient = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});