import { useEffect, useRef, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { calculateHealthScore, getScoreLabel } from '@/lib/scoring'

const SIZE = 160
const STROKE = 12
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

const SCORE_COLORS = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
}

export default function HealthScoreRing() {
  const { senders, totalScanned } = useApp()
  const score = calculateHealthScore(senders, totalScanned)
  const { label, color, desc } = getScoreLabel(score)
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const duration = 1000

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * score))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const strokeColor = SCORE_COLORS[color]
  const offset = CIRC - (displayed / 100) * CIRC

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#27272a"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-bold text-zinc-50" style={{ color: strokeColor }}>
            {displayed}
          </span>
          <span className="text-xs text-zinc-500 mt-0.5">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-zinc-100">{label}</p>
        <p className="text-sm text-zinc-400 mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
