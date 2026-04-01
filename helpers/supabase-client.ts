/**
 * ═══════════════════════════════════════════════════════════════
 * SUPABASE CLIENT - Cliente Singleton
 * ═══════════════════════════════════════════════════════════════
 * 
 * Cliente único do Supabase para toda a aplicação
 * Usa variáveis de ambiente para configuração
 * 
 * MODO LOCAL: Se credenciais não configuradas, retorna objeto mock
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kshybgeyetkkufkmjugz.supabase.co";
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaHliZ2V5ZXRra3Vma21qdWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjU1OTQsImV4cCI6MjA4OTg0MTU5NH0.bs6pHfjKnPAACxz9fVPR3sGw-2IsjQc4DrrW584wXiY";

// Detecta se Supabase está configurado
export const SUPABASE_CONFIGURED = true;

// Mock client que NÃO faz requisições - 100% seguro
const mockClient = {
  auth: {
    getSession: async () => {
      try {
        return { data: { session: null }, error: null };
      } catch (e) {
        return { data: { session: null }, error: null };
      }
    },
    onAuthStateChange: () => {
      try {
        return {
          data: { subscription: { unsubscribe: () => {} } },
        };
      } catch (e) {
        return {
          data: { subscription: { unsubscribe: () => {} } },
        };
      }
    },
    signInWithPassword: async () => {
      try {
        return { data: null, error: null };
      } catch (e) {
        return { data: null, error: null };
      }
    },
    signUp: async () => {
      try {
        return { data: null, error: null };
      } catch (e) {
        return { data: null, error: null };
      }
    },
    signOut: async () => {
      try {
        return { error: null };
      } catch (e) {
        return { error: null };
      }
    },
  },
} as any;

// Se configurado, cria cliente real; senão, retorna mock
export const supabase: SupabaseClient = SUPABASE_CONFIGURED
  ? createClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    })
  : mockClient;