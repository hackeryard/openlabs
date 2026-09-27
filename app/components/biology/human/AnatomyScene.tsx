"use client"

import React, { useState, Suspense, Component, ErrorInfo, ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Model from "./Model"
import ProceduralAnatomy from "./HumanBody"

interface ErrorBoundaryProps {
  fallback?: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("AnatomyScene 3D model failed to load:", error);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error || new Error("Failed to load 3D model"), this.reset);
      }
      return null;
    }
    return this.props.children;
  }
}

const CanvasWrapper = ({ type, onSelect }: any) => {
  const [useProcedural, setUseProcedural] = useState(false);

  if (useProcedural) {
    return <ProceduralAnatomy />;
  }

  return (
    <ModelErrorBoundary
      fallback={(error, reset) => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-white p-6 text-center">
          <div className="max-w-md bg-gray-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              !
            </div>
            <h3 className="text-lg font-bold mb-2">3D Model Unavailable</h3>
            <p className="text-sm text-gray-400 mb-6">
              The high-resolution 3D anatomy model could not be loaded over your current network connection.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl text-sm font-semibold transition"
              >
                Retry
              </button>
              <button
                onClick={() => setUseProcedural(true)}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-sm font-semibold transition shadow-md shadow-blue-500/20"
              >
                Load Procedural Anatomy
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 75 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: true,
        }}
        onCreated={(state) => {
          state.gl.setClearColor("#000000");
          const canvas = state.gl.domElement;
          canvas.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
            },
            false
          );
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} />

          <Model type={type} onSelect={onSelect} />

          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={2}
            maxDistance={6}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </ModelErrorBoundary>
  );
};

export default function AnatomyScene({ type, onSelect }: any) {
  return (
    <div className="w-full h-full bg-black">
      <CanvasWrapper type={type} onSelect={onSelect} />
    </div>
  );
}
