import { NavLink, Outlet } from 'react-router-dom'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/login', label: 'Login' },
]

export function PublicLayout() {
  return (
    <div>
      <header>
        <h1>Enerflux SpA</h1>
        <nav aria-label="Navegación pública">
          {publicLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
