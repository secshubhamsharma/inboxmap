import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import { RefreshCw, Menu, MapPin, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/context/AppContext'
import { useGmailScan } from '@/hooks/useGmailScan'

const PAGE_TITLES = {
  '/app/overview':    'Dashboard',
  '/app/accounts':    'Accounts Found',
  '/app/dead-weight': 'Dead Weight',
  '/app/senders':     'Inbox Map',
  '/app/analytics':   'Analytics',
  '/app/settings':    'Settings',
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, scanStatus, signOut } = useApp()
  const { startScan } = useGmailScan()
  const scanning = scanStatus === 'scanning'
  const title = PAGE_TITLES[location.pathname] || 'InboxMap'

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <header className="h-14 border-b border-zinc-800/60 flex items-center px-4 gap-4 bg-zinc-950 flex-shrink-0">
      <button className="md:hidden text-zinc-400 hover:text-zinc-200 p-1" onClick={onMenuClick}>
        <Menu className="w-5 h-5" />
      </button>

      <NavLink to="/app/overview" className="hidden md:flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-bold text-zinc-50 text-sm tracking-tight">InboxMap</span>
      </NavLink>

      <span className="flex-1 text-sm font-medium text-zinc-300">{title}</span>

      <Button
        variant="outline"
        size="sm"
        onClick={startScan}
        disabled={scanning}
        className="border-zinc-700 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800 text-xs gap-1.5"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
        {scanning ? 'Scanning…' : 'Rescan'}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg hover:bg-zinc-800/50 p-1.5 transition-colors">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-green-400" />
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 bg-zinc-900 border-zinc-800">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-zinc-200">{user?.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
