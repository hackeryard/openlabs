"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import { useRef } from "react";

/* Orbit ring for a single electron */
function ElectronOrbit({ radius, tilt, tiltY }) {
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
    <group rotation={[tilt, tiltY, 0]}>
      <Line points={points} color="#818cf8" lineWidth={1.2} transparent opacity={0.45} />
    </group>
  );
}

/* Electron */
function Electron({ radius, speed, angle, tilt, tiltY }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
    }
  });

  return (
    <group rotation={[tilt, tiltY, 0]}>
      <group ref={ref}>
        <mesh
          position={[
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius,
          ]}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}

/* Atom (Bohr-style, centered per-electron orbit) */
function Atom({ atomicNumber }) {
  const shellCapacities = [2, 8, 18, 32];
  let remaining = atomicNumber;

  const electrons = [];
  const orbits = [];

  shellCapacities.forEach((cap, shellIndex) => {
    const count = Math.min(cap, remaining);
    remaining -= count;
    if (count === 0) return;

    const radius = 1.2 + shellIndex * 0.75;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const tilt = ((i * 1.618) % 1) * Math.PI * 0.8 - Math.PI * 0.4;
      const tiltY = ((i * 2.718) % 1) * Math.PI * 0.8 - Math.PI * 0.4;

      orbits.push(
        <ElectronOrbit
          key={`orbit-${shellIndex}-${i}`}
          radius={radius}
          tilt={tilt}
          tiltY={tiltY}
        />
      );

      electrons.push(
        <Electron
          key={`electron-${shellIndex}-${i}`}
          radius={radius}
          angle={angle}
          tilt={tilt}
          tiltY={tiltY}
          speed={0.4 + shellIndex * 0.1}
        />
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Nucleus with dynamic glow */}
      <Sphere args={[0.42, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {orbits}
      {electrons}
    </group>
  );
}

export default function AtomicModel3D({ atomicNumber }) {
  return (
    <div className="w-full h-full min-h-[460px] relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#818cf8" />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#38bdf8" />

        <Atom atomicNumber={Math.min(atomicNumber, 32)} />

        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
