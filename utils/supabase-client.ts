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
import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Detecta se Supabase está configurado - FORÇADO DESLIGADO PARA O PREVIEW
export const SUPABASE_CONFIGURED = false;

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