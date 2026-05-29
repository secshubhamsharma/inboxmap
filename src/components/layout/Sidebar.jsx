import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Mail,
  Newspaper,
  ShoppingBag,
  Bell,
  MessageCircle,
  BarChart2,
  Settings,
  MapPin,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import ScanProgress from '@/components/shared/ScanProgress'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/app/overview', icon: LayoutDashboard, label: 'Overview', key: null },
  { to: '/app/senders', icon: Mail, label: 'All Senders', key: 'all' },
  { to: '/app/newsletters', icon: Newspaper, label: 'Newsletters', key: 'Newsletter' },
  { to: '/app/promotions', icon: ShoppingBag, label: 'Promotions', key: 'Promotion' },
  { to: '/app/notifications', icon: Bell, label: 'Notifications', key: 'Notification' },
  { to: '/app/social', icon: MessageCircle, label: 'Social', key: 'Social' },
  { to: '/app/analytics', icon: BarChart2, label: 'Analytics', key: null },
  { to: '/app/settings', icon: Settings, label: 'Settings', key: null },
]

function getBadgeCount(senders, key) {
  if (!key || !senders.length) return null
  if (key === 'all') return senders.length
  const count = senders.filter((s) => s.category === key).length
  return count || null
}

export default function Sidebar({ onClose }) {
  const { senders } = useApp()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/60 w-[220px]">
      <div
        className="px-5 py-5 flex items-center gap-2.5 cursor-pointer"
        onClick={() => { navigate('/app/overview'); onClose?.() }}
      >
        <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-zinc-50 tracking-tight">InboxMap</span>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, key }) => {
          const badge = getBadgeCount(senders, key)
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-green-500/10 text-green-400 border-l-2 border-green-500'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 font-medium">{label}</span>
              {badge !== null && (
                <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md">
                  {badge > 999 ? '999+' : badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto">
        <ScanProgress />
      </div>
    </div>
  )
}
