import {
  buildCurrentPrompt,
  buildModularFragments,
  buildSharedInstructionFragments,
} from '../../prompts/promptBuilder'
import { findAdditionalPromptProfile } from './profiles'

export function buildPromptWithProfile(settings, localizedEdit = null) {
  const mode = settings.promptProfile?.mode || 'current'

  if (mode === 'current') {
    return buildCurrentPrompt(settings, localizedEdit)
  }

  const profile = findAdditionalPromptProfile(settings.promptProfile?.templateId)
  if (mode === 'enhanced') {
    return [
      profile.prompt,
      ...buildSharedInstructionFragments(settings, localizedEdit),
    ].filter(Boolean).join('\n\n')
  }

  return [
    ...buildModularFragments(settings),
    'Selected architectural profile is authoritative for scene conditions, architectural preservation and photographic direction. Apply it without contradiction:',
    profile.prompt,
    ...buildSharedInstructionFragments(settings, localizedEdit),
  ].filter(Boolean).join('\n\n')
}
