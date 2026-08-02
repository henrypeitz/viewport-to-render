export function dataUrlParts(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl || '')
  if (!match) throw new Error('A imagem de referência não está em um formato válido.')
  return { mimeType: match[1], base64: match[2] }
}

function redactCredentials(message) {
  return String(message || '')
    .replace(/sk-or-v1-[a-zA-Z0-9_-]+/g, '[chave removida]')
    .replace(/AIza[a-zA-Z0-9_-]+/g, '[chave removida]')
    .slice(0, 360)
}

export async function readProviderError(response, providerLabel) {
  let payload = null

  try {
    payload = await response.json()
  } catch {
    // A generic status message is enough when the body is not JSON.
  }

  if (response.status === 401 || response.status === 403) {
    return new Error(`A chave do ${providerLabel} foi recusada. Verifique a credencial e tente novamente.`)
  }

  if (response.status === 429) {
    return new Error(`${providerLabel} atingiu o limite de requisições. Aguarde um pouco e tente novamente.`)
  }

  const detail =
    payload?.error?.message || payload?.error?.details?.[0]?.message || payload?.message
  const suffix = detail ? ` ${redactCredentials(detail)}` : ''
  return new Error(`${providerLabel} retornou o erro ${response.status}.${suffix}`)
}

export function toImageDataUrl(base64, mimeType = 'image/png') {
  if (!base64) throw new Error('O provedor não retornou uma imagem utilizável.')
  return `data:${mimeType};base64,${base64}`
}
