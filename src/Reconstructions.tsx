import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { BufferGeometry, Mesh, MeshStandardMaterial } from "three"
import {
  globalScaleAtom,
  reconstructionsLoadProgressAtom,
  reconstructModelsAtom,
  reconstructionIndexAtom,
} from "./atoms"
import { OBJLoader } from "three/examples/jsm/Addons.js"

const reconstructionMaterial = new MeshStandardMaterial({
  color: 'white',
  metalness: 0.5,
  roughness: 0.5,
})

export function Reconstructions() {
  const files = useAtomValue(reconstructModelsAtom)
  const [geometries, setGeometries] = useState<BufferGeometry[]>([])
  const index = useAtomValue(reconstructionIndexAtom)
  const scale = useAtomValue(globalScaleAtom)
  const setProgress = useSetAtom(reconstructionsLoadProgressAtom)

  useEffect(() => {
    if (files.length == 0) return
    setProgress({ total: files.length, loaded: 0 })
    const loader = new OBJLoader()
    Promise.all(
      files.map(
        file =>
          new Promise<BufferGeometry>((resolve, reject) => {
            const url = URL.createObjectURL(file)
            loader.load(
              url,
              obj => {
                const mesh = obj.children[0] as Mesh
                URL.revokeObjectURL(url)
                resolve(mesh.geometry as BufferGeometry)
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
    <mesh geometry={geometries[index]} material={reconstructionMaterial} scale={scale} />
  ) : null
}
