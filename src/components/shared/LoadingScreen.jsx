import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Progress } from '@/components/ui/progress'

export default function LoadingScreen() {
  const { scanProgress, scanMessage } = useApp()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 w-80"
      >
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
          <span className="text-green-400 text-2xl">📬</span>
        </div>
        <div className="w-full space-y-3">
          <Progress value={scanProgress} className="h-1.5" />
          <p className="text-sm text-zinc-400 text-center">{scanMessage}</p>
        </div>
      </motion.div>
    </div>
  )
}
