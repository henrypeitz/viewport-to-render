export function Section({ number, title, children, className = '' }) {
  return (
    <section className={`section ${className}`.trim()}>
      <div className="section-label">
        <span>{String(number).padStart(2, '0')}</span>
        {title}
      </div>
      {children}
    </section>
  )
}

export function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <label className={`toggle-row ${disabled ? 'is-disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-control" aria-hidden="true" />
      <span>{label}</span>
    </label>
  )
}
