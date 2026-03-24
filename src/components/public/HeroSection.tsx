import { NavLink } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-backdrop" aria-hidden="true" />
      <div className="home-hero-content reveal reveal-up">
        <p className="home-eyebrow">Enerflux SpA · Ingeniería eléctrica y automatización</p>
        <h1 id="home-hero-title">
          Instalaciones eléctricas, automatización industrial y monitoreo remoto
        </h1>
        <p className="home-hero-subtitle">
          Diseñamos e integramos soluciones para tableros de fuerza y control, sistemas PLC/HMI,
          telemetría y mantenimiento técnico orientado a continuidad operacional y seguridad de
          procesos.
        </p>
        <div className="home-hero-actions">
          <NavLink className="hero-primary-button" to="/proyectos">
            Ver proyectos
          </NavLink>
          <NavLink className="hero-secondary-button" to="/login">
            Ingreso clientes
          </NavLink>
        </div>
      </div>
    </section>
  )
}
