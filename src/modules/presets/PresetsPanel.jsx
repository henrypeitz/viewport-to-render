import { Copy, Heart, Save, Star, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

export function PresetsPanel({ builtIn, userPresets, onApply, onCreate, onUpdate, onDuplicate, onDelete, onFavorite }) {
  const [name, setName] = useState('')
  const allPresets = useMemo(
    () => [...builtIn, ...userPresets].sort((a, b) => Number(b.favorite) - Number(a.favorite)),
    [builtIn, userPresets],
  )

  function handleCreate(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setName('')
  }

  return (
    <div className="presets-panel">
      <div className="panel-intro">
        <div>
          <span className="eyebrow">Biblioteca</span>
          <h2>Presets de render</h2>
        </div>
        <span className="count-badge">{allPresets.length}</span>
      </div>

      <form className="preset-create" onSubmit={handleCreate}>
        <label className="field-label" htmlFor="presetName">Salvar configuração atual</label>
        <div className="key-row">
          <input
            id="presetName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome do novo preset"
          />
          <button className="icon-btn" type="submit" title="Salvar preset" aria-label="Salvar preset">
            <Save size={16} />
          </button>
        </div>
      </form>

      <div className="preset-list">
        {allPresets.map((preset) => (
          <article className="preset-card" key={preset.id}>
            <button className="preset-main" type="button" onClick={() => onApply(preset)}>
              <span className="preset-icon" aria-hidden="true">
                {preset.favorite ? <Star size={16} fill="currentColor" /> : <Heart size={16} />}
              </span>
              <span>
                <strong>{preset.name}</strong>
                <small>{preset.description || 'Configuração personalizada'}</small>
              </span>
            </button>
            <div className="preset-actions">
              <button
                className="icon-btn"
                type="button"
                title={preset.favorite ? 'Remover dos favoritos' : 'Marcar como favorito'}
                aria-label={preset.favorite ? 'Remover dos favoritos' : 'Marcar como favorito'}
                onClick={() => onFavorite(preset)}
              >
                <Star size={15} fill={preset.favorite ? 'currentColor' : 'none'} />
              </button>
              <button
                className="icon-btn"
                type="button"
                title="Duplicar preset"
                aria-label="Duplicar preset"
                onClick={() => onDuplicate(preset)}
              >
                <Copy size={15} />
              </button>
              {!preset.builtIn && (
                <>
                  <button
                    className="icon-btn"
                    type="button"
                    title="Atualizar com a configuração atual"
                    aria-label="Atualizar preset"
                    onClick={() => onUpdate(preset)}
                  >
                    <Save size={15} />
                  </button>
                  <button
                    className="icon-btn danger-quiet"
                    type="button"
                    title="Excluir preset"
                    aria-label="Excluir preset"
                    onClick={() => onDelete(preset.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
