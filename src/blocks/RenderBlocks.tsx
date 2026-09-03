import type { ComponentType } from 'react'

import type { Home, SiteSetting } from '@/payload-types'

import { resolveAnchors } from '@/lib/anchors'

import { About } from './About/Component'
import { Contact } from './Contact/Component'
import { Hero } from './Hero/Component'
import { List } from './List/Component'
import { Services } from './Services/Component'
import { Stats } from './Stats/Component'
import { WhatWeDo } from './WhatWeDo/Component'

type LayoutBlock = NonNullable<Home['layout']>[number]
type BlockType = LayoutBlock['blockType']

/**
 * Datos del sitio que cualquier bloque puede necesitar. Se pasan por props
 * desde la página: ningún bloque consulta Payload por su cuenta.
 */
type SharedBlockProps = {
  settings: SiteSetting
  /** Ancla ya resuelta y única en la página. La calcula RenderBlocks. */
  anchorId: string
}

/**
 * Un componente por cada tipo de bloque del CMS.
 *
 * El mapped type obliga a que estén todos: registrar un bloque en
 * `src/blocks/index.ts` sin escribir su componente rompe el build acá, con lo
 * que el CMS y el render no pueden quedar desincronizados.
 */
const BLOCK_COMPONENTS: {
  [K in BlockType]: ComponentType<Extract<LayoutBlock, { blockType: K }> & SharedBlockProps>
} = {
  hero: Hero,
  about: About,
  whatWeDo: WhatWeDo,
  services: Services,
  stats: Stats,
  list: List,
  contact: Contact,
}

type RenderBlocksProps = {
  blocks: LayoutBlock[] | null | undefined
  settings: SiteSetting
}

/** Traduce la lista de bloques del CMS a componentes. */
export function RenderBlocks({ blocks, settings }: RenderBlocksProps) {
  if (!blocks?.length) return null

  // Se resuelven de una sola vez para poder garantizar que no se repitan.
  const anchors = resolveAnchors(blocks)

  return (
    <>
      {blocks.map((block, position) => {
        // Indexar el registro con una unión pierde la correspondencia entre el
        // blockType y sus props. El mapped type de arriba ya la garantizó, así
        // que acá solo se recupera esa relación para poder aplicar el spread.
        const Component = BLOCK_COMPONENTS[block.blockType] as ComponentType<
          LayoutBlock & SharedBlockProps
        >

        return (
          <Component
            key={block.id ?? `${block.blockType}-${position}`}
            {...block}
            settings={settings}
            anchorId={anchors[position] ?? block.blockType}
          />
        )
      })}
    </>
  )
}
