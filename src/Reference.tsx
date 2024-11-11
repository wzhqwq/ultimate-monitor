import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { BufferGeometry, Mesh, MeshStandardMaterial } from "three"
import { OBJLoader } from "three/addons/loaders/ObjLoader.js"
import { globalScaleAtom, meshColoredAtom, referenceModelsAtom } from "./atoms"

const referenceMaterial = new MeshStandardMaterial({
  color: "lightblue",
  transparent: true,
  opacity: 0.5,
  side: 2,
})
const referenceMaterial2 = new MeshStandardMaterial({
  color: "black",
  wireframe: true,
})

export function ReferenceModel() {
  const files = useAtomValue(referenceModelsAtom)
  const scale = useAtomValue(globalScaleAtom)
  const colored = useAtomValue(meshColoredAtom)
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null)

  useEffect(() => {
    if (files.length == 0) return
    const file = files[0]
    const loader = new OBJLoader()
    const url = URL.createObjectURL(file)
    loader.load(url, obj => {
      const mesh = obj.children[0] as Mesh

      setGeometry(mesh.geometry as BufferGeometry)
      URL.revokeObjectURL(url)
    })
  }, [files])

  return geometry ? (
    <>
      <mesh geometry={geometry} material={referenceMaterial2} scale={scale} />
      {colored && <mesh geometry={geometry} material={referenceMaterial} scale={scale} />}
    </>
  ) : null
}
