import type { Block } from 'payload'

import { AboutBlock } from './About/config'
import { ContactBlock } from './Contact/config'
import { HeroBlock } from './Hero/config'
import { ListBlock } from './List/config'
import { ServicesBlock } from './Services/config'
import { StatsBlock } from './Stats/config'
import { WhatWeDoBlock } from './WhatWeDo/config'

/**
 * Registro único de bloques disponibles en el CMS. Sumar una sección al sistema
 * es agregar su config acá y su componente en RenderBlocks: nada más cambia.
 */
export const blocks: Block[] = [
  HeroBlock,
  AboutBlock,
  StatsBlock,
  WhatWeDoBlock,
  ServicesBlock,
  ListBlock,
  ContactBlock,
]
