"use client"

import { useGLTF, Html } from "@react-three/drei"
import { useMemo, useState } from "react"

useGLTF.preload("/models/human.glb")
useGLTF.preload("/models/skeleton.glb")

interface ModelProps {
  type: "human" | "skeleton"
  selectedOrgan?: string
  onSelect: (name: string) => void
}

const ORGAN_PINS = [
  { name: "Brain", position: [0, 2.05, 0.2] as [number, number, number], color: "#e2e8f0" },
  { name: "Heart", position: [-0.08, 1.25, 0.32] as [number, number, number], color: "#ef4444" },
  { name: "Lungs", position: [0.22, 1.28, 0.28] as [number, number, number], color: "#fca5a5" },
  { name: "Liver", position: [-0.22, 0.88, 0.32] as [number, number, number], color: "#854d0e" },
  { name: "Stomach", position: [0.18, 0.84, 0.3] as [number, number, number], color: "#fb923c" },
  { name: "Kidneys", position: [-0.25, 0.52, -0.1] as [number, number, number], color: "#a855f7" },
  { name: "Intestines", position: [0, 0.38, 0.3] as [number, number, number], color: "#fdba74" },
  { name: "Bladder", position: [0, -0.05, 0.26] as [number, number, number], color: "#fbbf24" }
];

export default function Model({ type, selectedOrgan, onSelect }: ModelProps) {
  const path = type === "human" ? "/models/human.glb" : "/models/skeleton.glb";
  const gltf = useGLTF(path);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const scene = useMemo(() => {
    return gltf.scene.clone();
  }, [gltf]);

  const handleModelClick = (e: any) => {
    e.stopPropagation();
    const y = e.point.y;
    const x = e.point.x;
    if (y > 1.8) onSelect("Brain");
    else if (y > 1.1) onSelect(x < 0 ? "Heart" : "Lungs");
    else if (y > 0.7) onSelect(x < 0 ? "Liver" : "Stomach");
    else if (y > 0.2) onSelect("Intestines");
    else if (y > -0.3) onSelect("Bladder");
  };

  return (
    <group>
      <primitive
        object={scene}
        scale={1.4}
        onClick={handleModelClick}
      />

      {/* 3D Anatomical Organ Pins */}
      {ORGAN_PINS.map((pin) => {
        const isSelected = selectedOrgan === pin.name;
        const isHovered = hoveredPin === pin.name;
        return (
          <group
            key={pin.name}
            position={pin.position}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pin.name);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredPin(pin.name);
            }}
            onPointerOut={() => setHoveredPin(null)}
          >
            {/* Outer glowing halo */}
            <mesh scale={isSelected ? [1.4, 1.4, 1.4] : [1, 1, 1]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial
                color={pin.color}
                transparent
                opacity={isSelected ? 0.9 : 0.6}
              />
            </mesh>

            {/* Pulsing center point */}
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Html Label Pin */}
            {(isSelected || isHovered) && (
              <Html distanceFactor={8} center position={[0, 0.12, 0]}>
                <div className={`px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-lg cursor-pointer transition-transform ${
                  isSelected
                    ? "bg-rose-600 text-white scale-110 ring-2 ring-white"
                    : "bg-slate-900/90 text-white border border-slate-700"
                }`}>
                  {pin.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}