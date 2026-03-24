type Service = {
  title: string
  description: string
  icon: string
}

const services: Service[] = [
  {
    title: 'Instalaciones eléctricas',
    description:
      'Montaje y modernización de infraestructura de baja y media tensión con ingeniería de detalle, protección selectiva y pruebas de puesta en servicio.',
    icon: '⚡',
  },
  {
    title: 'Automatización y control',
    description:
      'Desarrollo de lógica PLC, HMI y redes industriales para operación estable, trazabilidad de variables críticas y respuesta segura ante eventos.',
    icon: '🧠',
  },
  {
    title: 'Monitoreo remoto',
    description:
      'Telemetría en tiempo real para estados eléctricos y de proceso con acceso remoto seguro, alarmística y reporte técnico operacional.',
    icon: '📡',
  },
  {
    title: 'Mantenimiento',
    description:
      'Planes preventivos y correctivos sobre activos eléctricos y de control, priorizando disponibilidad de equipos y reducción de detenciones.',
    icon: '🛠️',
  },
]

export function ServicesSection() {
  return (
    <section className="home-section home-services" aria-labelledby="services-title">
      <div className="home-section-header reveal reveal-up">
        <p className="home-kicker">Capacidades técnicas</p>
        <h2 id="services-title">Servicios clave para entornos industriales exigentes</h2>
      </div>

      <div className="home-services-grid">
        {services.map((service, index) => (
          <article
            key={service.title}
            className="home-service-item reveal reveal-up"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <div className="home-service-icon" aria-hidden="true">
              <span>{service.icon}</span>
            </div>
            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
