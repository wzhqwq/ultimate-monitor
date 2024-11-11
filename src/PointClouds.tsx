import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { BufferGeometry } from "three"
import {
  globalScaleAtom,
  pointCloudIndexAtom,
  pointCloudsAtom,
  pointCloudsLoadProgressAtom,
} from "./atoms"
import { PLYLoader } from "three/examples/jsm/Addons.js"
import { pointCloudMaterial } from "./shaders/pointCloud"

export function PointClouds() {
  const files = useAtomValue(pointCloudsAtom)
  const [geometries, setGeometries] = useState<BufferGeometry[]>([])
  const index = useAtomValue(pointCloudIndexAtom)
  const scale = useAtomValue(globalScaleAtom)
  const setProgress = useSetAtom(pointCloudsLoadProgressAtom)

  useEffect(() => {
    if (files.length == 0) return
    setProgress({ total: files.length, loaded: 0 })
    const loader = new PLYLoader()
    Promise.all(
      files.map(
        file =>
          new Promise<BufferGeometry>((resolve, reject) => {
            const url = URL.createObjectURL(file)
            loader.load(
              url,
              geometry => {
                URL.revokeObjectURL(url)
                resolve(geometry)
                setProgress(progress => ({
                  total: progress.total,
                  loaded: progress.loaded + 1,
                }))
              },
              undefined,
              reject
            )
          })
      )
    ).then(geometries => {
      setGeometries(geometries)
    })
  }, [files])

  return geometries[index] ? (
    <points geometry={geometries[index]} material={pointCloudMaterial} scale={scale} />
  ) : null
}
