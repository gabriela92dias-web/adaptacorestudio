import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "./User";
import { supabase } from "./supabase-client";

type AuthState =
  | { type: "loading" }
  | { type: "authenticated"; user: User }
  | { type: "unauthenticated"; errorMessage?: string };

type AuthContextType = {
  authState: AuthState;
  onLogin: (user: User) => void;
  logout: () => Promise<void>;
  // Supabase bridging
  user: any;
  signIn: (email: string, pass: string) => Promise<{error: any}>;
  signUp: (email: string, pass: string, name: string) => Promise<{error: any}>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({ type: "loading" });
  const [sbUser, setSbUser] = useState<any>(null);

  const mapSupabaseUser = (sessionUser: any): User => ({
    id: 1, 
    email: sessionUser.email || "",
    displayName: sessionUser.user_metadata?.name || "Usuário Teste",
    avatarUrl: null,
    role: "admin" 
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSbUser(session.user);
        setAuthState({ type: "authenticated", user: mapSupabaseUser(session.user) });
      } else {
        setAuthState({ type: "unauthenticated" });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSbUser(session.user);
        setAuthState({ type: "authenticated", user: mapSupabaseUser(session.user) });
      } else {
        setSbUser(null);
        setAuthState({ type: "unauthenticated" });
      }
    });

    return () => {
      try { subscription.unsubscribe(); } catch {}
    };
  }, []);

  const logout = async () => {
    setAuthState({ type: "unauthenticated" });
    await supabase.auth.signOut();
  };

  const onLogin = (u: User) => {
    setAuthState({ type: "authenticated", user: u });
  };

  const signIn = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    // Emulate login even if it mocks
    setAuthState({ type: "authenticated", user: mapSupabaseUser({email}) });
    return { error };
  };

  const signUp = async (email: string, pass: string, name: string) => {
    const { error } = await supabase.auth.signUp({ email, password: pass, options: { data: { name } }});
    return { error };
  };

  return (
    <AuthContext.Provider value={{ authState, logout, onLogin, user: sbUser, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
