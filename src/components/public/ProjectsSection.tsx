type Project = {
  title: string
  description: string
  image: string
  imageAlt: string
  orientation: 'image-left' | 'image-right'
}

const fieldProjects: Project[] = [
  {
    title: 'Automatización de sala de bombas con PLC y variadores de frecuencia',
    description:
      'Implementación de lógica de control secuencial, integración de variadores de frecuencia y optimización de operación hidráulica para mejorar estabilidad y continuidad del sistema.',
    image: '/images/sala-bombas.jpg',
    imageAlt: 'Sala de bombas industrial con equipos de control y variadores de frecuencia',
    orientation: 'image-left',
  },
  {
    title: 'Monitoreo remoto y telemetría para instalaciones críticas',
    description:
      'Desarrollo de arquitectura de supervisión con visualización en tiempo real y gestión de alarmas para mejorar la trazabilidad y la respuesta ante eventos operacionales.',
    image: '/images/monitoreo-remoto.jpg',
    imageAlt: 'Supervisión técnica remota de variables críticas en planta industrial',
    orientation: 'image-right',
  },
  {
    title: 'Normalización y modernización de tableros eléctricos',
    description:
      'Actualización de tableros de fuerza y control bajo criterios técnicos actuales, mejorando seguridad, mantenibilidad y confiabilidad del sistema.',
    image: '/images/tablero-electrico.jpg',
    imageAlt: 'Tablero eléctrico industrial modernizado para continuidad operacional',
    orientation: 'image-left',
  },
]

export function ProjectsSection() {
  return (
    <section className="home-section home-projects" aria-labelledby="projects-title">
      <div className="home-section-header reveal reveal-up">
        <p className="home-kicker">Casos reales</p>
        <h2 id="projects-title">Implementaciones reales en terreno</h2>
        <p className="home-muted">
          Soluciones aplicadas en control, automatización y continuidad operacional.
        </p>
      </div>

      <div className="home-projects-list">
        {fieldProjects.map((project, index) => (
          <article
            key={project.title}
            className={`home-project-item ${project.orientation} reveal ${
              project.orientation === 'image-left' ? 'reveal-left' : 'reveal-right'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div
              className="home-project-image"
              role="img"
              aria-label={project.imageAlt}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.26), rgba(37, 99, 235, 0.16)), url('${project.image}')`,
              }}
            />
            <div className="home-project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <button className="home-inline-button" type="button" aria-label={`Ver más sobre ${project.title}`}>
                Ver más
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
