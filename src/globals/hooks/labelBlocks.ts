import type { GlobalBeforeChangeHook } from 'payload'

/** Lo que puede traer un bloque y sirve para nombrarlo en la lista. */
type LabelableBlock = {
  blockType?: string
  blockName?: string | null
  title?: string | null
  value?: string | null
}

const MAX_LENGTH = 60

const truncate = (text: string): string =>
  text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH - 1).trimEnd()}…` : text

/**
 * Nombra cada bloque con su propio título.
 *
 * Payload muestra `blockName` en la fila colapsada y, si está vacío, escribe
 * "Untitled". Con siete secciones el cliente veía siete filas idénticas y tenía
 * que abrirlas una por una para saber cuál era cuál.
 *
 * `blockName` es un concepto interno de Payload, no algo que el cliente deba
 * completar, así que se deriva del contenido en cada guardado.
 */
export const labelBlocks: GlobalBeforeChangeHook = ({ data }) => {
  const layout: unknown = data?.layout
  if (!Array.isArray(layout)) return data

  return {
    ...data,
    layout: layout.map((entry) => {
      const block = entry as LabelableBlock
      // El bloque de datos no tiene título propio: su primera cifra lo identifica.
      const source = block.title?.trim() || block.value?.trim() || ''

      return source ? { ...block, blockName: truncate(source) } : block
    }),
  }
}
