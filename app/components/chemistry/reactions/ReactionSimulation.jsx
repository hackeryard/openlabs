"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";

function Atom({ position, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function ReactionSimulation() {
  const [stage, setStage] = useState("reactants");

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold">Reaction Simulation</h2>
      <p className="text-gray-600">
        Example: Formation of Water (2H₂ + O₂ → 2H₂O)
      </p>

      <div className="h-80 border rounded-lg">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} />

          {stage === "reactants" && (
            <>
              {/* H₂ molecules */}
              <Atom position={[-2, 0, 0]} color="white" />
              <Atom position={[-1.5, 0, 0]} color="white" />

              <Atom position={[2, 0, 0]} color="white" />
              <Atom position={[2.5, 0, 0]} color="white" />

              {/* O₂ molecule */}
              <Atom position={[0, 1, 0]} color="red" />
              <Atom position={[0, 1.6, 0]} color="red" />
            </>
          )}

          {stage === "products" && (
            <>
              {/* H₂O molecules */}
              <Atom position={[-1, 0, 0]} color="red" />
              <Atom position={[-1.4, -0.4, 0]} color="white" />
              <Atom position={[-0.6, -0.4, 0]} color="white" />

              <Atom position={[1, 0, 0]} color="red" />
              <Atom position={[0.6, -0.4, 0]} color="white" />
              <Atom position={[1.4, -0.4, 0]} color="white" />
            </>
          )}

          <OrbitControls />
        </Canvas>
      </div>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setStage("reactants")}
        >
          Reactants
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setStage("products")}
        >
          Simulate Reaction
        </button>
      </div>
    </div>
  );
}
