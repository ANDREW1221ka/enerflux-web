import { NavLink } from 'react-router-dom'

type Project = {
  name: string
  scope: string
  stack: string
  result: string
}

const featuredProjects: Project[] = [
  {
    name: 'Modernización de sala eléctrica - Planta de alimentos',
    scope: 'Reemplazo de tableros, protección selectiva y actualización de canalizaciones.',
    stack: 'ETAP, tableros IEC, variadores de frecuencia y medición trifásica.',
    result: 'Reducción de 28% en interrupciones por fallas eléctricas durante los primeros 6 meses.',
  },
  {
    name: 'Sistema SCADA para estación de bombeo',
    scope: 'Integración de PLC, comunicaciones industriales y visualización remota 24/7.',
    stack: 'PLC Siemens, SCADA web, VPN industrial y alarmística por eventos críticos.',
    result: 'Tiempo de respuesta operacional reducido de 45 a 12 minutos en incidentes monitoreados.',
  },
  {
    name: 'Telemetría energética multi-sitio',
    scope: 'Centralización de consumo, calidad de energía y estados operativos en múltiples sedes.',
    stack: 'Medidores inteligentes, gateway IoT y paneles técnicos de indicadores.',
    result: 'Base de datos consolidada para decisiones de eficiencia y mantenimiento predictivo.',
  },
]

export function ProjectsSection() {
  return (
    <section className="home-section" aria-labelledby="projects-title">
      <div className="home-section-header home-section-header-inline">
        <div>
          <h2 id="projects-title">Proyectos destacados</h2>
          <p>Referencias técnicas representativas de implementación real en terreno.</p>
        </div>
        <NavLink className="home-text-link" to="/proyectos">
          Revisar portafolio completo
        </NavLink>
      </div>

      <div className="home-projects-list">
        {featuredProjects.map((project) => (
          <article key={project.name} className="home-card home-project-card">
            <h3>{project.name}</h3>
            <p>
              <strong>Alcance:</strong> {project.scope}
            </p>
            <p>
              <strong>Tecnologías:</strong> {project.stack}
            </p>
            <p>
              <strong>Resultado:</strong> {project.result}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
