import { NavLink } from 'react-router-dom'

export function ContactCTASection() {
  return (
    <section className="home-cta" aria-labelledby="home-cta-title">
      <h2 id="home-cta-title">¿Evaluamos tu próximo proyecto técnico?</h2>
      <p>
        Coordinamos un levantamiento inicial para definir alcance, riesgos operativos y propuesta de
        implementación con foco en continuidad y control.
      </p>
      <NavLink className="hero-primary-button" to="/contacto">
        Solicitar evaluación técnica
      </NavLink>
    </section>
  )
}
