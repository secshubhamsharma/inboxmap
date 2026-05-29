import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const DEFAULT_SETTINGS = {
  scanDepth: 500,
  autoRescan: true,
  includeSpam: false,
  showFullEmails: true,
  minCount: 1,
  dateFormat: 'DD/MM/YYYY',
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('inboxmap_settings')
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [senders, setSenders] = useState([])
  const [accounts, setAccounts] = useState([])
  const [authStats, setAuthStats] = useState({})
  const [breaches, setBreaches] = useState([])
  const [trackers, setTrackers] = useState({})
  const [trackerScanStatus, setTrackerScanStatus] = useState('idle')
  const [scanStatus, setScanStatus] = useState('idle')
  const [scanProgress, setScanProgress] = useState(0)
  const [scanMessage, setScanMessage] = useState('')
  const [totalScanned, setTotalScanned] = useState(0)
  const [lastScanned, setLastScanned] = useState(null)
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    localStorage.setItem('inboxmap_settings', JSON.stringify(settings))
  }, [settings])

  function updateSettings(partial) {
    setSettings((prev) => ({ ...prev, ...partial }))
  }

  function signOut() {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken)
    }
    setUser(null)
    setAccessToken(null)
    setSenders([])
    setAccounts([])
    setAuthStats({})
    setBreaches([])
    setTrackers({})
    setTrackerScanStatus('idle')
    setScanStatus('idle')
    setScanProgress(0)
    setScanMessage('')
    setTotalScanned(0)
    setLastScanned(null)
  }

  return (
    <AppContext.Provider
      value={{
        user, setUser,
        accessToken, setAccessToken,
        senders, setSenders,
        accounts, setAccounts,
        authStats, setAuthStats,
        breaches, setBreaches,
        trackers, setTrackers,
        trackerScanStatus, setTrackerScanStatus,
        scanStatus, setScanStatus,
        scanProgress, setScanProgress,
        scanMessage, setScanMessage,
        totalScanned, setTotalScanned,
        lastScanned, setLastScanned,
        settings, updateSettings,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
