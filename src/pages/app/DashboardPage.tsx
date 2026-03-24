import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOutUser } = useAuth()

  async function handleSignOut() {
    await signOutUser()
    navigate('/login', { replace: true })
  }

  return (
    <section>
      <h2>Bienvenido</h2>
      <p>{user?.email ?? 'Usuario autenticado'}</p>
      <button type="button" onClick={handleSignOut}>
        Cerrar sesión
      </button>
    </section>
  )
}
