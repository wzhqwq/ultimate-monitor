import { Stack } from "@mui/joy"
import { PrimitiveAtom, useAtom } from "jotai"
import { useState } from "react"

export interface DropFilesProps {
  atom: PrimitiveAtom<File[]>
  render: (fileNames: string[]) => JSX.Element
  validate?: (file: File) => boolean
}
export function DropFiles(props: DropFilesProps) {
  const { atom, render } = props
  const [isDragOver, setIsDragOver] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [files, setFiles] = useAtom(atom)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
    setIsInvalid(!e.dataTransfer.types.includes("Files"))
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setIsInvalid(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setFiles(Array.from(e.dataTransfer.files).filter(file => props.validate?.(file) ?? true))
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 4,
        height: 20,
        border: isDragOver ? "2px solid" : "2px dashed",
        borderColor: isInvalid ? "danger.500" : isDragOver ? "primary.500" : "primary.300",
        borderRadius: "lg",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isInvalid ? '类型错误' : render(files.map(file => file.name))}
    </Stack>
  )
}
