import { NavLink } from 'react-router-dom'

export function ContactCTASection() {
  return (
    <section className="home-cta reveal reveal-up" aria-labelledby="home-cta-title">
      <p className="home-kicker">Contacto técnico</p>
      <h2 id="home-cta-title">¿Necesitas una solución técnica para tu instalación?</h2>
      <p>
        Conversemos sobre tu operación y definamos una propuesta de implementación eléctrica y de
        control alineada a seguridad, disponibilidad y crecimiento.
      </p>
      <NavLink className="hero-primary-button" to="/contacto">
        Contactar
      </NavLink>
    </section>
  )
}
