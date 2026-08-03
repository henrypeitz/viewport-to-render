import {
  dataUrlParts,
  readProviderError,
  toImageDataUrl,
} from './providerUtils'

function normalizeModelId(modelId) {
  return modelId.replace(/^google\//, '')
}

function normalizeQuality(modelId, requestedQuality) {
  if (modelId.includes('flash-lite-image') || modelId.includes('2.5-flash-image')) {
    return '1K'
  }
  return requestedQuality
}

function shouldSendImageSize(modelId) {
  return !modelId.includes('2.5-flash-image')
}

function findImageBlock(value) {
  if (!value || typeof value !== 'object') return null
  if (value.inlineData || value.inline_data) return value.inlineData || value.inline_data
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
    const model = normalizeModelId(request.modelId)
    const source = dataUrlParts(request.image.dataUrl)
    const parts = [
      { text: request.prompt },
      { inline_data: { mime_type: source.mimeType, data: source.base64 } },
    ]

    if (request.maskUrl) {
      const mask = dataUrlParts(request.maskUrl)
      parts.push({ inline_data: { mime_type: mask.mimeType, data: mask.base64 } })
    }

    const imageConfig = {}
    if (request.aspect !== 'original') imageConfig.aspectRatio = request.aspect
    if (shouldSendImageSize(model)) imageConfig.imageSize = normalizeQuality(model, request.quality)

    const response = await fetch(`/api/google/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': request.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          ...(Object.keys(imageConfig).length
            ? { responseFormat: { image: imageConfig } }
            : {}),
        },
      }),
      signal: request.signal,
    })

    if (!response.ok) throw await readProviderError(response, 'Google AI Studio')

    const result = await response.json()
    if (result.promptFeedback?.blockReason) {
      throw new Error(`O Google AI Studio bloqueou a geração: ${result.promptFeedback.blockReason}.`)
    }

    if (result.status === 'failed') {
      throw new Error('O Google AI Studio não conseguiu concluir esta geração.')
    }

    const image = findImageBlock(result.candidates) || result.output_image
    const imageUrl = image?.uri || toImageDataUrl(image?.data, image?.mimeType || image?.mime_type)

    return {
      imageUrl,
      usage: result.usage || null,
      providerResponseId: result.id || null,
    }
  },
}
