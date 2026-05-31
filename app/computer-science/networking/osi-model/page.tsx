import React from "react";
import NetworkingLanding from "../NetworkingLanding";
import { createNetworkingMetadata, networkingContent } from "../networkingContent";

const content = networkingContent["osi-model"];

export const metadata = createNetworkingMetadata(content);

export default function Page() {
  return <NetworkingLanding content={content} />;
}
