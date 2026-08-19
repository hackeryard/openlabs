"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";

interface AdminSecretContextType {
  adminSecret: string;
  isUnlocked: boolean;
  isHydrated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  setSecret: (secret: string) => void;
  lock: () => void;
  unlock: (secret: string) => void;
}

const AdminSecretContext = createContext<AdminSecretContextType>({
  adminSecret: "",
  isUnlocked: false,
  isHydrated: false,
  isAdmin: false,
  isModerator: false,
  setSecret: () => {},
  lock: () => {},
  unlock: () => {},
});

export function AdminSecretProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState<boolean>(false);
  const [adminSecret, setAdminSecretState] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const isAdmin = mounted && user?.role === "admin";
  const isModerator = mounted && user?.role === "moderator";

  // Sync state on client mount from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored =
        localStorage.getItem("openlabs-admin-secret") ||
        sessionStorage.getItem("adminSecret") ||
        "";
      if (stored && stored.trim().length > 0) {
        setAdminSecretState(stored.trim());
        setIsUnlocked(true);
      }
    } catch {
      // Storage unavailable
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Regular users (role: "user") or unauthenticated users can NEVER be unlocked.
  // Admin role is ALWAYS unlocked.
  // Moderator role is unlocked ONLY when secret is entered.
  const effectiveUnlocked = isAdmin || (isModerator && isUnlocked);

  const unlock = useCallback((secret: string) => {
    const trimmed = secret.trim();
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("openlabs-admin-secret", trimmed);
        sessionStorage.setItem("adminSecret", trimmed);
      } catch {}
    }
    setAdminSecretState(trimmed);
    setIsUnlocked(true);
  }, []);

  const lock = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("openlabs-admin-secret");
        sessionStorage.removeItem("adminSecret");
      } catch {}
    }
    setAdminSecretState("");
    setIsUnlocked(false);
  }, []);

  const setSecret = useCallback(
    (secret: string) => {
      if (secret && secret.trim().length > 0) {
        unlock(secret);
      } else {
        lock();
      }
    },
    [unlock, lock]
  );

  const effectiveSecret =
    adminSecret ||
    (typeof window !== "undefined"
      ? localStorage.getItem("openlabs-admin-secret") ||
        sessionStorage.getItem("adminSecret") ||
        ""
      : "");

  return (
    <AdminSecretContext.Provider
      value={{
        adminSecret: effectiveSecret,
        isUnlocked: effectiveUnlocked,
        isHydrated,
        isAdmin,
        isModerator,
        setSecret,
        lock,
        unlock,
      }}
    >
      {children}
    </AdminSecretContext.Provider>
  );
}

export function useAdminSecret() {
  return useContext(AdminSecretContext);
}
