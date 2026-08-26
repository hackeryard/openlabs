"use client";

import React from "react";
import type { CurriculumTrack, TrackLabStep } from "@/app/lib/tracks";

export interface NextLabModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  xpEarned?: number;
  completedLabTitle?: string;
  track?: CurriculumTrack | null;
  nextStep?: TrackLabStep | null;
  trackPercentage?: number;
  isFinalStep?: boolean;
}

export default function NextLabModal(_props: NextLabModalProps) {
  return null;
}
