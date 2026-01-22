"use client"

import { useGLTF } from "@react-three/drei"
import { useEffect } from "react"

// Preload the model
useGLTF.preload("/models/human.glb")

export default function Model({ type, onSelect }: any) {
  const path = "/models/human.glb"

  try {
    const gltf = useGLTF(path)
    const scene = gltf.scene.clone()

    useEffect(() => {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.cursor = "pointer"
          child.onClick = () => {
            if (child.name) {
              onSelect(child.name)
            }
          }
        }
      })
    }, [scene, onSelect])

    return <primitive object={scene} scale={1.4} />
  } catch (error) {
    console.error("Error loading model:", error)
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"#ff0000"} />
      </mesh>
    )
  }
}
