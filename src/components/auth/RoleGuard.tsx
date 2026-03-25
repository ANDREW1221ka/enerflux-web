import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, type ClientRole, type UserRole } from '../../hooks/useAuth'

type RoleGuardProps = {
  allowedRoles: UserRole[]
  allowedClientRoles?: ClientRole[]
}

export function RoleGuard({ allowedRoles, allowedClientRoles }: RoleGuardProps) {
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

  if (allowedClientRoles && !allowedClientRoles.includes(profile.clientRole)) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
