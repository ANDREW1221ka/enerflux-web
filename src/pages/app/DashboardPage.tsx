import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function DashboardPage() {
  const navigate = useNavigate()
  const { profile, signOutUser } = useAuth()

  const isClientMonitor = profile?.role === 'client_user' && profile.clientRole === 'client_monitor'
  const isClientAdmin = profile?.role === 'client_user' && profile.clientRole === 'client_admin'

  async function handleSignOut() {
    await signOutUser()
    navigate('/login', { replace: true })
  }

  return (
    <section className="dashboard-page">
      <header>
        <h2>Bienvenido a Enerflux</h2>
        <p>Este es tu panel base de cliente.</p>
      </header>

      <dl className="dashboard-details">
        <div>
          <dt>Nombre</dt>
          <dd>{profile?.displayName ?? 'Sin nombre'}</dd>
        </div>
        <div>
          <dt>Empresa</dt>
          <dd>{profile?.companyName ?? 'Sin empresa'}</dd>
        </div>
        <div>
          <dt>ID Empresa</dt>
          <dd>{profile?.companyId ?? 'Sin ID'}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{profile?.email ?? 'Sin email'}</dd>
        </div>
        <div>
          <dt>Rol</dt>
          <dd>{profile?.role ?? 'Sin rol'}</dd>
        </div>
        <div>
          <dt>Rol cliente</dt>
          <dd>{profile?.clientRole ?? 'Sin rol cliente'}</dd>
        </div>
      </dl>

      {isClientMonitor ? (
        <p className="admin-flow-note">Perfil monitor: acceso de solo lectura. Las acciones de edición están deshabilitadas.</p>
      ) : null}
      {isClientAdmin ? (
        <p className="admin-flow-note">Perfil administrador cliente: habilitado para gestionar acciones permitidas de su dashboard.</p>
      ) : null}

      <button type="button" className="dashboard-signout" onClick={handleSignOut}>
        Cerrar sesión
      </button>
    </section>
  )
}
