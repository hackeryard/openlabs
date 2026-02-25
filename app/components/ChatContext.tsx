"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const ChatContext = createContext<any>(null);

export function ChatProvider({ children }: any) {
  const pathname = usePathname();

  const [experimentDataState, setExperimentDataState] = useState({
    title: "",
    theory: "",
    extraContext: "",
    path: "",
    updatedAt: 0,
  });

  // Prevent stale context when navigating between pages.
  useEffect(() => {
    setExperimentDataState((prev) => {
      if (prev.path === pathname) return prev;
      return {
        title: "",
        theory: "",
        extraContext: "",
        path: pathname,
        updatedAt: Date.now(),
      };
    });
  }, [pathname]);

  const setExperimentData = useMemo(() => {
    return (next: { title?: string; theory?: string; extraContext?: string }) => {
      setExperimentDataState({
        title: next?.title ?? "",
        theory: next?.theory ?? "",
        extraContext: next?.extraContext ?? "",
        path: pathname,
        updatedAt: Date.now(),
      });
    };
  }, [pathname]);

  return (
    <ChatContext.Provider
      value={{ experimentData: experimentDataState, setExperimentData }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}