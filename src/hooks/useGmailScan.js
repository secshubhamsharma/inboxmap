import { useCallback } from 'react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { scanInbox } from '../lib/gmail'

export function useGmailScan() {
  const {
    accessToken,
    settings,
    setSenders,
    setAccounts,
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
    toast.info('Scanning your inbox…')

    try {
      const { senders, accounts, totalScanned } = await scanInbox(
        accessToken,
        settings.scanDepth,
        ({ progress, message }) => {
          setScanProgress(progress)
          setScanMessage(message)
        }
      )
      setSenders(senders)
      setAccounts(accounts)
      setTotalScanned(totalScanned)
      setLastScanned(new Date())
      setScanStatus('done')
      toast.success(`Found ${accounts.length} services · ${senders.length} total senders`)
    } catch (err) {
      console.error(err)
      setScanStatus('error')
      toast.error('Scan failed — please try again')
    }
  }, [accessToken, scanStatus, settings.scanDepth, setSenders, setAccounts, setScanStatus, setScanProgress, setScanMessage, setTotalScanned, setLastScanned])

  return { startScan }
}
