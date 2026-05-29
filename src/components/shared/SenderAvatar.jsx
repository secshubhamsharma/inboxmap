import { getSenderGradient } from '@/lib/utils'

export default function SenderAvatar({ name, email, size = 36 }) {
  const letter = (name || email || '?')[0].toUpperCase()
  const gradient = getSenderGradient(email || '')

  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-white`}
      style={{ width: size, height: size, fontSize: size * 0.44 }}
    >
      {letter}
    </div>
  )
}
