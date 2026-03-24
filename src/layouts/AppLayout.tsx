import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AppLayout() {
  const { profile } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <h1>Enerflux App</h1>
          <nav className="app-nav" aria-label="Navegación privada">
            <NavLink to="/app" end>
              Dashboard
            </NavLink>
            {profile?.role === 'admin' ? <NavLink to="/app/admin">Administración</NavLink> : null}
          </nav>
        </div>
      </header>
      <main className="app-main">
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
