import { Card, LinearProgress, Stack, Typography } from "@mui/joy"
import { DropFiles } from "./DragFiles"
import {
  pointCloudsAtom,
  pointCloudsLoadProgressAtom,
  reconstructionsLoadProgressAtom,
  reconstructModelsAtom,
  referenceModelsAtom,
} from "./atoms"
import { useAtomValue } from "jotai"
import { PrimitiveAtom } from "jotai"

function PointCloudProgress({ atom }: { atom: PrimitiveAtom<{ loaded: number; total: number }> }) {
  const progress = useAtomValue(atom)
  return (
    <LinearProgress
      determinate
      value={progress.total == 0 ? 0 : (progress.loaded / progress.total) * 100}
      sx={{ width: "100%" }}
    />
  )
}
export function FilesBar() {
  return (
    <>
      <DropFiles
        atom={referenceModelsAtom}
        render={fileNames =>
          fileNames.length == 0 ? (
            <Typography>拖入参考模型</Typography>
          ) : (
            <Card>{fileNames[0]}</Card>
          )
        }
        validate={file => file.name.endsWith(".obj")}
      />
      <DropFiles
        atom={reconstructModelsAtom}
        render={fileNames =>
          fileNames.length == 0 ? (
            <Typography>拖入重建模型</Typography>
          ) : (
            <Stack>
              <Typography>共{fileNames.length}个重建结果</Typography>
              <PointCloudProgress atom={reconstructionsLoadProgressAtom} />
            </Stack>
          )
        }
        validate={file => /obj\d+_ep\d+_mesh\.obj/.test(file.name)}
      />
      <DropFiles
        atom={pointCloudsAtom}
        render={fileNames =>
          fileNames.length == 0 ? (
            <Typography>拖入点云数据</Typography>
          ) : (
            <Stack>
              <Typography>共{fileNames.length}个点云</Typography>
              <PointCloudProgress atom={pointCloudsLoadProgressAtom} />
            </Stack>
          )
        }
        validate={file => /debug_ep\d+_pc_\d+\.ply/.test(file.name)}
      />
    </>
  )
}
