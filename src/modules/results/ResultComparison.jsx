import {
  Download,
  Expand,
  ImageIcon,
  RotateCcw,
  Shuffle,
  SlidersHorizontal,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function ResultComparison({
  beforeUrl,
  result,
  status,
  onDownload,
  onRestart,
  onVariation,
  onUseResultAsBase,
}) {
  const [position, setPosition] = useState(52)
  const [showAfter, setShowAfter] = useState(false)
  const isDragging = useRef(false)
  const afterUrl = result?.imageUrl
  const isGenerating = ['validating', 'generating'].includes(status)
  const canCompare = Boolean(afterUrl && !showAfter && !isGenerating)

  useEffect(() => {
    setPosition(52)
    setShowAfter(false)
  }, [result?.id])

  function updatePosition(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const nextPosition = ((event.clientX - bounds.left) / bounds.width) * 100
    setPosition(Math.min(100, Math.max(0, nextPosition)))
  }

  function handlePointerDown(event) {
    if (!canCompare) return
    event.preventDefault()
    isDragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    updatePosition(event)
  }

  function handlePointerMove(event) {
    if (!isDragging.current || !canCompare) return
    updatePosition(event)
  }

  function stopDragging(event) {
    isDragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleSliderKeyDown(event) {
    if (!canCompare) return

    const commands = {
      ArrowLeft: () => setPosition((value) => Math.max(0, value - 2)),
      ArrowRight: () => setPosition((value) => Math.min(100, value + 2)),
      Home: () => setPosition(0),
      End: () => setPosition(100),
    }

    if (commands[event.key]) {
      event.preventDefault()
      commands[event.key]()
    }
  }

  return (
    <div className="result-area">
      <div className={`frame ${isGenerating ? 'is-generating' : ''}`}>
        <div
          className={`stage ${canCompare ? 'can-compare' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={handleSliderKeyDown}
          role={canCompare ? 'slider' : undefined}
          tabIndex={canCompare ? 0 : undefined}
          aria-label={canCompare ? 'Comparação antes e depois' : undefined}
          aria-valuemin={canCompare ? 0 : undefined}
          aria-valuemax={canCompare ? 100 : undefined}
          aria-valuenow={canCompare ? Math.round(position) : undefined}
        >
          {!beforeUrl && !afterUrl && (
            <div className="empty-state">
              <div className="empty-visual"><ImageIcon size={28} /></div>
              <strong>Seu render aparece aqui</strong>
              <span>Adicione uma imagem base para começar.</span>
            </div>
          )}
          {beforeUrl && (
            <img className="stage-image before-image" src={beforeUrl} alt="Imagem original" />
          )}
          {afterUrl && (
            <img
              className="stage-image after-layer"
              src={afterUrl}
              alt="Render gerado"
              style={{ clipPath: showAfter ? 'inset(0)' : `inset(0 ${100 - position}% 0 0)` }}
            />
          )}
          {beforeUrl && <span className="stage-tag before">referência</span>}
          {afterUrl && <span className="stage-tag after">render</span>}
          {afterUrl && !showAfter && (
            <div className="slider-handle" style={{ left: `${position}%` }}>
              <span><SlidersHorizontal size={15} /></span>
            </div>
          )}
          {isGenerating && (
            <div className="scanline">
              <div className="bar" />
              <div className="msg">
                <span className="loading-dot" />
                {status === 'validating' ? 'Preparando pedido' : 'Renderizando com IA'}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="canvas-actions">
        <div className="action-group">
          <button className="secondary" type="button" disabled={!afterUrl} onClick={onDownload}>
            <Download size={16} /> Baixar
          </button>
          <button className="secondary" type="button" disabled={!afterUrl} onClick={() => setShowAfter((value) => !value)}>
            <Expand size={16} /> {showAfter ? 'Comparar' : 'Ver render'}
          </button>
        </div>
        <div className="action-group">
          <button className="secondary" type="button" disabled={!afterUrl || isGenerating} onClick={onVariation}>
            <Shuffle size={16} /> Variação
          </button>
          <button className="secondary" type="button" disabled={!afterUrl} onClick={onUseResultAsBase}>
            <ImageIcon size={16} /> Usar como base
          </button>
          <button className="icon-btn" type="button" disabled={!beforeUrl && !afterUrl} onClick={onRestart} title="Recomeçar cena" aria-label="Recomeçar cena">
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
