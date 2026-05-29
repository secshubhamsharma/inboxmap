import { useCallback } from 'react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { scanInbox } from '../lib/gmail'

export function useGmailScan() {
  const {
    accessToken,
    settings,
    setSenders,
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
      const { senders, totalScanned } = await scanInbox(
        accessToken,
        settings.scanDepth,
        ({ progress, message }) => {
          setScanProgress(progress)
          setScanMessage(message)
        }
      )
      setSenders(senders)
      setTotalScanned(totalScanned)
      setLastScanned(new Date())
      setScanStatus('done')
      toast.success(`Inbox scanned — ${senders.length} senders found`)
    } catch (err) {
      console.error(err)
      setScanStatus('error')
      toast.error('Scan failed — please try again')
    }
  }, [
    accessToken,
    scanStatus,
    settings.scanDepth,
    setSenders,
    setScanStatus,
    setScanProgress,
    setScanMessage,
    setTotalScanned,
    setLastScanned,
  ])

  return { startScan }
}
