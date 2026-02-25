"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PacketProps {
  trigger: boolean;
  mode: "send" | "receive";
  protocol: "TCP" | "UDP";
}

export default function Packet({ trigger, mode, protocol }: PacketProps) {
  const mesh = useRef<THREE.Mesh>(null!);

  // Reset position on trigger
  useEffect(() => {
    if (!mesh.current) return;

    mesh.current.position.x = mode === "send" ? -8 : 8;
  }, [trigger, mode]);

  useFrame(() => {
    if (!mesh.current) return;

    const speed = 0.07;

    if (mode === "send") {
      if (mesh.current.position.x < 8) {
        mesh.current.position.x += speed;
      }
    } else {
      if (mesh.current.position.x > -8) {
        mesh.current.position.x -= speed;
      }
    }
  });

  return (
    <mesh ref={mesh} position={[mode === "send" ? -8 : 8, 0, 0]}>
      <boxGeometry args={[1.5, 0.8, 0.8]} />
      <meshStandardMaterial
        color={protocol === "TCP" ? "cyan" : "yellow"}
        emissive={protocol === "TCP" ? "cyan" : "yellow"}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}