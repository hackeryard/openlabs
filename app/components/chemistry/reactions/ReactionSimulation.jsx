"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useMemo, useState } from "react";

function ProgressDriver({ stage, progress }) {
  useFrame(() => {
    const target = stage === "reactants" ? 0 : 1;
    progress.current += (target - progress.current) * 0.04;
  });
  return null;
}

function Atom({ reactantPos, productPos, color, progress }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    const t = Math.min(progress.current, 1);

    const [sx, sy] = reactantPos;
    const [ex, ey] = productPos;

    const cp = [(sx + ex) / 2, (sy + ey) / 2 + 1];

    const x = (1 - t) ** 2 * sx + 2 * (1 - t) * t * cp[0] + t ** 2 * ex;
    const y = (1 - t) ** 2 * sy + 2 * (1 - t) * t * cp[1] + t ** 2 * ey;

    ref.current.position.set(x, y, 0);

    const pulse = t > 0.95 ? 1 + (t - 0.95) * 0.4 : 1;
    ref.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
    </mesh>
  );
}

function ElectronOrbit({ center }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += 0.03;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.35;
  });

  return (
    <group ref={group} position={center}>
      <mesh position={[0.9, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#8ec5ff"
          emissive="#8ec5ff"
          emissiveIntensity={0.9}
        />
      </mesh>
      <mesh position={[-0.9, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#8ec5ff"
          emissive="#8ec5ff"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

function AtomLabel({ text, position, progress }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    const t = Math.min(progress.current, 1);
    const alpha = t > 0.6 ? (t - 0.6) * 2 : 0;
    ref.current.style.opacity = Math.min(alpha, 1);
  });

  return (
    <Html position={position} center>
      <div
        ref={ref}
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "black",
          opacity: 0,
          transition: "opacity .3s",
        }}
      >
        {text}
      </div>
    </Html>
  );
}

export default function ReactionSimulation() {
  const [stage, setStage] = useState("reactants");
  const progress = useRef(0);

  const atoms = useMemo(
    () => [
      { id: "H1", color: "white" },
      { id: "H2", color: "white" },
      { id: "H3", color: "white" },
      { id: "H4", color: "white" },
      { id: "O1", color: "red" },
      { id: "O2", color: "red" },
    ],
    []
  );

  const reactants = {
    H1: [-2.2, 0, 0],
    H2: [-1.6, 0, 0],
    H3: [2.2, 0, 0],
    H4: [1.6, 0, 0],
    O1: [0, 1, 0],
    O2: [0, 1.6, 0],
  };

  const r = 0.8;
  const half = (52.25 * Math.PI) / 180;
  const dx = r * Math.cos(half);
  const dy = r * Math.sin(half);

  const products = {
    O1: [-1, 0, 0],
    H1: [-1 - dx, -dy, 0],
    H2: [-1 + dx, -dy, 0],
    O2: [1, 0, 0],
    H3: [1 - dx, -dy, 0],
    H4: [1 + dx, -dy, 0],
  };

  return (
    <div className="bg-white border rounded-xl p-5 sm:p-6 space-y-4 w-full max-w-3xl mx-auto overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Reaction Simulation
      </h2>

      <p className="text-gray-600 text-sm sm:text-base">
        Formation of Water (2H₂ + O₂ → 2H₂O)
      </p>

      <div className="w-full h-80 border rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 7] }}>
          <color attach="background" args={["#111"]} />

          <ambientLight intensity={0.7} />
          <pointLight position={[2, 2, 3]} intensity={1.3} />

          <ProgressDriver stage={stage} progress={progress} />

          {atoms.map((a) => (
            <Atom
              key={a.id}
              color={a.color}
              progress={progress}
              reactantPos={reactants[a.id]}
              productPos={products[a.id]}
            />
          ))}

          <ElectronOrbit
            center={stage === "reactants" ? reactants.O1 : products.O1}
          />
          <ElectronOrbit
            center={stage === "reactants" ? reactants.O2 : products.O2}
          />

          {atoms.map((a) => {
            const pos =
              stage === "reactants" ? reactants[a.id] : products[a.id];
            return (
              <AtomLabel
                key={a.id + "-label"}
                text={a.id.startsWith("H") ? "H" : "O"}
                position={pos}
                progress={progress}
              />
            );
          })}

          <OrbitControls enableZoom={false} />

          <EffectComposer disableNormalPass>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.2}
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          className={`px-4 py-2 rounded text-white ${
            stage === "products" ? "bg-green-700" : "bg-green-600"
          }`}
          onClick={() => setStage("products")}
        >
          ▶️ Run Reaction
        </button>

        <button
          className={`px-4 py-2 rounded text-white ${
            stage === "reactants" ? "bg-blue-700" : "bg-blue-600"
          }`}
          onClick={() => setStage("reactants")}
        >
          ⏮ Reset
        </button>
      </div>
    </div>
  );
}
