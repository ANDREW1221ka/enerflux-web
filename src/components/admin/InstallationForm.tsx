import { useMemo, useState, type FormEvent } from 'react'
import type { Company } from '../../types/companies'
import type { CreateInstallationPayload } from '../../types/installations'

export type InstallationFormValues = CreateInstallationPayload

type InstallationFormProps = {
  companies: Company[]
  defaultValues?: Partial<InstallationFormValues>
  submitting?: boolean
  serverError?: string | null
  submitLabel?: string
  onCancel: () => void
  onSubmit: (values: InstallationFormValues) => Promise<void>
}

type InstallationFormErrors = Partial<Record<keyof InstallationFormValues, string>>

const INITIAL_VALUES: InstallationFormValues = {
  name: '',
  companyId: '',
  companyName: '',
  type: '',
  location: '',
  active: true,
}

function normalizeValues(defaultValues?: Partial<InstallationFormValues>): InstallationFormValues {
  return {
    ...INITIAL_VALUES,
    ...defaultValues,
  }
}

function validate(values: InstallationFormValues, companies: Company[]): InstallationFormErrors {
  const errors: InstallationFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'El nombre de instalación es obligatorio.'
  }

  if (!values.type.trim()) {
    errors.type = 'El tipo es obligatorio.'
  }

  if (!values.location.trim()) {
    errors.location = 'La ubicación es obligatoria.'
  }

  if (!values.companyId.trim()) {
    errors.companyId = 'Selecciona una empresa para la instalación.'
  } else if (!companies.some((company) => company.id === values.companyId)) {
    errors.companyId = 'Selecciona una empresa válida.'
  }

  return errors
}

export function InstallationForm({
  companies,
  defaultValues,
  submitting = false,
  serverError = null,
  submitLabel = 'Crear instalación',
  onCancel,
  onSubmit,
}: InstallationFormProps) {
  const [values, setValues] = useState<InstallationFormValues>(normalizeValues(defaultValues))
  const [errors, setErrors] = useState<InstallationFormErrors>({})

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === values.companyId) ?? null,
    [companies, values.companyId],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(values, companies)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    await onSubmit({
      name: values.name.trim(),
      companyId: values.companyId,
      companyName: selectedCompany?.name ?? values.companyName,
      type: values.type.trim(),
      location: values.location.trim(),
      active: values.active,
    })
  }

  const handleCompanySelection = (companyId: string) => {
    const company = companies.find((item) => item.id === companyId)

    setValues((current) => ({
      ...current,
      companyId,
      companyName: company?.name ?? '',
    }))
  }

  return (
    <form className="user-form" onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Nombre
        <input
          type="text"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          placeholder="Planta Solar Quilicura"
        />
        {errors.name ? <span className="form-error">{errors.name}</span> : null}
      </label>

      <label>
        Tipo
        <input
          type="text"
          value={values.type}
          onChange={(event) => setValues((current) => ({ ...current, type: event.target.value }))}
          placeholder="Solar fotovoltaica"
        />
        {errors.type ? <span className="form-error">{errors.type}</span> : null}
      </label>

      <label>
        Ubicación
        <input
          type="text"
          value={values.location}
          onChange={(event) => setValues((current) => ({ ...current, location: event.target.value }))}
          placeholder="Quilicura, RM"
        />
        {errors.location ? <span className="form-error">{errors.location}</span> : null}
      </label>

      <label>
        Empresa
        <select value={values.companyId} onChange={(event) => handleCompanySelection(event.target.value)}>
          <option value="">Selecciona una empresa</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name} {company.active ? '' : '(Inactiva)'}
            </option>
          ))}
        </select>
        {errors.companyId ? <span className="form-error">{errors.companyId}</span> : null}
      </label>

      <label className="user-form-checkbox">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(event) => setValues((current) => ({ ...current, active: event.target.checked }))}
        />
        Activa
      </label>

      {serverError ? <p className="form-error">{serverError}</p> : null}

      <footer className="user-form-actions">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>
          Cancelar
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </footer>
    </form>
  )
}
