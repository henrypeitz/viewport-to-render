import { Box, Camera, ImagePlus, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Section } from '../../components/Section'
import { formatFileSize } from './imageValidation'

export function ImageInputPanel({
  image,
  sourceMode,
  sketchUpAvailable,
  onSourceModeChange,
  onFile,
  onCapture,
  onClear,
}) {
  const fileInput = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(files) {
    if (files?.[0]) onFile(files[0])
  }

  return (
    <Section number={3} title="Imagem base">
      <div className="segmented source-segmented" role="tablist" aria-label="Origem da imagem">
        <button
          type="button"
          className={sourceMode === 'browser' ? 'active' : ''}
          onClick={() => onSourceModeChange('browser')}
        >
          <Upload size={14} /> Upload
        </button>
        <button
          type="button"
          className={sourceMode === 'sketchup' ? 'active' : ''}
          onClick={() => onSourceModeChange('sketchup')}
          disabled={!sketchUpAvailable}
          title={sketchUpAvailable ? 'Usar viewport do SketchUp' : 'Disponível dentro do plugin'}
        >
          <Box size={14} /> SketchUp
        </button>
      </div>

      {sourceMode === 'browser' ? (
        <div
          className={`dropzone ${isDragging ? 'is-dragging' : ''} ${image ? 'has-image' : ''}`}
          onDragEnter={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            handleFiles(event.dataTransfer.files)
          }}
          onClick={() => fileInput.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') fileInput.current?.click()
          }}
          role="button"
          tabIndex={0}
        >
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => handleFiles(event.target.files)}
          />
          {image ? (
            <>
              <img src={image.dataUrl} className="thumb-preview" alt="Imagem base selecionada" />
              <div className="dropzone-meta">
                <strong>{image.fileName}</strong>
                <span>{image.width} × {image.height} {formatFileSize(image.size)}</span>
              </div>
              <button
                className="icon-btn dropzone-remove"
                type="button"
                title="Remover imagem"
                aria-label="Remover imagem"
                onClick={(event) => {
                  event.stopPropagation()
                  onClear()
                }}
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <>
              <div className="dropzone-icon"><ImagePlus size={22} /></div>
              <p><b>Clique ou arraste</b><br />PNG, JPEG ou WebP de até 20 MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="mode-note">
          <Camera size={18} />
          <div>
            <strong>Viewport atual</strong>
            <p>A captura será recebida diretamente do SketchUp.</p>
          </div>
          <button className="secondary compact" type="button" onClick={onCapture}>
            Capturar
          </button>
        </div>
      )}
    </Section>
  )
}
