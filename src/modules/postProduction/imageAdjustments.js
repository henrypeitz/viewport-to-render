function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Não foi possível preparar a imagem para exportação.'))
    image.src = url
  })
}

function cropDimensions(width, height, crop) {
  if (crop === 'original') return { sx: 0, sy: 0, sw: width, sh: height }

  const [ratioWidth, ratioHeight] = crop.split(':').map(Number)
  const targetRatio = ratioWidth / ratioHeight
  const sourceRatio = width / height

  if (sourceRatio > targetRatio) {
    const sw = height * targetRatio
    return { sx: (width - sw) / 2, sy: 0, sw, sh: height }
  }

  const sh = width / targetRatio
  return { sx: 0, sy: (height - sh) / 2, sw: width, sh }
}

function applyTemperature(context, width, height, temperature) {
  if (!temperature) return
  context.save()
  context.globalCompositeOperation = 'soft-light'
  context.fillStyle = temperature > 0
    ? `rgba(255, 136, 54, ${Math.abs(temperature) / 220})`
    : `rgba(46, 129, 255, ${Math.abs(temperature) / 220})`
  context.fillRect(0, 0, width, height)
  context.restore()
}

function applyVignette(context, width, height, amount) {
  if (!amount) return
  const gradient = context.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.22,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.7,
  )
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, `rgba(0,0,0,${amount / 125})`)
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)
}

function applySharpen(context, width, height, amount) {
  if (!amount || width * height > 12_000_000) return
  const image = context.getImageData(0, 0, width, height)
  const source = new Uint8ClampedArray(image.data)
  const strength = amount / 100
  const data = image.data

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = (y * width + x) * 4
      for (let channel = 0; channel < 3; channel += 1) {
        const center = source[index + channel]
        const neighbors =
          source[index - 4 + channel] + source[index + 4 + channel] +
          source[index - width * 4 + channel] + source[index + width * 4 + channel]
        data[index + channel] = center + (center * 4 - neighbors) * strength
      }
    }
  }

  context.putImageData(image, 0, 0)
}

export async function exportAdjustedImage(imageUrl, adjustments) {
  const image = await loadImage(imageUrl)
  const crop = cropDimensions(image.naturalWidth, image.naturalHeight, adjustments.crop)
  const targetWidth = adjustments.resizeWidth || Math.round(crop.sw)
  const targetHeight = Math.round(targetWidth * (crop.sh / crop.sw))
  const turns = Math.abs(adjustments.rotation / 90) % 2
  const canvas = document.createElement('canvas')
  canvas.width = turns ? targetHeight : targetWidth
  canvas.height = turns ? targetWidth : targetHeight

  const context = canvas.getContext('2d')
  context.save()
  context.translate(canvas.width / 2, canvas.height / 2)
  context.rotate((adjustments.rotation * Math.PI) / 180)
  context.filter = [
    `brightness(${100 + adjustments.brightness + adjustments.exposure * 12}%)`,
    `contrast(${100 + adjustments.contrast}%)`,
    `saturate(${100 + adjustments.saturation}%)`,
  ].join(' ')
  context.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    -targetWidth / 2,
    -targetHeight / 2,
    targetWidth,
    targetHeight,
  )
  context.restore()

  applyTemperature(context, canvas.width, canvas.height, adjustments.temperature)
  applyVignette(context, canvas.width, canvas.height, adjustments.vignette)
  applySharpen(context, canvas.width, canvas.height, adjustments.sharpness)

  const mimeType = `image/${adjustments.format}`
  const quality = adjustments.compression / 100

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Não foi possível exportar a imagem.')),
      mimeType,
      quality,
    )
  })
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
