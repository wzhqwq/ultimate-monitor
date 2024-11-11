import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DirectionalLight } from "three";

export function TrackingLight() {
  const lightRef = useRef<DirectionalLight>(null)
  useFrame(({ camera }) => lightRef.current?.position.copy(camera.position))
  return <directionalLight intensity={2} ref={lightRef} />
}