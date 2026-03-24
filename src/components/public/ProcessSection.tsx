type ProcessStage = {
  title: string
  description: string
  icon: string
}

const processStages: ProcessStage[] = [
  {
    title: '1. Evaluación técnica',
    description:
      'Análisis de la instalación existente, levantamiento de información y detección de puntos críticos.',
    icon: '🧪',
  },
  {
    title: '2. Diseño de solución',
    description:
      'Definición de arquitectura de control, selección de equipos y planteamiento de solución técnica.',
    icon: '📐',
  },
  {
    title: '3. Implementación',
    description:
      'Ejecución de trabajos en terreno, integración de sistemas y puesta en marcha.',
    icon: '🔧',
  },
  {
    title: '4. Seguimiento y soporte',
    description:
      'Monitoreo, ajustes y acompañamiento técnico para asegurar continuidad operacional.',
    icon: '📈',
  },
]

export function ProcessSection() {
  return (
    <section className="home-section home-process" aria-labelledby="process-title">
      <div className="home-section-header reveal reveal-up">
        <p className="home-kicker">Metodología</p>
        <h2 id="process-title">Cómo trabajamos</h2>
      </div>

      <div className="home-process-grid">
        {processStages.map((stage, index) => (
          <article
            key={stage.title}
            className="home-process-item reveal reveal-up"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <div className="home-process-icon" aria-hidden="true">
              <span>{stage.icon}</span>
            </div>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
