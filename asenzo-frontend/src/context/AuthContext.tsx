"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  role?: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSupabaseConnected: boolean;
  isDemoMode: boolean;
  login: (emailInput: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (emailInput: string, password: string, fullName: string, companyName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: "demo-founder-101",
  email: "founder@asenzo.ai",
  fullName: "Mark Alexander",
  companyName: "Asenzo OS",
  role: "Founder & CEO",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvKuTHxQEBhtUL1Xk6_BbKmJGggF7YOqSolpY8tUenyc5O6sLzEPwbvr5nKiw0BwbDEopuoK6RBhPB6hyGUUD7pj_9Au_7bAmPWEXASC7AuQGibBo-YjQ4w_CgGesTLbqq1QnfOf5FO3YpR0AwHvSj3NXt2TbPdXMPX-XkxrnTEyhK-xYNTEfFOSJyHiW-Wrr1tXQSSW8cYvj3Sx5msyX1xWfTB5zux4WkR2aKVjRldGr2Vcp8gGPs7Q",
  isDemo: true
};

function normalizeEmail(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "founder@asenzo.ai";
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  return `${trimmed.toLowerCase()}@asenzo.ai`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isSupabaseConnected = isSupabaseConfigured();

  useEffect(() => {
    async function initAuth() {
      setLoading(true);

      // 1. Check local storage first
      const stored = localStorage.getItem("asenzo_auth_user");
      let localProfile: UserProfile | null = null;
      if (stored) {
        try {
          localProfile = JSON.parse(stored);
          setUser(localProfile);
        } catch {
          localStorage.removeItem("asenzo_auth_user");
        }
      }

      // 2. Check Supabase session if configured
      if (isSupabaseConnected) {
        const supabase = getSupabaseClient();
        if (supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              const supaProfile: UserProfile = {
                id: session.user.id,
                email: session.user.email || "",
                fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
                companyName: session.user.user_metadata?.company_name || "Growth OS",
                avatarUrl: session.user.user_metadata?.avatar_url || DEMO_USER.avatarUrl,
                isDemo: false
              };
              setUser(supaProfile);
              localStorage.setItem("asenzo_auth_user", JSON.stringify(supaProfile));
            }
          } catch (err) {
            console.warn("Supabase session check notice:", err);
          }

          // 3. Subscription listener (only clear if explicit SIGNED_OUT)
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
              const supaProfile: UserProfile = {
                id: session.user.id,
                email: session.user.email || "",
                fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
                companyName: session.user.user_metadata?.company_name || "Growth OS",
                avatarUrl: session.user.user_metadata?.avatar_url || DEMO_USER.avatarUrl,
                isDemo: false
              };
              setUser(supaProfile);
              localStorage.setItem("asenzo_auth_user", JSON.stringify(supaProfile));
            } else if (event === "SIGNED_OUT") {
              setUser(null);
              localStorage.removeItem("asenzo_auth_user");
            }
            setLoading(false);
          });

          setLoading(false);
          return () => {
            subscription.unsubscribe();
          };
        }
      }

      setLoading(false);
    }

    initAuth();
  }, [isSupabaseConnected]);

  const login = async (emailInput: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const email = normalizeEmail(emailInput);

    if (isSupabaseConnected) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (!error && data.user) {
            const profile: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              fullName: data.user.user_metadata?.full_name || email.split("@")[0],
              companyName: data.user.user_metadata?.company_name || "Growth OS",
              avatarUrl: DEMO_USER.avatarUrl,
              isDemo: false // Registered/authenticated user -> FULL READ & WRITE
            };
            setUser(profile);
            localStorage.setItem("asenzo_auth_user", JSON.stringify(profile));
            setLoading(false);
            return { success: true };
          }
        } catch (err) {
          console.warn("Supabase signIn exception:", err);
        }
      }
    }

    // User Logged In via Form Credentials (FULL READ & WRITE ACCESS)
    const displayName = emailInput.includes("@")
      ? emailInput.split("@")[0]
      : emailInput;

    const userProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: displayName.replace(".", " ").replace(/^./, str => str.toUpperCase()),
      companyName: "Asenzo Growth OS",
      avatarUrl: DEMO_USER.avatarUrl,
      isDemo: false // User signed in via form -> FULL READ & WRITE
    };

    setUser(userProfile);
    localStorage.setItem("asenzo_auth_user", JSON.stringify(userProfile));
    setLoading(false);
    return { success: true };
  };

  const register = async (
    emailInput: string,
    password: string,
    fullName: string,
    companyName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const email = normalizeEmail(emailInput);

    if (isSupabaseConnected) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                company_name: companyName || "Growth OS"
              }
            }
          });

          if (!error && data.user) {
            const profile: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              fullName,
              companyName: companyName || "Growth OS",
              avatarUrl: DEMO_USER.avatarUrl,
              isDemo: false // Newly registered user -> FULL READ & WRITE
            };
            setUser(profile);
            localStorage.setItem("asenzo_auth_user", JSON.stringify(profile));
            setLoading(false);
            return { success: true };
          }
        } catch (err) {
          console.warn("Supabase signUp exception, using local session:", err);
        }
      }
    }

    // User Account Registration (FULL READ & WRITE ACCESS)
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      companyName: companyName || "Growth OS",
      avatarUrl: DEMO_USER.avatarUrl,
      isDemo: false // Registered account -> FULL READ & WRITE
    };

    setUser(profile);
    localStorage.setItem("asenzo_auth_user", JSON.stringify(profile));
    setLoading(false);
    return { success: true };
  };

  const logout = async () => {
    setLoading(true);
    if (isSupabaseConnected) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.warn("Signout warning:", err);
        }
      }
    }
    setUser(null);
    localStorage.removeItem("asenzo_auth_user");
    setLoading(false);
  };

  const loginAsDemo = async () => {
    setLoading(true);
    setUser(DEMO_USER); // ONLY this button sets isDemo: true!
    localStorage.setItem("asenzo_auth_user", JSON.stringify(DEMO_USER));
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isSupabaseConnected,
        isDemoMode: Boolean(user?.isDemo),
        login,
        register,
        logout,
        loginAsDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
