import { atom } from "jotai"
import { Vector3 } from "three"

export const referenceModelsAtom = atom<File[]>([])
export const pointCloudsAtom = atom<File[]>([])
export const reconstructModelsAtom = atom<File[]>([])

export const pointCloudIndexAtom = atom(0)
export const reconstructionIndexAtom = atom(0)
export const pointCloudsLoadProgressAtom = atom({
  total: 0,
  loaded: 0,
})
export const reconstructionsLoadProgressAtom = atom({
  total: 0,
  loaded: 0,
})

export const globalScaleAtom = atom(new Vector3(5, 5, 5))

export const meshColoredAtom = atom(false)
export const autoRotationAtom = atom(false)
