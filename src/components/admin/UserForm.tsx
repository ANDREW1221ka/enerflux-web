import { useMemo, useState, type FormEvent } from 'react'
import type { CreateUserPayload } from '../../types/adminUsers'
import type { Company, CreateCompanyPayload } from '../../types/companies'
import { CompanyForm } from './CompanyForm'
import { CompanySelect } from './CompanySelect'

export type UserFormValues = CreateUserPayload

type UserFormProps = {
  companies: Company[]
  defaultValues?: Partial<UserFormValues>
  platformAdminExists?: boolean
  submitting?: boolean
  serverError?: string | null
  submitLabel?: string
  emailDisabled?: boolean
  roleDisabled?: boolean
  onCancel: () => void
  onCreateCompany: (values: CreateCompanyPayload) => Promise<Company>
  onSubmit: (values: UserFormValues) => Promise<void>
}

type UserFormErrors = Partial<Record<keyof UserFormValues, string>>

const INITIAL_VALUES: UserFormValues = {
  displayName: '',
  email: '',
  role: 'client_user',
  clientRole: 'client_monitor',
  companyId: '',
  companyName: '',
  active: true,
}

function normalizeValues(defaultValues?: Partial<UserFormValues>): UserFormValues {
  return {
    ...INITIAL_VALUES,
    ...defaultValues,
  }
}

function validate(values: UserFormValues, companies: Company[]): UserFormErrors {
  const errors: UserFormErrors = {}

  if (!values.displayName.trim()) {
    errors.displayName = 'El nombre es obligatorio.'
  }

  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio.'
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(values.email.trim())) {
      errors.email = 'Ingresa un email válido.'
    }
  }

  if (values.role === 'client_user') {
    if (!values.companyId.trim()) {
      errors.companyId = 'La empresa es obligatoria para usuarios cliente.'
    } else if (!companies.some((company) => company.id === values.companyId)) {
      errors.companyId = 'Selecciona una empresa válida.'
    }
  }

  return errors
}

export function UserForm({
  companies,
  defaultValues,
  platformAdminExists = false,
  submitting = false,
  serverError = null,
  submitLabel = 'Crear usuario',
  emailDisabled = false,
  roleDisabled = false,
  onCancel,
  onCreateCompany,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>(normalizeValues(defaultValues))
  const [errors, setErrors] = useState<UserFormErrors>({})
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [creatingCompany, setCreatingCompany] = useState(false)
  const [createCompanyError, setCreateCompanyError] = useState<string | null>(null)

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
      displayName: values.displayName.trim(),
      email: values.email.trim().toLowerCase(),
      role: values.role,
      clientRole: values.role === 'platform_admin' ? 'client_monitor' : values.clientRole,
      companyId: values.role === 'platform_admin' ? '' : values.companyId,
      companyName: values.role === 'platform_admin' ? '' : selectedCompany?.name ?? values.companyName,
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

  const handleCreateCompany = async (payload: CreateCompanyPayload) => {
    setCreatingCompany(true)
    setCreateCompanyError(null)

    try {
      const createdCompany = await onCreateCompany(payload)
      handleCompanySelection(createdCompany.id)
      setShowCompanyForm(false)
    } catch (error) {
      console.error('No fue posible crear la empresa.', error)
      setCreateCompanyError('No fue posible crear la empresa. Intenta nuevamente.')
    } finally {
      setCreatingCompany(false)
    }
  }

  const allowPlatformAdminOption = values.role === 'platform_admin' || !platformAdminExists
  const isClientUser = values.role === 'client_user'

  return (
    <form className="user-form" onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Nombre
        <input
          type="text"
          value={values.displayName}
          onChange={(event) => setValues((current) => ({ ...current, displayName: event.target.value }))}
          placeholder="Nombre completo"
        />
        {errors.displayName ? <span className="form-error">{errors.displayName}</span> : null}
      </label>

      <label>
        Email
        <input
          type="email"
          value={values.email}
          disabled={emailDisabled}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          placeholder="usuario@empresa.cl"
        />
        {errors.email ? <span className="form-error">{errors.email}</span> : null}
      </label>

      <label>
        Rol de plataforma
        <select
          value={values.role}
          disabled={roleDisabled}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              role: event.target.value === 'platform_admin' ? 'platform_admin' : 'client_user',
            }))
          }
        >
          <option value="client_user">Cliente</option>
          {allowPlatformAdminOption ? <option value="platform_admin">Administrador de plataforma</option> : null}
        </select>
      </label>

      <label>
        Rol cliente
        <select
          value={values.clientRole}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              clientRole: event.target.value === 'client_admin' ? 'client_admin' : 'client_monitor',
            }))
          }
          disabled={values.role === 'platform_admin'}
        >
          <option value="client_admin">Administrador cliente</option>
          <option value="client_monitor">Monitor cliente</option>
        </select>
      </label>

      <CompanySelect
        companies={companies}
        value={values.companyId}
        disabled={!isClientUser}
        error={errors.companyId}
        onChange={handleCompanySelection}
        onCreateCompany={() => {
          setShowCompanyForm((current) => !current)
          setCreateCompanyError(null)
        }}
      />

      {showCompanyForm && isClientUser ? (
        <CompanyForm
          submitting={creatingCompany}
          serverError={createCompanyError}
          submitLabel="Crear y seleccionar"
          onCancel={() => setShowCompanyForm(false)}
          onSubmit={handleCreateCompany}
        />
      ) : null}

      <label className="user-form-checkbox">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(event) => setValues((current) => ({ ...current, active: event.target.checked }))}
        />
        Activo
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
