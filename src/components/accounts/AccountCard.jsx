import { useState } from 'react'
import { Calendar, Mail, Clock } from 'lucide-react'
import UnsubscribeButton from './UnsubscribeButton'
import { formatDate } from '@/lib/utils'

const STATUS_CONFIG = {
  active:  { label: 'Active',   cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
  dormant: { label: 'Dormant',  cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  ghost:   { label: 'Ghost',    cls: 'bg-zinc-700/50 text-zinc-500 border-zinc-700/50' },
}

export default function AccountCard({ account, dateFormat = 'DD/MM/YYYY' }) {
  const [imgError, setImgError] = useState(false)
  const status = STATUS_CONFIG[account.status] || STATUS_CONFIG.active
  const initial = account.serviceName[0]?.toUpperCase() || '?'

  return (
    <div className="group flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/30 transition-colors border-b border-zinc-800/40 last:border-0">
      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {!imgError ? (
          <img
            src={account.faviconUrl}
            alt={account.serviceName}
            className="w-6 h-6 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-sm font-bold text-zinc-400">{initial}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-zinc-200 truncate">{account.serviceName}</span>
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${status.cls}`}>
            {status.label}
          </span>
          {account.isAccountEmail && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Account
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-600 truncate mt-0.5">{account.senderEmail}</p>
      </div>

      <div className="hidden sm:flex items-center gap-5 text-xs text-zinc-500 flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-[90px]">
          <Calendar className="w-3.5 h-3.5 text-zinc-600" />
          <span>{formatDate(account.signupDate, dateFormat)}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-[90px]">
          <Clock className="w-3.5 h-3.5 text-zinc-600" />
          <span>{formatDate(account.lastEmailDate, dateFormat)}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-[60px]">
          <Mail className="w-3.5 h-3.5 text-zinc-600" />
          <span>{account.totalEmails} emails</span>
        </div>
      </div>

      <div className="flex-shrink-0 ml-2">
        <UnsubscribeButton domain={account.domain} url={account.unsubscribeUrl} compact />
      </div>
    </div>
  )
}
