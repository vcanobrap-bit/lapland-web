import type { ComponentType } from 'react'

import type { Home } from '@/payload-types'

import { Hero } from './Hero/Component'

type LayoutBlock = NonNullable<Home['layout']>[number]
type BlockType = LayoutBlock['blockType']

/**
 * Un componente por cada tipo de bloque del CMS.
 *
 * El mapped type obliga a que estén todos: registrar un bloque en
 * `src/blocks/index.ts` sin escribir su componente rompe el build acá, con lo
 * que el CMS y el render no pueden quedar desincronizados.
 */
const BLOCK_COMPONENTS: {
  [K in BlockType]: ComponentType<Extract<LayoutBlock, { blockType: K }>>
} = {
  hero: Hero,
}

/** Traduce la lista de bloques del CMS a componentes. */
export function RenderBlocks({ blocks }: { blocks: LayoutBlock[] | null | undefined }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, position) => {
        // Indexar el registro con una unión pierde la correspondencia entre el
        // blockType y sus props. El mapped type de arriba ya la garantizó, así
        // que acá solo se recupera esa relación para poder aplicar el spread.
        const Component = BLOCK_COMPONENTS[block.blockType] as ComponentType<LayoutBlock>

        return <Component key={block.id ?? `${block.blockType}-${position}`} {...block} />
      })}
    </>
  )
}
