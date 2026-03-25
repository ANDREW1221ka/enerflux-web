import type { Company } from '../../types/companies'

type CompanySelectProps = {
  companies: Company[]
  value: string
  disabled?: boolean
  error?: string
  onChange: (companyId: string) => void
  onCreateCompany: () => void
}

export function CompanySelect({
  companies,
  value,
  disabled = false,
  error,
  onChange,
  onCreateCompany,
}: CompanySelectProps) {
  const selectedCompanyExists = !value || companies.some((company) => company.id === value)

  return (
    <div className="company-select-field">
      <label>
        Empresa
        <div className="company-select-inline">
          <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
            <option value="">Selecciona una empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name} {company.active ? '' : '(Inactiva)'}
              </option>
            ))}
            {!selectedCompanyExists ? <option value={value}>Empresa actual no encontrada</option> : null}
          </select>
          <button type="button" className="secondary-button" onClick={onCreateCompany} disabled={disabled}>
            Nueva empresa
          </button>
        </div>
      </label>
      {error ? <span className="form-error">{error}</span> : null}
    </div>
  )
}
