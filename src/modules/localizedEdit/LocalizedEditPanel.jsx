import { Brush, CheckCircle2 } from 'lucide-react'
import { Section, Toggle } from '../../components/Section'

export function LocalizedEditPanel({
  edit,
  hasImage,
  isUsingRender,
  onChange,
  onOpenMask,
}) {
  return (
    <Section number={9} title="Edição localizada">
      <Toggle
        checked={edit.enabled}
        onChange={(enabled) => onChange({ enabled })}
        label="Editar somente uma região"
        disabled={!hasImage}
      />
      {edit.enabled && (
        <div className="localized-fields">
          <label className="field-label soft-top">Operação</label>
          <div className="segmented compact-segmented">
            {[
              ['remove', 'Remover'],
              ['replace', 'Substituir'],
              ['regenerate', 'Regenerar'],
            ].map(([id, label]) => (
              <button
                type="button"
                key={id}
                className={edit.mode === id ? 'active' : ''}
                onClick={() => onChange({ mode: id })}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="field-label soft-top" htmlFor="localizedPrompt">Instrução da área</label>
          <textarea
            id="localizedPrompt"
            rows="2"
            value={edit.prompt}
            onChange={(event) => onChange({ prompt: event.target.value })}
            placeholder="Ex.: trocar o sofá por um modelo terracota"
          />
          <button className="secondary mask-button" type="button" onClick={onOpenMask}>
            {edit.maskUrl ? <CheckCircle2 size={16} /> : <Brush size={16} />}
            {edit.maskUrl ? 'Editar máscara' : 'Desenhar máscara'}
          </button>
          <div className="strict-mask-options">
            <Toggle
              checked={edit.preserveOutside}
              onChange={(preserveOutside) => onChange({ preserveOutside })}
              label="Preservar pixels fora da máscara"
            />
            {edit.preserveOutside && (
              <label className="range-control mask-feather" htmlFor="maskFeather">
                <span>Suavização</span>
                <input
                  id="maskFeather"
                  type="range"
                  min="0"
                  max="24"
                  value={edit.feather}
                  onChange={(event) => onChange({ feather: Number(event.target.value) })}
                />
                <output>{edit.feather}px</output>
              </label>
            )}
          </div>
          <p className="help">
            {edit.preserveOutside
              ? 'Modo estrito: somente a área branca recebe pixels do novo render.'
              : 'Modo flexível: a máscara funciona apenas como guia para o modelo.'}
          </p>
          <p className="help edit-base-note">
            Base da edição: {isUsingRender ? 'último render gerado' : 'imagem de referência'}.
          </p>
        </div>
      )}
    </Section>
  )
}
