import { NavLink, Outlet } from 'react-router-dom'

const publicLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/contacto', label: 'Contacto' },
]

export function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="public-header-inner">
          <NavLink to="/" className="brand" aria-label="Ir a inicio Enerflux SpA" end>
            Enerflux SpA
          </NavLink>
          <nav className="public-nav" aria-label="Navegación pública">
            {publicLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <NavLink className="client-access-button" to="/login">
            Ingreso clientes
          </NavLink>
        </div>
      </header>
      <main className="public-main">
        <div className="public-content">
          <Outlet />
        </div>
      </main>
      <footer className="public-footer">
        <div className="public-footer-inner">
          <p className="footer-company">Enerflux SpA</p>
          <a href="mailto:contacto@enerflux.cl">contacto@enerflux.cl</a>
          <p className="footer-copy">
            Soluciones técnicas confiables para proyectos energéticos y de automatización.
          </p>
        </div>
      </footer>
    </div>
  )
}
