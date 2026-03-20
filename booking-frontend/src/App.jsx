import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toast } from './components/Toast'
import Navbar from './components/Navbar'

import LandingPage from './pages/LandingPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import ServicesPage from './pages/ServicesPage'
import DashboardPage from './pages/DashboardPage'
import { AdminDashboard, AdminBookingsPage, AdminServicesPage } from './pages/AdminPages'

// Redirect to login if not authenticated
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner" style={{ marginTop: 120 }} />
  return user ? children : <Navigate to="/login" replace />
}

// Redirect to home if not admin
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="spinner" style={{ marginTop: 120 }} />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/services" replace />
  return children
}

// Redirect logged-in users away from auth pages
function GuestRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (user) return <Navigate to={isAdmin ? '/admin' : '/services'} replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  const showNav = user !== null  // Hide navbar on landing/auth pages if you want — keep it always for simplicity

  return (
    <>
      {/* Show navbar only when user is logged in, or always — your choice */}
      {user && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* User routes */}
        <Route path="/services"  element={<PrivateRoute><ServicesPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

        {/* Admin routes */}
        <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
        <Route path="/admin/services" element={<AdminRoute><AdminServicesPage /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toast />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
