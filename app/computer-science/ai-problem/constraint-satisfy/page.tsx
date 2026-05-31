import React from "react";
import AiProblemLanding from "../AiProblemLanding";
import { aiProblemContent, createAiProblemMetadata } from "../aiProblemContent";

const content = aiProblemContent["constraint-satisfy"];

export const metadata = createAiProblemMetadata(content);

export default function Page() {
  return <AiProblemLanding content={content} />;
}
