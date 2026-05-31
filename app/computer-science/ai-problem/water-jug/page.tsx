import React from "react";
import AiProblemLanding from "../AiProblemLanding";
import { aiProblemContent, createAiProblemMetadata } from "../aiProblemContent";

const content = aiProblemContent["water-jug"];

export const metadata = createAiProblemMetadata(content);

export default function Page() {
  return <AiProblemLanding content={content} />;
}
