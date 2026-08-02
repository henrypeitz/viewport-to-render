import { ArrowUpRight, Clock3 } from 'lucide-react'
import { findAdditionalPromptProfile } from '../promptProfiles/profiles'

function formatTime(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function HistoryPanel({ history, onSelect, onUseAsBase }) {
  if (!history.length) {
    return (
      <div className="history-empty">
        <Clock3 size={24} />
        <strong>Histórico desta sessão</strong>
        <span>Os renders concluídos serão organizados aqui.</span>
      </div>
    )
  }

  return (
    <div className="history-grid">
      {history.map((item, index) => (
        <article className="history-item" key={item.id}>
          <button className="history-preview" type="button" onClick={() => onSelect(item)}>
            <img src={item.imageUrl} alt={`Render ${history.length - index}`} />
            <span>{item.quality}</span>
          </button>
          <div className="history-info">
            <div>
              <strong>Render {history.length - index}</strong>
              <small>{formatTime(item.createdAt)} · {item.providerLabel}</small>
              {item.promptProfile && (
                <small className="history-profile">
                  {item.promptProfile.mode === 'current'
                    ? 'Estado atual'
                    : item.promptProfile.mode === 'hybrid'
                      ? `Mesclado · ${findAdditionalPromptProfile(item.promptProfile.templateId).label}`
                      : `Arquitetônico · ${findAdditionalPromptProfile(item.promptProfile.templateId).label}`}
                </small>
              )}
            </div>
            <button className="icon-btn" type="button" onClick={() => onUseAsBase(item)} title="Usar como imagem base" aria-label="Usar como imagem base">
              <ArrowUpRight size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
