import { NavLink, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div>
      <header>
        <h1>Enerflux App</h1>
        <nav aria-label="Navegación privada">
          <NavLink to="/app" end>
            Dashboard
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
