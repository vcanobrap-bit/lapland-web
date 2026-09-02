import type { Block } from 'payload'

import { AboutBlock } from './About/config'
import { HeroBlock } from './Hero/config'
import { WhatWeDoBlock } from './WhatWeDo/config'

/**
 * Registro único de bloques disponibles en el CMS. Sumar una sección al sistema
 * es agregar su config acá y su componente en RenderBlocks: nada más cambia.
 */
export const blocks: Block[] = [HeroBlock, AboutBlock, WhatWeDoBlock]
