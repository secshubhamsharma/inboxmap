import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Inbox, BarChart2, Download, Shield, Zap, Users } from 'lucide-react'
import BrandLogo from '@/components/shared/BrandLogo'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/hooks/useAuth'
import { useGmailScan } from '@/hooks/useGmailScan'

const FEATURES = [
  {
    icon: Inbox,
    title: 'Account discovery',
    desc: 'Find every service and company that has your email address — even ones you forgot.',
  },
  {
    icon: BarChart2,
    title: 'One-click unsubscribe',
    desc: 'Every bulk sender is legally required to include an unsubscribe link. We surface it instantly.',
  },
  {
    icon: Download,
    title: 'Dead weight report',
    desc: 'See which senders have gone silent for months. Clean them out in one session.',
  },
]

const PERMISSIONS = [
  { ok: true,  text: 'Read sender names and email addresses' },
  { ok: true,  text: 'Read subject lines and dates' },
  { ok: true,  text: 'Read unsubscribe headers (List-Unsubscribe)' },
  { ok: true,  text: 'Read a sample of email body content (tracker detection only)' },
  { ok: false, text: 'Store email content anywhere' },
  { ok: false, text: 'Send, delete or modify emails' },
  { ok: false, text: 'Store anything on any server' },
]

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function Login() {
  const { accessToken, settings } = useApp()
  const { signIn } = useAuth()
  const { startScan } = useGmailScan()
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken) {
      navigate('/app/overview')
      if (settings.autoRescan) startScan()
    }
  }, [accessToken])

  return (
    <div className="min-h-screen bg-zinc-950 flex overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,rgba(34,197,94,0.04),transparent)]" />

      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative z-10 border-r border-zinc-800/40">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={34} uid="login-left" />
          <span className="font-logo font-semibold text-zinc-50 text-xl tracking-tight">InboxMap</span>
        </div>

        <div className="space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 mb-6">
              <Zap className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">100% browser-based · zero storage</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-zinc-50 leading-[1.15] tracking-tight">
              Your inbox,<br />finally mapped.
            </h1>
            <p className="text-zinc-400 text-base mt-4 leading-relaxed max-w-xs">
              Connect Gmail once. Get a full breakdown of every sender, how often they email you, and what category they fall into.
            </p>
          </div>

          <div className="space-y-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{title}</p>
                  <p className="text-sm text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <Users className="w-3.5 h-3.5" />
          <span>Reads headers only · Never touches email content</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[400px]"
        >
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <BrandLogo size={28} uid="login-mobile" />
            <span className="font-logo font-semibold text-zinc-50 tracking-tight">InboxMap</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-zinc-50 tracking-tight">Get started</h2>
            <p className="text-zinc-500 text-sm mt-1.5">Connect your Gmail to analyze your inbox</p>
          </div>

          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-zinc-900 font-semibold py-3 px-5 rounded-xl transition-all duration-150 text-sm shadow-sm border border-zinc-200 group"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="mt-8 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Permissions</span>
            </div>
            {PERMISSIONS.map(({ ok, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-green-500/15' : 'bg-zinc-800'}`}>
                  {ok
                    ? <Check className="w-2.5 h-2.5 text-green-400" strokeWidth={3} />
                    : <X className="w-2.5 h-2.5 text-zinc-600" strokeWidth={3} />
                  }
                </div>
                <span className={`text-xs ${ok ? 'text-zinc-300' : 'text-zinc-600'}`}>{text}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-zinc-600 mt-6">
            By continuing you agree to our{' '}
            <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">Privacy Policy</a>
            {' '}and{' '}
            <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">Terms of Service</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
