"use client";
import { createContext, useContext, useState } from "react";

const ChatContext = createContext<any>(null);

export function ChatProvider({ children }: any) {
  const [experimentData, setExperimentData] = useState({
    title: "",
    theory: "",
    extraContext: "",
  });

  return (
    <ChatContext.Provider value={{ experimentData, setExperimentData }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}