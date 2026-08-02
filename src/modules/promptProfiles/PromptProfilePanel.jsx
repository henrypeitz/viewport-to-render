import { Section } from '../../components/Section'
import {
  ADDITIONAL_PROMPT_PROFILES,
  PROMPT_PROFILE_MODES,
} from './profiles'

export function PromptProfilePanel({ profile, onChange }) {
  return (
    <Section number={4} title="Estratégia de prompt">
      <div className="segmented profile-segmented" aria-label="Estratégia de prompt">
        {PROMPT_PROFILE_MODES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={profile.mode === id ? 'active' : ''}
            onClick={() => onChange({ mode: id })}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="help">
        {PROMPT_PROFILE_MODES.find(([id]) => id === profile.mode)?.[2]}
      </p>
      {profile.mode !== 'current' && (
        <div className="soft-top">
          <label className="field-label" htmlFor="promptProfileTemplate">Perfil arquitetônico</label>
          <select
            id="promptProfileTemplate"
            value={profile.templateId}
            onChange={(event) => onChange({ templateId: event.target.value })}
          >
            {ADDITIONAL_PROMPT_PROFILES.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          <p className="help">
            {ADDITIONAL_PROMPT_PROFILES.find((item) => item.id === profile.templateId)?.description}
          </p>
        </div>
      )}
    </Section>
  )
}
