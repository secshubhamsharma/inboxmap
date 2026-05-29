import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, ExternalLink, LogOut } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useApp } from '@/context/AppContext'
import { useGmailScan } from '@/hooks/useGmailScan'
import { formatDate } from '@/lib/utils'

export default function Settings() {
  const { user, settings, updateSettings, signOut, lastScanned, scanStatus } = useApp()
  const { startScan } = useGmailScan()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-5 max-w-2xl mx-auto"
    >
      <div>
        <h1 className="text-xl font-display font-bold text-zinc-50 tracking-tight">Settings</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage your InboxMap preferences</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-200">Scan Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Scan depth</p>
              <p className="text-xs text-zinc-500">Number of emails to analyze</p>
            </div>
            <Select
              value={String(settings.scanDepth)}
              onValueChange={(v) => updateSettings({ scanDepth: Number(v) })}
            >
              <SelectTrigger className="w-28 bg-zinc-800 border-zinc-700 text-zinc-200 text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {[200, 500, 1000, 2000].map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-zinc-300">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator className="bg-zinc-800/60" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Auto-rescan on open</p>
              <p className="text-xs text-zinc-500">Automatically scan when you return</p>
            </div>
            <Switch
              checked={settings.autoRescan}
              onCheckedChange={(v) => updateSettings({ autoRescan: v })}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <Separator className="bg-zinc-800/60" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Include spam & trash</p>
              <p className="text-xs text-zinc-500">Scan spam and trash folders too</p>
            </div>
            <Switch
              checked={settings.includeSpam}
              onCheckedChange={(v) => updateSettings({ includeSpam: v })}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-200">Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Show full email addresses</p>
              <p className="text-xs text-zinc-500">Display full email or just domain</p>
            </div>
            <Switch
              checked={settings.showFullEmails}
              onCheckedChange={(v) => updateSettings({ showFullEmails: v })}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <Separator className="bg-zinc-800/60" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Minimum email count</p>
              <p className="text-xs text-zinc-500">Hide senders below this threshold</p>
            </div>
            <Select
              value={String(settings.minCount)}
              onValueChange={(v) => updateSettings({ minCount: Number(v) })}
            >
              <SelectTrigger className="w-28 bg-zinc-800 border-zinc-700 text-zinc-200 text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="1" className="text-zinc-300">All</SelectItem>
                <SelectItem value="3" className="text-zinc-300">3+</SelectItem>
                <SelectItem value="5" className="text-zinc-300">5+</SelectItem>
                <SelectItem value="10" className="text-zinc-300">10+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator className="bg-zinc-800/60" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Date format</p>
            </div>
            <Select
              value={settings.dateFormat}
              onValueChange={(v) => updateSettings({ dateFormat: v })}
            >
              <SelectTrigger className="w-36 bg-zinc-800 border-zinc-700 text-zinc-200 text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="DD/MM/YYYY" className="text-zinc-300">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY" className="text-zinc-300">MM/DD/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-200">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                {user?.name?.[0] || '?'}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-zinc-200">{user?.name}</p>
              <p className="text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>
          <Separator className="bg-zinc-800/60" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Last scanned</p>
              <p className="text-xs text-zinc-500">{lastScanned ? formatDate(lastScanned, settings.dateFormat) : 'Never'}</p>
            </div>
            <Button
              size="sm"
              onClick={startScan}
              disabled={scanStatus === 'scanning'}
              className="bg-green-600 hover:bg-green-700 text-white text-xs gap-1.5 h-8"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${scanStatus === 'scanning' ? 'animate-spin' : ''}`} />
              Rescan now
            </Button>
          </div>
          <Separator className="bg-zinc-800/60" />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSignOut}
            className="w-full gap-2 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-200">Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            InboxMap operates entirely in your browser. No email data, tokens, or personal information is ever sent to or stored on any server. All analysis happens locally on your device.
          </p>
          <Separator className="bg-zinc-800/60" />
          <div>
            <p className="text-sm font-medium text-zinc-300 mb-2">How to revoke access</p>
            <ol className="text-xs text-zinc-500 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Go to myaccount.google.com</li>
              <li>Navigate to Security → Third-party apps</li>
              <li>Find InboxMap and click Remove</li>
            </ol>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://myaccount.google.com/permissions', '_blank')}
            className="border-zinc-700 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800 text-xs gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Google Permissions
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
