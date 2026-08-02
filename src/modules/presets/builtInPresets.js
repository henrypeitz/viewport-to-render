import { normalizeSettings } from '../renderSettings/renderOptions'

export const BUILT_IN_PRESETS = [
  {
    id: 'clean-client',
    name: 'Render limpo para cliente',
    description: 'Fidelidade, luz equilibrada e acabamento profissional.',
    favorite: true,
    builtIn: true,
    settings: {
      quality: '2K',
      speedPreset: 'balanced',
      fidelityLevel: 'enhance',
      categories: {
        naturalLight: { enabled: true, value: 'midday' },
        atmosphere: { enabled: true, value: 'commercial' },
        materials: { enabled: true, value: 'preserve' },
      },
    },
  },
  {
    id: 'luxury-facade',
    name: 'Fachada luxo',
    description: 'Golden hour, materiais nobres e paisagismo completo.',
    favorite: false,
    builtIn: true,
    settings: {
      quality: '4K',
      speedPreset: 'final',
      categories: {
        sceneType: { enabled: true, value: 'facade' },
        naturalLight: { enabled: true, value: 'golden' },
        materials: { enabled: true, value: 'luxury' },
        surroundings: { enabled: true, value: 'complete' },
      },
    },
  },
  {
    id: 'contemporary-interior',
    name: 'Interior contemporâneo',
    description: 'Materiais limpos e luz natural editorial.',
    favorite: false,
    builtIn: true,
    settings: {
      quality: '2K',
      categories: {
        sceneType: { enabled: true, value: 'interior' },
        environment: { enabled: true, value: 'contemporary' },
        materials: { enabled: true, value: 'contemporary' },
        atmosphere: { enabled: true, value: 'editorial' },
      },
    },
  },
  {
    id: 'realistic-gourmet',
    name: 'Área gourmet realista',
    description: 'Luz quente e integração natural com o entorno.',
    favorite: false,
    builtIn: true,
    settings: {
      quality: '2K',
      categories: {
        sceneType: { enabled: true, value: 'gourmet' },
        naturalLight: { enabled: true, value: 'afternoon' },
        artificialLight: { enabled: true, temperature: '3000K' },
        surroundings: { enabled: true, value: 'light' },
      },
    },
  },
  {
    id: 'light-landscape',
    name: 'Paisagismo leve',
    description: 'Vegetação discreta sem alterar a composição.',
    favorite: false,
    builtIn: true,
    settings: {
      quality: '2K',
      categories: {
        sceneType: { enabled: true, value: 'landscape' },
        surroundings: { enabled: true, value: 'light' },
      },
    },
  },
  {
    id: 'fast-preview',
    name: 'Preview rápido',
    description: '1K para validar direção visual com menor custo.',
    favorite: false,
    builtIn: true,
    settings: { quality: '1K', captureSize: 1024, speedPreset: 'fast' },
  },
  {
    id: 'editorial-render',
    name: 'Render editorial',
    description: 'Contraste controlado e linguagem de revista.',
    favorite: false,
    builtIn: true,
    settings: {
      quality: '4K',
      speedPreset: 'final',
      categories: {
        atmosphere: { enabled: true, value: 'editorial' },
        naturalLight: { enabled: true, value: 'overcast' },
      },
    },
  },
  {
    id: 'maximum-preservation',
    name: 'Preservar máximo',
    description: 'Mantém geometria, materiais e composição originais.',
    favorite: true,
    builtIn: true,
    settings: {
      fidelityLevel: 'faithful',
      categories: {
        materials: { enabled: true, value: 'preserve' },
        surroundings: { enabled: true, value: 'preserve' },
      },
    },
  },
]

export function mergePresetSettings(current, presetSettings) {
  return normalizeSettings({
    ...current,
    ...presetSettings,
    categories: {
      ...current.categories,
      ...(presetSettings.categories || {}),
    },
    additionalElements: {
      ...current.additionalElements,
      ...(presetSettings.additionalElements || {}),
    },
  })
}
