type CompanySummaryCardProps = {
  companyName: string
  companyId: string
  installationsCount: number
}

export function CompanySummaryCard({
  companyName,
  companyId,
  installationsCount,
}: CompanySummaryCardProps) {
  return (
    <article className="company-summary-card" aria-label="Resumen de empresa">
      <h3>{companyName}</h3>
      <dl>
        <div>
          <dt>ID Empresa</dt>
          <dd>{companyId || 'Sin ID'}</dd>
        </div>
        <div>
          <dt>Instalaciones</dt>
          <dd>{installationsCount}</dd>
        </div>
      </dl>
    </article>
  )
}
