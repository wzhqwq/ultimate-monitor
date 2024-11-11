import "./App.css"
import { Button, Stack } from "@mui/joy"
import { Canvas } from "@react-three/fiber"
import { ReferenceModel } from "./Reference"
import { CameraControls, View } from "@react-three/drei"
import { autoRotationAtom } from "./atoms"
import { useAtomValue } from "jotai"
import { PointClouds } from "./PointClouds"
import { ErrorBoundary } from "react-error-boundary"
import { PointCloudController } from "./Controller"
import { FaRotateRight } from "react-icons/fa6"
import { useEffect, useRef } from "react"
import { Reconstructions } from "./Reconstructions"
import { FilesBar } from "./FilesBar"
import { TrackingLight } from "./lights"

function App() {
  const autoRotation = useAtomValue(autoRotationAtom)

  const controlsRef = useRef<CameraControls | null>(null)

  useEffect(() => {
    if (controlsRef.current && autoRotation) {
      const controls = controlsRef.current
      let lastTime = Date.now()
      let running = true
      const rotateFn = (time: number) => {
        if (!running) return
        const delta = time - lastTime
        lastTime = time
        controls.rotate(0.0005 * delta, 0, true)
        controls.update(delta)
        requestAnimationFrame(rotateFn)
      }
      requestAnimationFrame(rotateFn)
      return () => {
        running = false
      }
    }
  }, [autoRotation])

  return (
    <Stack sx={{ p: 2, flex: 1 }} gap={2}>
      <Stack direction="row" gap={2}>
        <FilesBar />
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{
                backgroundColor: "danger.100",
                border: "solid 2px",
                borderColor: "danger.500",
                borderRadius: "lg",
                p: 2,
              }}
            >
              {error.message}
              <Button onClick={resetErrorBoundary}>
                <FaRotateRight />
              </Button>
            </Stack>
          )}
        >
          <PointCloudController />
        </ErrorBoundary>
      </Stack>
      <Stack sx={{ flex: 1, position: "relative" }}>
        <Stack direction="row" gap={2} sx={{ position: "absolute", height: "100%", width: "100%" }}>
          <View style={{ flex: "1" }}>
            <ReferenceModel />
            <PointClouds />
          </View>
          <View style={{ flex: "1" }}>
            <ambientLight intensity={0.5} />
            <TrackingLight />
            <pointLight position={[10, 10, 10]} />
            <ReferenceModel />
            <Reconstructions />
          </View>
        </Stack>
        <Canvas>
          <CameraControls ref={controlsRef} />
          {/* <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={10} /> */}
          <View.Port />
        </Canvas>
      </Stack>
    </Stack>
  )
}

export default App
