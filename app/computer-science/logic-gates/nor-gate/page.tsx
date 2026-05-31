import React from "react";
import LogicGateLanding from "../LogicGateLanding";
import { createLogicGateMetadata, gateContent } from "../gateContent";

const gate = gateContent["nor-gate"];

export const metadata = createLogicGateMetadata(gate);

export default function Page() {
  return <LogicGateLanding gate={gate} />;
}
