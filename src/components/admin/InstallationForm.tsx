import { useMemo, useState, type FormEvent } from 'react'
import type { Company } from '../../types/companies'
import {
  DEFAULT_INSTALLATION_CAPABILITIES,
  DEFAULT_INSTALLATION_CATEGORY,
  DEFAULT_INSTALLATION_TYPE,
  INSTALLATION_CATEGORIES,
  INSTALLATION_TYPES,
  type CreateInstallationPayload,
} from '../../types/installations'

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

type InstallationFormErrors = Partial<Record<'name' | 'companyId' | 'type' | 'locationAddress', string>>

const INITIAL_VALUES: InstallationFormValues = {
  name: '',
  companyId: '',
  companyName: '',
  category: DEFAULT_INSTALLATION_CATEGORY,
  type: DEFAULT_INSTALLATION_TYPE,
  active: true,
  clientVisible: true,
  capabilities: DEFAULT_INSTALLATION_CAPABILITIES,
}

function normalizeValues(defaultValues?: Partial<InstallationFormValues>): InstallationFormValues {
  return {
    ...INITIAL_VALUES,
    ...defaultValues,
    category: defaultValues?.category ?? DEFAULT_INSTALLATION_CATEGORY,
    type: defaultValues?.type ?? DEFAULT_INSTALLATION_TYPE,
    clientVisible: defaultValues?.clientVisible ?? true,
    capabilities: {
      ...DEFAULT_INSTALLATION_CAPABILITIES,
      ...defaultValues?.capabilities,
    },
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

  if (!(values.location?.address?.trim())) {
    errors.locationAddress = 'La ubicación es obligatoria.'
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
      ...values,
      name: values.name.trim(),
      companyId: values.companyId,
      companyName: selectedCompany?.name ?? values.companyName,
      subtype: values.subtype?.trim(),
      description: values.description?.trim(),
      location: {
        ...values.location,
        address: values.location?.address?.trim(),
      },
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
        Categoría
        <select
          value={values.category}
          onChange={(event) =>
            setValues((current) => ({ ...current, category: event.target.value as InstallationFormValues['category'] }))
          }
        >
          {INSTALLATION_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Tipo
        <select
          value={values.type}
          onChange={(event) =>
            setValues((current) => ({ ...current, type: event.target.value as InstallationFormValues['type'] }))
          }
        >
          {INSTALLATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type ? <span className="form-error">{errors.type}</span> : null}
      </label>

      <label>
        Subtipo
        <input
          type="text"
          value={values.subtype ?? ''}
          onChange={(event) => setValues((current) => ({ ...current, subtype: event.target.value }))}
          placeholder="custom subtype"
        />
      </label>

      <label>
        Ubicación
        <input
          type="text"
          value={values.location?.address ?? ''}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              location: {
                ...current.location,
                address: event.target.value,
              },
            }))
          }
          placeholder="Quilicura, RM"
        />
        {errors.locationAddress ? <span className="form-error">{errors.locationAddress}</span> : null}
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

      <label>
        Descripción
        <textarea
          value={values.description ?? ''}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
          placeholder="Descripción técnica de la instalación"
          rows={3}
        />
      </label>

      <label className="user-form-checkbox">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(event) => setValues((current) => ({ ...current, active: event.target.checked }))}
        />
        Activa
      </label>

      <label className="user-form-checkbox">
        <input
          type="checkbox"
          checked={values.clientVisible}
          onChange={(event) => setValues((current) => ({ ...current, clientVisible: event.target.checked }))}
        />
        Visible para cliente
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
