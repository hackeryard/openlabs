import React from "react";
import AiProblemLanding from "../AiProblemLanding";
import { aiProblemContent, createAiProblemMetadata } from "../aiProblemContent";

const content = aiProblemContent["forward-backward"];

export const revalidate = 86400; // 24 hours ISR Edge CDN cache

export const metadata = createAiProblemMetadata(content);

export default function Page() {
  return <AiProblemLanding content={content} />;
}
