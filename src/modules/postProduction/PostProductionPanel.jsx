import { Download, RotateCcw } from 'lucide-react'

const SLIDERS = [
  ['brightness', 'Brilho', -50, 50, 1],
  ['contrast', 'Contraste', -50, 50, 1],
  ['saturation', 'Saturação', -100, 100, 1],
  ['sharpness', 'Nitidez', 0, 100, 1],
  ['temperature', 'Temperatura', -100, 100, 1],
  ['exposure', 'Exposição', -3, 3, 0.1],
  ['vignette', 'Vinheta', 0, 80, 1],
]

export function PostProductionPanel({ imageUrl, adjustments, onChange, onReset, onExport, isExporting }) {
  const previewStyle = {
    filter: [
      `brightness(${100 + adjustments.brightness + adjustments.exposure * 12}%)`,
      `contrast(${100 + adjustments.contrast}%)`,
      `saturate(${100 + adjustments.saturation}%)`,
      `sepia(${Math.abs(adjustments.temperature) * 0.12}%)`,
    ].join(' '),
    transform: `rotate(${adjustments.rotation}deg)`,
  }

  if (!imageUrl) {
    return (
      <div className="history-empty">
        <RotateCcw size={24} />
        <strong>Finalize um render primeiro</strong>
        <span>Os ajustes locais não consomem créditos de IA.</span>
      </div>
    )
  }

  return (
    <div className="post-production">
      <div className={`post-preview crop-${adjustments.crop.replace(':', '-')}`}>
        <img src={imageUrl} alt="Prévia da pós-produção" style={previewStyle} />
        {adjustments.temperature !== 0 && (
          <span
            className={`temperature-overlay ${adjustments.temperature > 0 ? 'warm' : 'cool'}`}
            style={{ opacity: Math.abs(adjustments.temperature) / 220 }}
          />
        )}
        {adjustments.vignette > 0 && (
          <span className="vignette-overlay" style={{ opacity: adjustments.vignette / 100 }} />
        )}
      </div>
      <aside className="post-controls">
        <div className="post-heading">
          <div>
            <span className="eyebrow">Sem custo de IA</span>
            <h2>Pós-produção</h2>
          </div>
          <button className="icon-btn" type="button" onClick={onReset} title="Restaurar ajustes" aria-label="Restaurar ajustes">
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="slider-list">
          {SLIDERS.map(([id, label, min, max, step]) => (
            <label className="range-control" key={id} htmlFor={`adjust-${id}`}>
              <span>{label}</span>
              <input
                id={`adjust-${id}`}
                type="range"
                min={min}
                max={max}
                step={step}
                value={adjustments[id]}
                onChange={(event) => onChange({ [id]: Number(event.target.value) })}
              />
              <output>{adjustments[id]}</output>
            </label>
          ))}
        </div>
        <div className="post-grid">
          <div>
            <label className="field-label" htmlFor="crop">Corte</label>
            <select id="crop" value={adjustments.crop} onChange={(event) => onChange({ crop: event.target.value })}>
              <option value="original">Original</option>
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1</option>
              <option value="9:16">9:16</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="rotation">Rotação</label>
            <select id="rotation" value={adjustments.rotation} onChange={(event) => onChange({ rotation: Number(event.target.value) })}>
              <option value="0">0°</option>
              <option value="90">90°</option>
              <option value="180">180°</option>
              <option value="270">270°</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="resizeWidth">Largura</label>
            <select id="resizeWidth" value={adjustments.resizeWidth} onChange={(event) => onChange({ resizeWidth: Number(event.target.value) })}>
              <option value="0">Original</option>
              <option value="1024">1024 px</option>
              <option value="2048">2048 px</option>
              <option value="4096">4096 px</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="format">Formato</label>
            <select id="format" value={adjustments.format} onChange={(event) => onChange({ format: event.target.value })}>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>
        <label className="range-control compression-control" htmlFor="compression">
          <span>Qualidade do arquivo</span>
          <input id="compression" type="range" min="50" max="100" value={adjustments.compression} onChange={(event) => onChange({ compression: Number(event.target.value) })} />
          <output>{adjustments.compression}%</output>
        </label>
        <button className="primary export-button" type="button" onClick={onExport} disabled={isExporting}>
          <Download size={17} /> {isExporting ? 'Exportando...' : 'Exportar imagem'}
        </button>
      </aside>
    </div>
  )
}
