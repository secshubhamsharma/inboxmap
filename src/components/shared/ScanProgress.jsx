import { useApp } from '@/context/AppContext'
import { Progress } from '@/components/ui/progress'

export default function ScanProgress() {
  const { scanStatus, scanProgress, scanMessage } = useApp()
  if (scanStatus !== 'scanning') return null

  return (
    <div className="px-3 py-3 space-y-2">
      <p className="text-xs text-zinc-400 truncate">{scanMessage}</p>
      <Progress value={scanProgress} className="h-1" />
    </div>
  )
}
