import type { ReactNode } from 'react'

type AdminModalProps = {
  title: string
  description: string
  ariaLabel: string
  onClose: () => void
  children: ReactNode
}

export function AdminModal({ title, description, ariaLabel, onClose, children }: AdminModalProps) {
  return (
    <div className="admin-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <h3>{title}</h3>
          <p>{description}</p>
        </header>
        {children}
      </section>
    </div>
  )
}
