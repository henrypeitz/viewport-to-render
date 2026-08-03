export const MAX_IMAGE_BYTES = 20 * 1024 * 1024

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada.'))
    reader.readAsDataURL(file)
  })
}

function readDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => reject(new Error('O arquivo não contém uma imagem válida.'))
    image.src = dataUrl
  })
}

export async function createImageAsset(file, source = 'upload') {
  if (!file) throw new Error('Selecione uma imagem para continuar.')
  if (!file.type?.startsWith('image/')) {
    throw new Error('Use um arquivo de imagem.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('A imagem deve ter no máximo 20 MB.')
  }

  const dataUrl = await readAsDataUrl(file)
  const dimensions = await readDimensions(dataUrl)

  return {
    id: crypto.randomUUID(),
    source,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    width: dimensions.width,
    height: dimensions.height,
    dataUrl,
    createdAt: new Date().toISOString(),
  }
}

export async function createImageAssetFromDataUrl(dataUrl, metadata = {}) {
  const dimensions = await readDimensions(dataUrl)
  const mimeType = /^data:([^;]+)/.exec(dataUrl)?.[1] || 'image/png'

  return {
    id: crypto.randomUUID(),
    source: metadata.source || 'sketchupPlugin',
    fileName: metadata.fileName || `captura-sketchup-${Date.now()}.png`,
    mimeType,
    size: metadata.size || null,
    width: dimensions.width,
    height: dimensions.height,
    dataUrl,
    createdAt: new Date().toISOString(),
  }
}

export function formatFileSize(bytes) {
  if (!bytes) return ''
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
