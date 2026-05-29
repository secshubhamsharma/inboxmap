import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[220px] border-zinc-800">
          <Sidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
