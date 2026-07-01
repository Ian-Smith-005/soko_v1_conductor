import { createBrowserRouter, Navigate } from 'react-router-dom'
import OperatorLayout from './operator/components/OperatorLayout'
import OperatorAuth from './operator/pages/OperatorAuth'
import OperatorDashboard from './operator/pages/OperatorDashboard'
import OperatorTripLog from './operator/pages/OperatorTripLog'
import OperatorRoute from './operator/pages/OperatorRoute'
import OperatorProfile from './operator/pages/OperatorProfile'
import { useOperatorAuthStore } from './operator/store/operatorAuthStore'

function Guard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useOperatorAuthStore()
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  { path: '/',         element: <OperatorAuth /> },
  { path: '/auth',     element: <OperatorAuth /> },
  {
    path: '/',
    element: <Guard><OperatorLayout /></Guard>,
    children: [
      { path: 'dashboard', element: <OperatorDashboard /> },
      { path: 'trips',     element: <OperatorTripLog /> },
      { path: 'route',     element: <OperatorRoute /> },
      { path: 'profile',   element: <OperatorProfile /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
