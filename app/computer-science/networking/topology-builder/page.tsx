import React from "react";
import NetworkingLanding from "../NetworkingLanding";
import { createNetworkingMetadata, networkingContent } from "../networkingContent";

const content = networkingContent["topology-builder"];

export const revalidate = 86400; // 24 hours ISR Edge CDN cache

export const metadata = createNetworkingMetadata(content);

export default function Page() {
  return <NetworkingLanding content={content} />;
}
