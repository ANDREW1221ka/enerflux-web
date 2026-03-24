type Collaborator = {
  name: string
}

const collaborators: Collaborator[] = [
  { name: 'ServimacB' },
  { name: 'Universidad de Chile – Facultad de Derecho' },
  { name: 'H20 Ingeniería SpA' },
  { name: 'Otros clientes y colaboradores' },
]

export function ClientsSection() {
  return (
    <section className="home-section home-clients" aria-labelledby="clients-title">
      <div className="home-section-header reveal reveal-up">
        <p className="home-kicker">Experiencia aplicada</p>
        <h2 id="clients-title">Empresas y colaboradores</h2>
        <p>
          Hemos participado en implementaciones técnicas junto a distintas organizaciones e
          instituciones.
        </p>
      </div>

      <div className="home-clients-grid" role="list" aria-label="Empresas y colaboradores">
        {collaborators.map((collaborator, index) => (
          <article
            key={collaborator.name}
            className="home-client-item reveal reveal-up"
            style={{ transitionDelay: `${index * 70}ms` }}
            role="listitem"
          >
            <span className="home-client-marker" aria-hidden="true" />
            <h3>{collaborator.name}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}
