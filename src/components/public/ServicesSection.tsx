const services = [
  {
    title: 'Instalaciones eléctricas de baja y media tensión',
    description:
      'Ejecución de obras eléctricas con criterios normativos, ingeniería de detalle y puesta en marcha documentada.',
  },
  {
    title: 'Automatización y control de procesos',
    description:
      'Desarrollo de arquitectura de control con PLC, HMI y SCADA para mejorar estabilidad, seguridad y eficiencia operativa.',
  },
  {
    title: 'Monitoreo remoto y telemetría',
    description:
      'Integración de sensores, adquisición de datos y visualización en tiempo real para diagnóstico y toma de decisiones.',
  },
  {
    title: 'Mantenimiento técnico y continuidad operacional',
    description:
      'Planes preventivos y correctivos sobre infraestructura eléctrica y de automatización para minimizar detenciones no programadas.',
  },
]

export function ServicesSection() {
  return (
    <section className="home-section" aria-labelledby="services-title">
      <div className="home-section-header">
        <h2 id="services-title">Servicios destacados</h2>
        <p>Capacidades orientadas a entornos industriales, comerciales y energéticos.</p>
      </div>
      <div className="home-services-grid">
        {services.map((service) => (
          <article key={service.title} className="home-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
