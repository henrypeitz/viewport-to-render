export function dataUrlParts(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl || '')
  if (!match) throw new Error('A imagem de referência não está em um formato válido.')
  return { mimeType: match[1], base64: match[2] }
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Não foi possível preparar a imagem para o provedor.'))
    image.src = dataUrl
  })
}

async function convertImageDataUrl(dataUrl, {
  mimeType = 'image/jpeg',
  quality = 0.92,
  background = '#fff',
} = {}) {
  const image = await loadImage(dataUrl)
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height

  if (!width || !height) {
    throw new Error('A imagem de referência não tem dimensões válidas.')
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (mimeType === 'image/jpeg') {
    context.fillStyle = background
    context.fillRect(0, 0, width, height)
  }
  context.drawImage(image, 0, 0, width, height)

  return canvas.toDataURL(mimeType, quality)
}

export async function normalizeImageDataUrl(dataUrl, {
  outputMimeType = 'image/jpeg',
  passthroughMimeTypes = [],
  quality = 0.92,
} = {}) {
  const source = dataUrlParts(dataUrl)

  if (passthroughMimeTypes.includes(source.mimeType)) {
    return source
  }

  const converted = await convertImageDataUrl(dataUrl, {
    mimeType: outputMimeType,
    quality,
  })
  return dataUrlParts(converted)
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

  const errorPayload = Array.isArray(payload) ? payload[0] : payload

  if (response.status === 401 || response.status === 403) {
    return new Error(`A chave do ${providerLabel} foi recusada. Verifique a credencial e tente novamente.`)
  }

  if (response.status === 429) {
    return new Error(`${providerLabel} atingiu o limite de requisições. Aguarde um pouco e tente novamente.`)
  }

  const detail =
    errorPayload?.error?.message ||
    errorPayload?.error?.details?.[0]?.message ||
    errorPayload?.message
  const suffix = detail ? ` ${redactCredentials(detail)}` : ''
  return new Error(`${providerLabel} retornou o erro ${response.status}.${suffix}`)
}

export function toImageDataUrl(base64, mimeType = 'image/png') {
  if (!base64) throw new Error('O provedor não retornou uma imagem utilizável.')
  return `data:${mimeType};base64,${base64}`
}
