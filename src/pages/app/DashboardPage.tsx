import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function DashboardPage() {
  const navigate = useNavigate()
  const { profile, signOutUser } = useAuth()

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
          <dt>Email</dt>
          <dd>{profile?.email ?? 'Sin email'}</dd>
        </div>
      </dl>

      <button type="button" className="dashboard-signout" onClick={handleSignOut}>
        Cerrar sesión
      </button>
    </section>
  )
}
