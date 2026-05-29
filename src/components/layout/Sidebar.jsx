import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, Ghost, Mail, BarChart2, Settings, MapPin } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import ScanProgress from '@/components/shared/ScanProgress'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/app/overview',    icon: LayoutDashboard, label: 'Dashboard',       countKey: null },
  { to: '/app/accounts',   icon: Building2,       label: 'Accounts Found',  countKey: 'accounts' },
  { to: '/app/dead-weight', icon: Ghost,           label: 'Dead Weight',     countKey: 'dead' },
  { to: '/app/senders',    icon: Mail,            label: 'Inbox Map',       countKey: 'senders' },
  { to: '/app/analytics',  icon: BarChart2,       label: 'Analytics',       countKey: null },
  { to: '/app/settings',   icon: Settings,        label: 'Settings',        countKey: null },
]

export default function Sidebar({ onClose }) {
  const { senders, accounts } = useApp()
  const navigate = useNavigate()

  function getCount(key) {
    if (!key) return null
    if (key === 'accounts') return accounts.length || null
    if (key === 'senders')  return senders.length || null
    if (key === 'dead') {
      const n = accounts.filter((a) => a.status === 'ghost' || a.status === 'dormant').length
      return n || null
    }
    return null
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/60 w-[220px]">
      <div
        className="px-5 py-5 flex items-center gap-2.5 cursor-pointer"
        onClick={() => { navigate('/app/overview'); onClose?.() }}
      >
        <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center shadow-md shadow-green-500/20">
          <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-bold text-zinc-50 tracking-tight">InboxMap</span>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, countKey }) => {
          const count = getCount(countKey)
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-green-500/10 text-green-400 border-l-2 border-green-500 pl-[10px]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 font-medium">{label}</span>
              {count !== null && (
                <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md tabular-nums">
                  {count > 999 ? '999+' : count}
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
