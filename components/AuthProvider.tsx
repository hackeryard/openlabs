"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export type AuthState =
  | "LOADING"
  | "UNAUTHENTICATED"
  | "AUTHENTICATED_BUT_UNVERIFIED"
  | "AUTHENTICATED";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar?: string;
  xp?: number;
  level?: number;
  badges?: string[];
  profileSetupComplete?: boolean;
  username?: string;
  bio?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  authState: AuthState;
  user: UserProfile | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authState: "LOADING",
  user: null,
  checkAuth: async () => {},
  logout: async () => {},
});

const protectedPrefixes = ["/labs", "/admin", "/profile", "/setup-profile"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("LOADING");
  const [user, setUser] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setUser(null);
      setAuthState("UNAUTHENTICATED");
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
        headers: { "Pragma": "no-cache" }
      });

      if (res.status === 200) {
        const data = await res.json();
        setUser(data.user);
        setAuthState("AUTHENTICATED");
      } else if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        setUser(null);
        setAuthState("AUTHENTICATED_BUT_UNVERIFIED");

        const isProtected = protectedPrefixes.some(p => pathname.startsWith(p));
        if (isProtected) {
          const emailParam = data.email ? `?email=${encodeURIComponent(data.email)}` : "";
          router.push(`/verify-email${emailParam}`);
        }
      } else {
        // 401, 404, 500 -> Unauthenticated
        setUser(null);
        setAuthState("UNAUTHENTICATED");
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setUser(null);
      setAuthState("UNAUTHENTICATED");
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  return (
    <AuthContext.Provider value={{ authState, user, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
