import { Brush, Check, RotateCcw, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export function MaskEditor({ imageUrl, initialMask, onCancel, onSave }) {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const drawing = useRef(false)
  const [brushSize, setBrushSize] = useState(56)

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image?.naturalWidth) return

    const maxWidth = 1600
    const scale = Math.min(1, maxWidth / image.naturalWidth)
    canvas.width = Math.round(image.naturalWidth * scale)
    canvas.height = Math.round(image.naturalHeight * scale)

    const context = canvas.getContext('2d')
    context.fillStyle = '#000000'
    context.fillRect(0, 0, canvas.width, canvas.height)

    if (initialMask) {
      const mask = new Image()
      mask.onload = () => context.drawImage(mask, 0, 0, canvas.width, canvas.height)
      mask.src = initialMask
    }
  }, [initialMask])

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  function pointFromEvent(event) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  function startDrawing(event) {
    drawing.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    const context = canvasRef.current.getContext('2d')
    const point = pointFromEvent(event)
    context.beginPath()
    context.moveTo(point.x, point.y)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#ffffff'
    context.lineWidth = brushSize
    context.lineTo(point.x + 0.01, point.y + 0.01)
    context.stroke()
  }

  function draw(event) {
    if (!drawing.current) return
    const context = canvasRef.current.getContext('2d')
    const point = pointFromEvent(event)
    context.lineTo(point.x, point.y)
    context.stroke()
  }

  function clearMask() {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#000000'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="maskTitle">
      <div className="mask-editor">
        <div className="modal-header">
          <div>
            <span className="eyebrow">Edição localizada</span>
            <h2 id="maskTitle">Marque a região a alterar</h2>
          </div>
          <button className="icon-btn" type="button" onClick={onCancel} title="Fechar" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="mask-stage">
          <img ref={imageRef} src={imageUrl} alt="Imagem para edição localizada" onLoad={prepareCanvas} />
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={() => { drawing.current = false }}
            onPointerCancel={() => { drawing.current = false }}
          />
        </div>
        <div className="mask-toolbar">
          <label className="range-field" htmlFor="brushSize">
            <Brush size={16} />
            <span>Pincel</span>
            <input
              id="brushSize"
              type="range"
              min="12"
              max="180"
              value={brushSize}
              onChange={(event) => setBrushSize(Number(event.target.value))}
            />
            <output>{brushSize}px</output>
          </label>
          <div className="toolbar-actions">
            <button className="secondary" type="button" onClick={clearMask}>
              <RotateCcw size={16} /> Limpar
            </button>
            <button className="primary compact-primary" type="button" onClick={() => onSave(canvasRef.current.toDataURL('image/png'))}>
              <Check size={16} /> Aplicar máscara
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
