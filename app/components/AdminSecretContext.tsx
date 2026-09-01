"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = Boolean(mounted && user?.role === "admin");
  const isModerator = Boolean(mounted && user?.role === "moderator");
  const isStaff = isAdmin || isModerator;

  return (
    <AdminSecretContext.Provider
      value={{
        adminSecret: "",
        isUnlocked: isStaff,
        isHydrated: mounted,
        isAdmin,
        isModerator,
        setSecret: () => {},
        lock: () => {},
        unlock: () => {},
      }}
    >
      {children}
    </AdminSecretContext.Provider>
  );
}

export function useAdminSecret() {
  return useContext(AdminSecretContext);
}
