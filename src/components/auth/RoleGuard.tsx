import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, type UserRole } from '../../hooks/useAuth'

type RoleGuardProps = {
  allowedRoles: UserRole[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { loading, profile } = useAuth()

  if (loading) {
    return <p>Cargando permisos...</p>
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
