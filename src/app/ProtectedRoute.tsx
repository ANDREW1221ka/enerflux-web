import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const location = useLocation()
  const { loading, user } = useAuth()

  if (loading) {
    return <p>Cargando sesión...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
