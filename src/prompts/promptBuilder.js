import {
  ARTIFICIAL_LIGHT_FIXTURES,
  findRenderOption,
  getElementDetailLabel,
} from '../modules/renderSettings/renderOptions'
import { NEGATIVE_PROMPT } from './negativePrompts'
import { PROMPT_BASE } from './promptBase'
import {
  FIDELITY_PROMPTS,
  LOCALIZED_EDIT_PROMPTS,
  SPEED_PROMPTS,
} from './promptFragments'

const ELEMENT_NAMES = {
  people: 'people',
  vehicles: 'vehicles',
  pets: 'pets',
  furniture: 'furniture',
  vegetation: 'vegetation',
  decor: 'decorative objects',
}

function buildArtificialLightFragment(config) {
  if (!config.enabled) return ''
  const fixtures = ARTIFICIAL_LIGHT_FIXTURES
    .filter(([id]) => config.fixtures?.[id])
    .map(([, , prompt]) => prompt)
  const fixturesText = fixtures.length
    ? ` Use ${fixtures.join(', ')}.`
    : ''
  return `Use realistic artificial lighting at ${config.temperature || '3000K'} color temperature.${fixturesText}`
}

function buildElementFragments(elements) {
  return Object.entries(elements)
    .filter(([, config]) => config.enabled)
    .map(([id, config]) => {
      const detailText = Object.entries(config.details || {})
        .map(([fieldId, value]) => getElementDetailLabel(id, fieldId, value))
        .filter((value) => value && value !== 'Sem especificar')
        .join(', ')
      const compositionRule = config.preserveComposition
        ? 'without changing the original composition'
        : 'with natural integration into the scene'
      const details = detailText ? ` Details: ${detailText}.` : ''

      return `Add ${config.quantity} ${ELEMENT_NAMES[id]}, positioned ${config.position}, with ${config.style} styling, ${config.scale} scale and ${config.realism} realism, ${compositionRule}.${details}`
    })
}

export function buildModularFragments(settings) {
  const fragments = [PROMPT_BASE]

  Object.entries(settings.categories).forEach(([categoryId, config]) => {
    if (categoryId === 'artificialLight') {
      const fragment = buildArtificialLightFragment(config)
      if (fragment) fragments.push(fragment)
      return
    }
    if (!config.enabled) return
    const option = findRenderOption(categoryId, config.value)
    if (option) fragments.push(`Visual direction: ${option.prompt}.`)
  })

  fragments.push(SPEED_PROMPTS[settings.speedPreset] || SPEED_PROMPTS.balanced)
  fragments.push(FIDELITY_PROMPTS[settings.fidelityLevel] || FIDELITY_PROMPTS.enhance)
  fragments.push(...buildElementFragments(settings.additionalElements))

  return fragments.filter(Boolean)
}

export function buildSharedInstructionFragments(settings, localizedEdit = null) {
  const fragments = []

  if (localizedEdit?.enabled && localizedEdit.maskUrl) {
    fragments.push(
      'A second reference image is a black-and-white mask. Modify only the white painted region; keep every black region unchanged.',
      LOCALIZED_EDIT_PROMPTS[localizedEdit.mode],
    )
    if (localizedEdit.prompt.trim()) {
      fragments.push(`Localized edit instruction: ${localizedEdit.prompt.trim()}`)
    }
  }

  if (settings.extraInstructions.trim()) {
    fragments.push(`Highest-priority user instruction: ${settings.extraInstructions.trim()}`)
  }

  fragments.push(`Restrictions: ${NEGATIVE_PROMPT}`)
  return fragments
}

export function buildCurrentPrompt(settings, localizedEdit = null) {
  return [
    ...buildModularFragments(settings),
    ...buildSharedInstructionFragments(settings, localizedEdit),
  ].join('\n\n')
}
