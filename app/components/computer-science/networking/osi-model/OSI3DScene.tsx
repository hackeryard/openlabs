"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Packet from "./Packet";
import NetworkPath from "./NetworkPath";

interface OSI3DSceneProps {
  trigger: boolean;
  mode: "send" | "receive";
  protocol: "TCP" | "UDP";
  message: string;
}

export default function OSI3DScene({
  trigger,
  mode,
  protocol,
  message,
}: OSI3DSceneProps) {
  return (
    <Canvas camera={{ position: [0, 6, 15], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <NetworkPath />

      <Packet
        trigger={trigger}
        mode={mode}
        protocol={protocol}
      />

      <OrbitControls />
    </Canvas>
  );
}