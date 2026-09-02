import type { WhatWeDoBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'

type WhatWeDoProps = WhatWeDoBlock & { anchorId: string }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function WhatWeDo({ anchorId, content, surface, title }: WhatWeDoProps) {
  return (
    <Section id={anchorId} surface={surface}>
      <div className="max-w-3xl">
        <h2 className="font-editorial text-h1 text-balance">{title}</h2>
        <RichText data={content} className="mt-8" onAnchor={surface === 'anchor'} />
      </div>
    </Section>
  )
}
