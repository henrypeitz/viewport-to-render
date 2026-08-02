import {
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { Section } from '../../components/Section'
import { getProvider, PROVIDERS } from './providerRegistry'

export function ProviderConfig({
  config,
  dynamicModels,
  isRefreshing,
  onProviderChange,
  onChange,
  onClearKey,
  onRefreshModels,
}) {
  const provider = getProvider(config.providerId)
  const modelMap = new Map(
    [...dynamicModels, ...provider.models].map((model) => [model.id, model]),
  )
  const models = [...modelMap.values()]
  const knownModel = models.some((model) => model.id === config.modelId)

  return (
    <Section number={1} title="Conexão">
      <div className="row">
        <div>
          <label className="field-label" htmlFor="providerSelect">Provedor</label>
          <select
            id="providerSelect"
            value={config.providerId}
            onChange={(event) => onProviderChange(event.target.value)}
          >
            {Object.values(PROVIDERS).map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="modelSelect">Modelo</label>
          <select
            id="modelSelect"
            value={knownModel ? config.modelId : '__custom__'}
            onChange={(event) => {
              const value = event.target.value
              onChange({ modelId: value === '__custom__' ? '' : value })
            }}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>{model.label}</option>
            ))}
            <option value="__custom__">Modelo personalizado</option>
          </select>
        </div>
      </div>

      {!knownModel && (
        <>
          <label className="field-label soft-top" htmlFor="customModel">ID do modelo</label>
          <input
            id="customModel"
            type="text"
            value={config.modelId}
            onChange={(event) => onChange({ modelId: event.target.value })}
            placeholder={provider.defaultModel}
          />
        </>
      )}

      <div className="field-heading soft-top">
        <label className="field-label" htmlFor="apiKey">{provider.keyLabel}</label>
        {config.providerId === 'openrouter' && (
          <button
            className="text-action"
            type="button"
            onClick={onRefreshModels}
            disabled={!config.apiKey || isRefreshing}
          >
            <RefreshCw size={13} className={isRefreshing ? 'is-spinning' : ''} />
            Atualizar modelos
          </button>
        )}
      </div>
      <div className="key-row">
        <KeyRound className="input-leading-icon" size={16} aria-hidden="true" />
        <input
          id="apiKey"
          className="has-leading-icon"
          type={config.showApiKey ? 'text' : 'password'}
          autoComplete="off"
          value={config.apiKey}
          onChange={(event) => onChange({ apiKey: event.target.value })}
          placeholder={provider.keyPlaceholder}
        />
        <button
          className="icon-btn"
          type="button"
          title={config.showApiKey ? 'Ocultar chave' : 'Mostrar chave'}
          aria-label={config.showApiKey ? 'Ocultar chave' : 'Mostrar chave'}
          onClick={() => onChange({ showApiKey: !config.showApiKey })}
        >
          {config.showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          className="icon-btn danger-quiet"
          type="button"
          title="Apagar chave salva"
          aria-label="Apagar chave salva"
          onClick={onClearKey}
          disabled={!config.apiKey}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <label className="check-row">
        <input
          type="checkbox"
          checked={config.rememberKeys}
          onChange={(event) => onChange({ rememberKeys: event.target.checked })}
        />
        <span>Lembrar a chave neste navegador</span>
      </label>
      <p className="help">A chave é enviada somente ao provedor selecionado e não entra no histórico.</p>
    </Section>
  )
}
