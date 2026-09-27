"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface WebGLErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  title?: string;
  className?: string;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): WebGLErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL / 3D Canvas error caught by WebGLErrorBoundary:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error || new Error("WebGL context error"),
          this.reset
        );
      }

      return (
        <div
          className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center bg-card/60 backdrop-blur-md rounded-2xl border border-border ${
            this.props.className || ""
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">
            {this.props.title || "3D Graphics Acceleration Unavailable"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
            Your browser or device was unable to create or maintain a WebGL context. Hardware
            acceleration may be disabled or your GPU resources may be temporarily exhausted.
          </p>
          <button
            onClick={this.reset}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry 3D Simulation
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
