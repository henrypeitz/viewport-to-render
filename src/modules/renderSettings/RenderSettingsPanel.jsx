import { ChevronDown } from 'lucide-react'
import { Section, Toggle } from '../../components/Section'
import {
  ARTIFICIAL_LIGHT_FIXTURES,
  COLOR_TEMPERATURES,
  ELEMENT_DETAIL_FIELDS,
  ELEMENT_OPTIONS,
  FIDELITY_LEVELS,
  RENDER_CATEGORIES,
} from './renderOptions'

function updateNested(current, key, patch) {
  return { ...current, [key]: { ...current[key], ...patch } }
}

function ArtificialLightControls({ config, onChange }) {
  function toggleFixture(id) {
    onChange({ fixtures: { ...config.fixtures, [id]: !config.fixtures[id] } })
  }

  return (
    <div className="artificial-light-controls">
      <div>
        <span className="field-label">Temperatura</span>
        <div className="chip-group setting-chips temperature-chips">
          {COLOR_TEMPERATURES.map(([id, label, description]) => (
            <button
              className={`chip ${config.temperature === id ? 'active' : ''}`}
              type="button"
              key={id}
              title={`${label} - ${description}`}
              onClick={() => onChange({ temperature: id })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className="field-label">Luminárias</span>
        <div className="chip-group setting-chips">
          {ARTIFICIAL_LIGHT_FIXTURES.map(([id, label]) => (
            <button
              className={`chip ${config.fixtures[id] ? 'active' : ''}`}
              type="button"
              key={id}
              onClick={() => toggleFixture(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ElementDetailFields({ elementId, details, onChange }) {
  const fields = ELEMENT_DETAIL_FIELDS[elementId] || []
  if (!fields.length) return null

  return (
    <div className="element-detail-grid soft-top">
      {fields.map(([fieldId, label, options]) => (
        <div key={fieldId}>
          <label className="field-label" htmlFor={`${elementId}-${fieldId}`}>{label}</label>
          <select
            id={`${elementId}-${fieldId}`}
            value={details[fieldId]}
            onChange={(event) => onChange({ [fieldId]: event.target.value })}
          >
            {options.map(([id, optionLabel]) => (
              <option key={id} value={id}>{optionLabel}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

export function QualitySettings({ settings, onChange, selectedModel }) {
  const availableQualities = selectedModel?.qualities || ['1K', '2K', '4K']

  return (
    <Section number={2} title="Modelo e qualidade">
      <div className="segmented quality-segmented" aria-label="Qualidade">
        {['1K', '2K', '4K'].map((quality) => (
          <button
            key={quality}
            type="button"
            className={settings.quality === quality ? 'active' : ''}
            disabled={!availableQualities.includes(quality)}
            onClick={() => onChange({ quality })}
          >
            <strong>{quality}</strong>
            <span>{quality === '1K' ? 'Teste' : quality === '2K' ? 'Preview' : 'Final'}</span>
          </button>
        ))}
      </div>
      <div className="row soft-top">
        <div>
          <label className="field-label" htmlFor="captureSize">Captura</label>
          <select
            id="captureSize"
            value={settings.captureSize}
            onChange={(event) => onChange({ captureSize: Number(event.target.value) })}
          >
            <option value="1024">1024 px</option>
            <option value="2048">2048 px</option>
            <option value="4096">4096 px</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="aspect">Formato</label>
          <select
            id="aspect"
            value={settings.aspect}
            onChange={(event) => onChange({ aspect: event.target.value })}
          >
            <option value="original">Original</option>
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
            <option value="3:4">3:4</option>
            <option value="1:1">1:1</option>
            <option value="9:16">9:16</option>
          </select>
        </div>
      </div>
      <label className="field-label soft-top">Ritmo</label>
      <div className="segmented compact-segmented">
        {[
          ['fast', 'Rápido'],
          ['balanced', 'Equilibrado'],
          ['final', 'Final'],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            className={settings.speedPreset === id ? 'active' : ''}
            onClick={() => onChange({ speedPreset: id })}
          >
            {label}
          </button>
        ))}
      </div>
      {!availableQualities.includes(settings.quality) && (
        <p className="validation-note">Este modelo gera apenas {availableQualities.join(' ou ')}.</p>
      )}
    </Section>
  )
}

export function RenderSettingsPanel({ settings, onChange }) {
  const profileOnlyMode = settings.promptProfile?.mode === 'enhanced'
  function updateCategory(id, patch) {
    onChange({ categories: updateNested(settings.categories, id, patch) })
  }

  function updateElement(id, patch) {
    onChange({ additionalElements: updateNested(settings.additionalElements, id, patch) })
  }

  function updateElementDetails(id, patch) {
    const config = settings.additionalElements[id]
    updateElement(id, { details: { ...config.details, ...patch } })
  }

  return (
    <>
      <Section number={5} title="Direção visual">
        {profileOnlyMode && (
          <p className="mode-note prompt-mode-note">
            No modo Arquitetônico, estes controles ficam guardados no preset, mas não entram no prompt. Use Mesclado para combiná-los ao perfil.
          </p>
        )}
        <div className="settings-stack">
          {RENDER_CATEGORIES.map((category) => {
            const config = settings.categories[category.id]
            const isArtificialLight = category.special === 'artificialLight'
            return (
              <div className={`setting-row ${isArtificialLight ? 'artificial-light-row' : ''} ${config.enabled ? 'is-enabled' : ''}`} key={category.id}>
                <Toggle
                  checked={config.enabled}
                  onChange={(enabled) => updateCategory(category.id, { enabled })}
                  label={category.label}
                />
                {isArtificialLight ? (
                  config.enabled && <ArtificialLightControls config={config} onChange={(patch) => updateCategory(category.id, patch)} />
                ) : category.chip && config.enabled ? (
                  <div className="chip-group setting-chips">
                    {category.options.map(([id, label]) => (
                      <button
                        className={`chip ${config.value === id ? 'active' : ''}`}
                        type="button"
                        key={id}
                        onClick={() => updateCategory(category.id, { value: id })}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="select-wrap">
                    <select
                      aria-label={category.label}
                      value={config.value}
                      disabled={!config.enabled}
                      onChange={(event) => updateCategory(category.id, { value: event.target.value })}
                    >
                      {category.options.map(([id, label]) => (
                        <option value={id} key={id}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} aria-hidden="true" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      <Section number={6} title="Fidelidade ao projeto">
        <div className="segmented fidelity-segmented" aria-label="Fidelidade ao projeto">
          {FIDELITY_LEVELS.map(([id, label]) => (
            <button
              className={settings.fidelityLevel === id ? 'active' : ''}
              type="button"
              key={id}
              onClick={() => onChange({ fidelityLevel: id })}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="help">
          {FIDELITY_LEVELS.find(([id]) => id === settings.fidelityLevel)?.[2]}
          {profileOnlyMode && ' Esta escolha entra em ação nos modos Estado atual e Mesclado.'}
        </p>
      </Section>

      <Section number={7} title="Elementos adicionais">
        {profileOnlyMode && (
          <p className="help">Os elementos configurados são preservados no estado, mas só entram no prompt nos modos Estado atual e Mesclado.</p>
        )}
        <div className="element-list">
          {ELEMENT_OPTIONS.map(([id, label]) => {
            const config = settings.additionalElements[id]
            return (
              <details className="element-item" key={id} open={config.enabled}>
                <summary>
                  <Toggle
                    checked={config.enabled}
                    onChange={(enabled) => updateElement(id, { enabled })}
                    label={label}
                  />
                  <ChevronDown size={15} aria-hidden="true" />
                </summary>
                {config.enabled && (
                  <div className="element-fields">
                    <div className="row">
                      <div>
                        <label className="field-label" htmlFor={`${id}Quantity`}>Quantidade</label>
                        <input
                          id={`${id}Quantity`}
                          type="number"
                          min="1"
                          max="20"
                          value={config.quantity}
                          onChange={(event) => updateElement(id, { quantity: Number(event.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor={`${id}Position`}>Posição</label>
                        <select id={`${id}Position`} value={config.position} onChange={(event) => updateElement(id, { position: event.target.value })}>
                          <option>integrado à cena</option>
                          <option>em primeiro plano</option>
                          <option>ao centro</option>
                          <option>ao fundo</option>
                          <option>na lateral esquerda</option>
                          <option>na lateral direita</option>
                        </select>
                      </div>
                    </div>
                    <label className="field-label soft-top" htmlFor={`${id}Style`}>Estilo</label>
                    <input id={`${id}Style`} type="text" value={config.style} onChange={(event) => updateElement(id, { style: event.target.value })} />
                    <ElementDetailFields elementId={id} details={config.details} onChange={(patch) => updateElementDetails(id, patch)} />
                    <div className="row soft-top">
                      <div>
                        <label className="field-label" htmlFor={`${id}Scale`}>Escala</label>
                        <select id={`${id}Scale`} value={config.scale} onChange={(event) => updateElement(id, { scale: event.target.value })}>
                          <option value="discreta">Discreta</option>
                          <option value="realista">Realista</option>
                          <option value="proeminente">Proeminente</option>
                        </select>
                      </div>
                      <div>
                        <label className="field-label" htmlFor={`${id}Realism`}>Realismo</label>
                        <select id={`${id}Realism`} value={config.realism} onChange={(event) => updateElement(id, { realism: event.target.value })}>
                          <option value="sutil">Sutil</option>
                          <option value="fotorealista">Fotorealista</option>
                          <option value="editorial">Editorial</option>
                        </select>
                      </div>
                    </div>
                    <label className="check-row compact-check">
                      <input type="checkbox" checked={config.preserveComposition} onChange={(event) => updateElement(id, { preserveComposition: event.target.checked })} />
                      <span>Preservar composição original</span>
                    </label>
                  </div>
                )}
              </details>
            )
          })}
        </div>
      </Section>

      <Section number={8} title="Instrução adicional">
        <label className="field-label" htmlFor="extraInstructions">Pedido específico</label>
        <textarea
          id="extraInstructions"
          rows="3"
          value={settings.extraInstructions}
          onChange={(event) => onChange({ extraInstructions: event.target.value })}
          placeholder="Ex.: manter exatamente o layout e melhorar apenas luz e materiais"
        />
        <p className="help">Tem prioridade sobre as opções acima e sobre o perfil selecionado.</p>
      </Section>
    </>
  )
}
