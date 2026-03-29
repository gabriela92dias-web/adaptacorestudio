/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH CONTEXT - Gerenciamento de Autenticação
 * ═══════════════════════════════════════════════════════════════
 * 
 * Gerencia estado de autenticação com Supabase
 * - Login/Logout
 * - Sessão persistente
 * - Proteção de rotas
 * 
 * MODO LOCAL: Se Supabase não configurado, usa localStorage
 * ⚡ OPTIMIZED: useCallback for stable function references + reduced logging
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, SUPABASE_CONFIGURED } from '../utils/supabase-client';
import { devLog } from '../utils/performance';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ══════════════════════════════════════════════════════════════
// MODO LOCAL (sem Supabase) - Para testes
// ══════════════════════════════════════════════════════════════

interface LocalUser {
  id: string;
  email: string;
  password: string;
  name: string;
  created_at: string;
}

const LOCAL_STORAGE_KEYS = {
  USERS: 'adapta_local_users',
  CURRENT_USER: 'adapta_local_current_user',
};

function getLocalUsers(): LocalUser[] {
  const users = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
}

function saveLocalUsers(users: LocalUser[]) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentLocalUser(): LocalUser | null {
  const user = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
}

function setCurrentLocalUser(user: LocalUser | null) {
  if (user) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  }
}

// ══════════════════════════════════════════════════════════════
// AUTH PROVIDER
// ══════════════════════════════════════════════════════════════

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug: Confirma que o provider foi montado
  devLog('🔐 AuthProvider mounted');

  // ⚡ Memoize callbacks to prevent unnecessary re-renders
  const signIn = useCallback(async (email: string, password: string) => {
    if (SUPABASE_CONFIGURED) {
      // Modo REAL - Supabase
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error: error ? new Error(error.message) : null };
      } catch (err) {
        return { error: err as Error };
      }
    } else {
      // Modo LOCAL - Mock
      const users = getLocalUsers();
      const foundUser = users.find((u) => u.email === email);

      if (!foundUser) {
        return { error: new Error('Usuário não encontrado. Crie uma conta primeiro.') };
      }

      // Validar senha
      if (foundUser.password !== password) {
        return { error: new Error('Senha incorreta.') };
      }

      // Simula login bem-sucedido
      const mockUser: any = {
        id: foundUser.id,
        email: foundUser.email,
        user_metadata: { name: foundUser.name },
        created_at: foundUser.created_at,
      };
      
      setCurrentLocalUser(foundUser);
      setUser(mockUser);
      setSession({ user: mockUser } as any);

      return { error: null };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    if (SUPABASE_CONFIGURED) {
      // Modo REAL - Supabase
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
            },
          },
        });
        return { error: error ? new Error(error.message) : null };
      } catch (err) {
        return { error: err as Error };
      }
    } else {
      // Modo LOCAL - Mock
      const users = getLocalUsers();
      const exists = users.find((u) => u.email === email);

      if (exists) {
        return { error: new Error('Este email já está cadastrado.') };
      }

      const newUser: LocalUser = {
        id: `local_${Date.now()}`,
        email,
        password,
        name: name || email.split('@')[0],
        created_at: new Date().toISOString(),
      };

      users.push(newUser);
      saveLocalUsers(users);

      return { error: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (SUPABASE_CONFIGURED) {
      await supabase.auth.signOut();
    } else {
      // Modo LOCAL - Mock
      setCurrentLocalUser(null);
      setUser(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    if (SUPABASE_CONFIGURED) {
      // Modo REAL - Supabase configurado
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Modo LOCAL - Mock com localStorage
      const localUser = getCurrentLocalUser();
      
      if (localUser) {
        // Simula User do Supabase
        const mockUser: any = {
          id: localUser.id,
          email: localUser.email,
          user_metadata: { name: localUser.name },
          created_at: localUser.created_at,
        };
        setUser(mockUser);
        setSession({ user: mockUser } as any);
      }
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}