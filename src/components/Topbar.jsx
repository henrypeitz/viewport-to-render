import { Box, CircleCheck, Cloud, Monitor } from 'lucide-react'
import { getProvider } from '../modules/provider/providerRegistry'

export function Topbar({ mode, providerId, generationStatus }) {
  const provider = getProvider(providerId)
  const isWorking = ['validating', 'generating'].includes(generationStatus)

  return (
    <header className="topbar">
      <div className="brand">
        <div className="mark" aria-hidden="true">
          <Box size={18} strokeWidth={1.8} />
        </div>
        <div>
          <h1>Estúdio IA Render</h1>
          <p>Visualização arquitetônica</p>
        </div>
      </div>
      <div className="badges">
        <span className="badge mode">
          {mode === 'sketchup' ? <Box size={14} /> : <Monitor size={14} />}
          {mode === 'sketchup' ? 'SketchUp' : 'Navegador'}
        </span>
        <span className="badge provider">
          <Cloud size={14} />
          {provider.label}
        </span>
        <span className={`badge status ${isWorking ? 'is-working' : ''}`}>
          <CircleCheck size={14} />
          {isWorking ? 'Processando' : 'Pronto'}
        </span>
      </div>
    </header>
  )
}
