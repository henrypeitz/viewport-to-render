const STORAGE_KEYS = {
  provider: 'iaRender.activeProvider',
  rememberKeys: 'iaRender.rememberKeys',
  presets: 'iaRender.userPresets',
  preferences: 'iaRender.preferences',
}

function storageAvailable() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function read(key, fallback = null) {
  if (!storageAvailable()) return fallback

  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : value
  } catch {
    return fallback
  }
}

function write(key, value) {
  if (!storageAvailable()) return

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable in private or embedded browser contexts.
  }
}

function remove(key) {
  if (!storageAvailable()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Keep session-only behavior when persistent storage is unavailable.
  }
}

export function apiKeyStorageKey(providerId) {
  return `iaRender.apiKeys.${providerId}`
}

export function loadProviderPreferences() {
  const providerId = read(STORAGE_KEYS.provider, 'openrouter')
  const rememberKeys = read(STORAGE_KEYS.rememberKeys, 'false') === 'true'

  return { providerId, rememberKeys }
}

export function saveProviderPreferences({ providerId, rememberKeys }) {
  write(STORAGE_KEYS.provider, providerId)
  write(STORAGE_KEYS.rememberKeys, String(rememberKeys))
}

export function loadApiKey(providerId) {
  return read(apiKeyStorageKey(providerId), '')
}

export function saveApiKey(providerId, apiKey) {
  if (apiKey) write(apiKeyStorageKey(providerId), apiKey)
  else remove(apiKeyStorageKey(providerId))
}

export function clearApiKey(providerId) {
  remove(apiKeyStorageKey(providerId))
}

export function loadUserPresets() {
  const stored = read(STORAGE_KEYS.presets, '[]')

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveUserPresets(presets) {
  write(STORAGE_KEYS.presets, JSON.stringify(presets))
}

export function loadAppPreferences() {
  const stored = read(STORAGE_KEYS.preferences, '{}')

  try {
    return JSON.parse(stored) || {}
  } catch {
    return {}
  }
}

export function saveAppPreferences(preferences) {
  write(STORAGE_KEYS.preferences, JSON.stringify(preferences))
}
