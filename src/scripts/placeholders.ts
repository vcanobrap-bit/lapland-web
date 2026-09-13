import sharp from 'sharp'

/**
 * Imágenes de relleno generadas en el momento, en la paleta de apoyo del design
 * system. Existen para que un sitio recién sembrado se vea compuesto en vez de
 * roto: se reemplazan desde el panel sin tocar código.
 */

/** Verdes de apoyo del sistema. El sistema los marca como decorativos. */
const TONES = ['#B7C8B0', '#D6EDCA', '#E9F8E3'] as const

export const placeholder = async (index: number, width = 1600, height = 900): Promise<Buffer> =>
  sharp({
    create: {
      width,
      height,
      channels: 3,
      background: TONES[index % TONES.length] ?? TONES[0],
    },
  })
    .jpeg({ quality: 88 })
    .toBuffer()

/**
 * Imagen para compartir el enlace. Se dibuja como SVG y se rasteriza, así el
 * sitio tiene una tarjeta decente en WhatsApp o LinkedIn desde el primer día.
 */
export const shareImage = async (name: string, tagline: string): Promise<Buffer> => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#182D2A"/>
    <text x="96" y="300" font-family="Georgia, serif" font-size="86" font-weight="700" fill="#F5F2EC">${name}</text>
    <text x="96" y="372" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#B7C8B0">${tagline}</text>
    <rect x="96" y="430" width="112" height="3" fill="#EBB552"/>
  </svg>`

  return sharp(Buffer.from(svg)).png().toBuffer()
}
