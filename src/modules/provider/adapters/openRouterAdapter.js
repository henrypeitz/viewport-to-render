import {
  readProviderError,
  toImageDataUrl,
} from './providerUtils'

const API_URL = 'https://openrouter.ai/api/v1/images'

function createReference(dataUrl) {
  return {
    type: 'image_url',
    image_url: { url: dataUrl },
  }
}

export const openRouterAdapter = {
  id: 'openrouter',
  supportsMaskEdit: 'reference',
  supportsCostEstimate: true,

  async generateImage(request) {
    const payload = {
      model: request.modelId,
      prompt: request.prompt,
      resolution: request.quality,
      output_format: 'png',
      n: 1,
      input_references: [createReference(request.image.dataUrl)],
    }

    if (request.aspect !== 'original') payload.aspect_ratio = request.aspect
    if (request.maskUrl) payload.input_references.push(createReference(request.maskUrl))

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${request.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Estúdio IA Render',
      },
      body: JSON.stringify(payload),
      signal: request.signal,
    })

    if (!response.ok) throw await readProviderError(response, 'OpenRouter')

    const result = await response.json()
    const image = result?.data?.[0]

    return {
      imageUrl: image?.url || toImageDataUrl(image?.b64_json, image?.media_type),
      usage: result?.usage || null,
      providerResponseId: result?.id || null,
    }
  },

  async listModels(apiKey) {
    const response = await fetch(`${API_URL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!response.ok) throw await readProviderError(response, 'OpenRouter')
    const result = await response.json()
    return (result?.data || []).map((model) => ({
      id: model.id,
      label: model.name || model.id,
      inputModalities: model.architecture?.input_modalities || [],
      supportedParameters: model.supported_parameters || {},
    }))
  },
}
