import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DashboardProvider } from '@/stores/DashboardContext'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Layout from './components/layout/Layout'
import Index from './pages/Index'
import Database from './pages/Database'
import Reports from './pages/Reports'
import Management from './pages/Management'
import Predictability from './pages/Predictability'
import Goals from './pages/Goals'
import Insights from './pages/Insights'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import { ReactNode } from 'react'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" />
  return <>{children}</>
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <DashboardProvider>
          <Toaster />
          <Sonner position="top-center" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/predictability" element={<Predictability />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/management" element={<Management />} />
              <Route path="/database" element={<Database />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardProvider>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
