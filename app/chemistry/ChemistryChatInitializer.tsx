"use client";

import { useEffect } from "react";
import { useChat } from "../components/ChatContext";

export default function ChemistryChatInitializer() {
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Chemistry Hub",
      theory:
        "Welcome to the OpenLabs Chemistry Portal. Explore atomic models, molecular bonding, chemical reactions, and water quality analysis with interactive simulation labs.",
      extraContext:
        "Chemistry section overview for the virtual labs and science education experience.",
    });
  }, [setExperimentData]);

  return null;
}
