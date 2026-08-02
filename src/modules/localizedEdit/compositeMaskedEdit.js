function loadImage(url, label) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Não foi possível carregar ${label} para a composição localizada.`))
    image.src = url
  })
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function buildMaskAlpha(mask, width, height, feather) {
  const rawCanvas = createCanvas(width, height)
  const rawContext = rawCanvas.getContext('2d', { willReadFrequently: true })
  rawContext.drawImage(mask, 0, 0, width, height)

  const rawPixels = rawContext.getImageData(0, 0, width, height)
  for (let index = 0; index < rawPixels.data.length; index += 4) {
    const luminance = Math.max(
      rawPixels.data[index],
      rawPixels.data[index + 1],
      rawPixels.data[index + 2],
    )
    rawPixels.data[index] = 255
    rawPixels.data[index + 1] = 255
    rawPixels.data[index + 2] = 255
    rawPixels.data[index + 3] = luminance
  }
  rawContext.putImageData(rawPixels, 0, 0)

  if (!feather) return rawCanvas

  const featheredCanvas = createCanvas(width, height)
  const featheredContext = featheredCanvas.getContext('2d', { willReadFrequently: true })
  featheredContext.filter = `blur(${feather}px)`
  featheredContext.drawImage(rawCanvas, 0, 0)
  featheredContext.filter = 'none'

  // Keep the feather inside the selected region so outside pixels remain exact.
  featheredContext.globalCompositeOperation = 'destination-in'
  featheredContext.drawImage(rawCanvas, 0, 0)
  featheredContext.globalCompositeOperation = 'source-over'

  return featheredCanvas
}

export async function compositeMaskedEdit({
  baseImageUrl,
  generatedImageUrl,
  maskUrl,
  feather = 8,
}) {
  const [baseImage, generatedImage, maskImage] = await Promise.all([
    loadImage(baseImageUrl, 'a imagem base'),
    loadImage(generatedImageUrl, 'o render gerado'),
    loadImage(maskUrl, 'a máscara'),
  ])

  const width = baseImage.naturalWidth
  const height = baseImage.naturalHeight
  if (!width || !height) throw new Error('A imagem base não possui dimensões válidas.')

  const outputCanvas = createCanvas(width, height)
  const outputContext = outputCanvas.getContext('2d')
  outputContext.drawImage(baseImage, 0, 0, width, height)

  const editedCanvas = createCanvas(width, height)
  const editedContext = editedCanvas.getContext('2d')
  editedContext.drawImage(generatedImage, 0, 0, width, height)
  editedContext.globalCompositeOperation = 'destination-in'
  editedContext.drawImage(
    buildMaskAlpha(maskImage, width, height, feather),
    0,
    0,
  )

  outputContext.drawImage(editedCanvas, 0, 0)
  return outputCanvas.toDataURL('image/png')
}
