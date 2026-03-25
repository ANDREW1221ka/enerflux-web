import { useState, type FormEvent } from 'react'
import type { CreateCompanyPayload } from '../../types/companies'

type CompanyFormProps = {
  submitting?: boolean
  submitLabel?: string
  serverError?: string | null
  onCancel?: () => void
  onSubmit: (values: CreateCompanyPayload) => Promise<void>
}

export function CompanyForm({
  submitting = false,
  submitLabel = 'Crear empresa',
  serverError = null,
  onCancel,
  onSubmit,
}: CompanyFormProps) {
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [nameError, setNameError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      setNameError('El nombre de empresa es obligatorio.')
      return
    }

    setNameError(null)
    await onSubmit({ name: name.trim(), active })
    setName('')
    setActive(true)
  }

  return (
    <form className="company-form" onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Nombre empresa
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enerflux SpA"
        />
        {nameError ? <span className="form-error">{nameError}</span> : null}
      </label>

      <label className="user-form-checkbox">
        <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
        Activa
      </label>

      {serverError ? <p className="form-error">{serverError}</p> : null}

      <footer className="user-form-actions">
        {onCancel ? (
          <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
        ) : null}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </footer>
    </form>
  )
}
