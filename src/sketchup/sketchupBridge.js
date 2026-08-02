export function isSketchUpEnvironment() {
  return typeof window !== 'undefined' && Boolean(window.sketchup)
}

export function requestViewportCapture(captureSize) {
  const bridge = window.sketchup?.captureViewport
  if (!bridge?.postMessage) {
    throw new Error('A captura automática está disponível apenas dentro do plugin do SketchUp.')
  }

  bridge.postMessage(JSON.stringify({ captureSize }))
}

export function registerSketchUpReceiver(onImage, onError) {
  const previous = window.iaRender || {}

  window.iaRender = {
    ...previous,
    receiveImage(payload) {
      try {
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
        const dataUrl = parsed.dataUrl || `data:${parsed.mimeType || 'image/png'};base64,${parsed.base64}`
        onImage(dataUrl, parsed)
      } catch {
        onError?.('O plugin enviou uma captura em formato inválido.')
      }
    },
  }

  const handleMessage = (event) => {
    if (event.data?.type !== 'ia-render:viewport') return
    window.iaRender.receiveImage(event.data.payload)
  }

  window.addEventListener('message', handleMessage)

  return () => {
    window.removeEventListener('message', handleMessage)
    window.iaRender = previous
  }
}
