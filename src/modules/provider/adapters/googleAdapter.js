import {
  dataUrlParts,
  readProviderError,
  toImageDataUrl,
} from './providerUtils'

const API_URL = '/api/google/interactions'

function normalizeModelId(modelId) {
  return modelId.replace(/^google\//, '')
}

function normalizeQuality(modelId, requestedQuality) {
  if (modelId.includes('flash-lite-image') || modelId.includes('2.5-flash-image')) {
    return '1K'
  }
  return requestedQuality
}

function findImageBlock(value) {
  if (!value || typeof value !== 'object') return null
  if (value.type === 'image' && (value.data || value.uri)) return value

  for (const child of Object.values(value)) {
    if (!child || typeof child !== 'object') continue
    const found = Array.isArray(child)
      ? child.map(findImageBlock).find(Boolean)
      : findImageBlock(child)
    if (found) return found
  }

  return null
}

export const googleAdapter = {
  id: 'google',
  supportsMaskEdit: 'reference',
  supportsCostEstimate: false,

  async generateImage(request) {
    const source = dataUrlParts(request.image.dataUrl)
    const input = [
      { type: 'text', text: request.prompt },
      { type: 'image', mime_type: source.mimeType, data: source.base64 },
    ]

    if (request.maskUrl) {
      const mask = dataUrlParts(request.maskUrl)
      input.push({ type: 'image', mime_type: mask.mimeType, data: mask.base64 })
    }

    const responseFormat = {
      type: 'image',
      mime_type: 'image/png',
      image_size: normalizeQuality(request.modelId, request.quality),
      delivery: 'inline',
    }

    if (request.aspect !== 'original') responseFormat.aspect_ratio = request.aspect

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-goog-api-key': request.apiKey,
        'Content-Type': 'application/json',
        'Api-Revision': '2026-05-20',
      },
      body: JSON.stringify({
        model: normalizeModelId(request.modelId),
        input,
        response_format: responseFormat,
      }),
      signal: request.signal,
    })

    if (!response.ok) throw await readProviderError(response, 'Google AI Studio')

    const result = await response.json()
    if (result.status === 'failed') {
      throw new Error('O Google AI Studio não conseguiu concluir esta geração.')
    }

    const image = result.output_image || findImageBlock(result.steps || result.outputs)
    const imageUrl = image?.uri || toImageDataUrl(image?.data, image?.mime_type)

    return {
      imageUrl,
      usage: result.usage || null,
      providerResponseId: result.id || null,
    }
  },
}
