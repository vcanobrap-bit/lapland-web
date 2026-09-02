import type { AboutBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { MediaImage } from '@/components/ui/MediaImage'
import { Section } from '@/components/ui/Section'
import { cn } from '@/lib/cn'
import { resolveMedia } from '@/lib/media'

type AboutProps = AboutBlock & { anchorId: string }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function About({ anchorId, content, image, surface, title }: AboutProps) {
  const media = resolveMedia(image)

  return (
    <Section id={anchorId} surface={surface}>
      <div className={cn('grid gap-12', media && 'md:grid-cols-2 md:items-center md:gap-20')}>
        <div className={cn(!media && 'max-w-3xl')}>
          <h2 className="font-editorial text-h1 text-balance">{title}</h2>
          <RichText data={content} className="mt-8" onAnchor={surface === 'anchor'} />
        </div>

        {media ? (
          <MediaImage
            media={media}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="rounded-card w-full object-cover"
          />
        ) : null}
      </div>
    </Section>
  )
}
