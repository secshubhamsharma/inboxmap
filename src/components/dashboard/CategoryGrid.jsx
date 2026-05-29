import { useNavigate } from 'react-router-dom'
import { Newspaper, ShoppingBag, Bell, MessageCircle, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'

const CATEGORIES = [
  { key: 'Newsletter', icon: Newspaper, label: 'Newsletters', to: '/app/newsletters', color: 'text-green-400', bg: 'bg-green-500/10' },
  { key: 'Promotion', icon: ShoppingBag, label: 'Promotions', to: '/app/promotions', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { key: 'Notification', icon: Bell, label: 'Notifications', to: '/app/notifications', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { key: 'Social', icon: MessageCircle, label: 'Social', to: '/app/social', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { key: 'Other', icon: Tag, label: 'Other', to: '/app/senders', color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
]

export default function CategoryGrid() {
  const { senders } = useApp()
  const navigate = useNavigate()

  const counts = senders.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {CATEGORIES.map(({ key, icon: Icon, label, to, color, bg }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}
        >
          <Card
            className="bg-zinc-900 border-zinc-800/60 p-4 cursor-pointer hover:bg-zinc-800/60 transition-colors group"
            onClick={() => navigate(to)}
          >
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <p className="text-xl font-display font-bold text-zinc-50">{counts[key] || 0}</p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">{label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
