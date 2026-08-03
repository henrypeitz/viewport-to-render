import {
  AlertCircle,
  History,
  ImageIcon,
  Layers3,
  Play,
  Send,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import './styles/tokens.css'
import './styles/ui.css'
import { Section } from './components/Section'
import { Topbar } from './components/Topbar'
import { ImageInputPanel } from './modules/imageInput/ImageInputPanel'
import {
  createImageAsset,
  createImageAssetFromDataUrl,
} from './modules/imageInput/imageValidation'
import { LocalizedEditPanel } from './modules/localizedEdit/LocalizedEditPanel'
import { MaskEditor } from './modules/localizedEdit/MaskEditor'
import { compositeMaskedEdit } from './modules/localizedEdit/compositeMaskedEdit'
import { PostProductionPanel } from './modules/postProduction/PostProductionPanel'
import { DEFAULT_ADJUSTMENTS } from './modules/postProduction/postProductionDefaults'
import {
  downloadBlob,
  exportAdjustedImage,
} from './modules/postProduction/imageAdjustments'
import { PresetsPanel } from './modules/presets/PresetsPanel'
import {
  BUILT_IN_PRESETS,
  mergePresetSettings,
} from './modules/presets/builtInPresets'
import { ProviderConfig } from './modules/provider/ProviderConfig'
import {
  getAdapter,
  getModel,
  getProvider,
  PROVIDERS,
} from './modules/provider/providerRegistry'
import { HistoryPanel } from './modules/results/HistoryPanel'
import { ResultComparison } from './modules/results/ResultComparison'
import {
  QualitySettings,
  RenderSettingsPanel,
} from './modules/renderSettings/RenderSettingsPanel'
import {
  createDefaultSettings,
  normalizeSettings,
} from './modules/renderSettings/renderOptions'
import { PromptProfilePanel } from './modules/promptProfiles/PromptProfilePanel'
import { buildPromptWithProfile } from './modules/promptProfiles/promptProfileBuilder'
import {
  clearApiKey,
  loadApiKey,
  loadAppPreferences,
  loadProviderPreferences,
  loadUserPresets,
  saveApiKey,
  saveAppPreferences,
  saveProviderPreferences,
  saveUserPresets,
} from './state/storage'
import {
  isSketchUpEnvironment,
  registerSketchUpReceiver,
  requestViewportCapture,
} from './sketchup/sketchupBridge'

function createInitialProviderState() {
  const saved = loadProviderPreferences()
  const preferences = loadAppPreferences()
  const providerId = PROVIDERS[saved.providerId] ? saved.providerId : 'openrouter'
  const apiKeyByProvider = {}

  if (saved.rememberKeys) {
    Object.keys(PROVIDERS).forEach((id) => {
      apiKeyByProvider[id] = loadApiKey(id)
    })
  }

  return {
    providerId,
    apiKeyByProvider,
    modelByProvider: {
      openrouter: PROVIDERS.openrouter.defaultModel,
      google: PROVIDERS.google.defaultModel,
      ...(preferences.modelByProvider || {}),
    },
    rememberKeys: saved.rememberKeys,
    showApiKey: false,
  }
}

const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function imageMimeTypeFromDataUrl(dataUrl) {
  return /^data:([^;]+)/.exec(dataUrl || '')?.[1] || 'image/png'
}

function imageExtensionFromDataUrl(dataUrl) {
  return IMAGE_EXTENSIONS[imageMimeTypeFromDataUrl(dataUrl)] || 'png'
}

function renderFileName(dataUrl, prefix = 'render') {
  return `${prefix}-${Date.now()}.${imageExtensionFromDataUrl(dataUrl)}`
}

function resultToImageAsset(result) {
  const mimeType = imageMimeTypeFromDataUrl(result.imageUrl)

  return {
    id: crypto.randomUUID(),
    source: 'previousRender',
    fileName: renderFileName(result.imageUrl),
    mimeType,
    size: null,
    width: null,
    height: null,
    dataUrl: result.imageUrl,
    createdAt: new Date().toISOString(),
  }
}

function downloadDataUrl(dataUrl, fileName) {
  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = fileName
  anchor.click()
}

function App() {
  const sketchUpAvailable = isSketchUpEnvironment()
  const [providerState, setProviderState] = useState(createInitialProviderState)
  const [dynamicModels, setDynamicModels] = useState([])
  const [isRefreshingModels, setIsRefreshingModels] = useState(false)
  const [settings, setSettings] = useState(createDefaultSettings)
  const [image, setImage] = useState(null)
  const [sourceMode, setSourceMode] = useState(sketchUpAvailable ? 'sketchup' : 'browser')
  const [localizedEdit, setLocalizedEdit] = useState({
    enabled: false,
    maskUrl: '',
    mode: 'replace',
    prompt: '',
    preserveOutside: true,
    feather: 8,
  })
  const [maskEditorOpen, setMaskEditorOpen] = useState(false)
  const [finalPrompt, setFinalPrompt] = useState('')
  const [generation, setGeneration] = useState({
    status: 'idle',
    error: '',
    currentResult: null,
  })
  const [history, setHistory] = useState([])
  const [editPrompt, setEditPrompt] = useState('')
  const [controlTab, setControlTab] = useState('settings')
  const [workspaceTab, setWorkspaceTab] = useState('result')
  const [userPresets, setUserPresets] = useState(loadUserPresets)
  const [builtInPresets, setBuiltInPresets] = useState(() => BUILT_IN_PRESETS.map((preset) => ({ ...preset })))
  const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS)
  const [isExporting, setIsExporting] = useState(false)
  const [notice, setNotice] = useState('')
  const abortController = useRef(null)

  const provider = getProvider(providerState.providerId)
  const apiKey = providerState.apiKeyByProvider[providerState.providerId] || ''
  const modelId = providerState.modelByProvider[providerState.providerId] || provider.defaultModel
  const selectedModel = getModel(providerState.providerId, modelId, dynamicModels)
  const generatedPrompt = useMemo(
    () => buildPromptWithProfile(settings, localizedEdit),
    [settings, localizedEdit],
  )

  useEffect(() => {
    setFinalPrompt(generatedPrompt)
  }, [generatedPrompt])

  useEffect(() => {
    saveProviderPreferences({
      providerId: providerState.providerId,
      rememberKeys: providerState.rememberKeys,
    })
    saveAppPreferences({ modelByProvider: providerState.modelByProvider })

    if (providerState.rememberKeys) {
      Object.entries(providerState.apiKeyByProvider).forEach(([id, key]) => {
        saveApiKey(id, key)
      })
    }
  }, [providerState])

  useEffect(() => {
    saveUserPresets(userPresets)
  }, [userPresets])

  useEffect(() => {
    return registerSketchUpReceiver(
      async (dataUrl, metadata) => {
        try {
          const asset = await createImageAssetFromDataUrl(dataUrl, metadata)
          setImage(asset)
          setSourceMode('sketchup')
          setGeneration((current) => ({ ...current, error: '', currentResult: null }))
          setNotice('Viewport recebida do SketchUp.')
        } catch (error) {
          setGeneration((current) => ({ ...current, error: error.message }))
        }
      },
      (message) => setGeneration((current) => ({ ...current, error: message })),
    )
  }, [])

  useEffect(() => () => abortController.current?.abort(), [])

  function updateProviderConfig(patch) {
    setProviderState((current) => {
      const next = { ...current }

      if ('apiKey' in patch) {
        next.apiKeyByProvider = {
          ...current.apiKeyByProvider,
          [current.providerId]: patch.apiKey,
        }
      }
      if ('modelId' in patch) {
        next.modelByProvider = {
          ...current.modelByProvider,
          [current.providerId]: patch.modelId,
        }
        const model = getModel(current.providerId, patch.modelId, dynamicModels)
        if (model?.qualities && !model.qualities.includes(settings.quality)) {
          setSettings((value) => ({ ...value, quality: model.qualities[0] }))
        }
      }
      if ('rememberKeys' in patch) {
        next.rememberKeys = patch.rememberKeys
        if (!patch.rememberKeys) {
          Object.keys(PROVIDERS).forEach(clearApiKey)
        }
      }
      if ('showApiKey' in patch) next.showApiKey = patch.showApiKey

      return next
    })
  }

  function changeProvider(providerId) {
    setDynamicModels([])
    setProviderState((current) => ({
      ...current,
      providerId,
      apiKeyByProvider: {
        ...current.apiKeyByProvider,
        [providerId]: current.apiKeyByProvider[providerId]
          ?? (current.rememberKeys ? loadApiKey(providerId) : ''),
      },
      showApiKey: false,
    }))
  }

  function handleClearKey() {
    clearApiKey(providerState.providerId)
    updateProviderConfig({ apiKey: '' })
    setNotice('Chave removida deste navegador.')
  }

  async function refreshModels() {
    if (!apiKey || providerState.providerId !== 'openrouter') return
    setIsRefreshingModels(true)
    setGeneration((current) => ({ ...current, error: '' }))

    try {
      const models = await getAdapter('openrouter').listModels(apiKey)
      const imageModels = models.filter((model) => model.inputModalities.includes('image'))
      setDynamicModels(imageModels)
      setNotice(`${imageModels.length} modelos de imagem atualizados.`)
    } catch (error) {
      setGeneration((current) => ({ ...current, error: error.message }))
    } finally {
      setIsRefreshingModels(false)
    }
  }

  async function handleFile(file) {
    try {
      const asset = await createImageAsset(file)
      setImage(asset)
      setGeneration({ status: 'idle', error: '', currentResult: null })
      setLocalizedEdit((current) => ({ ...current, enabled: false, maskUrl: '' }))
      setWorkspaceTab('result')
      setNotice('Imagem base carregada.')
    } catch (error) {
      setGeneration((current) => ({ ...current, error: error.message }))
    }
  }

  function validateGeneration(baseImage, prompt, maskUrl, requireMask) {
    if (!apiKey.trim()) return `Informe a chave do ${provider.label}.`
    if (!modelId.trim()) return 'Selecione ou informe um modelo de imagem.'
    if (!baseImage?.dataUrl) return 'Adicione uma imagem base antes de gerar.'
    if (!prompt.trim()) return 'O prompt final está vazio.'
    if (requireMask && !maskUrl) return 'Desenhe a máscara da edição localizada.'
    return ''
  }

  async function runGeneration({
    baseImage,
    prompt = finalPrompt,
    maskUrl = localizedEdit.enabled ? localizedEdit.maskUrl : '',
    requireMask = localizedEdit.enabled,
  } = {}) {
    const resolvedBaseImage = baseImage || (
      localizedEdit.enabled && generation.currentResult
        ? resultToImageAsset(generation.currentResult)
        : image
    )
    const validationError = validateGeneration(
      resolvedBaseImage,
      prompt,
      maskUrl,
      requireMask,
    )
    if (validationError) {
      setGeneration((current) => ({ ...current, status: 'error', error: validationError }))
      return
    }

    abortController.current?.abort()
    abortController.current = new AbortController()
    setWorkspaceTab('result')
    setNotice('')
    setGeneration((current) => ({ ...current, status: 'validating', error: '' }))

    try {
      await Promise.resolve()
      setGeneration((current) => ({ ...current, status: 'generating' }))
      const response = await getAdapter(providerState.providerId).generateImage({
        providerId: providerState.providerId,
        modelId,
        apiKey,
        image: resolvedBaseImage,
        prompt,
        quality: settings.quality,
        aspect: settings.aspect,
        maskUrl,
        signal: abortController.current.signal,
      })

      const imageUrl = maskUrl && localizedEdit.preserveOutside
        ? await compositeMaskedEdit({
            baseImageUrl: resolvedBaseImage.dataUrl,
            generatedImageUrl: response.imageUrl,
            maskUrl,
            feather: localizedEdit.feather,
          })
        : response.imageUrl

      const result = {
        id: crypto.randomUUID(),
        imageUrl,
        rawImageUrl: imageUrl === response.imageUrl ? null : response.imageUrl,
        sourceImageUrl: resolvedBaseImage.dataUrl,
        prompt,
        promptProfile: structuredClone(settings.promptProfile),
        settingsSnapshot: structuredClone(settings),
        providerId: providerState.providerId,
        providerLabel: provider.label,
        modelId,
        quality: settings.quality,
        usage: response.usage,
        providerResponseId: response.providerResponseId,
        createdAt: new Date().toISOString(),
      }

      setGeneration({ status: 'success', error: '', currentResult: result })
      setHistory((current) => [result, ...current])
      setNotice(response.usage?.cost
        ? `Render concluído. Custo informado: US$ ${Number(response.usage.cost).toFixed(4)}.`
        : 'Render concluído com sucesso.')
    } catch (error) {
      if (error.name === 'AbortError') return
      setGeneration((current) => ({ ...current, status: 'error', error: error.message }))
    }
  }

  function handleVariation() {
    if (!generation.currentResult) return
    runGeneration({
      baseImage: resultToImageAsset(generation.currentResult),
      prompt: `${generation.currentResult.prompt}\n\nCreate a refined variation with subtle changes while preserving the architecture and composition.`,
      maskUrl: '',
      requireMask: false,
    })
  }

  function handleIterativeEdit() {
    if (!generation.currentResult || !editPrompt.trim()) return
    runGeneration({
      baseImage: resultToImageAsset(generation.currentResult),
      prompt: `${generation.currentResult.prompt}\n\nHighest-priority edit instruction: ${editPrompt.trim()}. Preserve every area not affected by this instruction.`,
      maskUrl: '',
      requireMask: false,
    })
    setEditPrompt('')
  }

  function setResultAsBase(result = generation.currentResult) {
    if (!result) return
    setImage(resultToImageAsset(result))
    setGeneration({ status: 'idle', error: '', currentResult: null })
    setLocalizedEdit((current) => ({ ...current, enabled: false, maskUrl: '' }))
    setWorkspaceTab('result')
    setNotice('Render definido como nova imagem base.')
  }

  function restartScene() {
    abortController.current?.abort()
    setImage(null)
    setGeneration({ status: 'idle', error: '', currentResult: null })
    setLocalizedEdit({
      enabled: false,
      maskUrl: '',
      mode: 'replace',
      prompt: '',
      preserveOutside: true,
      feather: 8,
    })
    setAdjustments(DEFAULT_ADJUSTMENTS)
    setNotice('')
  }

  function applyPreset(preset) {
    setSettings((current) => mergePresetSettings(current, preset.settings))
    setControlTab('settings')
    setNotice(`Preset “${preset.name}” aplicado.`)
  }

  function createPreset(name) {
    setUserPresets((current) => [
      {
        id: crypto.randomUUID(),
        name,
        description: 'Configuração personalizada',
        favorite: false,
        builtIn: false,
        settings: structuredClone(settings),
      },
      ...current,
    ])
    setNotice('Preset salvo neste navegador.')
  }

  function updatePreset(preset) {
    setUserPresets((current) => current.map((item) => (
      item.id === preset.id ? { ...item, settings: structuredClone(settings) } : item
    )))
    setNotice('Preset atualizado com a configuração atual.')
  }

  function duplicatePreset(preset) {
    setUserPresets((current) => [
      {
        ...structuredClone(preset),
        id: crypto.randomUUID(),
        name: `${preset.name} — cópia`,
        favorite: false,
        builtIn: false,
      },
      ...current,
    ])
  }

  function deletePreset(id) {
    if (!window.confirm('Excluir este preset personalizado?')) return
    setUserPresets((current) => current.filter((preset) => preset.id !== id))
  }

  function favoritePreset(preset) {
    if (preset.builtIn) {
      setBuiltInPresets((current) => current.map((item) => (
        item.id === preset.id ? { ...item, favorite: !item.favorite } : item
      )))
    } else {
      setUserPresets((current) => current.map((item) => (
        item.id === preset.id ? { ...item, favorite: !item.favorite } : item
      )))
    }
  }

  async function handlePostExport() {
    if (!generation.currentResult) return
    setIsExporting(true)
    setGeneration((current) => ({ ...current, error: '' }))

    try {
      const blob = await exportAdjustedImage(generation.currentResult.imageUrl, adjustments)
      downloadBlob(blob, `render-ajustado.${adjustments.format}`)
      setNotice('Imagem ajustada exportada sem nova chamada de IA.')
    } catch (error) {
      setGeneration((current) => ({ ...current, error: error.message }))
    } finally {
      setIsExporting(false)
    }
  }

  const providerConfig = {
    providerId: providerState.providerId,
    apiKey,
    modelId,
    rememberKeys: providerState.rememberKeys,
    showApiKey: providerState.showApiKey,
  }
  const baseForMask = generation.currentResult?.imageUrl || image?.dataUrl

  return (
    <div className="app-shell">
      <Topbar
        mode={sourceMode}
        providerId={providerState.providerId}
        generationStatus={generation.status}
      />

      <main className="layout">
        <aside className="controls">
          <div className="control-tabs" role="tablist" aria-label="Painel de controles">
            <button className={controlTab === 'settings' ? 'active' : ''} type="button" onClick={() => setControlTab('settings')}>
              <SlidersHorizontal size={15} /> Configurar
            </button>
            <button className={controlTab === 'presets' ? 'active' : ''} type="button" onClick={() => setControlTab('presets')}>
              <Layers3 size={15} /> Presets
            </button>
          </div>

          <div className="controls-scroll">
            {controlTab === 'settings' ? (
              <>
                <ProviderConfig
                  config={providerConfig}
                  dynamicModels={dynamicModels}
                  isRefreshing={isRefreshingModels}
                  onProviderChange={changeProvider}
                  onChange={updateProviderConfig}
                  onClearKey={handleClearKey}
                  onRefreshModels={refreshModels}
                />
                <QualitySettings
                  settings={settings}
                  onChange={(patch) => setSettings((current) => ({ ...current, ...patch }))}
                  selectedModel={selectedModel}
                />
                <ImageInputPanel
                  image={image}
                  sourceMode={sourceMode}
                  sketchUpAvailable={sketchUpAvailable}
                  onSourceModeChange={setSourceMode}
                  onFile={handleFile}
                  onCapture={() => {
                    try {
                      requestViewportCapture(settings.captureSize)
                      setNotice('Solicitação de captura enviada ao SketchUp.')
                    } catch (error) {
                      setGeneration((current) => ({ ...current, error: error.message }))
                    }
                  }}
                  onClear={() => {
                    setImage(null)
                    setGeneration((current) => ({ ...current, currentResult: null }))
                  }}
                />
                <PromptProfilePanel
                  profile={settings.promptProfile}
                  onChange={(patch) => setSettings((current) => normalizeSettings({
                    ...current,
                    promptProfile: { ...current.promptProfile, ...patch },
                  }))}
                />
                <RenderSettingsPanel
                  settings={settings}
                  onChange={(patch) => setSettings((current) => normalizeSettings({ ...current, ...patch }))}
                />
                <LocalizedEditPanel
                  edit={localizedEdit}
                  hasImage={Boolean(baseForMask)}
                  isUsingRender={Boolean(generation.currentResult)}
                  onChange={(patch) => setLocalizedEdit((current) => ({ ...current, ...patch }))}
                  onOpenMask={() => setMaskEditorOpen(true)}
                />
                <Section number={10} title="Prompt final">
                  <label className="field-label" htmlFor="finalPrompt">Prompt enviado ao modelo</label>
                  <textarea
                    id="finalPrompt"
                    className="prompt-textarea"
                    value={finalPrompt}
                    onChange={(event) => setFinalPrompt(event.target.value)}
                  />
                  <p className="help">Editável antes de gerar. Alterar uma opção recompõe o texto.</p>
                </Section>
              </>
            ) : (
              <PresetsPanel
                builtIn={builtInPresets}
                userPresets={userPresets}
                onApply={applyPreset}
                onCreate={createPreset}
                onUpdate={updatePreset}
                onDuplicate={duplicatePreset}
                onDelete={deletePreset}
                onFavorite={favoritePreset}
              />
            )}
          </div>

          <div className="generation-footer">
            {(generation.error || notice) && (
              <div className={`status-line ${generation.error ? 'is-error' : 'is-success'}`}>
                {generation.error ? <AlertCircle size={15} /> : <Sparkles size={15} />}
                <span>{generation.error || notice}</span>
                <button
                  className="status-dismiss"
                  type="button"
                  onClick={() => {
                    setNotice('')
                    setGeneration((current) => ({ ...current, error: '' }))
                  }}
                  aria-label="Fechar mensagem"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <button
              className="primary generate-button"
              type="button"
              onClick={() => runGeneration()}
              disabled={['validating', 'generating'].includes(generation.status)}
            >
              {['validating', 'generating'].includes(generation.status)
                ? <span className="button-spinner" />
                : <Play size={17} fill="currentColor" />}
              {['validating', 'generating'].includes(generation.status) ? 'Gerando render' : 'Gerar render'}
            </button>
          </div>
        </aside>

        <section className="workspace">
          <div className="workspace-header">
            <div>
              <span className="eyebrow">Projeto atual</span>
              <h2>{image?.fileName || 'Nova visualização'}</h2>
            </div>
            <nav className="workspace-tabs" aria-label="Visualizações do workspace">
              <button className={workspaceTab === 'result' ? 'active' : ''} type="button" onClick={() => setWorkspaceTab('result')}>
                <ImageIcon size={15} /> Resultado
              </button>
              <button className={workspaceTab === 'post' ? 'active' : ''} type="button" onClick={() => setWorkspaceTab('post')} disabled={!generation.currentResult}>
                <SlidersHorizontal size={15} /> Pós
              </button>
              <button className={workspaceTab === 'history' ? 'active' : ''} type="button" onClick={() => setWorkspaceTab('history')}>
                <History size={15} /> Histórico <span>{history.length}</span>
              </button>
            </nav>
          </div>

          <div className="workspace-content">
            {workspaceTab === 'result' && (
              <>
                <ResultComparison
                  beforeUrl={generation.currentResult?.sourceImageUrl || image?.dataUrl}
                  result={generation.currentResult}
                  status={generation.status}
                  onDownload={() => downloadDataUrl(generation.currentResult.imageUrl, renderFileName(generation.currentResult.imageUrl))}
                  onRestart={restartScene}
                  onVariation={handleVariation}
                  onUseResultAsBase={() => setResultAsBase()}
                />
                <div className="edit-bar">
                  <div>
                    <label className="field-label" htmlFor="editPrompt">Editar usando o último render como base</label>
                    <textarea
                      id="editPrompt"
                      rows="1"
                      value={editPrompt}
                      onChange={(event) => setEditPrompt(event.target.value)}
                      placeholder="Ex.: trocar o sofá para terracota"
                    />
                  </div>
                  <button
                    className="secondary"
                    type="button"
                    disabled={!generation.currentResult || !editPrompt.trim() || ['validating', 'generating'].includes(generation.status)}
                    onClick={handleIterativeEdit}
                  >
                    <Send size={16} /> Aplicar edição
                  </button>
                </div>
              </>
            )}

            {workspaceTab === 'post' && (
              <PostProductionPanel
                imageUrl={generation.currentResult?.imageUrl}
                adjustments={adjustments}
                onChange={(patch) => setAdjustments((current) => ({ ...current, ...patch }))}
                onReset={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
                onExport={handlePostExport}
                isExporting={isExporting}
              />
            )}

            {workspaceTab === 'history' && (
              <HistoryPanel
                history={history}
                onSelect={(result) => {
                  setGeneration({ status: 'success', error: '', currentResult: result })
                  setWorkspaceTab('result')
                }}
                onUseAsBase={setResultAsBase}
              />
            )}
          </div>
        </section>
      </main>

      {maskEditorOpen && baseForMask && (
        <MaskEditor
          imageUrl={baseForMask}
          initialMask={localizedEdit.maskUrl}
          onCancel={() => setMaskEditorOpen(false)}
          onSave={(maskUrl) => {
            setLocalizedEdit((current) => ({ ...current, maskUrl }))
            setMaskEditorOpen(false)
            setNotice('Máscara pronta para a próxima geração.')
          }}
        />
      )}
    </div>
  )
}

export default App
