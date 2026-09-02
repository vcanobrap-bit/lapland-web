import type { WhatWeDoBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'

type WhatWeDoProps = WhatWeDoBlock & { anchorId: string; tone: 'default' | 'subtle' }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function WhatWeDo({ anchorId, content, title, tone }: WhatWeDoProps) {
  return (
    <Section id={anchorId} tone={tone}>
      <h2 className="text-ink text-3xl font-medium tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      <RichText data={content} className="mt-6" />
    </Section>
  )
}
