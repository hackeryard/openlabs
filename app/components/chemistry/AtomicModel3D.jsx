"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import { useRef } from "react";

/* Orbit ring for a single electron */
function ElectronOrbit({ radius, tilt }) {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    points.push([
      Math.cos(a) * radius,
      0,
      Math.sin(a) * radius,
    ]);
  }

  return (
    <group rotation={[tilt, 0, 0]}>
      <Line points={points} color="#d1d5db" lineWidth={0.8} />
    </group>
  );
}

/* Electron */
function Electron({ radius, speed, angle, tilt }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
    }
  });

  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <mesh
        position={[
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ]}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
    </group>
  );
}

/* Atom (Bohr-style, per-electron orbit) */
function Atom({ atomicNumber }) {
  const shellCapacities = [2, 8, 18, 32];
  let remaining = atomicNumber;

  const electrons = [];
  const orbits = [];

  shellCapacities.forEach((cap, shellIndex) => {
    const count = Math.min(cap, remaining);
    remaining -= count;
    if (count === 0) return;

    const radius = 1 + shellIndex * 0.75;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const tilt = (i / count) * Math.PI * 0.6;

      // 🔹 ONE orbit per electron
      orbits.push(
        <ElectronOrbit
          key={`orbit-${shellIndex}-${i}`}
          radius={radius}
          tilt={tilt}
        />
      );

      electrons.push(
        <Electron
          key={`electron-${shellIndex}-${i}`}
          radius={radius}
          angle={angle}
          tilt={tilt}
          speed={0.3 + shellIndex * 0.1}
        />
      );
    }
  });

  return (
    <>
      {/* Nucleus */}
      <Sphere args={[0.35, 32, 32]}>
        <meshStandardMaterial color="#dc2626" />
      </Sphere>

      {orbits}
      {electrons}
    </>
  );
}

export default function AtomicModel3D({ atomicNumber }) {
  return (
    <div className="w-full h-[600px] bg-white rounded-xl border">
      <div className="text-center text-sm text-gray-600 py-1">
        Bohr Model — One orbit per electron (Z = {atomicNumber})
      </div>

      <Canvas
        camera={{ position: [0, 0, 7] }}
        eventSource={undefined}
        eventPrefix="client"
      >
        <color attach="background" args={["#ffffff"]} />

        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />

        {/* Cap for performance */}
        <Atom atomicNumber={Math.min(atomicNumber, 30)} />

        <OrbitControls enableZoom enablePan={false} />
      </Canvas>
    </div>
  );
}
