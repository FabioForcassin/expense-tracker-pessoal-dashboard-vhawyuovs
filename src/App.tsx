import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import AdminUsers from './pages/admin/Users'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import UpdatePassword from './pages/UpdatePassword'
import { ReactNode, useEffect } from 'react'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" />
  return <>{children}</>
}

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (profile?.role !== 'admin') return <Navigate to="/" />
  return <>{children}</>
}

const AuthFlowHandler = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const hash = window.location.hash
    if (hash && (hash.includes('type=invite') || hash.includes('type=recovery'))) {
      navigate('/update-password')
    }
  }, [navigate])
  return null
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <DashboardProvider>
          <AuthFlowHandler />
          <Toaster />
          <Sonner position="top-center" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/update-password" element={<UpdatePassword />} />
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
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardProvider>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
