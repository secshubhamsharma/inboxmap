import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppProvider } from '@/context/AppContext'
import { useApp } from '@/context/AppContext'
import Login from '@/pages/Login'
import AppShell from '@/components/layout/AppShell'
import Overview from '@/pages/Overview'
import AllSenders from '@/pages/AllSenders'
import CategoryPage from '@/pages/CategoryPage'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'

function ProtectedRoute({ children }) {
  const { accessToken } = useApp()
  if (!accessToken) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="senders" element={<AllSenders />} />
        <Route path="newsletters" element={<CategoryPage category="Newsletter" />} />
        <Route path="promotions" element={<CategoryPage category="Promotion" />} />
        <Route path="notifications" element={<CategoryPage category="Notification" />} />
        <Route path="social" element={<CategoryPage category="Social" />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Toaster position="bottom-right" theme="dark" />
      </AppProvider>
    </BrowserRouter>
  )
}
