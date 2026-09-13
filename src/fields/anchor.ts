import type { Field } from 'payload'

/**
 * Ancla de la sección, para enlazarla desde el menú o desde un botón.
 *
 * Es un campo del CMS y no un id fijo en el componente porque el sistema de
 * bloques permite repetir una sección: dos bloques del mismo tipo con el id
 * hardcodeado producirían HTML inválido y romperían la navegación.
 */
export const anchor = (defaultValue?: string): Field => ({
  name: 'anchor',
  type: 'text',
  label: 'Ancla',
  defaultValue,
  admin: {
    position: 'sidebar',
    description: 'Se enlaza como #ancla. Si se deja vacío, se genera una automáticamente.',
  },
})
