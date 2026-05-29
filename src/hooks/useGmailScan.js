import { useCallback } from 'react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { scanInbox, runTrackerScan } from '../lib/gmail'
import { matchBreaches } from '../lib/breach'

export function useGmailScan() {
  const {
    accessToken,
    settings,
    setSenders,
    setAccounts,
    setAuthStats,
    setBreaches,
    setTrackers,
    setTrackerScanStatus,
    setScanStatus,
    setScanProgress,
    setScanMessage,
    setTotalScanned,
    setLastScanned,
    scanStatus,
  } = useApp()

  const startScan = useCallback(async () => {
    if (!accessToken || scanStatus === 'scanning') return

    setScanStatus('scanning')
    setScanProgress(0)
    setScanMessage('Starting scan…')
    setTrackerScanStatus('idle')
    toast.info('Scanning your inbox…')

    try {
      const { senders, accounts, authStats, totalScanned } = await scanInbox(
        accessToken,
        settings.scanDepth,
        ({ progress, message }) => {
          setScanProgress(progress)
          setScanMessage(message)
        }
      )

      setSenders(senders)
      setAccounts(accounts)
      setAuthStats(authStats || {})
      setTotalScanned(totalScanned)
      setLastScanned(new Date())
      setScanStatus('done')
      toast.success(`Found ${accounts.length} services · ${senders.length} total senders`)

      matchBreaches(accounts)
        .then((results) => setBreaches(results))
        .catch(() => {})

      setTrackerScanStatus('scanning')
      runTrackerScan(accessToken, senders, () => {})
        .then((trackerMap) => {
          setTrackers(trackerMap)
          setTrackerScanStatus('done')
          const count = Object.values(trackerMap).filter((t) => t.trackers.length > 0).length
          if (count > 0) toast.info(`${count} senders are tracking your email opens`)
        })
        .catch(() => setTrackerScanStatus('error'))
    } catch (err) {
      console.error(err)
      setScanStatus('error')
      toast.error('Scan failed — please try again')
    }
  }, [accessToken, scanStatus, settings.scanDepth, setSenders, setAccounts, setAuthStats, setBreaches, setTrackers, setTrackerScanStatus, setScanStatus, setScanProgress, setScanMessage, setTotalScanned, setLastScanned])

  return { startScan }
}
