import { Stack, Slider, Button, Divider, Typography, ButtonGroup, Checkbox } from "@mui/joy"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useState, useRef, useMemo, useEffect } from "react"
import { FaStop, FaPlay } from "react-icons/fa6"
import {
  autoRotationAtom,
  meshColoredAtom,
  pointCloudsAtom,
  pointCloudIndexAtom,
  reconstructionIndexAtom,
  reconstructModelsAtom,
} from "./atoms"

export function PointCloudController() {
  const pcs = useAtomValue(pointCloudsAtom)
  const recs = useAtomValue(reconstructModelsAtom)
  const setPcIndex = useSetAtom(pointCloudIndexAtom)
  const setRecIndex = useSetAtom(reconstructionIndexAtom)
  const [colored, setColored] = useAtom(meshColoredAtom)
  const [autoRotation, setAutoRotation] = useAtom(autoRotationAtom)

  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef(0)
  const [speed, setSpeed] = useState(1)

  const pcInfos = useMemo(
    () =>
      pcs
        .map((file, index) => {
          const name = file.name
          // expected format: debug_ep{epoch}_pc_{point count}.ply
          const match = name.match(/debug_ep(\d+)_pc_(\d+)\.ply/)
          if (!match) throw new Error("文件名不正确:" + name)
          const epoch = parseInt(match[1])
          const pointCount = parseInt(match[2])
          return { epoch, pointCount, index }
        })
        .sort((a, b) => a.epoch - b.epoch),
    [pcs]
  )
  const recInfos = useMemo(
    () =>
      recs
        .map((file, index) => {
          const name = file.name
          // expected format: obj{x}_ep{epoch}_mesh.obj
          const match = name.match(/obj\d+_ep(\d+)_mesh\.obj/)
          if (!match) throw new Error("文件名不正确:" + name)
          const epoch = parseInt(match[1])
          return { epoch, index }
        })
        .sort((a, b) => b.epoch - a.epoch),
    [recs]
  )

  useEffect(() => {
    if (!pcInfos[step]) return
    setPcIndex(pcInfos[step].index)
    const recEpoch = recInfos.findIndex(info => info.epoch <= pcInfos[step].epoch)
    if (recEpoch == -1) {
      setRecIndex(-1)
      return
    }
    setRecIndex(recInfos[recEpoch].index)
  }, [step, pcInfos, recInfos])

  useEffect(() => {
    if (pcInfos.length == 0) return
    if (step >= pcInfos.length) setStep(pcInfos.length - 1)
  }, [pcInfos.length, step])

  useEffect(() => {
    if (!playing) return
    if (step >= pcInfos.length - 1) {
      setPlaying(false)
      return
    }
    timerRef.current = setTimeout(() => {
      setStep(step + 1)
    }, (pcInfos[step].epoch - pcInfos[step - 1]?.epoch || 0) / speed)
  }, [playing, step])

  return pcInfos.length ? (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        border: "solid 2px gray",
        borderRadius: "lg",
        p: 2,
      }}
      gap={3}
    >
      <Slider
        min={0}
        max={pcInfos.length - 1}
        value={step}
        onChange={(_, value) => {
          if (playing) clearTimeout(timerRef.current)
          setStep(value as number)
          setPlaying(false)
        }}
        sx={{
          width: 300,
        }}
      />
      <Button
        onClick={() => {
          if (playing) {
            clearTimeout(timerRef.current)
          } else if (step == pcInfos.length - 1) {
            setStep(0)
          }
          setPlaying(!playing)
        }}
      >
        {playing ? <FaStop /> : <FaPlay />}
      </Button>
      <ButtonGroup>
        <Button onClick={() => setSpeed(1)} variant={speed == 1 ? "solid" : "outlined"}>
          1x
        </Button>
        <Button onClick={() => setSpeed(2)} variant={speed == 2 ? "solid" : "outlined"}>
          2x
        </Button>
        <Button onClick={() => setSpeed(4)} variant={speed == 4 ? "solid" : "outlined"}>
          4x
        </Button>
        <Button onClick={() => setSpeed(8)} variant={speed == 8 ? "solid" : "outlined"}>
          8x
        </Button>
      </ButtonGroup>
      <Stack gap={1}>
        <Checkbox checked={colored} onChange={e => setColored(e.target.checked)} label="表面上色" />
        <Checkbox
          checked={autoRotation}
          onChange={e => setAutoRotation(e.target.checked)}
          label="自动旋转"
        />
      </Stack>
      <Divider orientation="vertical" />
      {pcInfos[step] ? (
        <Stack gap={1}>
          <Typography>Epoch: {pcInfos[step].epoch}</Typography>
          <Typography>Point Count: {pcInfos[step].pointCount}</Typography>
        </Stack>
      ) : null}
    </Stack>
  ) : null
}
