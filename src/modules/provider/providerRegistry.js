import { googleAdapter } from './adapters/googleAdapter'
import { openRouterAdapter } from './adapters/openRouterAdapter'

const GOOGLE_MODELS = [
  { id: 'gemini-3.1-flash-image', label: 'Gemini 3.1 Flash Image', qualities: ['1K', '2K', '4K'] },
  { id: 'gemini-3.1-flash-lite-image', label: 'Gemini 3.1 Flash Lite Image', qualities: ['1K'] },
  { id: 'gemini-3-pro-image', label: 'Gemini 3 Pro Image', qualities: ['1K', '2K', '4K'] },
  { id: 'gemini-2.5-flash-image', label: 'Gemini 2.5 Flash Image', qualities: ['1K'] },
]

export const PROVIDERS = {
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    keyLabel: 'OpenRouter API key',
    keyPlaceholder: 'sk-or-v1-...',
    defaultModel: 'google/gemini-3.1-flash-image',
    models: GOOGLE_MODELS.map((model) => ({ ...model, id: `google/${model.id}` })),
    adapter: openRouterAdapter,
  },
  google: {
    id: 'google',
    label: 'Google AI Studio',
    keyLabel: 'Google API key',
    keyPlaceholder: 'AIza...',
    defaultModel: 'gemini-3.1-flash-image',
    models: GOOGLE_MODELS,
    adapter: googleAdapter,
  },
}

export function getProvider(providerId) {
  return PROVIDERS[providerId] || PROVIDERS.openrouter
}

export function getModel(providerId, modelId, dynamicModels = []) {
  const provider = getProvider(providerId)
  return [...dynamicModels, ...provider.models].find((model) => model.id === modelId)
}

export function getAdapter(providerId) {
  return getProvider(providerId).adapter
}
