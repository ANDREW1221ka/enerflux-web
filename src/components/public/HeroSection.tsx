import { NavLink } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <p className="home-eyebrow">Ingeniería eléctrica aplicada</p>
      <h1 id="home-hero-title">
        Instalaciones eléctricas, automatización industrial y monitoreo remoto para operaciones
        críticas.
      </h1>
      <p className="home-hero-subtitle">
        Diseñamos, implementamos y mantenemos soluciones técnicas con integración de tableros,
        instrumentación, control y telemetría para continuidad operativa y trazabilidad energética.
      </p>
      <div className="home-hero-actions">
        <NavLink className="hero-primary-button" to="/proyectos">
          Ver proyectos
        </NavLink>
        <NavLink className="hero-secondary-button" to="/login">
          Ingreso clientes
        </NavLink>
      </div>
    </section>
  )
}
