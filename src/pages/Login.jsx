import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, MapPin, Shield } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/hooks/useAuth'
import { useGmailScan } from '@/hooks/useGmailScan'

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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,197,94,0.06)_0%,_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/25">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-zinc-50 tracking-tight mt-1">InboxMap</h1>
            <p className="text-zinc-400 text-sm text-center">See exactly who's cluttering your inbox</p>
          </div>

          <div className="space-y-2 mb-8">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> What we access
            </p>
            {[
              { ok: true, text: 'Sender names & email addresses' },
              { ok: true, text: 'Subject lines and dates' },
              { ok: false, text: 'Email body content' },
              { ok: false, text: 'Send or delete emails' },
              { ok: false, text: 'Store data on any server' },
            ].map(({ ok, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-green-500/15' : 'bg-zinc-800'}`}>
                  {ok ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <X className="w-3 h-3 text-zinc-500" />
                  )}
                </div>
                <span className={`text-sm ${ok ? 'text-zinc-300' : 'text-zinc-500'}`}>{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-zinc-600 mt-5">
            By continuing, you agree to our{' '}
            <a href="#" className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2">Privacy Policy</a>
            {' '}and{' '}
            <a href="#" className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2">Terms of Service</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
