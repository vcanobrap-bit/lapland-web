import type { WhatWeDoBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function WhatWeDo({ content, title }: WhatWeDoBlock) {
  return (
    <Section id="que-hacemos" tone="subtle" width="narrow">
      <h2 className="text-ink text-3xl font-medium tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      <RichText data={content} className="mt-6" />
    </Section>
  )
}
