import type { Home } from '@/payload-types'

type LayoutBlock = NonNullable<Home['layout']>[number]
type BlockType = LayoutBlock['blockType']

/** Ancla por defecto de cada sección, cuando el cliente no escribió una. */
const DEFAULT_ANCHORS: Record<BlockType, string> = {
  hero: 'inicio',
  about: 'quienes-somos',
  whatWeDo: 'que-hacemos',
  services: 'servicios',
  contact: 'contacto',
}

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // separa y descarta los diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Devuelve un ancla por bloque, en el mismo orden, garantizando que no se
 * repitan: si el cliente agrega dos secciones del mismo tipo, la segunda pasa a
 * `servicios-2`. Sin esto habría ids duplicados y el menú saltaría siempre al
 * primero.
 */
export const resolveAnchors = (blocks: LayoutBlock[]): string[] => {
  const used = new Set<string>()

  return blocks.map((block) => {
    const preferred = block.anchor ? slugify(block.anchor) : ''
    const base = preferred || DEFAULT_ANCHORS[block.blockType] || block.blockType

    let candidate = base
    let suffix = 2

    while (used.has(candidate)) {
      candidate = `${base}-${suffix}`
      suffix += 1
    }

    used.add(candidate)
    return candidate
  })
}
