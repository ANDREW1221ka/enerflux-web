import { NavLink } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-backdrop" aria-hidden="true" />
      <div className="home-hero-content reveal reveal-up">
        <p className="home-eyebrow">Enerflux SpA · Ingeniería aplicada en terreno</p>
        <h1 id="home-hero-title">
          Soluciones técnicas en instalaciones eléctricas, automatización y monitoreo
        </h1>
        <p className="home-hero-subtitle">
          Acompañamos a nuestros clientes con soluciones confiables, integrando control,
          supervisión y continuidad operacional.
        </p>
        <div className="home-hero-actions">
          <NavLink className="hero-primary-button" to="/proyectos">
            Ver implementaciones
          </NavLink>
          <NavLink className="hero-secondary-button" to="/login">
            Ingreso clientes
          </NavLink>
        </div>
      </div>
    </section>
  )
}
