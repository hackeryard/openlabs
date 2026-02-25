"use client";

import { Text, Line } from "@react-three/drei";

function Node({
  position,
  color,
  label,
}: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  return (
    <>
      <mesh position={position}>
        <boxGeometry args={[1.5, 2.5, 1.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[position[0], position[1] + 2, position[2]]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </>
  );
}

export default function NetworkPath() {
  const points: [number, number, number][] = [
    [-8, 0, 0],
    [-3, 0, 0],
    [3, 0, 0],
    [8, 0, 0],
  ];

  return (
    <>
      <Node position={[-8, 0, 0]} color="green" label="Client" />
      <Node position={[-3, 0, 0]} color="purple" label="Switch" />
      <Node position={[3, 0, 0]} color="orange" label="Router" />
      <Node position={[8, 0, 0]} color="blue" label="Server" />

      <Line
        points={points}
        color="white"
        lineWidth={2}
      />
    </>
  );
}