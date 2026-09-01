import React from "react";
import STEMExperimentLanding, { STEMExperimentLandingProps } from "./STEMExperimentLanding";

export type PhysicsExperimentLandingProps = Omit<STEMExperimentLandingProps, "subject"> & {
  subject?: "physics";
};

export default function PhysicsExperimentLanding(props: PhysicsExperimentLandingProps) {
  return <STEMExperimentLanding subject="physics" {...props} />;
}
