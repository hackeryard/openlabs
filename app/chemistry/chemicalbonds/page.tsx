"use client";

import { useParams } from "next/navigation";
import ChemicalBondTypes from "../../components/chemistry/ChemicalBondTypes";
import { useEffect } from "react";
import { useChat } from "@/app/components/ChatContext";

export default function ElectronicConfigurationPage() {
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Chemical Bond Types",
      theory: "",
      extraContext: ``,
    });
  }, []);
  return (
    <ChemicalBondTypes />
  )
}
