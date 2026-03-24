import { NavLink } from 'react-router-dom'

type Project = {
  name: string
  description: string
  image: string
  imageAlt: string
  orientation: 'image-left' | 'image-right' | 'full-image'
}

const featuredProjects: Project[] = [
  {
    name: 'Normalización de tableros principales en planta industrial',
    description:
      'Ingeniería y recambio de tableros de distribución con selectividad de protecciones, nueva instrumentación de potencia y pruebas FAT/SAT para continuidad operacional.',
    image: '/images/proyecto-tablero.svg',
    imageAlt: 'Proyecto de tableros eléctricos de distribución y control en sala técnica',
    orientation: 'image-left',
  },
  {
    name: 'Automatización de sala de bombas con PLC y HMI',
    description:
      'Integración de control secuencial, variadores de frecuencia y visualización local/remota para optimizar disponibilidad hidráulica y tiempos de respuesta de operación.',
    image: '/images/sala-bombas.svg',
    imageAlt: 'Sala de bombas industrial con sistema de automatización y monitoreo',
    orientation: 'image-right',
  },
  {
    name: 'Monitoreo remoto para red multi-sitio de procesos críticos',
    description:
      'Implementación de arquitectura de telemetría con adquisición de datos PLC/HMI, alarmas por condición y panel de supervisión técnica para mantenimiento basado en condición.',
    image: '/images/plc-control.svg',
    imageAlt: 'Pantalla de control PLC HMI con métricas y estados de monitoreo en terreno',
    orientation: 'full-image',
  },
]

export function ProjectsSection() {
  return (
    <section className="home-section home-projects" aria-labelledby="projects-title">
      <div className="home-section-header home-section-header-inline reveal reveal-up">
        <div>
          <p className="home-kicker">Implementaciones en terreno</p>
          <h2 id="projects-title">Proyectos destacados</h2>
          <p className="home-muted">Ingeniería aplicada en energía, control y continuidad operacional.</p>
        </div>
        <NavLink className="home-text-link" to="/proyectos">
          Revisar portafolio completo
        </NavLink>
      </div>

      <div className="home-projects-list">
        {featuredProjects.map((project, index) => (
          <article
            key={project.name}
            className={`home-project-item ${project.orientation} reveal reveal-side`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div
              className="home-project-image"
              role="img"
              aria-label={project.imageAlt}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.22), rgba(37, 99, 235, 0.2)), url('${project.image}')`,
              }}
            />
            <div className="home-project-content">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <NavLink className="home-inline-link" to="/proyectos">
                Ver más
              </NavLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
