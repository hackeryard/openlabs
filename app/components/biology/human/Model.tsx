"use client"

import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"

useGLTF.preload("/models/human.glb")
useGLTF.preload("/models/skeleton.glb")

interface ModelProps {
  type: "human" | "skeleton"
  onSelect: (name: string) => void
}

export default function Model({ type, onSelect }: ModelProps) {
  const path =
    type === "human"
      ? "/models/human.glb"
      : "/models/skeleton.glb"

  const gltf = useGLTF(path)

  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone()

    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.userData.onClick = () => {
          if (child.name) {
            onSelect(child.name)
          }
        }
      }
    })

    return clonedScene
  }, [gltf, onSelect])

  return <primitive object={scene} scale={1.4} />
}