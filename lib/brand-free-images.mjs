export const TENANT_ID = '0f4f3ffa-9a1b-468f-8408-2f59a3b64e45'

export const SOURCE_FILES = Object.freeze([
  '02f2c9b85494be5f6063823e28e5665f.jpg',
  '07aa12b7ec089769602cf99396ad4717.jpg',
  '145d8f2fb35cde497a78de753733de09.jpg',
  '246d07276ec814ad150bfa9b0743524b.jpg',
  '30d699934a9dc20b49d07ccb91fa1cef.jpg',
  '31da433f19c652ef226adf68587f0afd.jpg',
  '387e1063a6c0345b8c690c4a64cd7b7d.jpg',
  '3e9c2d13f4aee978503506a95c46f298.jpg',
  '41a7662e2280501fc87a68d90e51c191.jpg',
  '5c14f20c11cae0e7c9617cdd638846fd.jpg',
  '5db473a5465b7db0c12cc26e0c1843cc.jpg',
  '60a2398278c02f4d6441f2c715df5a6f.jpg',
  '72df68df4bc1cfa526bb3ae4da3d4f06.jpg',
  '74555b5dbc17d0e1f4dbd000e97d0cda.jpg',
  '95cdd4127a66a1c65e08bc0b816e41e4.jpg',
  '9f207edbf52231ba32365ec49be9a90d.jpg',
  'bfb6243b6e876212a40c6c1f97cd18d2.jpg',
  'd9fdc25dc385d622514d29fad41d86dc.jpg',
  'dc66751b92bf3bd2a4edc3589a63270d.jpg',
  'e4915e3ee3bcf118efd515fa321ab0a5.jpg',
  'f0b42be9bff25d93aea867d94460452e.jpg',
  'fa5cc2105a12324374ce3e47e9e7c65d.jpg',
  'fcabfea35ff10fbd7d0106d729a26390.jpg',
])

export const R2_KEY_PREFIX = 'v0-design-assets/jiangsu-changhui/brand-free/'
export const R2_PUBLIC_BASE = 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/'
export const ORIGINAL_R2_PREFIX = `${R2_PUBLIC_BASE}v0-design-assets/jiangsu-changhui/`

const sourceFileSet = new Set(SOURCE_FILES)

export function brandFreePublicUrl(fileName) {
  if (!sourceFileSet.has(fileName)) {
    throw new Error(`${fileName} is not an approved Jiangsu Changhui source`)
  }
  return `${R2_PUBLIC_BASE}${R2_KEY_PREFIX}${fileName}`
}

export function replaceOriginalImageUrls(input) {
  let replacements = 0
  const visit = (value) => {
    if (typeof value === 'string') {
      let output = value
      for (const fileName of SOURCE_FILES) {
        const originalUrl = `${ORIGINAL_R2_PREFIX}${fileName}`
        const occurrences = output.split(originalUrl).length - 1
        if (occurrences > 0) {
          output = output.replaceAll(originalUrl, brandFreePublicUrl(fileName))
          replacements += occurrences
        }
      }
      return output
    }
    if (Array.isArray(value)) return value.map(visit)
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, visit(child)]))
    }
    return value
  }

  return { value: visit(input), replacements }
}

function rowStatistics(data, width, channels, y, sampleStep, whiteThreshold) {
  let luminanceTotal = 0
  let whitePixels = 0
  let samples = 0

  for (let x = 0; x < width; x += sampleStep) {
    const offset = (y * width + x) * channels
    const red = data[offset]
    const green = data[offset + 1]
    const blue = data[offset + 2]
    luminanceTotal += (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
    if (red >= whiteThreshold && green >= whiteThreshold && blue >= whiteThreshold) whitePixels += 1
    samples += 1
  }

  return {
    meanLuminance: luminanceTotal / samples,
    whiteFraction: whitePixels / samples,
  }
}

/**
 * Finds a camera-app footer by pixel evidence only. The candidate must be inside
 * the bottom 6-15%, begin with a sharp horizontal jump into near-white pixels,
 * and be followed by a clean white run. Dark logo/text pixels later in the footer
 * are deliberately ignored; no photographed pixels are synthesized or inpainted.
 */
export function detectWhiteFooterBoundary(image, options = {}) {
  const { data, width, height, channels } = image
  if (!Buffer.isBuffer(data) && !(data instanceof Uint8Array)) throw new TypeError('image.data must be raw pixel bytes')
  if (!Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(channels) || channels < 3) {
    throw new TypeError('image width, height, and channels must describe RGB pixels')
  }
  if (data.length < width * height * channels) throw new RangeError('image.data is shorter than the declared dimensions')

  const {
    minFooterRatio = 0.06,
    maxFooterRatio = 0.15,
    boundaryMeanLuminance = 230,
    boundaryWhiteFraction = 0.60,
    transitionMeanLuminance = 200,
    cleanMeanLuminance = 244,
    cleanWhiteFraction = 0.75,
    minimumEdgeDelta = 35,
    cleanRunLength = Math.max(6, Math.round(height * 0.006)),
    whiteThreshold = 242,
    sampleStep = Math.max(1, Math.floor(width / 512)),
  } = options

  const firstCandidate = Math.floor(height * (1 - maxFooterRatio))
  const lastCandidate = Math.floor(height * (1 - minFooterRatio))
  const cache = new Map()
  const statsAt = (y) => {
    if (!cache.has(y)) cache.set(y, rowStatistics(data, width, channels, y, sampleStep, whiteThreshold))
    return cache.get(y)
  }

  for (let y = firstCandidate; y <= lastCandidate && y + cleanRunLength < height; y += 1) {
    const cleanStart = statsAt(y)
    if (cleanStart.meanLuminance < boundaryMeanLuminance) continue
    if (cleanStart.whiteFraction < boundaryWhiteFraction) continue
    let cleanRows = 0
    for (let offset = 0; offset < cleanRunLength; offset += 1) {
      const candidate = statsAt(y + offset)
      if (candidate.meanLuminance >= cleanMeanLuminance && candidate.whiteFraction >= cleanWhiteFraction) cleanRows += 1
    }
    if (cleanRows !== cleanRunLength) continue

    let boundaryY = -1
    let boundary = null
    let edgeDelta = 0
    for (let candidateY = Math.max(firstCandidate, y - 2); candidateY <= y; candidateY += 1) {
      const previous = statsAt(candidateY - 1)
      const candidate = statsAt(candidateY)
      const candidateEdgeDelta = candidate.meanLuminance - previous.meanLuminance
      if (candidate.meanLuminance >= transitionMeanLuminance && candidateEdgeDelta >= minimumEdgeDelta) {
        boundaryY = candidateY
        boundary = candidate
        edgeDelta = candidateEdgeDelta
        break
      }
    }
    if (boundaryY < 0) continue

    const removedPixels = height - boundaryY
    return {
      cropHeight: boundaryY,
      removedPixels,
      removedRatio: removedPixels / height,
      edgeDelta,
      boundaryMeanLuminance: boundary.meanLuminance,
      boundaryWhiteFraction: boundary.whiteFraction,
      sampleStep,
    }
  }

  throw new Error('No qualifying bottom white footer band detected')
}
