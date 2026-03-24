import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute() {
  const location = useLocation()
  const { loading, profile, user } = useAuth()

  if (loading) {
    return <p>Cargando sesión...</p>
  }

  if (!user || !profile || !profile.active) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
